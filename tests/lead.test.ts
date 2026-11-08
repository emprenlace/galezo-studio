import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fits, quality, message, makeRef, waLink, stagesFor } from '../src/lib/lead.ts';
import { sanitize, ALLOWED } from '../src/lib/track.ts';

test('filtro: solo averiguando no encaja', () => {
  assert.deepEqual(fits({ service: 'vivienda', stage: 'averiguando', size: 'l' }), { ok: false, reason: 'exploring' });
});
test('filtro: casa nueva de menos de 60 m² no encaja', () => {
  assert.equal(fits({ service: 'vivienda', stage: 'lote', size: 'xs' }).ok, false);
});
test('filtro: remodelación pequeña sí encaja (el área intervenida suele ser pequeña)', () => {
  assert.equal(fits({ service: 'remodelacion', stage: 'existente', size: 'xs' }).ok, true);
});
test('prioridad: lote + grande + este mes = A (1); buscando + pequeño + más adelante = C (3)', () => {
  assert.equal(quality({ service: 'vivienda', stage: 'lote', size: 'l', timing: 'ya' }), 1);
  assert.equal(quality({ service: 'vivienda', stage: 'buscando', size: 's', timing: 'luego' }), 3);
  assert.equal(quality({ service: 'vivienda', stage: 'averiguando', size: 'l', timing: 'ya' }), 4);
});
test('referencia: GZ-XXXXX-prioridad', () => {
  assert.match(makeRef(2), /^GZ-[A-Z0-9]{5}-2$/);
});
test('mensaje en prosa con referencia al final', () => {
  const m = message({ service: 'vivienda', stage: 'lote', size: 'm', location: 'cesar', timing: 'pronto', details: 'Es para mi familia, cuatro habitaciones' }, 'GZ-AAAAA-2');
  assert.equal(
    m,
    'Hola, Galezo Studio. Quiero cotizar el diseño de una vivienda. Ya tengo el lote, el área es de unos 150 a 300 m² y la obra sería en Valledupar o el Cesar. Me gustaría empezar en uno a tres meses. Es para mi familia, cuatro habitaciones. Ref: GZ-AAAAA-2',
  );
  assert.match(waLink('+57 304 339 5726', m), /^https:\/\/wa\.me\/573043395726\?text=/);
});
test('etapas según el servicio', () => {
  assert.deepEqual(stagesFor('remodelacion').map((s) => s.id), ['existente', 'averiguando']);
  assert.deepEqual(stagesFor('vivienda').map((s) => s.id), ['lote', 'buscando', 'averiguando']);
});
test('privacidad: el texto libre y los datos de contacto nunca llegan al dataLayer', () => {
  const out = sanitize({ details: 'mi teléfono 300…', phone: '300', name: 'Ana', email: 'a@b.co', service_id: 'vivienda', shared_details: true });
  assert.deepEqual(out, { service_id: 'vivienda', shared_details: true });
  for (const k of ['details', 'phone', 'name', 'email', 'message']) assert.equal((ALLOWED as readonly string[]).includes(k), false);
});

import { normalizePhone, validEmail, leadRecord, messageWithName } from '../src/lib/lead.ts';

test('celular: formatos colombianos e internacionales', () => {
  assert.equal(normalizePhone('300 123 4567'), '+573001234567');
  assert.equal(normalizePhone('+57 300-123-4567'), '+573001234567');
  assert.equal(normalizePhone('573001234567'), '+573001234567');
  assert.equal(normalizePhone('+1 305 555 0101'), '+13055550101');
  assert.equal(normalizePhone('6051234567'), null);
  assert.equal(normalizePhone('12345'), null);
  // otros países con el selector de indicativo
  assert.equal(normalizePhone('612 345 678', '34'), '+34612345678');
  assert.equal(normalizePhone('34612345678', '34'), '+34612345678');
  assert.equal(normalizePhone('61234567', '34'), null);
  assert.equal(normalizePhone('(305) 555-0101', '1'), '+13055550101');
  assert.equal(normalizePhone('07911 123456', '44'), '+447911123456');
  assert.equal(normalizePhone('11 2345 6789', '54'), '+5491123456789');
  assert.equal(normalizePhone('55 1234 5678', '52'), '+525512345678');
  assert.equal(normalizePhone('6123 4567', '507'), '+50761234567');
  assert.equal(normalizePhone('0412 123 4567', '58'), '+584121234567');
  assert.equal(normalizePhone('+34 612 345 678', '57'), '+34612345678');
  assert.equal(normalizePhone('300 123 4567', '34'), null);
});
test('correo', () => {
  assert.equal(validEmail('ana@correo.co'), true);
  assert.equal(validEmail('ana@correo'), false);
});
test('registro para la base de datos: completo y con prioridad', () => {
  const r = leadRecord({ service: 'vivienda', stage: 'lote', size: 'xs', location: 'colombia', timing: 'luego' }, { name: ' Ana Pérez ', phone: '3001234567', email: 'Ana@Correo.co' }, { ref: 'GZ-AAAAA-4', status: 'completo', cta: 'hero', page: '/', attribution: { last_source: 'google' } });
  assert.equal(r.encaja, 'no');
  assert.equal(r.motivo, 'too_small');
  assert.equal(r.whatsapp, '+573001234567');
  assert.equal(r.correo, 'ana@correo.co');
  assert.equal(r.nombre, 'Ana Pérez');
  assert.equal(r.last_source, 'google');
});
test('mensaje con nombre', () => {
  assert.match(messageWithName({ service: 'vivienda' }, 'Ana Pérez', 'GZ-AAAAA-1'), /^Hola, Galezo Studio\. Soy Ana\. Quiero cotizar/);
});

test('atribución: los parámetros de anuncio sí pasan a la medición', () => {
  const out = sanitize({ first_content: 'video-a', last_term: 'diseño casa campestre', ttclid: 'x', fbp: 'fb.1.1.2', fbc: 'fb.1.3.abc' });
  assert.deepEqual(Object.keys(out).sort(), ['fbc', 'fbp', 'first_content', 'last_term', 'ttclid']);
});
