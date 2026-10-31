/** Servicios de Galezo Studio: un solo lugar para el menú, las páginas de cada servicio y el chat (data-service). */
export interface Servicio {
  slug: string;
  id: string;
  title: string;
  short: string;
  line: string;
}
export const servicios: Servicio[] = [
  { slug: 'casa-campestre', id: 'campestre', title: 'Casa campestre', short: 'Campestre', line: 'Para tu lote fuera de la ciudad o en un condominio' },
  { slug: 'casa-urbana', id: 'urbana', title: 'Casa urbana', short: 'Urbana', line: 'Para tu lote en la ciudad o en un conjunto' },
  { slug: 'remodelacion-y-ampliacion', id: 'remodelacion', title: 'Remodelación y ampliación', short: 'Remodelación', line: 'Tu casa crece o cambia sin empezar de cero' },
  { slug: 'diseno-de-interiores', id: 'interiores', title: 'Diseño de interiores', short: 'Interiores', line: 'Distribución, muebles y acabados' },
  { slug: 'locales-comerciales', id: 'comercial', title: 'Locales comerciales', short: 'Comercial', line: 'Locales y proyectos comerciales' },
];
