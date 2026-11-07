import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentGateway } from '@/lib/integrations/payments';
import { guardMutation } from '@/lib/security/request-guard';

export const runtime = 'nodejs';

/** POST /api/pagos — responde 503 mientras no exista un procesador de pagos contratado. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const blocked = await guardMutation(request, {
    name: 'pagos',
    max: 10,
    windowSec: 600,
  });
  if (blocked) return blocked;
  const gateway = getPaymentGateway();
  if (!gateway.configurado) {
    return NextResponse.json(
      {
        error:
          'El pago en línea aún no está habilitado. Puede abonar en la caja municipal.',
        configurado: false,
      },
      { status: 503 },
    );
  }
  return NextResponse.json({ error: 'No implementado.' }, { status: 501 });
}
