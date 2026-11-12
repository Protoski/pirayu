import { Camera, VideoOff } from 'lucide-react';
import { camarasPublicas } from '@/content/sitio';
import { SectionHeading } from './section-heading';

export function Camaras(): React.JSX.Element {
  const camaras = camarasPublicas.filter((camara) => {
    try {
      const url = new URL(camara.url);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
      return false;
    }
  });

  return (
    <section
      id="camaras"
      aria-labelledby="camaras-titulo"
      className="mx-auto max-w-7xl px-4 py-12"
    >
      <SectionHeading
        id="camaras-titulo"
        eyebrow="Ciudad y seguridad"
        title="Cámaras de la ciudad"
      >
        Consultá las transmisiones públicas habilitadas por la Municipalidad.
      </SectionHeading>
      {camaras.length === 0 ? (
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <VideoOff aria-hidden className="size-7" />
          </span>
          <div>
            <h3 className="font-serif text-xl font-semibold">
              Transmisiones aún no disponibles
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Las cámaras aparecerán aquí cuando el municipio habilite sus
              señales públicas.
            </p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {camaras.map((camara) => (
            <li
              key={camara.id}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- Las señales de vigilancia no tienen subtítulos disponibles. */}
              <video
                controls
                playsInline
                preload="none"
                className="aspect-video w-full bg-black"
                aria-label={`Transmisión de ${camara.nombre}`}
                src={camara.url}
              >
                Tu navegador no puede reproducir este video.
              </video>
              <div className="p-5">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Camera aria-hidden className="size-5 text-primary" />
                  {camara.nombre}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {camara.ubicacion}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
