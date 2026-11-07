"""Pruebas end-to-end del portal (skill webapp-testing, Playwright Python).

Uso (servidor de producción ya compilado con `npm run build`):
  python .claude/skills/webapp-testing/scripts/with_server.py \
    --server "npm run start -- -p 3000" --port 3000 -- .venv/bin/python tests/e2e/test_portal.py

Variables: BASE_URL (por defecto http://localhost:3000), CHROMIUM_PATH (opcional).
"""
import os
import re
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://localhost:3000")
fallos: list[str] = []


def check(cond: bool, msg: str) -> None:
    print(("OK   " if cond else "FAIL ") + msg)
    if not cond:
        fallos.append(msg)


with sync_playwright() as p:
    launch = {"headless": True}
    if os.environ.get("CHROMIUM_PATH"):
        launch["executable_path"] = os.environ["CHROMIUM_PATH"]
    browser = p.chromium.launch(**launch)
    ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    errores_consola: list[str] = []
    page.on("console", lambda m: errores_consola.append(m.text) if m.type == "error" else None)

    resp = page.goto(BASE + "/")
    page.wait_for_load_state("networkidle")
    h = resp.headers if resp else {}

    # --- Cabeceras de seguridad -------------------------------------------------
    check("max-age=63072000" in h.get("strict-transport-security", ""), "HSTS presente")
    check(h.get("x-frame-options") == "DENY", "X-Frame-Options: DENY")
    check(h.get("x-content-type-options") == "nosniff", "X-Content-Type-Options: nosniff")
    csp = h.get("content-security-policy", "")
    check(re.search(r"script-src [^;]*'nonce-", csp) is not None and "unsafe-inline" not in csp.split("style-src")[0], "CSP con nonce y sin unsafe-inline en scripts")
    check("x-powered-by" not in h, "Sin cabecera X-Powered-By")
    nonce2 = page.request.get(BASE + "/").headers.get("content-security-policy", "")
    check(nonce2 != csp, "Nonce CSP distinto en cada petición")

    # --- Estructura y 7 componentes --------------------------------------------
    check(page.locator("header").count() >= 1, "Header presente")
    for sec in ["inicio", "tramites", "autoridades", "transparencia", "turismo", "contacto"]:
        check(page.locator(f"#{sec}").count() == 1, f"Sección #{sec} presente")
    check(page.get_by_role("heading", name="Félix Cuevas").count() == 1, "Ficha del Intendente Félix Cuevas")
    for link in ["Política de Privacidad", "Términos de Servicio", "Canal de Denuncias Anticorrupción"]:
        check(page.locator("footer").get_by_role("link", name=link).count() == 1, f"Footer enlaza a {link}")

    # --- Buscador de trámites --------------------------------------------------
    page.get_by_label("¿Qué deseas tramitar hoy?").fill("registro")
    check(page.locator("form[role=search] ul li").filter(has_text="Licencia de Conducir").count() == 1, "Buscador: 'registro' encuentra Licencia de Conducir")
    page.get_by_role("button", name="Habilitación", exact=True).click()
    check(page.locator("form[role=search] ul li").filter(has_text="Patente Comercial").count() == 1, "Buscador: sugerencia 'Habilitación' encuentra Patente Comercial")

    # --- Accesibilidad: tamaño de fuente y tema --------------------------------
    page.get_by_role("button", name="texto muy grande").first.click()
    fs = page.evaluate("getComputedStyle(document.documentElement).fontSize")
    check(fs == "20px", f"Escala tipográfica A++ aplica 125 % (font-size={fs})")
    page.reload()
    page.wait_for_load_state("networkidle")
    check(page.evaluate("document.documentElement.dataset.fontScale") == "2", "Escala tipográfica persiste tras recargar")
    page.get_by_role("button", name="texto normal").first.click()
    page.get_by_role("button", name="Activar modo oscuro").first.click()
    check(page.evaluate("document.documentElement.classList.contains('dark')"), "Modo oscuro activa clase .dark")
    page.get_by_role("button", name="Activar modo claro").first.click()

    # --- Flujo: solicitud de audiencia (CSRF + Zod + cifrado) -----------------
    page.locator("#tramite-audiencia").get_by_role("button", name="Solicitar audiencia").click()
    dlg = page.get_by_role("dialog")
    dlg.get_by_role("button", name="Solicitar audiencia").click()
    check(dlg.get_by_text("Debe aceptar el tratamiento").count() == 1, "Audiencia: bloquea envío sin consentimiento")
    dlg.get_by_label("Nombre y apellido").fill("Persona de Prueba")
    dlg.get_by_label("Cédula de identidad").fill("1234567")
    dlg.get_by_label("Teléfono").fill("0981 123 456")
    dlg.get_by_label("Motivo de la audiencia").fill("Consulta sobre el estado del camino vecinal")
    dlg.get_by_role("checkbox").click()
    dlg.get_by_role("button", name="Solicitar audiencia").click()
    dlg.get_by_text("Número de expediente").wait_for(timeout=10000)
    expediente = dlg.locator("strong.font-mono").inner_text()
    check(re.fullmatch(r"AUD-\d{4}-\d{6}", expediente) is not None, f"Audiencia registrada con expediente {expediente}")
    page.keyboard.press("Escape")

    # --- Consulta de estado del expediente recién creado ----------------------
    page.locator("#tramite-audiencia").get_by_role("button", name="Consultar estado").click()
    dlg = page.get_by_role("dialog")
    dlg.get_by_label("Número de expediente").fill(expediente)
    dlg.get_by_role("button", name="Consultar estado").click()
    dlg.get_by_text("Recibido").wait_for(timeout=10000)
    check(True, "Estado del expediente: Recibido")
    page.keyboard.press("Escape")

    # --- Pago: no integrado, debe informarlo ----------------------------------
    page.locator("#tramite-inmobiliario").get_by_role("button", name="Pagar en línea").click()
    page.locator("#tramite-inmobiliario").get_by_text("aún no está habilitado").wait_for(timeout=10000)
    check(True, "Pago en línea informa que no está habilitado (503)")

    # --- Controles de API directos ---------------------------------------------
    r = page.request.post(BASE + "/api/audiencias", data={"x": 1}, headers={"Origin": BASE})
    check(r.status == 403, f"POST sin token CSRF → 403 (obtuvo {r.status})")
    r = page.request.post(BASE + "/api/audiencias", data={"x": 1}, headers={"Origin": "https://evil.example"})
    check(r.status == 403, f"POST con Origin ajeno → 403 (obtuvo {r.status})")
    token = page.request.get(BASE + "/api/csrf").json()["token"]
    set_cookie = [c for c in ctx.cookies() if "csrf" in c["name"]]
    check(bool(set_cookie) and set_cookie[0]["httpOnly"] and set_cookie[0]["sameSite"] == "Strict", "Cookie CSRF HttpOnly + SameSite=Strict")
    r = page.request.post(BASE + "/api/audiencias", data={"nombre": {"$ne": None}}, headers={"Origin": BASE, "x-csrf-token": token})
    check(r.status == 400, f"Payload con operador NoSQL → 400 (obtuvo {r.status})")
    r = page.request.post(
        BASE + "/api/reclamos",
        multipart={
            "tipo": "bache", "descripcion": "Bache grande en la esquina", "nombre": "Prueba", "ci": "1234567", "consentimiento": "true",
            "foto": {"name": "x.png", "mimeType": "image/png", "buffer": b"<svg onload=alert(1)></svg>"},
        },
        headers={"Origin": BASE, "x-csrf-token": token},
    )
    check(r.status == 415, f"Foto con contenido no-imagen (SVG disfrazado de PNG) → 415 (obtuvo {r.status})")
    csv = page.request.get(BASE + "/api/transparencia/nomina")
    check(csv.status == 200 and "text/csv" in csv.headers.get("content-type", "") and "es_ejemplo" in csv.text(), "Descarga CSV de nómina")
    codes = [page.request.post(BASE + "/api/tramites/estado", data={"tramite": "licencia", "expediente": f"LIC-2026-{i}"}, headers={"Origin": BASE, "x-csrf-token": token}).status for i in range(25)]
    check(429 in codes, f"Rate limit de consulta de estado devuelve 429 (códigos: {sorted(set(codes))})")

    # --- Páginas legales --------------------------------------------------------
    for ruta, titulo in [("/privacidad", "Política de Privacidad"), ("/terminos", "Términos de Servicio"), ("/denuncias", "Canal de Denuncias Anticorrupción")]:
        page.goto(BASE + ruta)
        check(page.get_by_role("heading", level=1, name=titulo).count() == 1, f"{ruta} renderiza")

    csp_errors = [e for e in errores_consola if "Content Security Policy" in e]
    check(not csp_errors, f"Sin violaciones de CSP en consola ({csp_errors[:2]})")
    browser.close()

print(f"\n{len(fallos)} fallo(s)")
sys.exit(1 if fallos else 0)
