import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getSecret } from './secrets';

/**
 * Protección CSRF (OWASP A01:2021) — patrón "signed double-submit cookie", sin estado en servidor.
 *
 * 1. GET /api/csrf crea un valor aleatorio de 256 bits y lo guarda en una cookie
 *    HttpOnly + SameSite=Strict + Secure (prefijo __Host- en producción: sin Domain, Path=/).
 * 2. El token entregado al cliente es HMAC-SHA256(CSRF_SECRET, valorCookie).
 * 3. Cada POST/PUT/PATCH/DELETE debe enviar el token en la cabecera `x-csrf-token`.
 *    El servidor recalcula el HMAC a partir de la cookie y compara en tiempo constante.
 *
 * Un sitio atacante no puede leer la cookie (HttpOnly), ni leer la respuesta de /api/csrf
 * (política de mismo origen), ni hacer que el navegador envíe la cookie en peticiones
 * cross-site (SameSite=Strict). Se complementa con la verificación de cabecera Origin.
 */
export const CSRF_HEADER = 'x-csrf-token';
export const CSRF_COOKIE =
  process.env.NODE_ENV === 'production' ? '__Host-pirayu.csrf' : 'pirayu.csrf';

export function createCsrfSeed(): string {
  return randomBytes(32).toString('base64url');
}

export function tokenForSeed(seed: string): string {
  return createHmac('sha256', getSecret('CSRF_SECRET'))
    .update(seed)
    .digest('base64url');
}

export function verifyCsrf(
  seed: string | undefined,
  token: string | null | undefined,
): boolean {
  if (!seed || !token || seed.length > 128 || token.length > 128) return false;
  const expected = Buffer.from(tokenForSeed(seed));
  const received = Buffer.from(token);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export const csrfCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 2, // 2 h
};
