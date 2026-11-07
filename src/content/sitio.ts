/**
 * ============================================================================
 *  CONTENIDO DEL PORTAL — ARCHIVO ÚNICO A EDITAR
 * ============================================================================
 *  Todo lo marcado con `ejemplo: true` o con el texto "[PENDIENTE]" es un DATO DE
 *  EJEMPLO / MARCADOR y DEBE reemplazarse por información oficial validada por la
 *  Municipalidad antes de publicar. La interfaz muestra una etiqueta "Dato de ejemplo"
 *  en cada bloque que aún no fue reemplazado.
 *
 *  Fuente de los datos NO marcados como ejemplo: mensaje de solicitud del proyecto
 *  (nombre del intendente, símbolos culturales). No fueron verificados contra fuentes
 *  oficiales por el equipo de desarrollo.
 * ============================================================================
 */

export const PENDIENTE = '[PENDIENTE]';

/** true = muestra un aviso global de "versión de demostración con datos de ejemplo". */
export const modoDemostracion = true;

export const institucion = {
  nombre: 'Municipalidad de Pirayú',
  departamento: 'Departamento de Paraguarí',
  pais: 'República del Paraguay',
  lema: 'Ventanilla única virtual',
  /** Ruta a un SVG/PNG del escudo oficial en /public/media. null = se muestra marcador. */
  escudo: null as string | null,
  contacto: {
    ejemplo: true,
    direccion: `${PENDIENTE} Dirección física de la sede municipal`,
    telefono: `${PENDIENTE} Teléfono oficial`,
    correo: `${PENDIENTE} correo@dominio-oficial`,
    horario: `${PENDIENTE} Horario de atención`,
  },
  /**
   * Información del proveedor exigida para comercio electrónico (Ley N° 4868/2013).
   * Completar con los datos fiscales oficiales de la Municipalidad.
   */
  proveedor: {
    ejemplo: true,
    razonSocial: 'Municipalidad de Pirayú',
    ruc: `${PENDIENTE} RUC`,
    domicilio: `${PENDIENTE} Domicilio legal`,
  },
};

export const administracion = {
  intendente: {
    nombre: 'Félix Cuevas',
    cargo: 'Intendente Municipal',
    /** Dato provisto en la solicitud del proyecto. Ver README: revisión legal sobre neutralidad institucional. */
    partido: 'ANR',
    mostrarPartido: true,
    periodo: `${PENDIENTE} Período de mandato`,
    foto: null as string | null,
    biografia: `${PENDIENTE} Reseña institucional del Intendente (trayectoria, ejes de gestión). Redactar y validar por la Secretaría General.`,
  },
  bienvenida: {
    ejemplo: true,
    titulo: 'Bienvenidos al portal de la Municipalidad de Pirayú',
    texto:
      'Desde aquí podés realizar trámites, consultar el estado de tus solicitudes y acceder a la información pública del municipio. [Texto de ejemplo: reemplazar por el mensaje oficial de la Administración.]',
  },
};

export interface Persona {
  nombre: string;
  cargo: string;
  foto: string | null;
  ejemplo: boolean;
}

/** Junta Municipal: completar con la integración oficial proclamada por la Justicia Electoral. */
export const juntaMunicipal: Persona[] = Array.from({ length: 6 }, (_, i) => ({
  nombre: `${PENDIENTE} Concejal/a ${i + 1}`,
  cargo: i === 0 ? 'Presidente/a de la Junta Municipal' : 'Concejal/a titular',
  foto: null,
  ejemplo: true,
}));

export const directores: Persona[] = [
  'Dirección de Administración y Finanzas',
  'Dirección de Tránsito',
  'Dirección de Obras Públicas',
  'Dirección de Cultura y Turismo',
  'Dirección de Medio Ambiente',
].map((cargo) => ({
  nombre: `${PENDIENTE} Nombre del/la director/a`,
  cargo,
  foto: null,
  ejemplo: true,
}));

export type EstadoServicio = 'en_linea' | 'parcial' | 'presencial';
export type AccionTramite = 'pago' | 'audiencia' | 'reclamo' | 'consulta';

