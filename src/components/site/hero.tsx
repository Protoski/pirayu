import { administracion, institucion } from '@/content/sitio';
import { EjemploBadge } from './ejemplo-badge';
import { HeroMedia } from './hero-media';
import { TramiteSearch } from './tramite-search';

/** 2. Hero: bienvenida de la Administración y buscador rápido de trámites. */
export function Hero(): React.JSX.Element {
  const { bienvenida } = administracion;
  return (
    <section
      id="inicio"
      aria-labelledby="titulo-inicio"
      className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:pt-14"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="flex flex-col">
          <p className="renewal-label mb-5 w-fit rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
            Pirayú · Paraguarí · Paraguay
          </p>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">
            {institucion.nombre}
          </p>
          <h1
            id="titulo-inicio"
            className="font-serif text-primary text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {bienvenida.titulo}
          </h1>
          <div className="mt-5 max-w-xl text-lg text-muted-foreground">
            <p>{bienvenida.texto}</p>
            {bienvenida.ejemplo ? (
              <p className="mt-2">
                <EjemploBadge texto="Mensaje de ejemplo" />
              </p>
            ) : null}
          </div>
          <div className="my-6 flex flex-wrap gap-3">
            <a
              href="/#tramites"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Explorar trámites
            </a>
            <a
              href="/#contacto"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-surface"
            >
              Contactar al municipio
            </a>
          </div>
          <div className="mt-4 max-w-xl lg:mt-auto lg:pt-4">
            <TramiteSearch />
          </div>
        </div>
        <HeroMedia />
      </div>
    </section>
  );
}
