import { NextResponse, type NextRequest } from 'next/server';
import { CSRF_COOKIE, CSRF_HEADER, verifyCsrf } from './csrf';
import { clientIp, getLimiter } from './rate-limit';

/**
 * Guardia común para endpoints que modifican estado (POST/PUT/PATCH/DELETE).
 * Orden: (1) Origin del mismo sitio → (2) rate limit por IP → (3) token CSRF.
 * Devuelve una respuesta de error o `null` si la petición puede continuar.
 * Los mensajes de error son genéricos: no revelan qué control falló en detalle.
 */
export interface GuardOptions {
  name: string;
  max: number;
  windowSec: number;
}

export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false; // Los navegadores modernos envían Origin en POST; si falta, se rechaza.
  const allowed =
    process.env.APP_ORIGIN?.replace(/\/$/, '') ?? request.nextUrl.origin;
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  return (
    origin === allowed ||
    (host !== null && origin === `${request.nextUrl.protocol}//${host}`)
  );
}

export async function guardMutation(
  request: NextRequest,
  opts: GuardOptions,
): Promise<NextResponse | null> {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: 'Origen no permitido.' },
      { status: 403 },
    );
  }

  const rl = await getLimiter(opts.name, opts.max, opts.windowSec).limit(
    clientIp(request.headers),
  );
  if (!rl.success) {
    const retry = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intente nuevamente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(retry) } },
    );
  }

  const seed = request.cookies.get(CSRF_COOKIE)?.value;
  if (!verifyCsrf(seed, request.headers.get(CSRF_HEADER))) {
    return NextResponse.json(
      { error: 'Token de seguridad inválido o vencido. Recargue la página.' },
      { status: 403 },
    );
  }
  return null;
}

/** Respuesta 400 uniforme para errores de validación Zod (sin eco de los valores enviados). */
export function validationError(
  issues: { path: PropertyKey[]; message: string }[],
): NextResponse {
  return NextResponse.json(
    {
      error: 'Datos inválidos.',
      campos: issues.map((i) => ({
        campo: i.path.map(String).join('.'),
        mensaje: i.message,
      })),
    },
    { status: 400 },
  );
}
