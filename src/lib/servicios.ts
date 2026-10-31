/** Servicios de Galezo Studio: un solo lugar para el menú, las páginas de cada servicio y el chat (data-service). */
export interface Servicio {
  slug: string;
  id: string;
  title: string;
  short: string;
  line: string;
  /** true cuando su página esté terminada: deja de ser noindex y entra al sitemap */
  ready?: boolean;
}
export const servicios: Servicio[] = [
  { slug: 'diseno-de-vivienda', id: 'vivienda', title: 'Diseño de vivienda', short: 'Vivienda', line: 'Casas campestres y urbanas' },
  { slug: 'remodelacion-e-interiores', id: 'remodelacion', title: 'Remodelación e interiores', short: 'Remodelación', line: 'Ampliaciones, remodelaciones y diseño interior' },
  { slug: 'comercial-e-institucional', id: 'comercial', title: 'Comercial e institucional', short: 'Comercial', line: 'Locales, colegios, escenarios deportivos y edificios públicos' },
  { slug: 'proyectos-ejecutivos', id: 'ejecutivo', title: 'Proyectos ejecutivos', short: 'Ejecutivos', line: 'Toda la ingeniería y la arquitectura del proyecto' },
];
