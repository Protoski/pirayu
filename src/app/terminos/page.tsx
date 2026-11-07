import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';
import { institucion } from '@/content/sitio';

export const metadata: Metadata = { title: 'Términos de Servicio' };

/** Términos de servicio — BORRADOR. Incluye la información del proveedor prevista en la Ley N° 4868/2013. */
export default function Terminos(): React.JSX.Element {
  const p = institucion.proveedor;
  return (
    <LegalPage titulo="Términos de Servicio" actualizado="[PENDIENTE]">
      <h2>1. Identificación del proveedor</h2>
      <p>
        Denominación: {p.razonSocial}. RUC: {p.ruc}. Domicilio: {p.domicilio}.
        Correo: {institucion.contacto.correo}. (Información exigida a
        proveedores de bienes y servicios por vía electrónica — Ley N°
        4868/2013, de Comercio Electrónico.)
      </p>

      <h2>2. Objeto</h2>
      <p>
        El portal permite iniciar trámites, consultar su estado, presentar
        reclamos y acceder a información pública. Las constancias electrónicas
        emitidas tienen el alcance que les asigne la normativa municipal vigente
        [PENDIENTE: definir].
      </p>

      <h2>3. Pagos electrónicos</h2>
      <p>
        El pago en línea de tributos <strong>aún no está habilitado</strong>.
        Cuando lo esté, se informará antes de cada pago: el concepto y monto,
        los medios de pago, el procesador utilizado y el comprobante que se
        emitirá. El portal no almacenará datos de tarjetas.
      </p>

      <h2>4. Uso aceptable</h2>
      <ul>
        <li>
          Brindar información veraz; los datos falsos pueden invalidar el
          trámite.
        </li>
        <li>
          No intentar vulnerar la seguridad del sistema ni automatizar envíos
          masivos.
        </li>
      </ul>

      <h2>5. Disponibilidad</h2>
      <p>
        La Municipalidad procurará la disponibilidad continua del servicio, sin
        garantizarla ante mantenimientos o fallas de terceros. Los plazos
        administrativos se rigen por la normativa aplicable y no por la
        disponibilidad del portal.
      </p>
    </LegalPage>
  );
}
