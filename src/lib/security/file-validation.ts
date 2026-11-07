/**
 * Validación de imágenes subidas (reclamos ciudadanos).
 * No se confía en la extensión ni en el Content-Type enviado por el cliente: se verifican los
 * "magic bytes" del archivo. Tamaño máximo 5 MB. Formatos: JPEG, PNG, WebP.
 * Pendiente para producción: re-codificar la imagen en servidor (elimina metadatos EXIF con
 * ubicación del ciudadano) y analizarla con antivirus antes de almacenarla.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export type ImageKind = 'image/jpeg' | 'image/png' | 'image/webp';

export function detectImageType(bytes: Uint8Array): ImageKind | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    return 'image/jpeg';
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((b, i) => bytes[i] === b))
    return 'image/png';
  const ascii = (from: number, to: number): string =>
    String.fromCharCode(...bytes.slice(from, to));
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP')
    return 'image/webp';
  return null;
}
