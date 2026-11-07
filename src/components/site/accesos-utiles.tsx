import { ArrowUpRight, FileText, MapPin, Phone, Trees } from 'lucide-react';

const accesos = [
  {
    titulo: 'Hablá con el municipio',
    texto: 'Llamá al 0519 20112 para orientarte antes de acudir.',
    href: 'tel:+59551920112',
    Icon: Phone,
  },
  {
    titulo: 'Información pública',
    texto: 'Presupuesto, rendiciones de cuentas y publicaciones oficiales.',
    href: '/#transparencia',
    Icon: FileText,
  },
  {
    titulo: 'Visitá Pirayú',
    texto: 'Historia, artesanía y lugares para conocer nuestra ciudad.',
    href: '/#turismo',
    Icon: Trees,
  },
  {
    titulo: 'Encontrá la Municipalidad',
    texto: 'Dirección y canales de atención en un solo lugar.',
    href: '/#contacto',
    Icon: MapPin,
  },
];

export function AccesosUtiles(): React.JSX.Element {
  return (
    <nav aria-label="Accesos útiles" className="mx-auto max-w-7xl px-4 pb-12">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {accesos.map(({ titulo, texto, href, Icon }) => (
          <li key={titulo}>
            <a
              href={href}
              className="group flex h-full gap-3 rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary hover:bg-primary-soft"
            >
              <Icon aria-hidden className="mt-1 size-5 shrink-0 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-semibold">{titulo}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {texto}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
