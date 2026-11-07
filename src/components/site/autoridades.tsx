import { UserRound } from 'lucide-react';
import Image from 'next/image';
import {
  administracion,
  directores,
  juntaMunicipal,
  type Persona,
} from '@/content/sitio';
import { EjemploBadge } from './ejemplo-badge';
import { SafeHtml } from './safe-html';
import { SectionHeading } from './section-heading';

function Retrato({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
}): React.JSX.Element {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 20vw, 40vw"
          className="object-cover object-top"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-primary-soft text-primary ${className}`}
      role="img"
      aria-label={`Foto institucional pendiente: ${alt}`}
    >
      <UserRound aria-hidden className="size-1/3" strokeWidth={1.25} />
    </div>
  );
}

function FichaPersona({ p }: { p: Persona }): React.JSX.Element {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border p-3">
      <Retrato
        src={p.foto}
        alt={p.cargo}
        className="size-14 shrink-0 rounded-sm"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{p.nombre}</p>
        <p className="text-sm text-muted-foreground">{p.cargo}</p>
      </div>
    </li>
  );
}

/** 3. Autoridades: ficha del Intendente, Junta Municipal y Unidad de Contratación. */
export function Autoridades(): React.JSX.Element {
  const { intendente } = administracion;
  return (
    <section
      aria-labelledby="titulo-autoridades"
      className="mx-auto max-w-7xl px-4 py-16"
      id="autoridades"
    >
      <SectionHeading
        id="titulo-autoridades"
        eyebrow="Autoridades"
        title="Información institucional"
      >
        Intendencia Municipal y canales de información institucional.
      </SectionHeading>

      <article
        className="grid gap-6 rounded-md border border-border bg-surface p-4 sm:grid-cols-[16rem_1fr] sm:p-6"
        aria-labelledby="ficha-intendente"
      >
        <Retrato
          src={intendente.foto}
          alt={`${intendente.cargo} ${intendente.nombre}`}
          className="aspect-[4/5] w-full max-w-64 rounded-sm"
        />
        <div>
          <span className="renewal-label mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
            Renovación · Identidad · Servicio
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {intendente.cargo}
          </p>
          <h3
            id="ficha-intendente"
            className="mt-1 font-serif text-3xl font-semibold"
          >
            {intendente.nombre}
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {intendente.mostrarPartido ? (
              <div>
                <dt className="text-muted-foreground">Partido</dt>
                <dd className="font-medium">{intendente.partido}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground">Período</dt>
              <dd className="font-medium">{intendente.periodo}</dd>
            </div>
          </dl>
          <SafeHtml
            html={intendente.biografia}
            className="mt-4 max-w-2xl text-base"
          />
          <p className="mt-3">
            <a
              href="/fuentes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              Consultar fuentes sobre la administración municipal
            </a>
          </p>
        </div>
      </article>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">
              Junta Municipal
            </h3>
            <EjemploBadge texto="Integración vigente por confirmar" />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            No se encontró una nómina oficial vigente en las fuentes
            consultadas.{' '}
            <a
              className="text-primary underline"
              href="https://www.municipios.gov.py/pirayu/junta-municipal/"
            >
              Consultar sección municipal
            </a>
            .
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {juntaMunicipal.map((p) => (
              <FichaPersona key={p.nombre} p={p} />
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">
              Unidad de Contratación
            </h3>
            <EjemploBadge texto="Registro DNCP" />
          </div>
          <p className="mb-4 text-sm">
            Contacto UOC:{' '}
            <a
              className="text-primary underline"
              href="mailto:uoc@pirayu.gov.py"
            >
              uoc@pirayu.gov.py
            </a>{' '}
            · 0519 20241.{' '}
            <a
              className="text-primary underline"
              href="https://www.contrataciones.gov.py/convocantes/municipalidad-pirayu/responsables.html"
            >
              Fuente: DNCP
            </a>
            .
          </p>
          <ul className="grid gap-3">
            {directores.map((p) => (
              <FichaPersona key={p.cargo} p={p} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
