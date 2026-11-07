import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <p className="font-mono text-sm text-muted-foreground">Error 404</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">
        Página no encontrada
      </h1>
      <p className="mt-4 text-muted-foreground">
        La dirección no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 font-semibold text-primary-foreground"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
