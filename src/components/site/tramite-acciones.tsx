'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { modoDemostracion, type Tramite } from '@/content/sitio';
import {
  AudienciaForm,
  EstadoForm,
  PagoButton,
  ReclamoForm,
} from './tramite-forms';

export function TramiteAcciones({
  tramite,
}: {
  tramite: Tramite;
}): React.JSX.Element {
  if (modoDemostracion) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Ver cómo funciona</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{tramite.titulo}</DialogTitle>
          <DialogDescription>
            Vista de demostración. Este recorrido no registra solicitudes ni
            genera expedientes oficiales.
          </DialogDescription>
          <ol className="my-4 grid list-decimal gap-3 pl-5 text-sm">
            <li>Consultás los requisitos de tu trámite.</li>
            <li>
              El municipio valida la documentación y comunica los pasos a
              seguir.
            </li>
            <li>
              Con la integración municipal habilitada, podrás seguir el
              expediente desde este portal.
            </li>
          </ol>
          <p className="text-sm text-muted-foreground">
            La habilitación requiere procesos, responsables y sistemas aprobados
            por la Municipalidad. No ingreses datos personales en esta
            demostración.
          </p>
          <a
            href="tel:+59551920112"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 font-semibold text-primary-foreground"
          >
            Llamar al municipio: 0519 20112
          </a>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <div className="flex w-full flex-wrap items-start gap-2">
      {tramite.acciones.includes('reclamo') ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nuevo reclamo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Nuevo reclamo ciudadano</DialogTitle>
            <DialogDescription>
              Los campos con * son obligatorios. Sus datos personales se guardan
              cifrados.
            </DialogDescription>
            <div className="mt-5">
              <ReclamoForm />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      {tramite.acciones.includes('audiencia') ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Solicitar audiencia</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Solicitud de audiencia</DialogTitle>
            <DialogDescription>
              Secretaría General confirmará fecha y hora por teléfono o correo.
            </DialogDescription>
            <div className="mt-5">
              <AudienciaForm />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      {tramite.acciones.includes('consulta') ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={
                tramite.acciones.includes('pago') ? 'default' : 'outline'
              }
            >
              Consultar estado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Estado de expediente</DialogTitle>
            <DialogDescription>{tramite.titulo}</DialogDescription>
            <div className="mt-5">
              <EstadoForm tramite={tramite} />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      {tramite.acciones.includes('pago') ? (
        <PagoButton concepto={tramite.id} />
      ) : null}
    </div>
  );
}
