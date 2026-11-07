'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { galeria } from '@/content/sitio';
import { MediaPlaceholder } from './media-placeholder';

/**
 * Galería con lazy-loading (next/image `loading="lazy"` + AVIF/WebP) y visor accesible
 * (diálogo con foco atrapado, Escape para cerrar, flechas de teclado para navegar).
 */
export function Galeria(): React.JSX.Element {
  const [abierta, setAbierta] = useState<number | null>(null);
  const item = abierta === null ? null : galeria[abierta];
  const mover = (d: number): void => {
    setAbierta((i) =>
      i === null ? i : (i + d + galeria.length) % galeria.length,
    );
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {galeria.map((g, i) => (
          <li
            key={g.id}
            className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
          >
            <button
              type="button"
              onClick={() => {
                setAbierta(i);
              }}
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-sm"
              aria-label={`Ampliar: ${g.titulo}`}
            >
              {g.src ? (
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <MediaPlaceholder
                  motivo={g.motivo}
                  titulo={g.titulo}
                  className="h-full w-full"
                  compact
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      <Dialog
        open={item !== null && item !== undefined}
        onOpenChange={(o) => {
          if (!o) setAbierta(null);
        }}
      >
        {item ? (
          <DialogContent
            className="max-w-4xl"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') mover(1);
              if (e.key === 'ArrowLeft') mover(-1);
            }}
          >
            <DialogTitle>{item.titulo}</DialogTitle>
            <DialogDescription>
              Imagen {(abierta ?? 0) + 1} de {galeria.length}. Usá las flechas
              del teclado para navegar.
            </DialogDescription>
            <div className="relative mt-4 aspect-[3/2] w-full overflow-hidden rounded-sm">
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 56rem, 100vw"
                  className="object-contain"
                />
              ) : (
                <MediaPlaceholder
                  motivo={item.motivo}
                  titulo={item.titulo}
                  className="h-full w-full"
                />
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  mover(-1);
                }}
              >
                <ChevronLeft aria-hidden /> Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  mover(1);
                }}
              >
                Siguiente <ChevronRight aria-hidden />
              </Button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
