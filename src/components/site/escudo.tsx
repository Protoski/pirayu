import Image from 'next/image';
import { institucion } from '@/content/sitio';

/**
 * Escudo institucional. Mientras `institucion.escudo` sea null se muestra un MARCADOR genérico
 * (no es el escudo oficial). Colocar el archivo oficial en /public/media y apuntar la ruta.
 */
export function Escudo({
  size = 40,
  decorative = false,
}: {
  size?: number;
  decorative?: boolean;
}): React.JSX.Element {
  if (institucion.escudo) {
    return (
      <Image
        src={institucion.escudo}
        alt={decorative ? '' : 'Escudo de la Municipalidad de Pirayú'}
        width={size}
        height={size}
        priority
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      {...(decorative
        ? { 'aria-hidden': true }
        : {
            role: 'img',
            'aria-label': 'Marcador del escudo institucional (pendiente)',
          })}
    >
      <path
        d="M20 2 L36 8 V20 C36 29 29 35 20 38 C11 35 4 29 4 20 V8 Z"
        fill="var(--primary)"
      />
      <path
        d="M20 6 L32 10.5 V20 C32 27 26.5 31.5 20 34 C13.5 31.5 8 27 8 20 V10.5 Z"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="var(--primary-foreground)"
        fontFamily="serif"
      >
        P
      </text>
      <rect
        x="4"
        y="8"
        width="32"
        height="2"
        fill="var(--accent-red)"
        opacity="0.9"
      />
    </svg>
  );
}
