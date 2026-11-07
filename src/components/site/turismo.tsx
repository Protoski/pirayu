import { Galeria } from './galeria';
import { SectionHeading } from './section-heading';
import { TurismoExplorer } from './turismo-explorer';

/** 6. Sección turística "Descubrí Pirayú". */
export function Turismo(): React.JSX.Element {
  return (
    <section
      id="turismo"
      aria-labelledby="titulo-turismo"
      className="bg-surface py-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="titulo-turismo"
          eyebrow="Turismo"
          title="Descubrí Pirayú"
        >
          Patrimonio ferroviario, historia de la Guerra de la Triple Alianza,
          ñandutí, calzados de cuero y cocina local.
        </SectionHeading>
        <TurismoExplorer />
        <h3 className="mb-4 mt-12 font-serif text-2xl font-semibold">
          Galería
        </h3>
        <Galeria />
      </div>
    </section>
  );
}
