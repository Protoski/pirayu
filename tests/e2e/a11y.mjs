// Auditoría automática de accesibilidad con axe-core (WCAG 2.0/2.1 A, AA y AAA).
// Uso: con el servidor en marcha → BASE_URL=http://localhost:3000 node tests/e2e/a11y.mjs
// Limitación: axe detecta ~30-40 % de los problemas WCAG; no sustituye una revisión manual
// con lector de pantalla (NVDA/VoiceOver) ni pruebas con usuarios.
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const RUTAS = ['/', '/privacidad', '/terminos', '/denuncias', '/ingresar'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag2aaa'];

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {},
);
let total = 0;
for (const scheme of ['light', 'dark']) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport });
    const page = await ctx.newPage();
    for (const ruta of RUTAS) {
      await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
      const { violations } = await new AxeBuilder({ page })
        .withTags(TAGS)
        .analyze();
      for (const v of violations) {
        total += v.nodes.length;
        console.log(
          `[${scheme} ${viewport.width}px] ${ruta} · ${v.id} (${v.impact}) · ${v.nodes.length} nodo(s): ${v.help}`,
        );
        for (const n of v.nodes.slice(0, 3))
          console.log(
            `    ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1] ?? ''}`,
          );
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`\nTotal de nodos con violaciones: ${total}`);
process.exit(total ? 1 : 0);
