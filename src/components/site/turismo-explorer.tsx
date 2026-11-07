'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { centroMapa, sitiosTuristicos } from '@/content/sitio';
import { cn } from '@/lib/utils';
import { LeafletMap } from './leaflet-map';

/** Mapa de sitios + lista sincronizada (la lista es la alternativa accesible al mapa). */
export function TurismoExplorer(): React.JSX.Element {
  const [activo, setActivo] = useState<string | null>(
    sitiosTuristicos[0]?.id ?? null,
  );
  const sitio = sitiosTuristicos.find((s) => s.id === activo);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <ul className="grid content-start gap-2" aria-label="Sitios turísticos">
        {sitiosTuristicos.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={activo === s.id}
              onClick={() => {
                setActivo(s.id);
              }}
              className={cn(
                'flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition-colors',
                activo === s.id
                  ? 'border-primary bg-primary-soft'
                  : 'border-border hover:bg-surface',
              )}
            >
              <MapPin
                aria-hidden
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  activo === s.id ? 'text-accent-red' : 'text-muted-foreground',
                )}
              />
              <span>
                <span className="block font-semibold">{s.nombre}</span>
                <span className="block text-xs text-muted-foreground">
                  {s.categoria}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="grid gap-3">
        <LeafletMap
          center={centroMapa}
          markers={sitiosTuristicos.map((s) => ({
            id: s.id,
            lat: s.lat,
            lng: s.lng,
            label: s.nombre,
          }))}
          activeId={activo}
          onMarkerClick={setActivo}
          label="Mapa de sitios turísticos de Pirayú"
          className="h-80 lg:h-[26rem]"
        />
        {sitio ? (
          <div
            aria-live="polite"
            className="rounded-md border border-border p-4"
          >
            <p className="font-semibold">{sitio.nombre}</p>
            <p className="text-sm text-muted-foreground">{sitio.descripcion}</p>
            {!sitio.coordenadasVerificadas ? (
              <p className="mt-2 text-xs text-warning">
                Ubicación ilustrativa: pendiente de relevamiento.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
