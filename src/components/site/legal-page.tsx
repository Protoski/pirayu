import { AlertTriangle } from 'lucide-react';

/** Plantilla de páginas legales: ancho de lectura limitado (~70 caracteres) y aviso de borrador. */
export function LegalPage({
  titulo,
  actualizado,
  borrador = true,
  children,
}: {
  titulo: string;
  actualizado: string;
  borrador?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        {titulo}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: {actualizado}
      </p>
      {borrador ? (
        <div
          role="note"
          className="mt-6 flex gap-3 rounded-md border border-warning/50 p-4 text-sm"
        >
          <AlertTriangle
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-warning"
          />
          <p>
            <strong>Borrador técnico.</strong> Este texto fue preparado por el
            equipo de desarrollo como punto de partida y debe ser revisado y
            aprobado por la asesoría jurídica de la Municipalidad antes de su
            publicación oficial.
          </p>
        </div>
      ) : null}
      <div className="mt-8 space-y-6 text-base leading-relaxed [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline">
        {children}
      </div>
    </article>
  );
}
