# Medición y conversión · Galezo Studio

## Recorrido del cliente (formulario, no chat)
1. Cualquier botón "Cotiza tu diseño" (o el WhatsApp del pie) abre el **cotizador** (`Cotizador.astro`): una pregunta por pantalla, tarjetas de un toque y la maqueta del servicio que se arma con cada respuesta. El botón dice de dónde viene (`data-cta`) y, si lo sabe, el servicio (`data-service`).
2. Pasos: servicio (si no lo trae el botón) → etapa → tamaño → ubicación → cuándo empezar → **contacto**: nombre, WhatsApp (indicativo de cualquier país, preseleccionado por la zona horaria; validado por país y guardado en E.164) y correo (obligatorios), detalle opcional y autorización de datos.
3. Al enviar: **se guarda en la base de datos (Google Sheets) siempre**, encaje o no; si encaja se marca `generate_lead` (conversión); si no, `lead_unqualified` (sin conversión). En ambos casos **se abre WhatsApp** con el mensaje escrito y la referencia. WhatsApp no permite que la web lo envíe sola: el cliente toca Enviar.
4. Si deja nombre y WhatsApp válidos y cierra sin enviar → se guarda como **lead parcial** (`lead_partial`).
5. Fase 2 (opcional): API de WhatsApp Business para que el estudio le escriba automáticamente al cliente.

## Base de datos
Google Sheets mediante Apps Script: `docs/leads-apps-script.gs` + guía `docs/leads-google-sheets.md`. URL en `PUBLIC_LEADS_URL`. Envío con `sendBeacon` (sobrevive a la apertura de WhatsApp). Campo trampa `empresa` contra robots. Aviso por correo de cada lead completo. **Aquí sí van nombre, WhatsApp y correo; nunca al dataLayer.**

## Prioridad y referencia
- Puntos: etapa (lote o espacio existente 3 · buscando 1) + tamaño (más de 300 m² 3 · 150–300 2 · menos 1) + cuándo (este mes 3 · 1–3 meses 2 · más adelante 0).
- 8 o más = **A** (`-1`), 5–7 = **B** (`-2`), resto = **C** (`-3`); no encaja = `-4`.
- La referencia cruza el chat de WhatsApp con la campaña en GA4 (`lead_ref` = ID de transacción en Google Ads y `eventID` en Meta).

## dataLayer (`src/lib/track.ts`)
- `track(event, params)`: solo parámetros de la lista de permitidos; cada push vacía las claves del anterior.
- El texto libre del cliente y sus datos de contacto **nunca** viajan al dataLayer (solo `shared_details: true/false`). Prueba automática: `npm test`.
- `page_context` se envía antes de GTM: `page_type`, `content_group`, `service_id`.
- Atribución en `localStorage` (`gz_attr`): primer y último toque (utm_source/medium/campaign/content/term, gclid, gbraid, wbraid, fbclid, ttclid, landing), adjunta a `generate_lead`. Además `fbp`/`fbc` (cookies de Meta; si no hay `_fbc` se arma desde fbclid como `fb.1.<ms>.<fbclid>`) para la API de Conversiones.

| Evento | Cuándo | Parámetros | Conversión |
|---|---|---|---|
| `page_context` | Carga de cada página | page_type, content_group, service_id | No |
| `cta_click` | Toca un botón que abre el chat | cta_id, service_id | No |
| `service_dialog_open` | Se abre el chat | cta_id, service_id | No |
| `service_select` | Elige el servicio en el chat | cta_id, service_id | No |
| `lead_step` | Cada respuesta | step (stage/size/location/timing/contact/contact_error), answer | No |
| `generate_lead` | Encaja y envía el formulario | lead_quality, lead_value, lead_ref, event_id, stage, size, location, timing, shared_details + atribución | **Sí** |
| `lead_unqualified` | Envía el formulario sin encajar (se guarda y abre WhatsApp) | reason, lead_ref | No |
| `lead_partial` | Dejó nombre y WhatsApp y cerró sin enviar | lead_ref | No |
| `not_found_build` | En el 404, tocó el lote y construyó el cero | — | No |
| `service_dialog_close` | Cierra sin terminar | step | No |
| `contact_whatsapp` | Toca un WhatsApp directo (botón flotante, /contacto) | link_type, cta_id (flotante, contacto) | No (contacto sin calificar: se mide en GA4, nunca como conversión de pauta) |
| `contact_email` | Toca un correo (/contacto, política) | link_type, cta_id (contacto, privacidad) | No |
| `contact_instagram` | Toca un Instagram (/contacto, pie) | link_type, cta_id (contacto, cierre) | No |
| `project_filter` | En /proyectos, toca un filtro de categoría | filter (todos, destacados, construido, en-obra, disenado, modelado) | No |
| `project_open` | En /proyectos, abre la ficha de un proyecto | project_id (slug del proyecto) | No |

Valores de `cta_id` (chat): hero, header, menu, proyectos (ficha de /proyectos), entregable, servicios, obras, proceso, bim, estudio, preguntas, cierre, clientes, vivienda-hero, comercial-hero, ejecutivo-hero, remodelacion-hero, servicio, contacto, arquitecto, blog, 404, 404_inicio, url.
Valores de `cta_id` (contacto directo, en `contact_*`): flotante, contacto, cierre, privacidad. Un evento por canal; el botón se lee en `cta_id` (no se crea un evento por botón).

Regla: todo botón o enlace nuevo lleva `data-cta` (y `data-service` si aplica). Si abre el chat, `data-open-chat`; si es contacto directo, `data-contact="whatsapp|email|instagram"`. Base.astro registra `contact_<canal>` para todo el sitio; no se agregan registros sueltos por página.

## Consentimiento
Sin aviso de cookies (decisión del usuario: público en Colombia, la Ley 1581 no lo exige; sí se publicará la política de privacidad). Consent Mode v2 queda concedido por defecto en `Base.astro`, listo para cambiarse si se pauta en Europa.

## GTM (cuando exista el contenedor)
- Variable de entorno `PUBLIC_GTM_ID`. GTM carga 2 s después de `load` y en un momento libre (o al primer toque o tecla); nunca con el scroll. Los eventos anteriores esperan en el dataLayer y GTM los procesa al cargar.
- Variables: `DLV - <parámetro>` para cada parámetro de la tabla + la integrada **Event**.
- Activadores: `CE - generate_lead` (exacto), `CE - chat` (regex: `cta_click|service_dialog_open|service_select|lead_step|lead_unqualified|lead_partial|service_dialog_close`) y `CE - contacto` (regex: `contact_(whatsapp|email|instagram)`).
- Etiquetas: `GA4 - Chat` ({{Event}} + parámetros) en `CE - chat`; `GA4 - Contacto directo` ({{Event}} + link_type y cta_id) en `CE - contacto`; `GA4 - generate_lead`; Meta evento personalizado `LeadCalificado` con `eventID = {{DLV - event_id}}`; Google Ads conversión con ID de transacción `{{DLV - lead_ref}}`. Ninguna etiqueta de pauta en "Clic en enlace".
- GA4: marcar `generate_lead` como evento clave; registrar dimensiones de ámbito evento el mismo día (cta_id, service_id, step, answer, stage, size, location, timing, lead_quality, lead_ref, shared_details, reason, link_type, project_id, filter).
- Probar en vista previa con un lead que encaja y otro que no; el que no encaja no dispara Meta ni Ads.
