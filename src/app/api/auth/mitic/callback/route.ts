import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface OidcTransient {
  state: string;
  nonce: string;
  verifier: string;
}

/**
 * GET /api/auth/mitic/callback — valida `state` y se detiene.
 * PENDIENTE (requiere documentación y credenciales oficiales): intercambio del `code` por
 * tokens con `code_verifier`, validación del ID Token (firma JWKS, iss, aud, exp, nonce) y
 * emisión de la cookie de sesión HttpOnly + Secure + SameSite=Strict.
 */
export function GET(request: NextRequest): NextResponse {
  const raw = request.cookies.get('pirayu.oidc')?.value;
  let transient: OidcTransient | null = null;
  try {
    transient = raw ? (JSON.parse(raw) as OidcTransient) : null;
  } catch {
    transient = null;
  }
  const state = request.nextUrl.searchParams.get('state');
  if (!transient || !state || state !== transient.state) {
    return NextResponse.json(
      { error: 'Solicitud de autenticación inválida.' },
      { status: 400 },
    );
  }
  const res = NextResponse.json(
    {
      error:
        'Integración con Identidad Electrónica pendiente de credenciales oficiales.',
    },
    { status: 501 },
  );
  res.cookies.delete('pirayu.oidc');
  return res;
}
