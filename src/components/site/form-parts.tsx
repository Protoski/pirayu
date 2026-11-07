'use client';

import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Errores = Record<string, string | undefined>;

export function erroresDe(
  campos?: { campo: string; mensaje: string }[],
): Errores {
  const e: Errores = {};
  for (const c of campos ?? []) e[c.campo] ??= c.mensaje;
  return e;
}

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  defaultValue?: string;
}

/** Campo con etiqueta, ayuda y error asociados por aria-describedby (WCAG 1.3.1, 3.3.1, 3.3.2). */
export function Field({
  name,
  label,
  error,
  hint,
  required,
  multiline,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  defaultValue,
}: FieldProps): React.JSX.Element {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  const describedBy =
    [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') ||
    undefined;
  const common = {
    id,
    name,
    required,
    maxLength,
    defaultValue,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  };
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden className="text-accent-red">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> (opcional)</span>
        )}
      </Label>
      {multiline ? (
        <Textarea {...common} />
      ) : (
        <Input
          {...common}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
      )}
      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="text-sm font-medium text-accent-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Consentimiento informado para el tratamiento de datos personales.
 * Casilla NO premarcada; el envío queda bloqueado sin ella (validación cliente y servidor).
 */
export function Consentimiento({
  checked,
  onChange,
  error,
  finalidad,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  finalidad: string;
}): React.JSX.Element {
  const id = useId();
  return (
    <div className="grid gap-1.5 rounded-md border border-border bg-surface p-3">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => {
            onChange(v === true);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        <Label htmlFor={id} className="font-normal leading-snug">
          Acepto que la Municipalidad de Pirayú trate mis datos personales con
          la finalidad de {finalidad}, conforme a la{' '}
          <Link
            href="/privacidad"
            className="font-semibold text-primary underline underline-offset-2"
            target="_blank"
          >
            Política de Privacidad
          </Link>
          . Puedo solicitar acceso, rectificación o supresión en cualquier
          momento.
        </Label>
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-sm font-medium text-accent-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Resultado({
  tipo,
  children,
}: {
  tipo: 'ok' | 'error';
  children: React.ReactNode;
}): React.JSX.Element {
  const Icon = tipo === 'ok' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      role={tipo === 'ok' ? 'status' : 'alert'}
      className={`flex gap-2 rounded-md border p-3 text-sm ${tipo === 'ok' ? 'border-success/40 text-foreground' : 'border-accent-red/50 text-foreground'}`}
    >
      <Icon
        aria-hidden
        className={`mt-0.5 size-4 shrink-0 ${tipo === 'ok' ? 'text-success' : 'text-accent-red'}`}
      />
      <div>{children}</div>
    </div>
  );
}
