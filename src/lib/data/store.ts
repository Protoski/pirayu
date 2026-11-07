import { createHash, randomInt } from 'node:crypto';
import { encryptField } from '@/lib/security/field-crypto';

/**
 * Almacén de solicitudes ciudadanas — IMPLEMENTACIÓN EN MEMORIA (demostración).
 * Los datos se pierden al reiniciar la instancia y NO se comparten entre instancias serverless.
 * Para producción, sustituir por una base de datos (p. ej. PostgreSQL + Drizzle ORM con
 * consultas parametrizadas) manteniendo esta misma interfaz `SolicitudStore`.
 *
 * Minimización de datos (principio de la Ley 7593/2025 — validar con asesoría legal):
 * los identificadores personales (CI, teléfono, correo) se guardan cifrados con AES-256-GCM.
 */
export type TipoSolicitud = 'reclamo' | 'audiencia' | 'denuncia';
export type EstadoSolicitud =
  'recibido' | 'en_revision' | 'observado' | 'resuelto';

export interface Solicitud {
  expediente: string;
  tipo: TipoSolicitud;
  estado: EstadoSolicitud;
  creado: string;
  /** Datos no identificatorios en claro. */
  datos: Record<string, string | number | boolean | undefined>;
  /** Datos personales cifrados (formato v1.iv.tag.ct). */
  cifrado: Record<string, string>;
}

export interface SolicitudStore {
  crear: (
    tipo: TipoSolicitud,
    datos: Solicitud['datos'],
    sensibles: Record<string, string | undefined>,
  ) => Promise<Solicitud>;
  buscar: (expediente: string) => Promise<Solicitud | undefined>;
}

const PREFIJOS: Record<TipoSolicitud, string> = {
  reclamo: 'REC',
  audiencia: 'AUD',
  denuncia: 'DEN',
};
const MAX_REGISTROS = 5000;

class MemoryStore implements SolicitudStore {
  private readonly items = new Map<string, Solicitud>();

  crear(
    tipo: TipoSolicitud,
    datos: Solicitud['datos'],
    sensibles: Record<string, string | undefined>,
  ): Promise<Solicitud> {
    const anio = new Date().getFullYear();
    const expediente = `${PREFIJOS[tipo]}-${anio}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`;
    const cifrado: Record<string, string> = {};
    for (const [k, v] of Object.entries(sensibles))
      if (v) cifrado[k] = encryptField(v);
    const s: Solicitud = {
      expediente,
      tipo,
      estado: 'recibido',
      creado: new Date().toISOString(),
      datos,
      cifrado,
    };
    if (this.items.size >= MAX_REGISTROS) {
      const first = this.items.keys().next().value;
      if (first) this.items.delete(first);
    }
    this.items.set(expediente, s);
    return Promise.resolve(s);
  }

  buscar(expediente: string): Promise<Solicitud | undefined> {
    return Promise.resolve(this.items.get(expediente));
  }
}

const globalStore = globalThis as unknown as { __pirayuStore?: SolicitudStore };
globalStore.__pirayuStore ??= new MemoryStore();
export const store: SolicitudStore = globalStore.__pirayuStore;

/**
 * Estado SIMULADO para trámites que viven en sistemas externos (licencias, impuesto inmobiliario,
 * patentes). Determinista a partir del número de expediente. Se marca siempre `simulacion: true`
 * y la interfaz lo muestra. Reemplazar por la integración con el sistema de gestión municipal.
 */
const ESTADOS: EstadoSolicitud[] = [
  'recibido',
  'en_revision',
  'observado',
  'resuelto',
];

export function estadoSimulado(expediente: string): {
  estado: EstadoSolicitud;
  actualizado: string;
} {
  const h = createHash('sha256').update(expediente).digest();
  const estado = ESTADOS[(h[0] ?? 0) % ESTADOS.length] ?? 'recibido';
  const dias = (h[1] ?? 0) % 20;
  const actualizado = new Date(Date.now() - dias * 86_400_000)
    .toISOString()
    .slice(0, 10);
  return { estado, actualizado };
}
