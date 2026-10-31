/**
 * Galezo Studio · Recibe los leads del formulario y los guarda en esta hoja de Google.
 * Instalación: ver docs/leads-google-sheets.md
 *
 * - Una fila por lead; si llega primero "parcial" y luego "completo" con la misma ref, se actualiza la misma fila.
 * - Avisa por correo cada lead completo (cambia AVISAR_A o déjalo vacío para no avisar).
 */
const HOJA = 'Leads';
const AVISAR_A = 'arquitectoulisesgalezo@gmail.com';
const COLUMNAS = [
  'fecha', 'ref', 'estado', 'calidad', 'encaja', 'motivo', 'nombre', 'whatsapp', 'correo',
  'servicio', 'etapa', 'tamano', 'ubicacion', 'cuando', 'detalles', 'boton', 'pagina',
  'first_source', 'first_medium', 'first_campaign', 'last_source', 'last_medium', 'last_campaign',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'landing_page',
  'first_content', 'first_term', 'last_content', 'last_term', 'ttclid', 'fbp', 'fbc',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.empresa) return salida({ ok: true }); // trampa para robots: campo oculto lleno = spam
    if (!data.ref || !data.whatsapp) return salida({ ok: false, error: 'faltan datos' });

    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
    // encabezados: se crean la primera vez y se completan si se agregan columnas nuevas al final
    if (hoja.getLastRow() === 0 || hoja.getLastColumn() < COLUMNAS.length) {
      hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }
    data.fecha = new Date();
    // como texto: un valor que empieza por + = - @ (p. ej. "+57300…") Sheets lo tomaría como fórmula
    const texto = (v) => {
      const s = String(v).slice(0, 1000);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    const fila = COLUMNAS.map((c) => (data[c] === undefined ? '' : texto(data[c])));
    fila[0] = data.fecha;

    // ¿ya existe esa ref? (un lead parcial que ahora se completó)
    const refs = hoja.getLastRow() > 1 ? hoja.getRange(2, 2, hoja.getLastRow() - 1, 1).getValues().flat() : [];
    const i = refs.indexOf(data.ref);
    if (i >= 0) hoja.getRange(i + 2, 1, 1, COLUMNAS.length).setValues([fila]);
    else hoja.appendRow(fila);

    if (AVISAR_A && data.estado === 'completo') {
      MailApp.sendEmail({
        to: AVISAR_A,
        subject: `Nuevo lead ${data.calidad} · ${data.servicio} · ${data.nombre}`,
        body:
          `${data.nombre} · ${data.whatsapp} · ${data.correo}\n` +
          `${data.servicio} · ${data.etapa} · ${data.tamano} · ${data.ubicacion} · ${data.cuando}\n` +
          (data.detalles ? `Detalles: ${data.detalles}\n` : '') +
          `Encaja: ${data.encaja} · Ref: ${data.ref}\n` +
          `Origen: ${data.last_source || '(directo)'} / ${data.last_medium || ''} ${data.last_campaign || ''}\n` +
          `WhatsApp: https://wa.me/${String(data.whatsapp).replace(/\D/g, '')}`,
      });
    }
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
