import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Propuesta de portal ciudadano' };
const pilares = [
  [
    'Atención más cercana',
    'Información de servicios, búsqueda de trámites y acceso directo a teléfono, correo y ubicación.',
  ],
  [
    'Transparencia accesible',
    'Accesos a documentos municipales y fuentes públicas, conservando el ejercicio de cada publicación.',
  ],
  [
    'Identidad y patrimonio',
    'Diseño inspirado en Pirayú, presentación institucional y contenidos turísticos con referencias.',
  ],
  [
    'Acceso desde el celular',
    'Navegación adaptable, controles de tamaño de texto, modo oscuro e imágenes optimizadas.',
  ],
];
export default function Presentacion(): React.JSX.Element {
  return (
    <article className="mx-auto max-w-5xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Propuesta para revisión institucional
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
        Un portal de Pirayú, al servicio de su gente.
      </h1>
      <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
        Una base de trabajo para acercar la Municipalidad a vecinos,
        contribuyentes y visitantes. Preparada por ONYX Ingeniería y GEOGASS
        S.A.
      </p>
      <div className="my-10 grid gap-4 sm:grid-cols-2">
        {pilares.map(([titulo, texto]) => (
          <section
            key={titulo}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h2 className="font-serif text-2xl font-semibold">{titulo}</h2>
            <p className="mt-3 text-muted-foreground">{texto}</p>
          </section>
        ))}
      </div>
      <section className="rounded-lg border border-primary/30 bg-primary-soft p-6">
        <h2 className="font-serif text-2xl font-semibold">
          Qué se puede presentar hoy
        </h2>
        <p className="mt-3">
          Diseño navegable, contenidos institucionales documentados, galería,
          búsqueda, contacto, fuentes y recorridos de servicios en demostración.
          Los formularios de atención y denuncias no reciben solicitudes
          oficiales en esta versión.
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-3xl font-semibold">
          Pasos para la puesta en servicio
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6">
          <li>
            Validar autoridades, nómina, horarios, requisitos, imágenes y textos
            con los responsables municipales.
          </li>
          <li>
            Designar las dependencias que recibirán y responderán cada gestión.
          </li>
          <li>
            Integrar almacenamiento permanente, expedientes y mecanismos de
            seguimiento.
          </li>
          <li>
            Revisar privacidad, conservación de datos y procedimientos de
            atención.
          </li>
          <li>
            Habilitar pagos e identidad electrónica cuando existan las
            integraciones correspondientes.
          </li>
          <li>
            Publicar en el dominio aprobado, capacitar al equipo y activar la
            difusión ciudadana.
          </li>
        </ol>
      </section>
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="font-serif text-2xl font-semibold">
          Contenido y confianza
        </h2>
        <p className="mt-3">
          La web diferencia información documentada de datos por confirmar. Las
          imágenes turísticas generadas se identifican como ilustraciones. El
          acceso a buscadores permanece desactivado hasta la aprobación de la
          Municipalidad.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground"
          >
            Recorrer el portal
          </a>
          <a
            href="/fuentes"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-5 font-semibold"
          >
            Revisar fuentes
          </a>
        </div>
      </section>
    </article>
  );
}
