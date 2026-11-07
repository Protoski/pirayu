import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Marcador gráfico para fotos/videos aún no provistos por la Municipalidad.
 * Los motivos son ilustraciones lineales originales (encaje radial tipo ñandutí, vías férreas,
 * arcadas coloniales); no reproducen fotografías ni obras de terceros.
 */
type Motivo = 'tren' | 'nanduti' | 'centro';

function Nanduti(): React.JSX.Element {
  const spokes = Array.from({ length: 24 }, (_, i) => (i * Math.PI * 2) / 24);
  const petals = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {[30, 60, 90, 120, 150].map((r) => (
        <circle key={r} cx="300" cy="200" r={r} opacity={0.35 + r / 400} />
      ))}
      {spokes.map((a) => (
        <line
          key={a}
          x1="300"
          y1="200"
          x2={300 + Math.cos(a) * 150}
          y2={200 + Math.sin(a) * 150}
          opacity="0.5"
        />
      ))}
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="300"
          cy="125"
          rx="10"
          ry="28"
          transform={`rotate(${deg} 300 200)`}
        />
      ))}
      {petals.map((deg) => (
        <circle
          key={`d${deg}`}
          cx="300"
          cy="62"
          r="6"
          transform={`rotate(${deg + 15} 300 200)`}
        />
      ))}
    </g>
  );
}

function Tren(): React.JSX.Element {
  const sleepers = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="300" y1="170" x2="120" y2="400" />
      <line x1="300" y1="170" x2="480" y2="400" />
      {sleepers.map((i) => {
        const t = (i + 1) / 13;
        const y = 170 + t * t * 230;
        const half = t * t * 200;
        return (
          <line
            key={i}
            x1={300 - half}
            y1={y}
            x2={300 + half}
            y2={y}
            opacity="0.6"
          />
        );
      })}
      <path d="M150 170 V110 L300 60 L450 110 V170 Z" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${175 + i * 55} 170 V135 a17 17 0 0 1 34 0 V170`} />
      ))}
      <line x1="120" y1="170" x2="480" y2="170" />
    </g>
  );
}

function Centro(): React.JSX.Element {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M60 300 V160 H540 V300" />
      <path d="M50 160 L60 140 H540 L550 160" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${80 + i * 58} 300 V215 a22 22 0 0 1 44 0 V300`} />
      ))}
      <line x1="30" y1="300" x2="570" y2="300" />
      <path d="M300 140 V80 M285 95 H315" />
    </g>
  );
}

export function MediaPlaceholder({
  motivo,
  titulo,
  className,
  compact = false,
}: {
  motivo: Motivo;
  titulo: string;
  className?: string;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-primary-soft text-primary',
        className,
      )}
    >
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {motivo === 'nanduti' && <Nanduti />}
        {motivo === 'tren' && <Tren />}
        {motivo === 'centro' && <Centro />}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-background/90 px-3 py-2 text-xs text-foreground">
        <ImageOff
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground"
        />
        <span>
          <span className="font-semibold">{titulo}</span>
          {!compact && (
            <span className="text-muted-foreground">
              {' '}
              · Foto pendiente: reemplazar en src/content/sitio.ts
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
