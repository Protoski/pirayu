import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';
import { institucion } from '@/content/sitio';

export const metadata: Metadata = { title: 'Política de Privacidad' };

/**
 * Política de privacidad — BORRADOR.
 * Nota legal verificada por el equipo (fuentes públicas, nov. 2026):
 * - La Ley N° 6534/2020 regula la protección de datos personales CREDITICIOS.
 * - La Ley N° 7593/2025 es la ley general de protección de datos personales (promulgada en 2025).
 *   Su entrada en vigor, plazos de adecuación y autoridad de control deben confirmarse con asesoría legal.
 */
export default function Privacidad(): React.JSX.Element {
  const c = institucion.contacto;
  return (
    <LegalPage titulo="Política de Privacidad" actualizado="[PENDIENTE]">
      <h2>1. Responsable del tratamiento</h2>
      <p>
        {institucion.nombre}, {institucion.departamento}, {institucion.pais}.
        Domicilio: {c.direccion}. Contacto para asuntos de datos personales:{' '}
        {c.correo}.
      </p>

      <h2>2. Marco normativo</h2>
      <ul>
        <li>
          Constitución Nacional: derecho a la intimidad y garantía de Hábeas
          Data.
        </li>
        <li>
          Ley N° 7593/2025, de protección de datos personales (ley general).
        </li>
        <li>
          Ley N° 6534/2020, de protección de datos personales crediticios
          (aplicable solo a datos crediticios).
        </li>
        <li>
          Ley N° 5282/2014, de libre acceso ciudadano a la información pública y
          transparencia gubernamental.
        </li>
      </ul>

      <h2>3. Datos que recogemos y para qué</h2>
      <ul>
        <li>
          <strong>Reclamos ciudadanos:</strong> nombre, cédula, teléfono o
          correo (opcionales), ubicación y foto del problema. Finalidad:
          gestionar el reclamo e informar su avance.
        </li>
        <li>
          <strong>Solicitud de audiencia:</strong> nombre, cédula, teléfono,
          correo (opcional) y motivo. Finalidad: agendar la audiencia.
        </li>
        <li>
          <strong>Denuncias:</strong> pueden realizarse de forma anónima. Si
          indica un correo, solo se usa para dar seguimiento.
        </li>
        <li>
          <strong>Consulta de expedientes:</strong> número de expediente; no se
          almacena.
        </li>
      </ul>
      <p>
        El tratamiento se basa en su <strong>consentimiento expreso</strong>,
        otorgado al marcar la casilla correspondiente en cada formulario (nunca
        premarcada), y en el ejercicio de las funciones propias del municipio.
      </p>

      <h2>4. Seguridad</h2>
      <ul>
        <li>Comunicación cifrada con TLS (HTTPS obligatorio mediante HSTS).</li>
        <li>
          Cédula, teléfono y correo se almacenan cifrados con AES-256-GCM.
        </li>
        <li>
          Protección contra ataques automatizados (límite de solicitudes) y
          contra falsificación de peticiones (CSRF).
        </li>
      </ul>

      <h2>5. Conservación y cesión</h2>
      <p>
        Los datos se conservan durante el tiempo necesario para la finalidad y
        los plazos legales de archivo [PENDIENTE: definir plazos por tipo de
        trámite]. No se ceden a terceros salvo obligación legal o requerimiento
        judicial.
      </p>

      <h2>6. Sus derechos</h2>
      <p>
        Puede solicitar el acceso, la rectificación, la actualización, la
        supresión de sus datos u oponerse a su tratamiento, y retirar su
        consentimiento, escribiendo a {c.correo} o presentándose en la
        Municipalidad con su cédula. [PENDIENTE: plazo de respuesta y
        procedimiento conforme a la Ley N° 7593/2025.]
      </p>

      <h2>7. Cookies y almacenamiento local</h2>
      <p>
        El portal solo usa una cookie técnica de seguridad (protección CSRF,
        expira en 2 horas) y guarda en su navegador la preferencia de tamaño de
        letra y de modo oscuro. No utiliza cookies de publicidad ni de analítica
        de terceros.
      </p>
    </LegalPage>
  );
}
