import { NextResponse, type NextRequest } from 'next/server';
import { store } from '@/lib/data/store';
import { guardMutation, validationError } from '@/lib/security/request-guard';
import { audienciaSchema } from '@/lib/validation/schemas';

export const runtime = 'nodejs';

/** POST /api/audiencias — JSON. Rate limit 3 / hora por IP. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const blocked = await guardMutation(request, {
    name: 'audiencias',
    max: 3,
    windowSec: 3600,
  });
  if (blocked) return blocked;
  const body: unknown = await request.json().catch(() => null);
  const parsed = audienciaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);
  const d = parsed.data;
  const s = await store.crear(
    'audiencia',
    { motivo: d.motivo, fechaPreferida: d.fechaPreferida },
    { nombre: d.nombre, ci: d.ci, telefono: d.telefono, email: d.email },
  );
  return NextResponse.json(
    { expediente: s.expediente, estado: s.estado, demostracion: true },
    { status: 201 },
  );
}
