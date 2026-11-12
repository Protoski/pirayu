/**
 * Construcción de la Content-Security-Policy (mitigación de XSS, OWASP A03:2021 Inyección).
 *
 * - script-src usa un nonce aleatorio por petición + 'strict-dynamic': solo se ejecutan scripts
 *   emitidos por el servidor con ese nonce (y los que éstos carguen). No se permite 'unsafe-inline'.
 *   En desarrollo se añade 'unsafe-eval' porque React Refresh lo requiere; nunca en producción.
 * - style-src permite 'unsafe-inline': React/Next y la librería de animación escriben atributos
 *   `style`. Riesgo aceptado y documentado: la inyección de CSS no ejecuta código.
 * - img-src incluye tile.openstreetmap.org (teselas del mapa interactivo).
 * - frame-ancestors 'none' equivale a X-Frame-Options: DENY.
 */
import { camarasPublicas } from '@/content/sitio';

export function buildCsp(nonce: string, isDev: boolean): string {
  const cameraOrigins = camarasPublicas.flatMap((camara) => {
    try {
      const url = new URL(camara.url);
      return url.protocol === 'https:' && !url.username && !url.password
        ? [url.origin]
        : [];
    } catch {
      return [];
    }
  });
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https://tile.openstreetmap.org'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(isDev ? ['ws:'] : [])],
    'media-src': ["'self'", ...new Set(cameraOrigins)],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
  };
  const policy = Object.entries(directives).map(
    ([k, v]) => `${k} ${v.join(' ')}`,
  );
  if (!isDev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
