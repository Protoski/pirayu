import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { institucion, navegacion, portalUnificado } from '@/content/sitio';
import { Escudo } from './escudo';

/**
 * 7. Footer legal: contacto oficial, enlaces legales y datos del proveedor del servicio
 * electrónico (Ley N° 4868/2013 exige identificar al proveedor: denominación, domicilio, RUC).
 */
export function SiteFooter(): React.JSX.Element {
  const c = institucion.contacto;
  const p = institucion.proveedor;
  return (
    <footer
      id="contacto"
      aria-labelledby="titulo-contacto"
      className="border-t-4 border-primary bg-[#001a2e] text-[#dfe7ee]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Escudo size={44} decorative />
            <div>
              <p className="font-serif text-lg font-semibold text-white">
                {institucion.nombre}
              </p>
              <p className="text-sm">{institucion.departamento}</p>
            </div>
          </div>
          <p className="mt-4 text-sm">{institucion.pais}</p>
        </div>

        <div>
          <h2
            id="titulo-contacto"
            className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            Contacto
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{c.direccion}</span>
            </li>
            <li className="flex gap-2">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{c.telefono}</span>
            </li>
            <li className="flex gap-2">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{c.correo}</span>
            </li>
            <li className="flex gap-2">
              <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{c.horario}</span>
            </li>
          </ul>
          {c.ejemplo ? (
            <p className="mt-3">
              <span className="inline-block border border-dashed border-[#f2c26b] px-2 py-0.5 text-xs font-semibold text-[#f2c26b]">
                Datos de contacto pendientes
              </span>
            </p>
          ) : null}
        </div>

        <nav aria-label="Secciones">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Secciones
          </h2>
          <ul className="space-y-1 text-sm">
            {navegacion.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex min-h-9 items-center underline-offset-4 hover:underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Información legal">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Legal
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/privacidad"
                className="inline-flex min-h-9 items-center underline-offset-4 hover:underline"
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link
                href="/terminos"
                className="inline-flex min-h-9 items-center underline-offset-4 hover:underline"
              >
                Términos de Servicio
              </Link>
            </li>
            <li>
              <Link
                href="/denuncias"
                className="inline-flex min-h-9 items-center underline-offset-4 hover:underline"
              >
                Canal de Denuncias Anticorrupción
              </Link>
            </li>
            <li>
              <a
                href={portalUnificado.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center underline-offset-4 hover:underline"
              >
                {portalUnificado.etiqueta}
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs">
          <p>
            Proveedor del servicio electrónico: {p.razonSocial} · RUC {p.ruc} ·{' '}
            {p.domicilio}
          </p>
          <p>
            © {new Date().getFullYear()} {institucion.nombre}
          </p>
        </div>
      </div>
    </footer>
  );
}
