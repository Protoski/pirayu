'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Tramite } from '@/content/sitio';
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
