> **Versión de presentación actualizada (7 de noviembre de 2026).** Portal publicado en https://pirayu.vercel.app/ y resumen institucional en https://pirayu.vercel.app/presentacion. Ver [entrega y alcance](docs/ENTREGA-MUNICIPALIDAD.md).
>
> Por defecto, `NEXT_PUBLIC_MODO_DEMOSTRACION=true`: los recorridos de trámites y denuncias no reciben solicitudes oficiales en la interfaz. Se conservan las integraciones originales para una futura habilitación. El modo productivo requiere validación e integración municipal; no basta cambiar la variable. Las claves se administran en Vercel, sin guardarlas en Git.

# Portal web · Municipalidad de Pirayú

Portal institucional (ventanilla única virtual) de la Municipalidad de Pirayú, Departamento de Paraguarí, Paraguay.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · componentes shadcn/ui · Lucide · Motion.

> **Estado: demostración técnica.** Todo dato marcado como *ejemplo* o `[PENDIENTE]` (funcionarios, cifras, contactos,
> coordenadas, imágenes, textos legales) **no es oficial** y debe reemplazarse en `src/content/sitio.ts` antes de publicar.
> El pago en línea y el login con Identidad Electrónica (MITIC) **no están integrados**: son interfaces preparadas.

## Inicio rápido

```bash
npm ci
cp .env.example .env.local      # en desarrollo puede quedar vacío: se usan secretos efímeros
npm run dev                     # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run build` / `npm start` | Compilación y servidor de producción |
| `npm run lint` | ESLint 8 + `@vercel/style-guide` 6.0.0 (archivado, versión fijada) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Pruebas unitarias (Vitest): CSRF, rate limit, cifrado, CSV, validación, sanitización, CSP |
| `npm run test:e2e` | 37 verificaciones en navegador real (skill `webapp-testing`, Playwright Python). Requiere `npm run build` y `bash scripts/setup.sh` |
| `npm run test:a11y` | axe-core WCAG 2.0/2.1 A, AA y AAA en 5 rutas × claro/oscuro × móvil/escritorio (servidor en marcha) |
| `npm run qa:visual` | Auditoría visual de la skill `frontend-visual-qa` (servidor en marcha) |

En producción (`npm start`) son **obligatorias** `CSRF_SECRET` y `DATA_ENCRYPTION_KEY` (ver `.env.example`); sin ellas los formularios responden error (fail-closed).

### Cámaras públicas

La sección de cámaras comienza sin señales configuradas. Para habilitar una, agregar a `camarasPublicas` en `src/content/sitio.ts` su `id`, `nombre`, `ubicacion` y `url` HTTPS pública, autorizada y reproducible directamente por el navegador. No incluir usuarios, contraseñas ni direcciones privadas de las cámaras. La política de seguridad permite únicamente los orígenes HTTPS configurados en esa lista. El reproductor nativo requiere un formato compatible con el navegador; las señales RTSP o un servicio que requiera autenticación o un reproductor específico necesitan una integración adicional. Comprobar la disponibilidad y las autorizaciones antes de publicar cada señal.

## Estructura

```
src/
  content/sitio.ts          ÚNICO archivo de contenido editable (datos de ejemplo marcados)
  app/                      rutas: / · /privacidad · /terminos · /denuncias · /ingresar
  app/api/                  csrf · reclamos · audiencias · denuncias · tramites/estado · pagos · transparencia/[dataset] · auth/mitic
  components/site/          1 site-header · 2 hero · 3 autoridades · 4 ventanilla-tramites · 5 transparencia · 6 turismo · 7 site-footer
  components/ui/            componentes base shadcn/ui (button, card, dialog, input, checkbox, badge, label)
  lib/security/             csp · csrf · rate-limit · field-crypto · sanitize · csv · file-validation · request-guard
  lib/validation/schemas.ts esquemas Zod de toda entrada ciudadana
  lib/integrations/         payments (interfaz, no integrada) · mitic (OIDC + PKCE, no integrada)
  lib/data/store.ts         almacén EN MEMORIA (demostración) — reemplazar por base de datos
  middleware.ts             nonce + Content-Security-Policy por petición
tests/unit · tests/e2e
```

## Seguridad: qué está implementado y qué no

