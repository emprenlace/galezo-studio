/**
 * Datos de contacto del estudio: un solo lugar para la página de contacto, el pie, la política y el schema.
 * WhatsApp Business confirmado (2026-11-12). El correo es provisional hasta que Ulises tenga el corporativo.
 */
export const contacto = {
  whatsapp: '+573001408059',
  whatsappLabel: '+57 300 140 8059',
  email: 'galezostudio@gmail.com',
  instagram: 'galezostudio',
  ciudad: 'Valledupar, Cesar',
};

/** Saludo del WhatsApp directo según la página: le dice a Ulises qué busca la persona y termina en pregunta. */
export const saludos: Record<string, string> = {
  general: 'Hola, vi la web de Galezo Studio y quiero contarles de mi proyecto. ¿Me pueden orientar?',
  vivienda: 'Hola, quiero diseñar mi casa y vi su trabajo en la web. ¿Me cuentan cómo empezamos?',
  remodelacion: 'Hola, quiero remodelar un espacio y vi su trabajo en la web. ¿Me cuentan cómo trabajan?',
  comercial: 'Hola, tengo un proyecto comercial o institucional y vi su experiencia en la web. ¿Podemos hablar?',
  ejecutivo: 'Hola, necesito el proyecto completo, con arquitectura e ingenierías, para construir. ¿Me cuentan cómo funciona?',
  about: 'Hola Ulises, vi tu perfil en la web y quiero hablar contigo sobre mi proyecto.',
};

/** Enlace a WhatsApp con un saludo ya escrito (el visitante lo puede cambiar antes de enviar). */
export const waLink = (texto = saludos.general) =>
  `https://wa.me/${contacto.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