export interface Tramite {
  id: 'licencia' | 'inmobiliario' | 'patente' | 'audiencia' | 'reclamo';
  titulo: string;
  resumen: string;
  palabrasClave: string[];
  estadoServicio: EstadoServicio;
  requisitos: string[];
  acciones: AccionTramite[];
  prefijoExpediente: string;
}

export const tramites: Tramite[] = [
  {
    id: 'licencia',
    titulo: 'Renovación de Licencia de Conducir',
    resumen:
      'Iniciá la renovación, agendá el examen y consultá el estado de tu expediente.',
    palabrasClave: [
      'registro',
      'licencia',
      'conducir',
      'carnet',
      'tránsito',
      'renovación',
    ],
    estadoServicio: 'parcial',
    requisitos: [
      'Cédula de identidad vigente',
      'Licencia anterior',
      `${PENDIENTE} Certificados exigidos por la Dirección de Tránsito`,
    ],
    acciones: ['consulta', 'pago'],
    prefijoExpediente: 'LIC',
  },
  {
    id: 'inmobiliario',
    titulo: 'Pago de Impuesto Inmobiliario',
    resumen:
      'Consultá tu liquidación por cuenta corriente catastral y pagá en línea.',
    palabrasClave: [
      'inmobiliario',
      'impuesto',
      'catastro',
      'inmueble',
      'terreno',
      'casa',
    ],
    estadoServicio: 'parcial',
    requisitos: [
      'Número de cuenta corriente catastral',
      `${PENDIENTE} Requisitos de la Dirección de Hacienda`,
    ],
    acciones: ['consulta', 'pago'],
    prefijoExpediente: 'INM',
  },
  {
    id: 'patente',
    titulo: 'Patente Comercial y Habilitación',
    resumen: 'Habilitación de comercios y pago anual de la patente comercial.',
    palabrasClave: [
      'patente',
      'comercial',
      'habilitación',
      'comercio',
      'negocio',
      'local',
    ],
    estadoServicio: 'parcial',
    requisitos: [
      'RUC del contribuyente',
      'Plano o croquis del local',
      `${PENDIENTE} Requisitos de habilitación vigentes`,
    ],
    acciones: ['consulta', 'pago'],
    prefijoExpediente: 'PAT',
  },
  {
    id: 'audiencia',
    titulo: 'Solicitud de Audiencia con el Intendente',
    resumen:
      'Pedí una reunión indicando el motivo. Secretaría General confirma fecha y hora.',
    palabrasClave: ['audiencia', 'intendente', 'reunión', 'cita', 'entrevista'],
    estadoServicio: 'en_linea',
    requisitos: [
      'Cédula de identidad',
      'Teléfono de contacto',
      'Motivo de la audiencia',
    ],
    acciones: ['audiencia', 'consulta'],
    prefijoExpediente: 'AUD',
  },
  {
    id: 'reclamo',
    titulo: 'Reclamos Ciudadanos',
    resumen:
      'Baches, alumbrado público y recolección de residuos. Marcá el lugar en el mapa y adjuntá una foto.',
    palabrasClave: [
      'reclamo',
      'bache',
      'calle',
      'alumbrado',
      'luz',
      'basura',
      'recolección',
      'residuos',
    ],
    estadoServicio: 'en_linea',
    requisitos: ['Ubicación del problema', 'Descripción', 'Foto (opcional)'],
    acciones: ['reclamo', 'consulta'],
    prefijoExpediente: 'REC',
  },
];

export const sugerenciasBusqueda = ['Registro', 'Inmobiliario', 'Habilitación'];

/**
 * Datasets de Transparencia Activa (Ley N° 5282/2014; remuneraciones: Ley N° 5189/2014).
 * `filas` contiene DATOS DE EJEMPLO para demostrar el formato abierto CSV. Reemplazar por
 * exportaciones oficiales del sistema contable/RR.HH. `pdf` = ruta en /public/transparencia.
 */
export interface Dataset {
  id: string;
  titulo: string;
  descripcion: string;
  base: string;
  actualizado: string;
  columnas: string[];
  filas: (string | number | null)[][];
  pdf: string | null;
  enlaceExterno?: { url: string; etiqueta: string };
}

