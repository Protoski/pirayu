# Instalación en tu repositorio

Desde la raíz de tu proyecto web:

1. Copiar la carpeta `.claude/skills/` de este paquete a la raíz del repo.
2. Si el repo ya tiene `CLAUDE.md`, añadir al final el contenido de `CLAUDE.md` de este paquete; si no, copiarlo tal cual.
3. Ejecutar `claude` en la raíz. Verificación: escribir `/skills` (o preguntar "¿qué skills tienes?") debe listar `webapp-testing` y `frontend-visual-qa`.

Requisitos para usar las skills:
- `webapp-testing`: Python 3 + `pip install playwright` + `playwright install chromium`.
- `frontend-visual-qa`: Node 18+ con Playwright para sus scripts `.mjs`.

Correcciones a las instrucciones originales:
- `awesome-claude-skills/frontend-design.md` no existe en el repositorio; el `cat ... >> CLAUDE.md` fallaría.
- `vercel/style-guide` no contiene guías de UI/UX en Markdown: son configs de ESLint/Prettier/TypeScript y el repo está archivado.
- Formato nativo de Claude Code: skills en `.claude/skills/<nombre>/SKILL.md` (no hace falta pegar todo en CLAUDE.md, que se carga entero en cada sesión).
