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
export const modoDemostracion =
  process.env.NEXT_PUBLIC_MODO_DEMOSTRACION !== 'false';

export const institucion = {
  nombre: 'Municipalidad de Pirayú',
  departamento: 'Departamento de Paraguarí',
  pais: 'República del Paraguay',
  lema: 'Renovación para Pirayú',
  /** Ruta a un SVG/PNG del escudo oficial en /public/media. null = se muestra marcador. */
  escudo: '/media/oficial/logo.png' as string | null,
  contacto: {
    ejemplo: true,
    direccion: 'Tte. Ramón Gómez entre Gral. Díaz y Juan Pablo II, Pirayú',
    telefono: '0519-20112 / 0519-20011',
    correo: 'municipalidaddepirayu@gmail.com',
    horario: 'Confirmar horario de atención por teléfono antes de acudir',
  },
  /**
   * Información del proveedor exigida para comercio electrónico (Ley N° 4868/2013).
   * Completar con los datos fiscales oficiales de la Municipalidad.
   */
  proveedor: {
    ejemplo: false,
    razonSocial: 'Municipalidad de Pirayú',
    ruc: '80000725-5',
    domicilio: 'Tte. Ramón Gómez entre Gral. Díaz y Juan Pablo II, Pirayú',
  },
};

export const administracion = {
  intendente: {
    nombre: 'Félix de Jesús Cuevas Salinas',
    cargo: 'Intendente Municipal',
    /** Dato provisto en la solicitud del proyecto. Ver README: revisión legal sobre neutralidad institucional. */
    partido: 'Partido Colorado · ANR',
    mostrarPartido: true,
    periodo: '2026–2031',
    foto: '/media/ia/felix-cuevas-institucional.webp' as string | null,
    biografia:
      'Félix de Jesús Cuevas Salinas fue elegido para la Intendencia de Pirayú en las elecciones municipales del 4 de octubre de 2026. La Administración Municipal atiende a la ciudadanía a través de sus canales institucionales.',
  },
  bienvenida: {
    ejemplo: false,
    titulo: 'Renovación para Pirayú',
    texto:
      'Una nueva etapa, cerca de cada vecino. Encontrá información útil, conocé los servicios municipales y descubrí el patrimonio que nos une. Un portal pensado para toda la ciudadanía de Pirayú.',
  },
};

export interface Persona {
  nombre: string;
  cargo: string;
  foto: string | null;
  ejemplo: boolean;
}

/** Junta Municipal: completar con la integración oficial proclamada por la Justicia Electoral. */
export const juntaMunicipal: Persona[] = [];

export const directores: Persona[] = [
  {
    nombre: 'Rosalía Rojas',
    cargo: 'Encargada de la Unidad Operativa de Contratación (registro DNCP)',
    foto: null,
    ejemplo: false,
  },
];

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
      'Orientación para renovar tu licencia y consultar los pasos con Tránsito.',
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
      'Información para consultar tu liquidación y las formas de pago habilitadas.',
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
      'Conocé el recorrido para solicitar una reunión con la Intendencia.',
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
  ia?: boolean;
}

