import { fuentesOficiales } from '@/content/fuentes';

export default function Fuentes(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold">
        Fuentes y referencias
      </h1>
      <p className="my-6">
        Revisión: 7 de noviembre de 2026. Las fechas de publicación de los
        documentos pueden ser anteriores. Las fuentes institucionales se
        complementan con referencias periodísticas identificadas para la
        elección del intendente. La integración actual de la Junta, los horarios
        y los requisitos completos de trámites requieren confirmación municipal.
      </p>
      <ul className="grid gap-4">
        {fuentesOficiales.map((f) => (
          <li key={f.url} className="rounded-md border border-border p-5">
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              {f.titulo}
            </a>
            <p className="mt-2 text-sm">{f.descripcion}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
