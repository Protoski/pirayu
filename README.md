# Pirayu

Repositorio del proyecto web Pirayu. Incluye dos skills de Claude Code en `.claude/skills/`, que Claude Code carga al arrancar en la raíz del repo.

| Skill | Para qué sirve | Requiere |
|---|---|---|
| `webapp-testing` | Probar la app web con Playwright (Python): clics, formularios, capturas, logs de consola | Python ≥ 3.9 + Playwright |
| `frontend-visual-qa` | Auditar la UI ya renderizada: overflow, responsive, tipografía, capturas desktop/móvil | Node ≥ 18 + Playwright |

## 1. Instalar

```bash
git clone https://github.com/Protoski/pirayu.git
cd pirayu
bash scripts/setup.sh          # crea .venv, instala Playwright (Python y Node) y Chromium
source .venv/bin/activate      # en Windows: .venv\Scripts\activate
```

## 2. Comprobar que funcionan

```bash
# webapp-testing: levanta demo/ en el puerto 5173 y ejecuta la prueba
python .claude/skills/webapp-testing/scripts/with_server.py \
  --server "python3 -m http.server 5173 --directory demo" --port 5173 \
  -- python tests/smoke_demo.py
# Esperado: "OK: demo carga y el contador funciona"

# frontend-visual-qa: audita demo/index.html en 3 tamaños de pantalla
npm run qa:demo
# Esperado: informe y capturas en .qa/demo/
```

## 3. Usar con Claude Code

```bash
claude
```

Dentro de Claude Code, `/skills` debe listar `webapp-testing` y `frontend-visual-qa`. Las skills se activan solas según lo que pidas. Ejemplos de prompt:

- **webapp-testing**: «Levanta la app con `npm run dev` en el puerto 3000 y prueba que el formulario de login muestre un error con contraseña vacía. Usa la skill webapp-testing.»
- **frontend-visual-qa**: «Audita visualmente http://localhost:3000 en escritorio y móvil y dime qué se desborda o se corta. Usa la skill frontend-visual-qa.»

## Estructura

```
.claude/skills/   skills de Claude Code
CLAUDE.md         reglas del proyecto que Claude Code lee al iniciar
demo/             página de prueba
tests/            prueba mínima de webapp-testing
scripts/setup.sh  instalación de dependencias
```

## Origen y licencias

- `webapp-testing`: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) @ be2a406, Apache-2.0.
- `frontend-visual-qa`: [daymade/claude-code-skills](https://github.com/daymade/claude-code-skills) @ dc3eb11, MIT (sin sus carpetas `tests/` y `evals/`).
