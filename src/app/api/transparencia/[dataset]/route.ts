import { NextResponse } from 'next/server';
import { datasets } from '@/content/sitio';
import { toCsv } from '@/lib/security/csv';

/** GET /api/transparencia/:dataset — descarga en formato abierto CSV (UTF-8, RFC 4180). */
export function generateStaticParams(): { dataset: string }[] {
  return datasets.map((d) => ({ dataset: d.id }));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ dataset: string }> },
): Promise<NextResponse> {
  const { dataset } = await ctx.params;
  const ds = datasets.find((d) => d.id === dataset);
  if (!ds)
    return NextResponse.json(
      { error: 'Conjunto de datos inexistente.' },
      { status: 404 },
    );
  return new NextResponse(toCsv(ds.columnas, ds.filas), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pirayu-${ds.id}.csv"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