export const sitiosTuristicos: SitioTuristico[] = [
  {
    id: 'estacion',
    nombre: 'Estación del Ferrocarril de Pirayú',
    categoria: 'Patrimonio',
    descripcion:
      'Estación ferroviaria restaurada conservando su estructura original y sus dos torres laterales. SENATUR la identifica como estación y museo, vinculada al turismo comunitario de Pirayú.',
    lat: -25.4825,
    lng: -57.0345,
    coordenadasVerificadas: false,
    foto: '/media/oficial/estacion.jpg',
  },
  {
    id: 'iglesia',
    nombre: 'Iglesia Virgen del Rosario',
    categoria: 'Patrimonio',
    descripcion:
      'La Iglesia Virgen del Rosario integra los circuitos turísticos de Pirayú difundidos por SENATUR. Consultá las condiciones y horarios de visita con el municipio.',
    lat: -25.4842,
    lng: -57.0318,
    coordenadasVerificadas: false,
    foto: '/media/ia/iglesia.webp',
    ia: true,
  },
  {
    id: 'nanduti',
    nombre: 'Artesanía en Ñandutí y calzados de cuero',
    categoria: 'Artesanía',
    descripcion:
      'El circuito Ñandu Rape invita a conocer la artesanía tradicional de Pirayú. SENATUR también documenta la Escuela de Salvaguarda de los Textiles de la ciudad.',
    lat: -25.4851,
    lng: -57.0355,
    coordenadasVerificadas: false,
    foto: '/media/ia/nanduti.webp',
    ia: true,
  },
  {
    id: 'cerro-leon',
    nombre: 'Museo Campamento Cerro León',
    categoria: 'Historia',
    descripcion:
      'Museo vinculado a la memoria de la Guerra de la Triple Alianza, documentado por la Secretaría Nacional de Cultura. Agencia IP lo ubica a 11 km del centro de Pirayú. La posición del mapa es ilustrativa; confirmá el acceso antes de viajar.',
    lat: -25.47,
    lng: -57.05,
    coordenadasVerificadas: false,
    foto: '/media/ia/cerro.webp',
    ia: true,
  },
  {
    id: 'gastronomia',
    nombre: 'Gastronomía local',
    categoria: 'Gastronomía',
    descripcion:
      'La gastronomía integra el turismo comunitario promovido por SENATUR en Pirayú. Consultá con el municipio las propuestas disponibles y los prestadores habilitados.',
    lat: -25.4838,
    lng: -57.033,
    coordenadasVerificadas: false,
    foto: '/media/ia/gastronomia.webp',
    ia: true,
  },
];

/** Diapositivas del Hero. `src` null = marcador gráfico. Ver public/media/LEEME.md. */
export interface Diapositiva {
  id: string;
  titulo: string;
  src: string | null;
  alt: string;
  motivo: 'tren' | 'nanduti' | 'centro';
  ia?: boolean;
}

export const heroDiapositivas: Diapositiva[] = [
  {
    id: 'estacion',
    titulo: 'Estación del Ferrocarril de Pirayú',
    src: '/media/oficial/estacion.jpg',
    alt: 'Estación del Ferrocarril de Pirayú, fotografía del portal municipal',
    motivo: 'tren',
  },
];

/** Video opcional en bucle para el Hero (MP4 H.264, ≤ 4 MB). null = slider de imágenes. */
export const heroVideo: { src: string; poster: string } | null = null;

export const galeria: Diapositiva[] = [
  ...heroDiapositivas,
  {
    id: 'cuero',
    titulo: 'Calzados de cuero',
    src: '/media/ia/cuero.webp',
    alt: 'Ilustración de IA: elaboración artesanal de sandalias de cuero',
    motivo: 'nanduti',
    ia: true,
  },
  {
    id: 'iglesia',
    titulo: 'Iglesia Virgen del Rosario',
    src: '/media/ia/iglesia.webp',
    alt: 'Ilustración de IA basada en referencias de la Iglesia Virgen del Rosario de Pirayú',
    motivo: 'centro',
    ia: true,
  },
  {
    id: 'cerro',
    titulo: 'Museo Campamento Cerro León',
    src: '/media/ia/cerro.webp',
    alt: 'Ilustración de IA basada en referencias del Museo Campamento Cerro León',
    motivo: 'tren',
    ia: true,
  },
  {
    id: 'nanduti',
    titulo: 'Artesanía en ñandutí',
    src: '/media/ia/nanduti.webp',
    alt: 'Ilustración de IA: manos trabajando encaje de ñandutí sobre bastidor',
    motivo: 'nanduti',
    ia: true,
  },
  {
    id: 'gastronomia',
    titulo: 'Sabores de Paraguay',
    src: '/media/ia/gastronomia.webp',
    alt: 'Ilustración de IA: chipa y sopa paraguaya sobre una mesa de madera',
    motivo: 'centro',
    ia: true,
  },
];

export const navegacion = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#autoridades', label: 'Autoridades' },
  { href: '/#tramites', label: 'Trámites Virtuales' },
  { href: '/#transparencia', label: 'Transparencia' },
  { href: '/#turismo', label: 'Turismo' },
  { href: '/#contacto', label: 'Contacto' },
] as const;
