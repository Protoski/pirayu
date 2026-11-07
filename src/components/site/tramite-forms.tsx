'use client';

import { Camera, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { centroMapa, type Tramite } from '@/content/sitio';
import { postForm, postJson } from '@/lib/client-api';
import {
  Consentimiento,
  Field,
  Resultado,
  erroresDe,
  type Errores,
} from './form-parts';
import { LeafletMap } from './leaflet-map';

interface Creado {
  expediente: string;
  estado: string;
  demostracion: boolean;
}

const ETIQUETA_ESTADO: Record<string, string> = {
  recibido: 'Recibido',
  en_revision: 'En revisión',
  observado: 'Observado: requiere documentación',
  resuelto: 'Resuelto',
};

function Confirmacion({ r }: { r: Creado }): React.JSX.Element {
  return (
    <Resultado tipo="ok">
      <p>
        Solicitud registrada. Número de expediente:{' '}
        <strong className="font-mono">{r.expediente}</strong>
      </p>
      <p className="mt-1 text-muted-foreground">
        Guardalo para consultar el estado.
      </p>
      {r.demostracion ? (
        <p className="mt-1 text-muted-foreground">
          Entorno de demostración: el registro se conserva solo temporalmente.
        </p>
      ) : null}
    </Resultado>
  );
}

/** Consulta de estado de expediente. */
export function EstadoForm({
  tramite,
}: {
  tramite: Tramite;
}): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<{
    expediente: string;
    estado: string;
    actualizado: string;
    simulacion: boolean;
  } | null>(null);

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRes(null);
        const fd = new FormData(e.currentTarget);
        const r = await postJson<{
          expediente: string;
          estado: string;
          actualizado: string;
          simulacion: boolean;
        }>('/api/tramites/estado', {
          tramite: tramite.id,
          expediente: String(fd.get('expediente') ?? ''),
        }).catch(() => null);
        setLoading(false);
        if (!r) {
          setError('Sin conexión. Intente nuevamente.');
          return;
        }
        setErrores(erroresDe(r.data.campos));
        if (!r.ok) {
          setError(r.data.error ?? 'No se pudo consultar.');
          return;
        }
        setRes(r.data);
      }}
    >
      <Field
        name="expediente"
        label="Número de expediente"
        required
        error={errores.expediente}
        hint={`Formato: ${tramite.prefijoExpediente}-2026-000123`}
        autoComplete="off"
        maxLength={20}
      />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
        Consultar estado
      </Button>
      <div aria-live="polite">
        {error ? <Resultado tipo="error">{error}</Resultado> : null}
        {res ? (
          <Resultado tipo="ok">
            <p>
              Expediente <span className="font-mono">{res.expediente}</span>:{' '}
              <strong>{ETIQUETA_ESTADO[res.estado] ?? res.estado}</strong>
            </p>
            <p className="mt-1 text-muted-foreground">
              Última actualización: {res.actualizado}
            </p>
            {res.simulacion ? (
              <p className="mt-2">
                <Badge variant="ejemplo">
                  Simulación: sistema de gestión no integrado
                </Badge>
              </p>
            ) : null}
          </Resultado>
        ) : null}
      </div>
    </form>
  );
}

/** Solicitud de audiencia con el Intendente. */
export function AudienciaForm(): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<Creado | null>(null);

  if (ok) return <Confirmacion r={ok} />;

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!consent) {
          setErrores({
            consentimiento:
              'Debe aceptar el tratamiento de datos personales para continuar.',
          });
          return;
        }
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const val = (k: string): string | undefined => {
          const v = String(fd.get(k) ?? '').trim();
          return v === '' ? undefined : v;
        };
        const r = await postJson<Creado>('/api/audiencias', {
          nombre: val('nombre'),
          ci: val('ci'),
          telefono: val('telefono'),
          email: val('email'),
          motivo: val('motivo'),
          fechaPreferida: val('fechaPreferida'),
          consentimiento: consent,
        }).catch(() => null);
        setLoading(false);
        if (!r) {
          setError('Sin conexión. Intente nuevamente.');
          return;
        }
        setErrores(erroresDe(r.data.campos));
        if (!r.ok) {
          setError(r.data.error ?? 'No se pudo registrar.');
          return;
        }
        setOk(r.data);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="nombre"
          label="Nombre y apellido"
          required
          autoComplete="name"
          maxLength={100}
          error={errores.nombre}
        />
        <Field
          name="ci"
          label="Cédula de identidad"
          required
          inputMode="numeric"
          maxLength={12}
          error={errores.ci}
        />
        <Field
          name="telefono"
          label="Teléfono"
          required
          type="tel"
          autoComplete="tel"
          maxLength={20}
          error={errores.telefono}
          hint="Ej.: 0981 123 456"
        />
        <Field
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          maxLength={254}
          error={errores.email}
        />
      </div>
      <Field
        name="motivo"
        label="Motivo de la audiencia"
        required
        multiline
        maxLength={1000}
        error={errores.motivo}
        hint="Mínimo 20 caracteres."
      />
      <Field
        name="fechaPreferida"
        label="Fecha preferida"
        type="date"
        error={errores.fechaPreferida}
      />
      <Consentimiento
        checked={consent}
        onChange={setConsent}
        error={errores.consentimiento}
        finalidad="gestionar mi solicitud de audiencia y contactarme"
      />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
        Solicitar audiencia
      </Button>
      <div aria-live="polite">
        {error ? <Resultado tipo="error">{error}</Resultado> : null}
      </div>
    </form>
  );
}

