import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, generateNonce } from '@/lib/security/csp';

/**
 * Middleware de seguridad (Edge runtime).
 * 1. Genera un nonce criptográfico por petición y lo expone a los Server Components vía `x-nonce`.
 * 2. Emite la CSP en la respuesta. Next.js lee la CSP de las cabeceras de la petición y
 *    aplica el nonce a sus propios <script>.
 * Las demás cabeceras (HSTS, X-Frame-Options, nosniff…) se definen en next.config.ts.
 */
export function middleware(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|media/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
