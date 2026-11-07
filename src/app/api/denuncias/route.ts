import { NextResponse, type NextRequest } from 'next/server';
import { store } from '@/lib/data/store';
import { guardMutation, validationError } from '@/lib/security/request-guard';
import { denunciaSchema } from '@/lib/validation/schemas';

export const runtime = 'nodejs';

/**
 * POST /api/denuncias — Canal de denuncias anticorrupción.
 * Las denuncias anónimas no guardan ningún dato identificatorio. La IP solo se usa en memoria
 * para el rate limit y no se almacena junto a la denuncia.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const blocked = await guardMutation(request, {
    name: 'denuncias',
    max: 3,
    windowSec: 3600,
  });
  if (blocked) return blocked;
  const body: unknown = await request.json().catch(() => null);
  const parsed = denunciaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);
  const d = parsed.data;
  const s = await store.crear(
    'denuncia',
    { anonima: d.anonima, area: d.area, descripcion: d.descripcion },
    d.anonima ? {} : { contacto: d.contacto },
  );
  return NextResponse.json(
    { expediente: s.expediente, estado: s.estado, demostracion: true },
    { status: 201 },
  );
}