export const datasets: Dataset[] = [
  {
    id: 'presupuesto',
    titulo: 'Presupuesto y ejecución presupuestaria',
    descripcion: 'Presupuesto aprobado y ejecución por rubro.',
    base: 'Ley 5282/2014',
    actualizado: PENDIENTE,
    columnas: [
      'ejercicio',
      'rubro',
      'descripcion',
      'presupuestado_gs',
      'ejecutado_gs',
      'es_ejemplo',
    ],
    filas: [
      [2026, '100', 'Servicios personales', 1000000, 500000, 'SI'],
      [2026, '200', 'Servicios no personales', 1000000, 500000, 'SI'],
      [2026, '500', 'Inversión física', 1000000, 500000, 'SI'],
    ],
    pdf: null,
  },
  {
    id: 'nomina',
    titulo: 'Nómina de funcionarios y remuneraciones',
    descripcion:
      'Personal permanente y contratado, cargo y remuneración mensual.',
    base: 'Ley 5282/2014 · Ley 5189/2014',
    actualizado: PENDIENTE,
    columnas: [
      'periodo',
      'nombre',
      'cargo',
      'vinculo',
      'remuneracion_gs',
      'es_ejemplo',
    ],
    filas: [
      [
        '2026-10',
        'Funcionario/a de ejemplo 1',
        'Cargo de ejemplo',
        'Permanente',
        1000000,
        'SI',
      ],
      [
        '2026-10',
        'Funcionario/a de ejemplo 2',
        'Cargo de ejemplo',
        'Contratado',
        1000000,
        'SI',
      ],
    ],
    pdf: null,
  },
  {
    id: 'contrataciones',
    titulo: 'Licitaciones y contrataciones públicas',
    descripcion:
      'Llamados y adjudicaciones. La fuente oficial es el portal de la DNCP.',
    base: 'Ley 5282/2014 · Ley 7021/2022',
    actualizado: PENDIENTE,
    columnas: [
      'id_llamado_dncp',
      'objeto',
      'modalidad',
      'estado',
      'monto_gs',
      'es_ejemplo',
    ],
    filas: [
      [
        '000000',
        'Llamado de ejemplo',
        'Contratación directa',
        'Ejemplo',
        1000000,
        'SI',
      ],
    ],
    pdf: null,
    enlaceExterno: {
      url: 'https://www.contrataciones.gov.py/',
      etiqueta: 'Portal DNCP',
    },
  },
  {
    id: 'resoluciones',
    titulo: 'Resoluciones de la Intendencia',
    descripcion: 'Resoluciones numeradas con fecha y resumen.',
    base: 'Ley 5282/2014',
    actualizado: PENDIENTE,
    columnas: ['numero', 'fecha', 'resumen', 'es_ejemplo'],
    filas: [['0/2026', '2026-01-01', 'Resolución de ejemplo', 'SI']],
    pdf: null,
  },
  {
    id: 'ordenanzas',
    titulo: 'Ordenanzas de la Junta Municipal',
    descripcion: 'Ordenanzas sancionadas y promulgadas.',
    base: 'Ley 5282/2014 · Ley 3966/2010',
    actualizado: PENDIENTE,
    columnas: ['numero', 'fecha', 'titulo', 'es_ejemplo'],
    filas: [['0/2026', '2026-01-01', 'Ordenanza de ejemplo', 'SI']],
    pdf: null,
  },
];

export const portalUnificado = {
  url: 'https://informacionpublica.paraguay.gov.py/',
  etiqueta: 'Portal Unificado de Información Pública',
};

/** Centro aproximado del casco urbano. VERIFICAR con Catastro antes de publicar. */
export const centroMapa = {
  lat: -25.4833,
  lng: -57.0333,
  zoom: 14,
  verificado: false,
};

export interface SitioTuristico {
  id: string;
  nombre: string;
  categoria:
    'Historia' | 'Patrimonio' | 'Artesanía' | 'Gastronomía' | 'Naturaleza';
  descripcion: string;
  lat: number;
  lng: number;
  /** false = posición ilustrativa; reemplazar por coordenadas relevadas. */
  coordenadasVerificadas: boolean;
  foto: string | null;
}

