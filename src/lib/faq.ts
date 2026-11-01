/** Preguntas frecuentes: las usa la sección 7 (chat) y el JSON-LD FAQPage. Solo respuestas confirmadas. */
export const faq = [
  { q: '¿Cuánto cuesta el diseño?', a: 'Depende del área y del tipo de proyecto. Cuéntanos de tu proyecto y te enviamos la cotización por WhatsApp.' },
  { q: '¿Cómo se paga?', a: 'Arrancamos con un anticipo y avanzamos por etapas: cada una la revisas y la apruebas antes de seguir.' },
  { q: '¿Ustedes construyen?', a: 'No, nos dedicamos al diseño. Te entregamos todo para que tu constructor lo levante tal como lo diseñamos.' },
  { q: '¿Trabajan en mi ciudad?', a: 'Sí. Diseñamos proyectos en todo Colombia.' },
  { q: '¿Qué recibo al final?', a: 'Planos completos, modelo BIM de arquitectura en Revit, renders, recorrido virtual y cantidades de obra.' },
  { q: '¿Diseñan locales?', a: 'Sí, también diseñamos locales y proyectos comerciales.' },
];

/** Página de vivienda: sin la de locales (no aplica a quien va a construir casa). */
export const faqVivienda = faq.filter((f) => f.q !== '¿Diseñan locales?');
