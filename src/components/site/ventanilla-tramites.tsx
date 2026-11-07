import {
  Building2,
  CalendarClock,
  Car,
  Home,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { tramites, type EstadoServicio, type Tramite } from '@/content/sitio';
import { EjemploBadge } from './ejemplo-badge';
import { SectionHeading } from './section-heading';
import { TramiteAcciones } from './tramite-acciones';

const ICONOS: Record<Tramite['id'], LucideIcon> = {
  licencia: Car,
  inmobiliario: Home,
  patente: Building2,
  audiencia: CalendarClock,
  reclamo: Megaphone,
};

const SERVICIO: Record<
  EstadoServicio,
  { texto: string; variant: 'success' | 'warning' | 'default' }
> = {
  en_linea: { texto: '100 % en línea', variant: 'success' },
  parcial: { texto: 'Inicio en línea · pago en caja', variant: 'warning' },
  presencial: { texto: 'Presencial', variant: 'default' },
};

/** 4. Ventanilla Virtual de Trámites (Ciudadano Digital). */
export function VentanillaTramites(): React.JSX.Element {
  return (
    <section
      id="tramites"
      aria-labelledby="titulo-tramites"
      className="bg-surface py-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="titulo-tramites"
          eyebrow="Ciudadano digital"
          title="Ventanilla Virtual de Trámites"
        >
          Iniciá solicitudes, consultá el estado de tu expediente y pagá
          tributos municipales. El pago en línea se habilitará cuando la
          Municipalidad contrate una pasarela de cobro.
        </SectionHeading>

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tramites.map((t) => {
            const Icon = ICONOS[t.id];
            const s = SERVICIO[t.estadoServicio];
            return (
              <li
                key={t.id}
                id={`tramite-${t.id}`}
                tabIndex={-1}
                className="scroll-mt-28 outline-none focus-visible:outline-3"
              >
                <Card className="flex h-full flex-col transition-shadow hover:shadow-[0_1px_0_0_var(--border),0_8px_24px_-12px_rgb(0_0_0/0.25)]">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-sm bg-primary-soft text-primary">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <Badge variant={s.variant}>
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-current"
                        />
                        {s.texto}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug">
                      {t.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t.resumen}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <details className="group text-sm">
                      <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-primary">
                        Requisitos
                      </summary>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                        {t.requisitos.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      {t.requisitos.some((r) => r.includes('[PENDIENTE]')) ? (
                        <p className="mt-2">
                          <EjemploBadge texto="Requisitos por confirmar" />
                        </p>
                      ) : null}
                    </details>
                  </CardContent>
                  <CardFooter>
                    <TramiteAcciones tramite={t} />
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