export const sitiosTuristicos: SitioTuristico[] = [
  {
    id: 'estacion',
    nombre: 'Estación del Ferrocarril de Pirayú',
    categoria: 'Patrimonio',
    descripcion:
      'Edificio ferroviario declarado Patrimonio Histórico Nacional. [Ampliar con reseña oficial.]',
    lat: -25.4825,
    lng: -57.0345,
    coordenadasVerificadas: false,
    foto: null,
  },
  {
    id: 'iglesia',
    nombre: 'Iglesia Virgen del Rosario',
    categoria: 'Patrimonio',
    descripcion:
      'Templo de la comunidad. [Ampliar con reseña oficial y horarios de visita.]',
    lat: -25.4842,
    lng: -57.0318,
    coordenadasVerificadas: false,
    foto: null,
  },
  {
    id: 'nanduti',
    nombre: 'Artesanía en Ñandutí y calzados de cuero',
    categoria: 'Artesanía',
    descripcion:
      'Talleres de tejido de ñandutí y producción de calzados de cuero. [Agregar talleres con su autorización.]',
    lat: -25.4851,
    lng: -57.0355,
    coordenadasVerificadas: false,
    foto: null,
  },
  {
    id: 'cerro-leon',
    nombre: 'Cerro León y Campamento Azcurra',
    categoria: 'Historia',
    descripcion:
      'Sitios vinculados a la Guerra de la Triple Alianza. [Validar ubicación y reseña con historiadores locales.]',
    lat: -25.47,
    lng: -57.05,
    coordenadasVerificadas: false,
    foto: null,
  },
  {
    id: 'gastronomia',
    nombre: 'Gastronomía local',
    categoria: 'Gastronomía',
    descripcion:
      '[Listar comedores y productores locales con su autorización.]',
    lat: -25.4838,
    lng: -57.033,
    coordenadasVerificadas: false,
    foto: null,
  },
];

/** Diapositivas del Hero. `src` null = marcador gráfico. Ver public/media/LEEME.md. */
export interface Diapositiva {
  id: string;
  titulo: string;
  src: string | null;
  alt: string;
  motivo: 'tren' | 'nanduti' | 'centro';
}

export const heroDiapositivas: Diapositiva[] = [
  {
    id: 'estacion',
    titulo: 'Estación del Ferrocarril',
    src: null,
    alt: 'Estación del Ferrocarril de Pirayú',
    motivo: 'tren',
  },
  {
    id: 'nanduti',
    titulo: 'Telares de Ñandutí',
    src: null,
    alt: 'Artesana tejiendo ñandutí',
    motivo: 'nanduti',
  },
  {
    id: 'centro',
    titulo: 'Centro histórico',
    src: null,
    alt: 'Centro histórico de Pirayú',
    motivo: 'centro',
  },
];

/** Video opcional en bucle para el Hero (MP4 H.264, ≤ 4 MB). null = slider de imágenes. */
export const heroVideo: { src: string; poster: string } | null = null;

export const galeria: Diapositiva[] = [
  ...heroDiapositivas,
  {
    id: 'cuero',
    titulo: 'Calzados de cuero',
    src: null,
    alt: 'Taller de calzados de cuero',
    motivo: 'nanduti',
  },
  {
    id: 'iglesia',
    titulo: 'Iglesia Virgen del Rosario',
    src: null,
    alt: 'Iglesia Virgen del Rosario',
    motivo: 'centro',
  },
  {
    id: 'cerro',
    titulo: 'Cerro León',
    src: null,
    alt: 'Vista del Cerro León',
    motivo: 'tren',
  },
];

export const navegacion = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#autoridades', label: 'Autoridades' },
  { href: '/#tramites', label: 'Trámites Virtuales' },
  { href: '/#transparencia', label: 'Transparencia Ley 5282' },
  { href: '/#turismo', label: 'Turismo' },
  { href: '/#contacto', label: 'Contacto' },
] as const;
