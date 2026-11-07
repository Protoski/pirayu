import type { Metadata } from 'next';
import { modoDemostracion } from '@/content/sitio';
import { DenunciaForm } from '@/components/site/denuncia-form';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = {
  title: 'Canal de Denuncias Anticorrupción',
};

export default function Denuncias(): React.JSX.Element {
  return (
    <LegalPage
      titulo="Canal de Denuncias Anticorrupción"
      actualizado="[PENDIENTE]"
    >
      <p>
        Informe hechos de corrupción, uso indebido de bienes públicos o
        irregularidades administrativas. Puede hacerlo de forma anónima.
        [PENDIENTE: designar la dependencia responsable de recibir y tramitar
        las denuncias, el plazo de respuesta y las medidas de protección al
        denunciante.]
      </p>
      <p>
        Los hechos que puedan constituir delito también pueden denunciarse ante
        el Ministerio Público.
      </p>
      <div className="not-prose rounded-md border border-border p-4 md:p-6">
        {modoDemostracion ? (
          <p>
            El canal digital de denuncias está pendiente de habilitación
            institucional. Esta demostración no recibe denuncias. Para consultar
            el procedimiento oficial, comunicate con la Municipalidad al{' '}
            <a href="tel:+59551920112">0519 20112</a>. No envíes información
            sensible por formularios de prueba.
          </p>
        ) : (
          <DenunciaForm />
        )}
      </div>
    </LegalPage>
  );
}
