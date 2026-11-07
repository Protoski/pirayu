'use client';

import { ArrowRight, Search } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { sugerenciasBusqueda, tramites } from '@/content/sitio';

const normalizar = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Buscador rápido de trámites: filtra en el cliente, sin peticiones de red (apto para 3G). */
export function TramiteSearch(): React.JSX.Element {
  const [q, setQ] = useState('');
  const inputId = useId();
  const resultsId = useId();

  const resultados = useMemo(() => {
    const n = normalizar(q);
    if (!n) return [];
    return tramites.filter((t) =>
      [t.titulo, t.resumen, ...t.palabrasClave].some((k) =>
        normalizar(k).includes(n),
      ),
    );
  }, [q]);

  const ir = (id: string): void => {
    const el = document.getElementById(`tramite-${id}`);
    el?.scrollIntoView({ block: 'start' });
    el?.focus({ preventScroll: true });
  };

  return (
    <form
      role="search"
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const first = resultados[0];
        if (first) ir(first.id);
      }}
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold">
        ¿Qué deseas tramitar hoy?
      </label>
      <div className="flex items-stretch rounded-md border border-border bg-background focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-ring">
        <Search
          aria-hidden
          className="ml-3 size-5 self-center text-muted-foreground"
        />
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          placeholder="Ej.: registro, inmobiliario, habilitación"
          autoComplete="off"
          aria-describedby={resultsId}
          className="min-h-12 w-full bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="m-1 rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Buscar
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Más buscados:</span>
        {sugerenciasBusqueda.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQ(s);
            }}
            className="min-h-9 rounded-sm border border-border px-3 hover:border-primary hover:text-primary"
          >
            {s}
          </button>
        ))}
      </div>
      <div id={resultsId} aria-live="polite" className="mt-3">
        {q && resultados.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin coincidencias. Revisá la lista completa de trámites más abajo.
          </p>
        ) : null}
        {resultados.length > 0 ? (
          <ul className="divide-y divide-border rounded-md border border-border bg-background">
            {resultados.map((t) => (
              <li key={t.id}>
                <a
                  href={`#tramite-${t.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    ir(t.id);
                  }}
                  className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-surface"
                >
                  <span className="font-medium">{t.titulo}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </form>
  );
}
