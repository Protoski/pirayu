import { NextResponse, type NextRequest } from 'next/server';
import { store } from '@/lib/data/store';
import {
  detectImageType,
  MAX_UPLOAD_BYTES,
} from '@/lib/security/file-validation';
import { guardMutation, validationError } from '@/lib/security/request-guard';
import { reclamoSchema } from '@/lib/validation/schemas';

export const runtime = 'nodejs';

/**
 * POST /api/reclamos — multipart/form-data.
 * Capas: Origin + rate limit (5 / 10 min por IP) + CSRF → Zod → validación binaria de la foto
 * → cifrado de datos personales → almacenamiento. La foto NO se persiste en esta versión
 * (falta almacenamiento de objetos con antivirus); solo se valida y se registra su tipo y tamaño.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const blocked = await guardMutation(request, {
    name: 'reclamos',
    max: 5,
    windowSec: 600,
  });
  if (blocked) return blocked;

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json(
      { error: 'La solicitud supera el tamaño máximo (5 MB).' },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Formato de envío inválido.' },
      { status: 400 },
    );
  }

  const str = (k: string): string | undefined => {
    const v = form.get(k);
    return typeof v === 'string' && v.trim() !== '' ? v : undefined;
  };
  const num = (k: string): number | undefined => {
    const v = str(k);
    return v === undefined ? undefined : Number(v);
  };

  const parsed = reclamoSchema.safeParse({
    tipo: str('tipo'),
    descripcion: str('descripcion'),
    referencia: str('referencia'),
    lat: num('lat'),
    lng: num('lng'),
    nombre: str('nombre'),
    ci: str('ci'),
    telefono: str('telefono'),
    email: str('email'),
    consentimiento: form.get('consentimiento') === 'true',
  });
  if (!parsed.success) return validationError(parsed.error.issues);

  let foto: { tipo: string; bytes: number } | undefined;
  const file = form.get('foto');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'La foto supera 5 MB.' },
        { status: 413 },
      );
    }
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const tipo = detectImageType(head);
    if (!tipo)
      return NextResponse.json(
        { error: 'La foto debe ser JPEG, PNG o WebP.' },
        { status: 415 },
      );
    foto = { tipo, bytes: file.size };
  }

  const d = parsed.data;
  const s = await store.crear(
    'reclamo',
    {
      tipo: d.tipo,
      descripcion: d.descripcion,
      referencia: d.referencia,
      lat: d.lat,
      lng: d.lng,
      fotoTipo: foto?.tipo,
      fotoBytes: foto?.bytes,
    },
    { nombre: d.nombre, ci: d.ci, telefono: d.telefono, email: d.email },
  );
  return NextResponse.json(
    { expediente: s.expediente, estado: s.estado, demostracion: true },
    { status: 201 },
  );
}
