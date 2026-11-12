/**
 * Proyectos de Galezo Studio para la página /proyectos, tal cual el "portafolio final" de Ulises (2026-11-09):
 * mismo orden y número, misma sección (categoría) y la ficha de cada uno (ubicación, contratación, año, área,
 * estado y descripción). En los textos solo se corrigieron tildes y erratas evidentes.
 * Imágenes en src/assets/proyectos/<slug>/NN-obra|render|antes.jpg (la primera es la portada): las del portafolio,
 * y para los proyectos que ya estaban, las de la carpeta PROYECTOS 2.
 *
 * Categorías = las secciones del portafolio:
 * - construido: proyectos diseñados y ya construidos
 * - en-obra: diseñados y en construcción
 * - disenado: diseñados
 * - modelado: modelados y renderizados (Ulises hizo el modelo 3D y los renders)
 * `estado` es el que dice la ficha de cada proyecto (en algunos no coincide con la sección; ver docs/decisiones.md).
 */
export type Categoria = 'construido' | 'en-obra' | 'disenado' | 'modelado';

export const CATEGORIAS: { id: Categoria; label: string; short: string }[] = [
  { id: 'construido', label: 'Diseñados y construidos', short: 'Construido' },
  { id: 'en-obra', label: 'Diseñados y en construcción', short: 'En construcción' },
  { id: 'disenado', label: 'Diseñados', short: 'Diseñado' },
  { id: 'modelado', label: 'Modelados y renderizados', short: 'Modelado y renderizado' },
];

export interface Proyecto {
  n: number;
  slug: string;
  name: string;
  tipo: string;
  cat: Categoria;
  estado: string;
  city: string;
  client?: string;
  year: string;
  m2: string;
  what: string;
}

const claustro = (inst: string) =>
  `Diseño arquitectónico y formulación de una nueva infraestructura para ${inst} en Valledupar, Cesar. La edificación es tipo claustro de 3 pisos y hace parte de un diseño prototipo de la Gobernación del Cesar, en el cual modifiqué y diseñé fachadas, nuevos espacios internos como aulas de clase, zona administrativa, auditorio, laboratorios, aulas especializadas, biblioteca y externos como plazoletas, parqueaderos, canchas, zonas verdes y cafetería. Adaptando la infraestructura a las necesidades de la institución. Las modificaciones conservaron el concepto de la forma y cubierta de la edificación prototipo.`;
const plazas = 'Modificación del espacio público, de circulaciones, zonas verdes, diseño y materiales de piso e instalación de mobiliario urbano.';
const banco = 'Alcaldía de El Banco, Magdalena';
const ccmvBanos = (tipo: string) =>
  `Diseño de interiores para todos los baños del Centro Cultural de la Música Vallenata. Cada baño tiene un diseño diferente usando diversos materiales y mobiliarios. ${tipo}`;