| Control | Estado | Dónde |
|---|---|---|
| HSTS (2 años, subdominios), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP | ✅ | `next.config.ts` |
| CSP con nonce por petición + `strict-dynamic`; sin `unsafe-inline`/`unsafe-eval` en scripts (prod) | ✅ | `src/middleware.ts`, `lib/security/csp.ts` |
| `style-src 'unsafe-inline'` | ⚠️ riesgo aceptado (React/Motion usan atributos `style`) | idem |
| CSRF: cookie semilla HttpOnly + SameSite=Strict + Secure (`__Host-` en prod) + token HMAC en cabecera + verificación de Origin | ✅ | `lib/security/csrf.ts`, `request-guard.ts` |
| Validación Zod (listas blancas, longitudes, rechazo de `<>` y caracteres de control, consentimiento `literal(true)`) | ✅ | `lib/validation/schemas.ts` |
| Inyección SQL/NoSQL | ✅ sin superficie: no hay base de datos y los tipos se validan. Al conectar BD usar **solo** consultas parametrizadas (Drizzle/Prisma) | — |
| XSS: React escapa la salida; HTML editorial pasa por DOMPurify (servidor) | ✅ | `lib/security/sanitize.ts`, `components/site/safe-html.tsx` |
| Rate limiting por IP (Upstash Redis si hay credenciales; si no, memoria por instancia) | ✅ / ⚠️ en Vercel sin Upstash el límite es por instancia | `lib/security/rate-limit.ts` |
| Cifrado AES-256-GCM de cédula, teléfono y correo en reposo | ✅ | `lib/security/field-crypto.ts` |
| Fotos: validación por magic bytes y 5 MB | ✅ · **falta**: almacenamiento, re-codificación (quitar EXIF/GPS) y antivirus | `lib/security/file-validation.ts` |
| CSV de datos abiertos con defensa contra inyección de fórmulas | ✅ | `lib/security/csv.ts` |
| Persistencia | ❌ en memoria: se pierde al reiniciar y no se comparte entre instancias | `lib/data/store.ts` |
| Login administrativo | ❌ no existe en esta versión | — |
| Identidad Electrónica MITIC | ❌ preparado (state/nonce/PKCE); falta intercambio de tokens. Disponibilidad y endpoints del servicio **no verificados** | `lib/integrations/mitic.ts` |
| Pasarela de pagos | ❌ interfaz; `/api/pagos` responde 503 | `lib/integrations/payments.ts` |

## Marco legal: lo que debe validar un abogado

El código **no garantiza cumplimiento legal**. Puntos verificados por el equipo en fuentes públicas (nov. 2026) y puntos abiertos:

1. **Ley N° 5282/2014** (acceso a la información pública y transparencia gubernamental): título confirmado. Validar la lista exacta de información mínima de oficio, formato y periodicidad de actualización, y responsable de la Oficina de Acceso a la Información. La remuneración de funcionarios se rige además por la **Ley N° 5189/2014**.
2. **Ley N° 6534/2020**: su título oficial es *"De protección de datos personales crediticios"*; **no** es una ley general de datos sensibles como indicaba el pedido. La ley general es la **Ley N° 7593/2025** de protección de datos personales. Confirmar entrada en vigor, plazos de adecuación, autoridad de control, bases legales aplicables a entes públicos y plazos de respuesta a derechos del titular. La política de privacidad incluida es un borrador.
3. **Ley N° 4868/2013** (comercio electrónico): se muestran los datos del proveedor (denominación, RUC, domicilio) en el pie y en Términos. Validar su aplicabilidad al cobro de tributos municipales y los requisitos de confirmación/comprobante cuando se integre una pasarela.
4. **Contrataciones**: se cita la Ley N° 7021/2022 y el portal de la DNCP; confirmar vigencia y enlaces.
5. **Neutralidad institucional**: el pedido incluye la afiliación partidaria (ANR) y un acento cromático asociado. Antes de publicar, consultar si su uso en un portal oficial es compatible con la normativa electoral y de uso de recursos públicos. Se desactiva con `administracion.intendente.mostrarPartido = false`.
6. Fotos de personas, textos de ordenanzas y resoluciones: verificar autorizaciones y fidelidad con los originales.

## Accesibilidad

Selector de tamaño de texto (100/112,5/125 %), modo claro/oscuro/sistema, enlace "saltar al contenido", foco visible de 3 px, objetivos táctiles ≥ 44 px, `prefers-reduced-motion`, pausa del carrusel (WCAG 2.2.2), lista textual alternativa al mapa, etiquetas y errores asociados a cada campo. Contrastes de texto ≥ 7:1 (AAA); el rojo `#D91023` (5,2:1) se usa solo en detalles decorativos.
axe-core no reporta violaciones A/AA/AAA en las pruebas automáticas; **no** se hizo prueba manual con lectores de pantalla ni con usuarios, necesaria para afirmar conformidad WCAG.

## Rendimiento (4G/3G)

Fuentes autoalojadas (sin peticiones a Google Fonts), JS inicial de la portada ≈ 199 KB ("First Load JS" según `next build`), mapa Leaflet cargado solo a pedido, imágenes vía `next/image` (AVIF/WebP, lazy). No se midió con Lighthouse ni en red 3G real.

## Despliegue en Vercel

1. En <https://vercel.com/new> importar `Protoski/pirayu` (framework detectado: Next.js; región `gru1` São Paulo vía `vercel.json`).
2. En *Settings → Environment Variables* cargar al menos `CSRF_SECRET` y `DATA_ENCRYPTION_KEY` (`openssl rand -base64 32` cada una) y `APP_ORIGIN` con el dominio final. Recomendado: `UPSTASH_REDIS_REST_URL`/`TOKEN` (integración Upstash del Marketplace de Vercel).
3. Cada push a `main` despliega producción; cada PR genera una URL de vista previa.
4. Mientras `modoDemostracion = true`, el sitio muestra un aviso global y envía `noindex`.

## Skills de Claude Code incluidas

`.claude/skills/webapp-testing` (ComposioHQ/awesome-claude-skills @ be2a406, Apache-2.0) y `.claude/skills/frontend-visual-qa` (daymade/claude-code-skills @ dc3eb11, MIT). Instalación de dependencias: `bash scripts/setup.sh`. La demo original sigue en `demo/` (`npm run demo`, `npm run qa:demo`).
