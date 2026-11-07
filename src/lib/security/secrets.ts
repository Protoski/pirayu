import { randomBytes } from 'node:crypto';

/**
 * Lectura de secretos desde variables de entorno.
 * Producción: si falta un secreto se lanza un error (fail-closed). Nunca se usa un valor por defecto.
 * Desarrollo/test: se genera un valor efímero por proceso para poder trabajar sin configurar nada.
 */
const ephemeral = new Map<string, Buffer>();

export function getSecret(
  name: 'CSRF_SECRET' | 'DATA_ENCRYPTION_KEY',
  bytes = 32,
): Buffer {
  const raw = process.env[name];
  if (raw) {
    const buf = Buffer.from(raw, 'base64');
    if (buf.length < bytes)
      throw new Error(`${name} debe tener al menos ${bytes} bytes en base64`);
    return buf.subarray(0, bytes);
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `Falta la variable de entorno ${name} (requerida en producción)`,
    );
  }
  let value = ephemeral.get(name);
  if (!value) {
    value = randomBytes(bytes);
    ephemeral.set(name, value);
    console.warn(
      `[seguridad] ${name} no definida: usando valor efímero (solo desarrollo).`,
    );
  }
  return value;
}
