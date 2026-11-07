import { NextResponse, type NextRequest } from 'next/server';
import { estadoSimulado, store } from '@/lib/data/store';
import { guardMutation, validationError } from '@/lib/security/request-guard';
import { estadoSchema } from '@/lib/validation/schemas';

export const runtime = 'nodejs';

/**
 * POST /api/tramites/estado — consulta de expediente.
 * Se usa POST (no GET) para que el número de expediente no quede en logs de URL ni en el historial.
 * Rate limit 20 / 5 min: dificulta la enumeración de expedientes.
 * Reclamos/audiencias creados en este portal devuelven su estado real (almacén en memoria);
 * los trámites de sistemas externos devuelven un estado SIMULADO marcado como tal.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const blocked = await guardMutation(request, {
    name: 'estado',
    max: 20,
    windowSec: 300,
  });
  if (blocked) return blocked;
  const body: unknown = await request.json().catch(() => null);
  const parsed = estadoSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);

  const { tramite, expediente } = parsed.data;
  if (tramite === 'reclamo' || tramite === 'audiencia') {
    const s = await store.buscar(expediente);
    if (!s || s.tipo !== tramite) {
      return NextResponse.json(
        { error: 'No se encontró el expediente.' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      expediente,
      estado: s.estado,
      actualizado: s.creado.slice(0, 10),
      simulacion: false,
    });
  }
  return NextResponse.json({
    expediente,
    ...estadoSimulado(expediente),
    simulacion: true,
  });
}
