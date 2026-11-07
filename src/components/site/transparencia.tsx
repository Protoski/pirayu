import { fuentesOficiales } from '@/content/fuentes';
import { portalUnificado } from '@/content/sitio';
import { SectionHeading } from './section-heading';

export function Transparencia(): React.JSX.Element {
  const fuentes = fuentesOficiales.slice(3, 8);
  return (
    <section
      id="transparencia"
      aria-labelledby="titulo-transparencia"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <SectionHeading
        id="titulo-transparencia"
        eyebrow="Información pública"
        title="Transparencia municipal"
      >
        Accedé a las publicaciones oficiales. Cada documento conserva su
        ejercicio y período de origen.
      </SectionHeading>
      <ul className="grid gap-4 md:grid-cols-2">
        {fuentes.map((f) => (
          <li
            key={f.url}
            className="rounded-md border border-border bg-surface p-6"
          >
            <h3 className="font-semibold">{f.titulo}</h3>
            <p className="my-3 text-sm text-muted-foreground">
              {f.descripcion}
            </p>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Consultar fuente oficial
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        Para solicitudes de acceso a la información:{' '}
        <a className="text-primary underline" href={portalUnificado.url}>
          {portalUnificado.etiqueta}
        </a>
        .{' '}
        <a className="text-primary underline" href="/fuentes">
          Ver todas las fuentes consultadas
        </a>
        .
      </p>
    </section>
  );
}
