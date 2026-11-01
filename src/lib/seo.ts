/** Datos estructurados (JSON-LD). Solo en páginas indexables. */
import { faq } from './faq';

export const SITE = 'https://www.galezostudio.com';
export const PHONE = '+573043395726';
const org = `${SITE}/#estudio`;

export const estudio = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': org,
  name: 'Galezo Studio',
  description: 'Estudio de diseño arquitectónico: vivienda campestre y urbana, remodelación e interiores, proyectos comerciales e institucionales y proyectos ejecutivos con arquitectura e ingeniería. Planos, modelo BIM en Revit, renders, recorrido virtual y cantidades de obra.',
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/og/galezo-proyecto.jpg`,
  telephone: PHONE,
  email: 'arquitectoulisesgalezo@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Valledupar', addressRegion: 'Cesar', addressCountry: 'CO' },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  founder: { '@type': 'Person', name: 'Ulises Galezo Cifuentes', jobTitle: 'Arquitecto', alumniOf: 'Universidad del Atlántico' },
  sameAs: ['https://www.instagram.com/galezostudio'],
  knowsAbout: ['Diseño arquitectónico', 'Casas campestres', 'Vivienda urbana', 'Remodelación', 'Diseño de interiores', 'Locales comerciales', 'Arquitectura institucional', 'Obra pública', 'Proyectos ejecutivos', 'Modelado BIM', 'Revit', 'Renders', 'Cantidades de obra'],
};

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#web`,
  url: SITE,
  name: 'Galezo Studio',
  inLanguage: 'es-CO',
  publisher: { '@id': org },
};

/** Migas de pan: [['Inicio', '/'], ['Servicios', '/#servicios'], ['Diseño de vivienda', '/servicios/...']] */
export const breadcrumb = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${path}` })),
});

/** Servicio ofrecido por el estudio */
export const servicio = (name: string, description: string, path: string, serviceType: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  serviceType,
  url: `${SITE}${path}`,
  provider: { '@id': org },
  areaServed: { '@type': 'Country', name: 'Colombia' },
});

/** FAQPage con las preguntas que se muestran en una página concreta */
export const faqDe = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
