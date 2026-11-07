# Directivas de desarrollo web (frontend, testing, React/Next.js)

Fuentes verificadas (clonadas el 2026-11-07):
- ComposioHQ/awesome-claude-skills @ be2a406 — skill `webapp-testing` (Apache-2.0)
- daymade/claude-code-skills @ dc3eb11 — skill `frontend-visual-qa` (MIT)
- vercel/style-guide @ b56b657 — configs ESLint/Prettier/TypeScript (repositorio archivado)

## Skills del proyecto
Las skills viven en `.claude/skills/` y Claude Code las carga solas al arrancar en la raíz del repo. Dependencias: `bash scripts/setup.sh` (usar `.venv/bin/python` para los scripts Python).
- `webapp-testing`: pruebas de la app web local con Playwright (Python). Ejecutar `scripts/with_server.py --help` antes de usarlo; esperar `networkidle` antes de inspeccionar el DOM.
- `frontend-visual-qa`: auditoría visual de UI ya renderizada (tipografía, overflow, responsive, rutas, gráficos). Por defecto solo audita; no edita código ni instala dependencias salvo que se pida.

## Reglas de UI
- Evitar el estilo genérico de IA: exceso de layouts centrados, degradados morados, bordes redondeados uniformes y la fuente Inter por defecto (fuente: awesome-claude-skills/artifacts-builder).
- No dar por buena una UI por compilar o porque el elemento exista en el DOM: verificarla renderizada en navegador real (fuente: frontend-visual-qa).

## Lint y formato (React/Next.js/TypeScript)
- Si el proyecto usa React o Next.js, usar los configs de `@vercel/style-guide` (`eslint/react.js`, `eslint/next.js`, `eslint/typescript`, `prettier`). El repo está archivado: fijar la versión y no esperar actualizaciones.
