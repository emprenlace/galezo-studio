/**
 * Datos de contacto del estudio: un solo lugar para la página de contacto, el pie, la política y el schema.
 * Provisionales hasta que Ulises tenga el correo corporativo y el WhatsApp Business (tareas pendientes).
 */
export const contacto = {
  whatsapp: '+573043395726',
  whatsappLabel: '+57 304 339 5726',
  email: 'arquitectoulisesgalezo@gmail.com',
  instagram: 'galezostudio',
  ciudad: 'Valledupar, Cesar',
};

/** Enlace a WhatsApp con un saludo ya escrito (el visitante lo puede cambiar antes de enviar). */
export const waLink = (texto = 'Hola, quiero información para diseñar mi proyecto.') =>
  `https://wa.me/${contacto.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
