import { z } from 'zod';

/**
 * Esquemas Zod: única puerta de entrada de datos ciudadanos al servidor.
 * - Listas blancas (enum) para valores categóricos.
 * - Longitudes máximas en todos los textos (evita payloads gigantes).
 * - Rechazo de caracteres de control y de los signos menor/mayor (defensa en profundidad frente a XSS;
 *   aunque React escapa al renderizar, el dato puede terminar en otros sistemas).
 * - Al no construirse consultas SQL/NoSQL por concatenación, y validarse el tipo de cada campo,
 *   se elimina la superficie de inyección. Cuando se conecte una base de datos, usar
 *   consultas parametrizadas (Drizzle/Prisma) — ver README.
 * - Consentimiento explícito obligatorio (z.literal(true)) donde se tratan datos personales.
 */
// eslint-disable-next-line no-control-regex -- se buscan precisamente caracteres de control
const UNSAFE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/;

export const safeText = (min: number, max: number): z.ZodString =>
  z
    .string()
    .trim()
    .min(min, `Debe tener al menos ${min} caracteres.`)
    .max(max, `Máximo ${max} caracteres.`)
    .refine((s) => !UNSAFE.test(s), 'Contiene caracteres no permitidos.');

/** Cédula de identidad paraguaya: solo dígitos (se aceptan puntos de miles), 5 a 8 cifras. */
export const cedula = z
  .string()
  .trim()
  .transform((s) => s.replace(/\./g, ''))
  .pipe(z.string().regex(/^\d{5,8}$/, 'Cédula inválida (5 a 8 dígitos).'));

/** Teléfono paraguayo: +595 o 0 seguido de 8–9 dígitos. Espacios y guiones se ignoran. */
export const telefono = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s-]/g, ''))
  .pipe(
    z
      .string()
      .regex(/^(?:\+595|0)\d{8,9}$/, 'Teléfono inválido. Ej.: 0981 123 456.'),
  );

const email = z.email('Correo inválido.').max(254);

const consentimiento = z.literal(true, {
  error: 'Debe aceptar el tratamiento de datos personales para continuar.',
});

/** Rectángulo aproximado del territorio paraguayo: descarta coordenadas absurdas. */
const lat = z.number().min(-27.7).max(-19.2);
const lng = z.number().min(-62.7).max(-54.2);

export const TIPOS_RECLAMO = ['bache', 'alumbrado', 'basura'] as const;

export const reclamoSchema = z.object({
  tipo: z.enum(TIPOS_RECLAMO),
  descripcion: safeText(10, 1000),
  referencia: safeText(0, 200).optional(),
  lat: lat.optional(),
  lng: lng.optional(),
  nombre: safeText(2, 100),
  ci: cedula,
  telefono: telefono.optional(),
  email: email.optional(),
  consentimiento,
});
export type ReclamoInput = z.infer<typeof reclamoSchema>;

export const audienciaSchema = z.object({
  nombre: safeText(2, 100),
  ci: cedula,
  telefono,
  email: email.optional(),
  motivo: safeText(20, 1000),
  fechaPreferida: z.iso.date('Fecha inválida.').optional(),
  consentimiento,
});
export type AudienciaInput = z.infer<typeof audienciaSchema>;

export const TRAMITES_CON_EXPEDIENTE = [
  'licencia',
  'inmobiliario',
  'patente',
  'audiencia',
  'reclamo',
] as const;

export const estadoSchema = z.object({
  tramite: z.enum(TRAMITES_CON_EXPEDIENTE),
  expediente: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2,4}-\d{4}-\d{1,6}$/, 'Formato esperado: XXX-2026-000123.'),
});

export const denunciaSchema = z
  .object({
    anonima: z.boolean(),
    area: safeText(0, 120).optional(),
    descripcion: safeText(30, 3000),
    contacto: email.optional(),
    consentimiento: z.boolean().optional(),
  })
  .superRefine((d, ctx) => {
    if (!d.anonima && !d.contacto) {
      ctx.addIssue({
        code: 'custom',
        path: ['contacto'],
        message: 'Indique un correo o marque la denuncia como anónima.',
      });
    }
    if (d.contacto && d.consentimiento !== true) {
      ctx.addIssue({
        code: 'custom',
        path: ['consentimiento'],
        message: 'Debe aceptar el tratamiento de su correo.',
      });
    }
  });
export type DenunciaInput = z.infer<typeof denunciaSchema>;