const TIPOS = [
  { value: 'bache', label: 'Bache o calle dañada' },
  { value: 'alumbrado', label: 'Alumbrado público' },
  { value: 'basura', label: 'Recolección de residuos' },
];
const MAX_FOTO = 5 * 1024 * 1024;

/** Reclamo ciudadano con mapa (opcional) y foto (opcional). */
export function ReclamoForm(): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<Creado | null>(null);

  if (ok) return <Confirmacion r={ok} />;

  const elegirFoto = (f: File | undefined): void => {
    if (preview) URL.revokeObjectURL(preview);
    if (!f) {
      setFoto(null);
      setPreview(null);
      return;
    }
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(f.type) ||
      f.size > MAX_FOTO
    ) {
      setErrores((e) => ({
        ...e,
        foto: 'La foto debe ser JPEG, PNG o WebP y pesar hasta 5 MB.',
      }));
      return;
    }
    setErrores((e) => ({ ...e, foto: undefined }));
    setFoto(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!consent) {
          setErrores({
            consentimiento:
              'Debe aceptar el tratamiento de datos personales para continuar.',
          });
          return;
        }
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        fd.delete('foto');
        if (foto) fd.set('foto', foto);
        if (punto) {
          fd.set('lat', String(punto.lat));
          fd.set('lng', String(punto.lng));
        }
        fd.set('consentimiento', String(consent));
        const r = await postForm<Creado>('/api/reclamos', fd).catch(() => null);
        setLoading(false);
        if (!r) {
          setError('Sin conexión. Intente nuevamente.');
          return;
        }
        setErrores(erroresDe(r.data.campos));
        if (!r.ok) {
          setError(r.data.error ?? 'No se pudo registrar el reclamo.');
          return;
        }
        setOk(r.data);
      }}
    >
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">
          Tipo de reclamo{' '}
          <span aria-hidden className="text-accent-red">
            *
          </span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {TIPOS.map((t, i) => (
            <label
              key={t.value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
            >
              <input
                type="radio"
                name="tipo"
                value={t.value}
                defaultChecked={i === 0}
                className="size-4 accent-[var(--primary)]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        name="descripcion"
        label="Descripción del problema"
        required
        multiline
        maxLength={1000}
        error={errores.descripcion}
        hint="Mínimo 10 caracteres."
      />

      <div className="grid gap-2">
        <p className="text-sm font-semibold">
          Ubicación{' '}
          <span className="font-normal text-muted-foreground">
            (tocá el mapa o escribí una referencia)
          </span>
        </p>
        <LeafletMap
          center={centroMapa}
          onPick={setPunto}
          picked={punto}
          label="Mapa para indicar la ubicación del reclamo"
          className="h-72"
        />
        {punto ? (
          <p className="flex items-center justify-between gap-2 text-sm">
            <span>
              Punto seleccionado:{' '}
              <span className="font-mono">
                {punto.lat}, {punto.lng}
              </span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPunto(null);
              }}
            >
              Quitar
            </Button>
          </p>
        ) : null}
        <Field
          name="referencia"
          label="Referencia (calle, barrio, casa de referencia)"
          maxLength={200}
          error={errores.referencia}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reclamo-foto">
          Foto{' '}
          <span className="font-normal text-muted-foreground">
            (opcional, JPEG/PNG/WebP, máx. 5 MB)
          </span>
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface focus-within:outline focus-within:outline-3 focus-within:outline-ring">
            <Camera aria-hidden className="size-4" />
            {foto ? 'Cambiar foto' : 'Adjuntar foto'}
            <input
              id="reclamo-foto"
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                elegirFoto(e.target.files?.[0]);
              }}
            />
          </label>
          {preview ? (
            <span className="flex items-center gap-2">
              {/* Vista previa local (blob:), no se sube hasta enviar el formulario. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- blob local, next/image no aplica */}
              <img
                src={preview}
                alt="Vista previa de la foto adjunta"
                className="size-14 rounded-sm object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Quitar foto"
                onClick={() => {
                  elegirFoto(undefined);
                }}
              >
                <Trash2 aria-hidden />
              </Button>
            </span>
          ) : null}
        </div>
        {errores.foto ? (
          <p className="text-sm font-medium text-accent-red">{errores.foto}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="nombre"
          label="Nombre y apellido"
          required
          autoComplete="name"
          maxLength={100}
          error={errores.nombre}
        />
        <Field
          name="ci"
          label="Cédula de identidad"
          required
          inputMode="numeric"
          maxLength={12}
          error={errores.ci}
        />
        <Field
          name="telefono"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          maxLength={20}
          error={errores.telefono}
        />
        <Field
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          maxLength={254}
          error={errores.email}
        />
      </div>
      <Consentimiento
        checked={consent}
        onChange={setConsent}
        error={errores.consentimiento}
        finalidad="gestionar mi reclamo, informarme su avance y elaborar estadísticas anónimas"
      />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
        Enviar reclamo
      </Button>
      <div aria-live="polite">
        {error ? <Resultado tipo="error">{error}</Resultado> : null}
      </div>
    </form>
  );
}

/** Botón de pago: informa que la pasarela no está habilitada (respuesta 503 del servidor). */
export function PagoButton({
  concepto,
}: {
  concepto: string;
}): React.JSX.Element {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const r = await postJson<{ configurado?: boolean }>('/api/pagos', {
            concepto,
          }).catch(() => null);
          setLoading(false);
          setMsg(r?.data.error ?? 'Sin conexión. Intente nuevamente.');
        }}
      >
        Pagar en línea
      </Button>
      <div aria-live="polite">
        {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
      </div>
    </div>
  );
}
