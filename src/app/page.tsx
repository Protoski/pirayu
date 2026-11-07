import { Autoridades } from '@/components/site/autoridades';
import { Hero } from '@/components/site/hero';
import { Transparencia } from '@/components/site/transparencia';
import { Turismo } from '@/components/site/turismo';
import { VentanillaTramites } from '@/components/site/ventanilla-tramites';

export default function Home(): React.JSX.Element {
  return (
    <>
      <Hero />
      <VentanillaTramites />
      <Autoridades />
      <Transparencia />
      <Turismo />
    </>
  );
}
