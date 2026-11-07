import { Badge } from '@/components/ui/badge';

/** Etiqueta visible en todo bloque con datos de ejemplo pendientes de reemplazo. */
export function EjemploBadge({
  texto = 'Dato de ejemplo',
}: {
  texto?: string;
}): React.JSX.Element {
  return <Badge variant="ejemplo">{texto}</Badge>;
}
