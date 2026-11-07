import { NextResponse } from 'next/server';
import {
  CSRF_COOKIE,
  createCsrfSeed,
  csrfCookieOptions,
  tokenForSeed,
} from '@/lib/security/csrf';

export const dynamic = 'force-dynamic';

/** Emite la cookie semilla (HttpOnly, SameSite=Strict) y devuelve el token CSRF derivado. */
export function GET(): NextResponse {
  const seed = createCsrfSeed();
  const res = NextResponse.json(
    { token: tokenForSeed(seed) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  res.cookies.set(CSRF_COOKIE, seed, csrfCookieOptions);
  return res;
}
