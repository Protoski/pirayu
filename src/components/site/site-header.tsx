'use client';

import { KeyRound, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { institucion, navegacion } from '@/content/sitio';
import { FontSizeControl, ThemeToggle } from './accessibility-controls';
import { Escudo } from './escudo';

/** 1. Header / Navbar: escudo, navegación principal, tamaño de fuente y modo oscuro. */
export function SiteHeader(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="civic-stripe" aria-hidden />
      <div className="bg-[#902334] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <p>
            Portal ciudadano
            <span className="hidden sm:inline">
              {' '}
              · {institucion.departamento}, Paraguay
            </span>
          </p>
          <Link
            href="/ingresar"
            className="inline-flex min-h-8 items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <KeyRound aria-hidden className="size-3.5" />
            Mi Carpeta · Próximamente
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Escudo size={40} decorative />
          <span className="min-w-0 leading-tight">
            <span className="block font-serif text-lg font-semibold">
              {institucion.nombre}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {institucion.departamento}
            </span>
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-1 text-sm">
            {navegacion.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex min-h-11 items-center rounded-md px-3 font-medium hover:bg-surface"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex xl:ml-2">
          <FontSizeControl />
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-border sm:ml-2 xl:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => {
            setOpen((v) => !v);
          }}
        >
          {open ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="menu-movil"
            key="menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border xl:hidden"
          >
            <nav
              aria-label="Principal (móvil)"
              className="mx-auto max-w-7xl px-4 py-3"
            >
              <ul className="grid gap-1">
                {navegacion.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="flex min-h-11 items-center rounded-md px-3 font-medium hover:bg-surface"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 sm:hidden">
                <FontSizeControl />
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
