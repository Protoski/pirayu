'use client';

import { Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { heroDiapositivas, heroVideo } from '@/content/sitio';
import { MediaPlaceholder } from './media-placeholder';

const INTERVALO_MS = 6000;

/**
 * Slider del Hero (o video en bucle si `heroVideo` está definido).
 * WCAG 2.2.2: todo contenido que se mueve más de 5 s tiene botón de pausa. Con
 * `prefers-reduced-motion` el avance automático no se activa.
 * Rendimiento 3G: el video usa preload="none" y solo se reproduce si el usuario no pidió
 * movimiento reducido; las imágenes van por next/image (AVIF/WebP y tamaños responsivos).
 */
export function HeroMedia(): React.JSX.Element {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activo = playing && !reduce;

  useEffect(() => {
    if (heroVideo) {
      const v = videoRef.current;
      if (!v) return;
      if (activo)
        void v.play().catch(() => {
          setPlaying(false);
        });
      else v.pause();
      return;
    }
    if (!activo || heroDiapositivas.length < 2) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroDiapositivas.length);
    }, INTERVALO_MS);
    return () => {
      window.clearInterval(t);
    };
  }, [activo]);

  const slide = heroDiapositivas[index] ?? heroDiapositivas[0];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {heroVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo.src}
          poster={heroVideo.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
      ) : (
        <AnimatePresence mode="sync" initial={false}>
          {slide ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.6 }}
            >
              {slide.src ? (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <MediaPlaceholder
                  motivo={slide.motivo}
                  titulo={slide.titulo}
                  className="h-full w-full"
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}

      {heroVideo !== null || heroDiapositivas.length > 1 ? (
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 p-1">
          {!heroVideo &&
            heroDiapositivas.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setIndex(i);
                }}
                aria-label={`Mostrar: ${d.titulo}`}
                aria-current={i === index}
                className="flex size-9 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground'}`}
                />
              </button>
            ))}
          <button
            type="button"
            onClick={() => {
              setPlaying((p) => !p);
            }}
            aria-label={
              activo ? 'Pausar presentación' : 'Reproducir presentación'
            }
            className="flex size-9 items-center justify-center rounded-sm hover:bg-surface"
          >
            {activo ? (
              <Pause aria-hidden className="size-4" />
            ) : (
              <Play aria-hidden className="size-4" />
            )}
          </button>
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-12 text-white">
        <p className="text-xs uppercase tracking-[0.15em]">Nuestra identidad</p>
        <p className="mt-1 font-serif text-xl">
          Historia que nos une. Una ciudad que se renueva.
        </p>
      </div>
    </div>
  );
}
