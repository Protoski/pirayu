'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { postJson } from '@/lib/client-api';
import {
  Consentimiento,
  Field,
  Resultado,
  erroresDe,
  type Errores,
} from './form-parts';

export function DenunciaForm(): React.JSX.Element {
  const [anonima, setAnonima] = useState(true);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (ok) {
    return (
      <Resultado tipo="ok">
        Denuncia registrada con el código{' '}
        <strong className="font-mono">{ok}</strong>. Guárdelo para dar
        seguimiento.
        <span className="mt-1 block text-muted-foreground">
          Entorno de demostración: el registro se conserva solo temporalmente.
        </span>
      </Resultado>
    );
  }

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const v = (k: string): string | undefined => {
          const s = String(fd.get(k) ?? '').trim();
          return s === '' ? undefined : s;
        };
        const r = await postJson<{ expediente: string }>('/api/denuncias', {
          anonima,
          area: v('area'),
          descripcion: v('descripcion'),
          contacto: anonima ? undefined : v('contacto'),
          consentimiento: anonima ? undefined : consent,
        }).catch(() => null);
        setLoading(false);
        if (!r) {
          setError('Sin conexión. Intente nuevamente.');
          return;
        }
        setErrores(erroresDe(r.data.campos));
        if (!r.ok) {
          setError(r.data.error ?? 'No se pudo registrar la denuncia.');
          return;
        }
        setOk(r.data.expediente);
      }}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id="anonima"
          checked={anonima}
          onCheckedChange={(c) => {
            setAnonima(c === true);
          }}
        />
        <Label htmlFor="anonima" className="font-normal">
          Denuncia anónima (no se guardará ningún dato que lo identifique)
        </Label>
      </div>
      <Field
        name="area"
        label="Dependencia o área involucrada"
        maxLength={120}
        error={errores.area}
      />
      <Field
        name="descripcion"
        label="Descripción de los hechos"
        required
        multiline
        maxLength={3000}
        error={errores.descripcion}
        hint="Fechas, lugares y personas involucradas. Mínimo 30 caracteres."
      />
      {!anonima ? (
        <>
          <Field
            name="contacto"
            label="Correo para seguimiento"
            required
            type="email"
            autoComplete="email"
            maxLength={254}
            error={errores.contacto}
          />
          <Consentimiento
            checked={consent}
            onChange={setConsent}
            error={errores.consentimiento}
            finalidad="dar seguimiento a mi denuncia"
          />
        </>
      ) : null}
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
        Enviar denuncia
      </Button>
      <div aria-live="polite">
        {error ? <Resultado tipo="error">{error}</Resultado> : null}
      </div>
    </form>
  );
}
