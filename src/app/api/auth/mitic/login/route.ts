import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  buildAuthorizationUrl,
  createPkce,
  getMiticConfig,
} from '@/lib/integrations/mitic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/mitic/login — inicia el flujo OIDC (Authorization Code + PKCE).
 * Sin configuración (convenio con MITIC pendiente) responde 503.
 *
 * Nota de cookies: la cookie transitoria de `state`/PKCE usa SameSite=Lax, NO Strict, porque el
 * regreso desde el proveedor de identidad es una navegación cross-site y una cookie Strict no se
 * enviaría, rompiendo el login. Sigue siendo HttpOnly + Secure y dura 10 minutos.
 * La cookie de sesión que se emita tras el callback sí debe ser SameSite=Strict.
 */
export function GET(): NextResponse {
  const cfg = getMiticConfig();
  if (!cfg) {
    return NextResponse.json(
      {
        error: 'El acceso con Identidad Electrónica aún no está habilitado.',
        configurado: false,
      },
      { status: 503 },
    );
  }
  const state = randomBytes(24).toString('base64url');
  const nonce = randomBytes(24).toString('base64url');
  const { verifier, challenge } = createPkce();
  const res = NextResponse.redirect(
    buildAuthorizationUrl(cfg, state, nonce, challenge),
  );
  res.cookies.set('pirayu.oidc', JSON.stringify({ state, nonce, verifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/mitic',
    maxAge: 600,
  });
  return res;
}
