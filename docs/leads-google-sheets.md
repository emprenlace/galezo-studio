# Base de datos de leads en Google Sheets (paso a paso)

1. Crea una hoja de cálculo en Google Drive con la cuenta del estudio, por ejemplo "Galezo Studio · Leads".
2. Menú **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de `docs/leads-apps-script.gs`. Guarda.
3. Si quieres que el aviso llegue a otro correo, cambia `AVISAR_A` (o déjalo vacío).
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - Implementar → autoriza los permisos (hoja y correo).
5. Copia la **URL de la aplicación web** (termina en `/exec`) y ponla en el archivo `.env` del sitio:
   `PUBLIC_LEADS_URL=https://script.google.com/macros/s/…/exec`
6. Recompila el sitio. Haz una prueba con el formulario: debe aparecer la fila en la pestaña **Leads** y llegar el correo.

Notas
- Cada vez que cambies el script, usa **Implementar → Gestionar implementaciones → Editar → Nueva versión** (la URL no cambia).
- Columnas: fecha, ref, estado (parcial/completo), calidad (A/B/C/no_encaja), encaja, motivo, nombre, whatsapp, correo, servicio, etapa, tamaño, ubicación, cuándo, detalles, botón de origen, página y atribución (fuente, medio, campaña, contenido, término, gclid, fbclid, ttclid, fbp, fbc…). Si se agregan columnas al final de `COLUMNAS`, el script completa los encabezados solo en el siguiente lead.
- "parcial" = dejó su contacto pero no terminó; vale la pena escribirle.
