import { Download, ExternalLink, FileText } from 'lucide-react';
import { datasets, portalUnificado } from '@/content/sitio';
import { EjemploBadge } from './ejemplo-badge';
import { SectionHeading } from './section-heading';

/**
 * 5. Portal de Transparencia Activa.
 * Ley N° 5282/2014 obliga a difundir de oficio información mínima (estructura, nómina,
 * remuneraciones —también Ley N° 5189/2014—, presupuesto y ejecución, contrataciones, normas).
 * Los CSV se generan desde src/content/sitio.ts con protección contra inyección de fórmulas.
 * El listado exacto de ítems obligatorios y su periodicidad deben validarse con asesoría legal.
 */
export function Transparencia(): React.JSX.Element {
  return (
    <section
      id="transparencia"
      aria-labelledby="titulo-transparencia"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <SectionHeading
        id="titulo-transparencia"
        eyebrow="Transparencia Ley 5282/14"
        title="Portal de Transparencia Activa"
      >
        Información pública de oficio en formato abierto (CSV, UTF-8). Las
        solicitudes de acceso a información pública se tramitan en el{' '}
        <a
          href={portalUnificado.url}
          className="font-semibold text-primary underline underline-offset-2"
          rel="noopener noreferrer"
          target="_blank"
        >
          {portalUnificado.etiqueta}
          <span className="sr-only"> (abre en una pestaña nueva)</span>
        </a>
        .
      </SectionHeading>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <EjemploBadge texto="Datos de ejemplo" />
        <span>
          Los archivos actuales demuestran el formato; deben reemplazarse por
          las exportaciones oficiales.
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <ul className="divide-y divide-border">
          {datasets.map((d) => (
            <li
              key={d.id}
              className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center md:gap-6"
            >
              <div className="min-w-0">
                <h3 className="font-semibold">{d.titulo}</h3>
                <p className="text-sm text-muted-foreground">{d.descripcion}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    Base legal:{' '}
                    <span className="font-medium text-foreground">
                      {d.base}
                    </span>
                  </span>
                  <span>
                    Actualizado:{' '}
                    <span className="font-medium text-foreground">
                      {d.actualizado}
                    </span>
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`/api/transparencia/${d.id}`}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Download aria-hidden className="size-4" />
                  CSV<span className="sr-only"> de {d.titulo}</span>
                </a>
                {d.pdf ? (
                  <a
                    href={d.pdf}
                    download
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface"
                  >
                    <FileText aria-hidden className="size-4" />
                    PDF<span className="sr-only"> de {d.titulo}</span>
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-md border border-dashed border-border px-4 text-sm text-muted-foreground">
                    <FileText aria-hidden className="size-4" />
                    PDF pendiente
                  </span>
                )}
                {d.enlaceExterno ? (
                  <a
                    href={d.enlaceExterno.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface"
                  >
                    {d.enlaceExterno.etiqueta}
                    <ExternalLink aria-hidden className="size-4" />
                    <span className="sr-only">(abre en una pestaña nueva)</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
