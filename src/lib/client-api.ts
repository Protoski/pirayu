'use client';

/**
 * Cliente HTTP del navegador. Obtiene el token CSRF de /api/csrf (una vez por carga; se
 * renueva si el servidor responde 403) y lo envía en la cabecera `x-csrf-token`.
 * `credentials: 'same-origin'` garantiza que la cookie semilla solo viaje al propio dominio.
 */
let tokenPromise: Promise<string> | null = null;

async function fetchToken(): Promise<string> {
  const r = await fetch('/api/csrf', {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!r.ok) throw new Error('No se pudo obtener el token de seguridad.');
  const data = (await r.json()) as { token: string };
  return data.token;
}

function getToken(force = false): Promise<string> {
  if (force || !tokenPromise)
    tokenPromise = fetchToken().catch((e: unknown) => {
      tokenPromise = null;
      throw e;
    });
  return tokenPromise;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T & { error?: string; campos?: { campo: string; mensaje: string }[] };
}

async function send<T>(
  url: string,
  body: BodyInit,
  json: boolean,
  retry = true,
): Promise<ApiResult<T>> {
  const token = await getToken();
  const headers: Record<string, string> = { 'x-csrf-token': token };
  if (json) headers['Content-Type'] = 'application/json';
  const r = await fetch(url, {
    method: 'POST',
    body,
    headers,
    credentials: 'same-origin',
  });
  if (r.status === 403 && retry) {
    await getToken(true);
    return send<T>(url, body, json, false);
  }
  const data = (await r
    .json()
    .catch(() => ({
      error: 'Respuesta inválida del servidor.',
    }))) as ApiResult<T>['data'];
  return { ok: r.ok, status: r.status, data };
}

export function postJson<T>(
  url: string,
  payload: unknown,
): Promise<ApiResult<T>> {
  return send<T>(url, JSON.stringify(payload), true);
}

export function postForm<T>(
  url: string,
  form: FormData,
): Promise<ApiResult<T>> {
  return send<T>(url, form, false);
}
