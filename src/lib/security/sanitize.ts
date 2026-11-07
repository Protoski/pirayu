import { sanitize } from 'isomorphic-dompurify';

/**
 * Sanitización de fragmentos HTML (XSS). Solo se usa para contenido editorial con formato
 * (p. ej. resúmenes de resoluciones). Los datos ingresados por ciudadanos NUNCA se renderizan
 * como HTML: se guardan como texto y React los escapa al mostrarlos.
 */
const ALLOWED_TAGS = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'br'];

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href'],
    ALLOWED_URI_REGEXP: /^(?:https:|mailto:|tel:|\/)/i,
  });
}
