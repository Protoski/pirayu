import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { getSecret } from './secrets';

/**
 * Cifrado de campos sensibles en reposo (cédula, teléfono, correo) con AES-256-GCM.
 * - IV aleatorio de 96 bits por valor; etiqueta de autenticación de 128 bits (detecta manipulación).
 * - Formato: "v1.<iv>.<tag>.<ciphertext>" en base64url, para permitir rotación de clave futura.
 * - La clave (DATA_ENCRYPTION_KEY) vive solo en variables de entorno, nunca en el repositorio.
 * En tránsito, la confidencialidad la da TLS (HSTS obligatorio).
 */
const ALG = 'aes-256-gcm';

export function encryptField(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALG, getSecret('DATA_ENCRYPTION_KEY'), iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [
    'v1',
    iv.toString('base64url'),
    cipher.getAuthTag().toString('base64url'),
    ct.toString('base64url'),
  ].join('.');
}

export function decryptField(payload: string): string {
  const [version, iv, tag, ct] = payload.split('.');
  if (version !== 'v1' || !iv || !tag || ct === undefined)
    throw new Error('Formato de campo cifrado inválido');
  const decipher = createDecipheriv(
    ALG,
    getSecret('DATA_ENCRYPTION_KEY'),
    Buffer.from(iv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(ct, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}
