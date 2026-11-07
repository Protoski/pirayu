import { KeyRound } from 'lucide-react';
import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = { title: 'Mi Carpeta Ciudadana' };

export default function Ingresar(): React.JSX.Element {
  return (
    <LegalPage titulo="Mi Carpeta Ciudadana" actualizado="—" borrador={false}>
      <p>
        La carpeta ciudadana permitirá ver todos sus trámites en un solo lugar,
        ingresando con su Identidad Electrónica.
      </p>
      <div className="flex gap-3 rounded-md border border-border bg-surface p-4">
        <KeyRound aria-hidden className="mt-1 size-5 shrink-0 text-primary" />
        <p>
          <strong>Aún no disponible.</strong> El acceso requiere un convenio con
          el Ministerio de Tecnologías de la Información y Comunicación (MITIC).
          Mientras tanto, puede explorar los recorridos de demostración desde la{' '}
          <a href="/#tramites">Ventanilla Virtual</a>.
        </p>
      </div>
    </LegalPage>
  );
}