export const proyectos: Proyecto[] = [
  // ---------- Diseñados y ya construidos ----------
  { n: 1, slug: 'hospital-aguachica', name: 'Desarrollo Urbano del Hospital José Padilla', tipo: 'Espacio urbano', cat: 'construido', estado: 'Diseñado / Construido', city: 'Aguachica, Cesar', client: 'Gobernación del Cesar', year: '2021', m2: '7.683', what: 'La intervención vial y urbanística en el entorno directo del Hospital Regional José David Padilla Villafañe contempló un total de 4.780 metros cuadrados de pavimento en concreto rígido. Se destinaron 2.903 metros cuadrados exclusivamente a la construcción de andenes peatonales. Se realizó la adecuación de nuevos parqueaderos para visitantes y una plazoleta con mobiliario urbano. También se instaló una cubierta tipo domo especial para el área donde arriban las ambulancias a la zona de urgencias, optimizando de manera integral los accesos al centro médico.' },
  { n: 2, slug: 'parque-la-antillana', name: 'Remodelación del Parque La Antillana', tipo: 'Espacio público', cat: 'construido', estado: 'Diseñado / Construido', city: 'Codazzi, Cesar', client: 'HRS Ingeniería', year: '2021', m2: '3.104', what: 'La obra consistió en la transformación urbanística y dotación de un espacio público y recreodeportivo integral para la comunidad del sector. El diseño incluyó la habilitación de zonas de recreación, áreas de esparcimiento y encuentro comunitario, senderos peatonales y la integración de mobiliario urbano y elementos paisajísticos para mitigar el deterioro del espacio público y fomentar la integración social y el deporte en el municipio.' },
  { n: 3, slug: 'parques-sacudete', name: 'Proyectos de Parque Sacúdete Nacional', tipo: 'Espacio público', cat: 'construido', estado: 'Diseñado / Construido', city: 'Codazzi, Cesar y El Molino, La Guajira', client: 'HRS Ingeniería y Marbal Ingeniería SAS', year: '2021 y 2022', m2: '1.200', what: 'Corresponde a 2 Sacúdete al Parque Tipo 1 en diferentes municipios, el cual cuenta con un área estándar de 1.200 m² de intervención. Incluye cancha sintética, auditorio/teatrino al aire libre, juegos infantiles, gimnasio biosaludable y módulo de cafetería/servicios. Este es un proyecto nacional.' },
  { n: 4, slug: 'parque-de-la-vida', name: 'Diseños Internos para el Parque de la Vida', tipo: 'Espacio público', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2022', m2: '40.000', what: 'Se diseñaron espacios específicos dentro del Parque de la Vida en Valledupar, Cesar. Además del modelado y renderizado de imágenes de todo el parque. Infraestructura: templete para eventos sociales y culturales, CAI policial y diseño de juegos infantiles.' },
  { n: 5, slug: 'instpecam', name: 'Institución Educativa Instpecam', tipo: 'Colegio', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2022', m2: '15.097', what: claustro('el Instituto Técnico Pedro Castro Monsalvo') },
  { n: 6, slug: 'alfonso-lopez', name: 'Institución Educativa Alfonso López Pumarejo', tipo: 'Colegio', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2022', m2: '15.097', what: claustro('la Institución Educativa Alfonso López Pumarejo') },
  { n: 7, slug: 'casd', name: 'Institución Educativa CASD', tipo: 'Colegio', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2022', m2: '15.097', what: claustro('la Institución Educativa CASD') },
  { n: 8, slug: 'corales', name: 'Pórtico Conjunto Residencial Los Corales', tipo: 'Acceso de conjunto', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Unidad Inmobiliaria Los Corales', year: '2023', m2: '64', what: 'Demolición y construcción de un nuevo pórtico de acceso vehicular y peatonal para el Conjunto Residencial Cerrado Los Corales. Nuevo diseño aporticado contemporáneo, construcción de mampostería, instalación de portones nuevos y eléctricos, remodelación de la garita de vigilancia, instalación de luminarias, adoquines, jardines y fachaletas en muro acordes a las viviendas del conjunto. Construido por mi empresa.' },
  { n: 9, slug: 'mirador', name: 'Mirador al Monumento del Santo Eccehomo', tipo: 'Espacio público', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2023', m2: '1.988', what: 'Diseño arquitectónico y ornamental para terminar la obra del mirador al monumento Santo Eccehomo dentro del polígono de área sustraída del cerro, ya que este se encontraba abandonado en etapa de obra gris desde el año 2008.' },
  { n: 10, slug: 'jose-eugenio', name: 'Institución Educativa José Eugenio Martínez', tipo: 'Colegio', cat: 'construido', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2024', m2: '15.097', what: claustro('la Institución Educativa José Eugenio Martínez') },
  { n: 11, slug: 'corpocesar', name: 'Levantamiento de sede de Corpocesar CAVFFS', tipo: 'Levantamiento', cat: 'construido', estado: 'Levantado', city: 'Valledupar, Cesar', client: 'Consorcio Atención Silvestre', year: '2024', m2: '15.097', what: 'Levantamiento de la infraestructura existente de la sede de Corpocesar CAVFFS, para modificaciones futuras.' },

  // ---------- Diseñados y en construcción ----------
  { n: 12, slug: 'vivienda-cerro', name: 'Vivienda Unifamiliar Sobre Cerro', tipo: 'Vivienda', cat: 'en-obra', estado: 'Diseñado / En construcción', city: 'Valledupar, Cesar', client: 'Particular', year: '2025', m2: '900', what: 'Diseño arquitectónico de una vivienda unifamiliar de 5 pisos, que incluye seminiveles ya que el proyecto está ubicado en un cerro. Tiene 900 m² de área construida, incluye 5 habitaciones con baños internos, estudio, oficina, gimnasio, sala, comedor, recibo, 2 zonas de parqueo, baños sociales, terrazas tipo balcón, BBQ y una ampliación de la fachada con la mitad del lote vacío para futura expansión.' },
  { n: 13, slug: 'multicampus', name: 'Multicampus Universitario', tipo: 'Educación superior', cat: 'en-obra', estado: 'Diseñado / Construido', city: 'Codazzi, Cesar', client: 'Gobernación del Cesar', year: '2025', m2: '4.050', what: 'Diseño arquitectónico de un campus universitario de 1 piso que contiene 11 aulas de clase, 1 auditorio, 2 aulas de informática, biblioteca, zona administrativa y de servicios.' },
  { n: 14, slug: 'ccmv-banos', name: 'Diseño de interiores baños del CCMV', tipo: 'Diseño de interiores', cat: 'en-obra', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'A Construir', year: '2025', m2: '250', what: ccmvBanos('Tipos: rústico, boho-chic, abstracto o artístico, contemporáneo-industrial y exterior.') },
  { n: 15, slug: 'ccmv-hall', name: 'Diseño de interiores del Hall de la Fama, CCMV', tipo: 'Diseño de interiores', cat: 'en-obra', estado: 'Diseñado / Construido', city: 'Valledupar, Cesar', client: 'A Construir', year: '2025', m2: '1.200', what: 'Diseño de interiores para el Centro Cultural de la Música Vallenata del Salón de la Fama, en este estarán ubicadas las esculturas de cera de todos los artistas vallenatos. El museo se divide en 3 zonas: zona de juglares, donde están los pioneros y más antiguos con un diseño de la época; zona de los 5 grandes, donde estarán los más grandes artistas del género, con un diseño tipo disco de los 80, y zona de expansión, donde se encuentran el resto de intérpretes, con un diseño contemporáneo futurista. Aparte del diseño de pasillos que conectan las 3 zonas.' },
  { n: 16, slug: 'coliseo', name: 'Coliseo de Tenis de Mesa', tipo: 'Escenario deportivo', cat: 'en-obra', estado: 'Diseñado / En construcción', city: 'Valledupar, Cesar', client: 'Gobernación del Cesar', year: '2025', m2: '8.959', what: 'Diseño arquitectónico y formulación de una infraestructura deportiva tipo caja de cristal para tenis de mesa, de alta calidad, sostenible, innovadora y accesible, que cumple con los requisitos técnicos y reglamentarios nacionales e internacionales para la práctica y competición de la disciplina, impulsando el desarrollo deportivo y social de la región.' },

  // ---------- Diseñados ----------
  { n: 17, slug: 'museo-juglares', name: 'Museo de Juglares', tipo: 'Cultural', cat: 'disenado', estado: 'Diseñado', city: 'Urumita, La Guajira', client: 'Particular', year: '2021', m2: '1.600', what: 'Diseño arquitectónico de un museo para exposiciones de la cultura vallenata, incluye lobby, zona de exposición, auditorio, cafetería y baños.' },
  { n: 18, slug: 'plazas-el-banco', name: 'Renovación urbana de las plazas de la Catedral, José Barros y Telecom', tipo: 'Espacio público', cat: 'disenado', estado: 'Diseñado', city: 'El Banco, Magdalena', client: banco, year: '2022', m2: '2.400', what: `Rediseño de plazas en El Banco, Magdalena. ${plazas}` },
  { n: 19, slug: 'plaza-roja', name: 'Renovación urbana de la Plaza Roja', tipo: 'Espacio público', cat: 'disenado', estado: 'Diseñado', city: 'El Banco, Magdalena', client: banco, year: '2022', m2: '2.000', what: `Rediseño de plaza en El Banco, Magdalena. ${plazas}` },
  { n: 20, slug: 'plaza-mama-suraya', name: 'Renovación urbana de la Plaza Mamá Suraya', tipo: 'Espacio público', cat: 'disenado', estado: 'Diseñado', city: 'El Banco, Magdalena', client: banco, year: '2022', m2: '2.500', what: `Rediseño de plaza en El Banco, Magdalena. ${plazas}` },
  { n: 21, slug: 'muelle-chalupas', name: 'Renovación urbana del Muelle de Chalupas', tipo: 'Espacio público', cat: 'disenado', estado: 'Diseñado', city: 'El Banco, Magdalena', client: banco, year: '2022', m2: '545', what: `Rediseño del espacio público del muelle de chalupas en El Banco, Magdalena. ${plazas}` },
  { n: 22, slug: 'vivienda-dibulla', name: 'Vivienda Unifamiliar de 3 pisos', tipo: 'Vivienda', cat: 'disenado', estado: 'Diseñado', city: 'Dibulla, La Guajira', client: 'Particular', year: '2022', m2: '500', what: 'Diseño arquitectónico de una vivienda unifamiliar de 3 pisos.' },
  { n: 23, slug: 'zona-social-valleyville', name: 'Zona Social Campestre Valleyville', tipo: 'Vivienda campestre', cat: 'disenado', estado: 'Diseñado', city: 'San Diego, Cesar', client: 'Vive Ámbar', year: '2023', m2: '1.200', what: 'Diseño arquitectónico de un predio social campestre que incluye habitaciones, quiosco, piscina y BBQ.' },
  { n: 24, slug: 'complejo-tamalameque', name: 'Complejo Recreo-Deportivo', tipo: 'Escenario deportivo', cat: 'disenado', estado: 'Diseñado', city: 'Tamalameque, Cesar', client: 'HRS Ingeniería', year: '2023', m2: '30.200', what: 'Diseño arquitectónico de un complejo recreo-deportivo interdisciplinario. Incluye 2 canchas multifuncionales, 1 cancha de fútbol, gimnasio biosaludable, plaza de eventos, plazoleta gastronómica, parques infantiles y senderos ecológicos.' },
  { n: 25, slug: 'infraestructura-educativa-tipo', name: 'Infraestructura Educativa Tipo', tipo: 'Colegio', cat: 'disenado', estado: 'Diseñado', city: 'Sin ubicación exacta', client: 'Particular', year: '2024', m2: '2.200', what: 'Diseño arquitectónico de un bloque tipo para replicar en instituciones educativas. Diseño contemporáneo de 2 pisos con capacidad para 11 aulas, zona administrativa y de servicios.' },
  { n: 26, slug: 'centro-integral-el-plan', name: 'Centro Integral Administrativo', tipo: 'Institucional', cat: 'disenado', estado: 'Diseñado', city: 'El Plan, La Jagua del Pilar', client: 'HRS Ingeniería', year: '2024', m2: '800', what: 'Diseño arquitectónico de centro integral administrativo de 1 piso que contiene área de exposiciones temporales, salones de música, auditorio, biblioteca, zona administrativa e inspección de policía.' },
  { n: 27, slug: 'complejo-padel', name: 'Complejo de Pádel', tipo: 'Escenario deportivo', cat: 'disenado', estado: 'Diseñado', city: 'Valledupar, Cesar', client: 'HRS Ingeniería', year: '2024', m2: '1.400', what: 'Diseño arquitectónico de un complejo recreodeportivo de pádel. Incluye 4 canchas, 2 cubiertas y 2 sin cubierta, bar deportivo, baños, taquilla - venta y parqueaderos.' },
  { n: 28, slug: 'gasolineras-terpel', name: 'Gasolineras Terpel', tipo: 'Comercial', cat: 'disenado', estado: 'Diseñado', city: 'Valledupar, Cesar', client: 'Particular', year: '2024', m2: '3.000', what: 'Diseño arquitectónico de varias gasolineras en la ciudad de Valledupar, teniendo en cuenta los diseños de los módulos, estructura y cubierta Terpel.' },
  { n: 29, slug: 'umng-becerril', name: 'Campus de la Universidad Militar Nueva Granada', tipo: 'Educación superior', cat: 'disenado', estado: 'Diseñado', city: 'Becerril, Cesar', client: 'HRS Ingeniería', year: '2025', m2: '30.000', what: 'Diseño arquitectónico y formulación de una nueva infraestructura para la Universidad Militar Nueva Granada en Becerril, teniendo en cuenta los espacios requeridos por el plantel y los materiales característicos de sus sedes. Dos pisos donde la volumetría del edificio responde a un esquema lineal, que permite articular patios internos, facilitar la ventilación cruzada y promover el aprovechamiento de la luz natural.' },
  { n: 30, slug: 'sendero-cerro-estados-unidos', name: 'Sendero Peatonal y Mirador en Cerro Estados Unidos', tipo: 'Espacio público', cat: 'disenado', estado: 'Diseñado', city: 'Becerril, Cesar', client: 'Particular', year: '2025', m2: '600', what: 'Diseño en cerro de sendero peatonal empedrado, y mirador con letras ornamentales.' },

  // ---------- Modelados y renderizados ----------
  { n: 31, slug: 'auditorio-el-molino', name: 'Auditorio', tipo: 'Cultural', cat: 'modelado', estado: 'Modelado / Renderizado', city: 'El Molino, La Guajira', client: 'Marbal Ingeniería SAS', year: '2021', m2: '400', what: 'Modelado 3D y renderizado de un auditorio para eventos en El Molino, La Guajira.' },
  { n: 32, slug: 'coliseo-la-jagua', name: 'Coliseo Deportivo', tipo: 'Escenario deportivo', cat: 'modelado', estado: 'Modelado / Renderizado', city: 'La Jagua de Ibirico', client: 'Marbal Ingeniería SAS', year: '2021', m2: '20.000', what: 'Modelado 3D arquitectónico y renderizado de un coliseo para emplazamiento, plaza y parqueaderos.' },
  { n: 33, slug: 'condominio-eeuu', name: 'Condominio Residencial en EE. UU.', tipo: 'Vivienda', cat: 'modelado', estado: 'Modelado / Renderizado', city: 'Estados Unidos', client: 'Particular', year: '2022', m2: '32.000', what: 'Modelado 3D del diseño arquitectónico y renderizado del proyecto.' },
  { n: 34, slug: 'hospital-manaure', name: 'Hospital José Antonio Socarrás Sánchez', tipo: 'Salud', cat: 'modelado', estado: 'Modelado / Renderizado', city: 'Manaure, Cesar', client: 'Gobernación del Cesar', year: '2023', m2: '3.200', what: 'Modelado 3D del diseño arquitectónico, redistribución de espacios, planificación de niveles internos para acople a topografía del predio y renderizado del proyecto.' },
  { n: 35, slug: 'cac-el-banco', name: 'Centro de Atención al Ciudadano', tipo: 'Institucional', cat: 'modelado', estado: 'Diseñado', city: 'El Banco, Magdalena', client: 'Particular', year: '2024', m2: '3.000', what: 'Modelado 3D arquitectónico, estructural, renderizado y elaboración de la edificación de 3 pisos del CAC en El Banco, Magdalena.' },
  { n: 36, slug: 'zona-social-estrato-6', name: 'Zona Social de Vivienda Unifamiliar Estrato 6', tipo: 'Vivienda', cat: 'modelado', estado: 'Modelado / Renderizado', city: 'Valledupar, Cesar', client: 'Particular', year: '2025', m2: '300', what: 'Modelado 3D, rediseños de espacios y renderizado de la zona social de la vivienda.' },
  { n: 37, slug: 'bomberos-bosconia', name: 'Estación de Bomberos', tipo: 'Institucional', cat: 'modelado', estado: 'Diseñado', city: 'Bosconia, Cesar', client: 'HRS Ingeniería', year: '2026', m2: '1.695', what: 'Modelado 3D arquitectónico y estructural de una estación de bomberos tipo II, modificación de espacios internos y renderizado.' },
];

/**
 * Destacados (estrella): los proyectos más grandes y más reconocidos diseñados por Ulises (pedido del usuario, 2026-11-12).
 * Criterio: obra pública de gran escala o emblemática, ya construida o en obra, y los diseños de mayor área. No entran
 * los modelados y renderizados (no son diseño propio). Ulises puede ajustar la lista: es solo esta línea.
 */
export const DESTACADOS = new Set([
  'parque-de-la-vida', // 40.000 m², construido
  'mirador', // Ecce Homo, obra emblemática de Valledupar
  'instpecam', // los cuatro colegios: 15.097 m² cada uno, construidos
  'alfonso-lopez',
  'casd',
  'jose-eugenio',
  'coliseo', // 8.959 m², en construcción
  'complejo-tamalameque', // 30.200 m²
  'umng-becerril', // 30.000 m²
]);
export const esDestacado = (slug: string) => DESTACADOS.has(slug);

// Imágenes de cada proyecto, en orden de nombre de archivo; el sufijo dice qué es
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/proyectos/*/*.jpg', { eager: true });
export type Tag = 'obra' | 'render' | 'antes';
export const TAG_LABEL: Record<Tag, string> = { obra: 'obra', render: 'render', antes: 'antes' };
export function imagenesDe(slug: string): { src: ImageMetadata; tag: Tag }[] {
  return Object.keys(files)
    .filter((k) => k.includes(`/proyectos/${slug}/`))
    .sort()
    .map((k) => ({ src: files[k].default, tag: (k.match(/-(obra|render|antes)\.jpg$/)?.[1] || 'obra') as Tag }));
}
