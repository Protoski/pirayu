'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Controles de accesibilidad: escala tipográfica (100 / 112.5 / 125 %) y tema claro/oscuro.
 * La preferencia se guarda en localStorage (no es dato personal; no requiere consentimiento)
 * y se aplica antes del primer pintado mediante el script con nonce de layout.tsx.
 */
export const FONT_SCALE_KEY = 'pirayu.fontScale';
const SCALES = [
  { value: '0', label: 'A', name: 'texto normal' },
  { value: '1', label: 'A+', name: 'texto grande' },
  { value: '2', label: 'A++', name: 'texto muy grande' },
];

export function FontSizeControl({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  const [scale, setScale] = useState('0');

  useEffect(() => {
    setScale(document.documentElement.dataset.fontScale ?? '0');
  }, []);

  const apply = (v: string): void => {
    setScale(v);
    document.documentElement.dataset.fontScale = v;
    try {
      localStorage.setItem(FONT_SCALE_KEY, v);
    } catch {
      /* almacenamiento no disponible: la preferencia dura solo esta visita */
    }
  };

  return (
    <div
      role="group"
      aria-label="Tamaño del texto"
      className={cn('inline-flex rounded-md border border-border', className)}
    >
      {SCALES.map((s) => (
        <button
          key={s.value}
          type="button"
          aria-pressed={scale === s.value}
          title={`Tamaño: ${s.name}`}
          onClick={() => {
            apply(s.value);
          }}
          className="min-h-11 min-w-11 px-2 text-sm font-semibold first:rounded-l-md last:rounded-r-md hover:bg-surface aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {s.label}
          <span className="sr-only"> ({s.name})</span>
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle(): React.JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const dark = mounted && resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={() => {
        setTheme(dark ? 'light' : 'dark');
      }}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      className="inline-flex size-11 items-center justify-center rounded-md border border-border hover:bg-surface"
    >
      {dark ? (
        <Sun aria-hidden className="size-5" />
      ) : (
        <Moon aria-hidden className="size-5" />
      )}
    </button>
  );
}
