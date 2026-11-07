import { sanitizeHtml } from '@/lib/security/sanitize';

/**
 * Renderiza HTML editorial (p. ej. reseñas cargadas desde un CMS) tras sanitizarlo con DOMPurify
 * en el servidor: solo etiquetas de formato básico y enlaces https/mailto/tel/relativos.
 * Server Component: DOMPurify (y jsdom) no se envían al navegador.
 */
export function SafeHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
