import { administracion, institucion } from '@/content/sitio';
import { EjemploBadge } from './ejemplo-badge';
import { HeroMedia } from './hero-media';
import { TramiteSearch } from './tramite-search';

/** 2. Hero: bienvenida de la Administración y buscador rápido de trámites. */
export function Hero(): React.JSX.Element {
  const { intendente, bienvenida } = administracion;
  return (
    <section
      id="inicio"
      aria-labelledby="titulo-inicio"
      className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:pt-14"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="flex flex-col">
          <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {institucion.lema}
            </span>
            <span aria-hidden>·</span>
            <span>
              Administración {intendente.nombre}
              {intendente.mostrarPartido ? ` (${intendente.partido})` : ''}
            </span>
          </p>
          <h1
            id="titulo-inicio"
            className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
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
          <div className="mt-8 max-w-xl lg:mt-auto lg:pt-8">
            <TramiteSearch />
          </div>
        </div>
        <HeroMedia />
      </div>
    </section>
  );
}
