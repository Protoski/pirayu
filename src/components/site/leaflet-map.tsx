'use client';

import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';
import { MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

interface LeafletMapProps {
  center: { lat: number; lng: number; zoom: number };
  markers?: MapMarker[];
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  /** Modo selección: un clic en el mapa fija un punto (reclamos). */
  onPick?: (p: { lat: number; lng: number }) => void;
  picked?: { lat: number; lng: number } | null;
  label: string;
  className?: string;
}

/**
 * Mapa interactivo con Leaflet + teselas de OpenStreetMap (atribución obligatoria por licencia ODbL).
 * Carga diferida: la librería (~40 KB gz) y las teselas solo se descargan cuando el usuario pulsa
 * "Cargar mapa", para no penalizar conexiones 3G. El mapa no es la única vía de acceso a la
 * información: cada uso ofrece una alternativa en texto (lista de sitios / campo "referencia").
 * Producción con tráfico alto: la política de uso de tile.openstreetmap.org exige un proveedor
 * de teselas propio o comercial.
 */
export function LeafletMap({
  center,
  markers = [],
  activeId,
  onMarkerClick,
  onPick,
  picked,
  label,
  className,
}: LeafletMapProps): React.JSX.Element {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const markerRefs = useRef(new Map<string, Leaflet.Marker>());
  const pickRef = useRef<Leaflet.Marker | null>(null);
  const onPickRef = useRef(onPick);
  const onMarkerClickRef = useRef(onMarkerClick);
  onPickRef.current = onPick;
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!enabled || !containerRef.current || mapRef.current) return;
    let cancelled = false;
    void import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current) return;
      const L =
        (mod as unknown as { default?: typeof Leaflet }).default ??
        (mod as unknown as typeof Leaflet);
      LRef.current = L;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView([center.lat, center.lng], center.zoom);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      for (const m of markers) {
        const marker = L.marker([m.lat, m.lng], {
          icon: L.divIcon({
            className: '',
            html: `<span class="pin" data-id="${m.id}"></span>`,
            iconSize: [18, 18],
          }),
          title: m.label,
          alt: m.label,
          keyboard: true,
        })
          .addTo(map)
          .bindTooltip(m.label);
        marker.on('click', () => onMarkerClickRef.current?.(m.id));
        markerRefs.current.set(m.id, marker);
      }
      map.on('click', (e: Leaflet.LeafletMouseEvent) => {
        onPickRef.current?.({
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
        });
      });
      mapRef.current = map;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- marcadores y centro son estáticos durante la vida del componente
  }, [enabled]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  // Resalta el marcador activo y centra el mapa en él.
  useEffect(() => {
    const map = mapRef.current;
    for (const [id, mk] of markerRefs.current) {
      const el = mk.getElement()?.querySelector('.pin');
      el?.setAttribute('data-active', String(id === activeId));
      if (id === activeId && map) map.panTo(mk.getLatLng());
    }
  }, [activeId]);

  // Punto elegido por el ciudadano (reclamos).
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    if (!picked) {
      pickRef.current?.remove();
      pickRef.current = null;
      return;
    }
    if (!pickRef.current) {
      pickRef.current = L.marker([picked.lat, picked.lng], {
        icon: L.divIcon({
          className: '',
          html: '<span class="pin" data-active="true"></span>',
          iconSize: [18, 18],
        }),
        title: 'Ubicación seleccionada',
      }).addTo(map);
    } else {
      pickRef.current.setLatLng([picked.lat, picked.lng]);
    }
  }, [picked]);

  return (
    <div className={className}>
      {enabled ? (
        <div
          ref={containerRef}
          role="region"
          aria-label={label}
          className="h-full min-h-72 w-full rounded-md border border-border"
        />
      ) : (
        <div className="flex h-full min-h-72 flex-col items-start justify-center gap-3 rounded-md border border-dashed border-border bg-surface p-6">
          <MapPinned aria-hidden className="size-8 text-primary" />
          <p className="max-w-sm text-sm text-muted-foreground">
            El mapa se carga a pedido para ahorrar datos móviles (≈ 40 KB +
            imágenes del mapa).
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEnabled(true);
            }}
          >
            Cargar mapa
          </Button>
        </div>
      )}
    </div>
  );
}
