/**
 * Proyectos de Galezo Studio para la página /proyectos. Un solo lugar: agregar un proyecto es una entrada aquí y sus
 * imágenes en src/assets/proyectos/<slug>/ (NN-obra.jpg, NN-render.jpg o NN-antes.jpg; la primera es la portada).
 *
 * Categorías (las de Ulises, como en su portafolio):
 * - construido: diseñado y construido
 * - en-obra: diseñado y en construcción
 * - disenado: solo diseñado
 * - modelado: proyecto que no diseñó Ulises; él hizo el modelo 3D y los renders
 *
 * Solo entran proyectos con la categoría confirmada (portafolio o Ulises). Los demás de la carpeta PROYECTOS esperan
 * su clasificación: un proyecto ajeno nunca puede quedar como "diseñado" por nosotros.
 * city, year, m2 y client solo cuando están confirmados.
 */
export type Categoria = 'construido' | 'en-obra' | 'disenado' | 'modelado';

export const CATEGORIAS: { id: Categoria; label: string; short: string }[] = [
  { id: 'construido', label: 'Diseñados y construidos', short: 'Construido' },
  { id: 'en-obra', label: 'Diseñados y en construcción', short: 'En construcción' },
  { id: 'disenado', label: 'Diseñados', short: 'Diseñado' },
  { id: 'modelado', label: 'Modelados y renderizados', short: 'Modelado y renderizado' },
];

export interface Proyecto {
  slug: string;
  name: string;
  tipo: string;
  cat: Categoria;
  city?: string;
  year?: number;
  m2?: string;
  client?: string;
  what: string;
}

const colegio = 'Colegio en claustro de tres pisos: rediseñamos espacios interiores, fachadas, plazas, canchas y cafetería.';

export const proyectos: Proyecto[] = [
  { slug: 'mirador', name: 'Mirador al Santo Ecce Homo', tipo: 'Espacio público', cat: 'construido', city: 'Valledupar', year: 2023, m2: '1.988', client: 'Gobernación del Cesar', what: 'Terminamos una obra abandonada en obra gris desde 2008: diseño arquitectónico y ornamental del mirador.' },
  { slug: 'instpecam', name: 'I.E. Instpecam', tipo: 'Colegio', cat: 'construido', city: 'Valledupar', year: 2022, m2: '15.097', client: 'Gobernación del Cesar', what: colegio },
  { slug: 'alfonso-lopez', name: 'I.E. Alfonso López Pumarejo', tipo: 'Colegio', cat: 'construido', city: 'Valledupar', year: 2022, m2: '15.097', client: 'Gobernación del Cesar', what: colegio },
  { slug: 'casd', name: 'I.E. CASD', tipo: 'Colegio', cat: 'construido', city: 'Valledupar', year: 2022, m2: '15.097', client: 'Gobernación del Cesar', what: colegio },
  { slug: 'corales', name: 'Pórtico Los Corales', tipo: 'Acceso de conjunto', cat: 'construido', what: 'Cambiamos la entrada del conjunto: de los arcos de antes a un pórtico de ladrillo y concreto, con reja e iluminación nuevas.' },
  { slug: 'multicampus', name: 'Multicampus Universitario Codazzi', tipo: 'Educación superior', cat: 'construido', city: 'Agustín Codazzi', what: 'Sede universitaria con acceso cubierto, bloque de aulas y una fachada de paneles en tonos de azul.' },
  { slug: 'coliseo', name: 'Coliseo de Tenis de Mesa', tipo: 'Escenario deportivo', cat: 'en-obra', city: 'Valledupar', year: 2025, m2: '8.959', client: 'Gobernación del Cesar', what: 'Una caja de cristal para entrenar y competir con las reglas nacionales e internacionales.' },
  { slug: 'jose-eugenio', name: 'I.E. José Eugenio Martínez', tipo: 'Colegio', cat: 'en-obra', city: 'Valledupar', year: 2024, m2: '15.097', client: 'Gobernación del Cesar', what: colegio },
];

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
