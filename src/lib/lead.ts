/**
 * Lógica del chat calificador (sin DOM, probada en tests/lead.test.ts).
 * Pasos: servicio (si el botón no lo trae) → etapa → tamaño → ubicación → cuándo (solo si encaja) → detalle opcional.
 * No encaja: "solo estoy averiguando", o una casa nueva de menos de 60 m² (difícil llegar al valor mínimo del diseño).
 */
export type ServiceId = 'campestre' | 'urbana' | 'remodelacion' | 'interiores' | 'comercial';
export type Stage = 'lote' | 'buscando' | 'existente' | 'averiguando';
export type Size = 'xs' | 's' | 'm' | 'l';
export type Place = 'cesar' | 'colombia' | 'exterior';
export type Timing = 'ya' | 'pronto' | 'luego';

export interface Answers {
  service?: ServiceId;
  stage?: Stage;
  size?: Size;
  location?: Place;
  timing?: Timing;
  details?: string;
}

export const SERVICES: { id: ServiceId; label: string; noun: string }[] = [
  { id: 'campestre', label: 'Casa campestre', noun: 'una casa campestre' },
  { id: 'urbana', label: 'Casa urbana', noun: 'una casa urbana' },
  { id: 'remodelacion', label: 'Remodelación o ampliación', noun: 'la remodelación o ampliación de mi casa' },
  { id: 'interiores', label: 'Diseño de interiores', noun: 'el diseño interior de mi espacio' },
  { id: 'comercial', label: 'Local comercial', noun: 'un local comercial' },
];

export const STAGES: { id: Stage; label: string; text: string }[] = [
  { id: 'lote', label: 'Ya tengo el lote', text: 'ya tengo el lote' },
  { id: 'existente', label: 'Mi casa o local ya existe', text: 'el espacio ya existe' },
  { id: 'buscando', label: 'Estoy buscando lote', text: 'estoy buscando lote' },
  { id: 'averiguando', label: 'Solo estoy averiguando', text: 'por ahora estoy averiguando' },
];

/** Etapas que tienen sentido para cada servicio. */
export function stagesFor(s?: ServiceId) {
  const ids: Stage[] = s === 'remodelacion' || s === 'interiores' ? ['existente', 'averiguando'] : ['lote', 'buscando', 'averiguando'];
  return STAGES.filter((x) => ids.includes(x.id));
}

export const SIZES: { id: Size; label: string; text: string }[] = [
  { id: 'xs', label: 'Menos de 60 m²', text: 'de menos de 60 m²' },
  { id: 's', label: '60 a 150 m²', text: 'de unos 60 a 150 m²' },
  { id: 'm', label: '150 a 300 m²', text: 'de unos 150 a 300 m²' },
  { id: 'l', label: 'Más de 300 m²', text: 'de más de 300 m²' },
];

export const PLACES: { id: Place; label: string; text: string }[] = [
  { id: 'cesar', label: 'Valledupar o el Cesar', text: 'en Valledupar o el Cesar' },
  { id: 'colombia', label: 'Otra ciudad de Colombia', text: 'en otra ciudad de Colombia' },
  { id: 'exterior', label: 'Fuera de Colombia', text: 'fuera de Colombia' },
];

export const TIMINGS: { id: Timing; label: string; text: string }[] = [
  { id: 'ya', label: 'Este mes', text: 'empezar este mes' },
  { id: 'pronto', label: 'En 1 a 3 meses', text: 'empezar en uno a tres meses' },
  { id: 'luego', label: 'Más adelante', text: 'empezar más adelante' },
];

/** Obra nueva: el tamaño filtra. En remodelación e interiores el área intervenida suele ser pequeña: no filtra. */
const isNewBuild = (s?: ServiceId) => s === 'campestre' || s === 'urbana' || s === 'comercial';

export function fits(a: Answers): { ok: boolean; reason?: 'exploring' | 'too_small' } {
  if (a.stage === 'averiguando') return { ok: false, reason: 'exploring' };
  if (a.size === 'xs' && isNewBuild(a.service)) return { ok: false, reason: 'too_small' };
  return { ok: true };
}

/** Prioridad 1 (A) a 3 (C); 4 = no encaja. */
export function quality(a: Answers): 1 | 2 | 3 | 4 {
  if (!fits(a).ok) return 4;
  let pts = 0;
  pts += a.stage === 'lote' || a.stage === 'existente' ? 3 : 1;
  pts += a.size === 'l' ? 3 : a.size === 'm' ? 2 : 1;
  pts += a.timing === 'ya' ? 3 : a.timing === 'pronto' ? 2 : 0;
  return pts >= 8 ? 1 : pts >= 5 ? 2 : 3;
}
export const QUALITY_LABEL = { 1: 'A', 2: 'B', 3: 'C', 4: 'no_encaja' } as const;
/** Valor orientativo para la pauta (no es el precio del diseño). */
export const QUALITY_VALUE = { 1: 3, 2: 2, 3: 1, 4: 0 } as const;

/** Código aleatorio por conversación + prioridad: GZ-7K3P2-1 */
export function makeRef(q: number, rnd: () => number = Math.random) {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += abc[Math.floor(rnd() * abc.length)];
  return `GZ-${code}-${q}`;
}

const pick = <T extends { id: string; text?: string; noun?: string }>(list: T[], id?: string) => list.find((x) => x.id === id);

/** Mensaje para WhatsApp, en prosa, como lo escribiría una persona. */
export function message(a: Answers, ref: string) {
  const sv = pick(SERVICES, a.service);
  const st = pick(STAGES, a.stage);
  const sz = pick(SIZES, a.size);
  const pl = pick(PLACES, a.location);
  const tm = pick(TIMINGS, a.timing);
  const parts: string[] = [];
  parts.push(`Hola, Galezo Studio. Quiero cotizar el diseño de ${sv ? sv.noun : 'mi proyecto'}.`);
  const what = [st?.text, sz ? `el área es ${sz.text}` : '', pl ? `la obra sería ${pl.text}` : ''].filter(Boolean);
  if (what.length) parts.push(capital(joinEs(what)) + '.');
  if (tm) parts.push(`Me gustaría ${tm.text}.`);
  if (a.details?.trim()) parts.push(a.details.trim().replace(/\s+/g, ' ').slice(0, 400) + (/[.!?]$/.test(a.details.trim()) ? '' : '.'));
  parts.push(`Ref: ${ref}`);
  return parts.join(' ');
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

function joinEs(xs: string[]) {
  return xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`;
}
function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- Contacto (formulario) ----------
export interface Contact {
  name: string;
  phone: string;
  email: string;
}

/** Celular colombiano (10 dígitos que empiezan por 3) o número internacional con +. Devuelve E.164 o null. */
export function normalizePhone(raw: string): string | null {
  const t = raw.trim();
  const digits = t.replace(/\D/g, '');
  if (t.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  if (/^3\d{9}$/.test(digits)) return `+57${digits}`;
  if (/^573\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const validName = (n: string) => n.trim().length >= 2;

/** Fila para la base de datos (Google Sheets). Aquí sí van los datos de contacto; nunca al dataLayer. */
export function leadRecord(a: Answers, c: Contact, meta: { ref: string; status: 'completo' | 'parcial'; cta: string; page: string; attribution: Record<string, unknown> }) {
  const q = quality(a);
  const f = fits(a);
  return {
    ref: meta.ref,
    estado: meta.status,
    calidad: QUALITY_LABEL[q],
    encaja: f.ok ? 'sí' : 'no',
    motivo: f.reason || '',
    nombre: c.name.trim(),
    whatsapp: normalizePhone(c.phone) || c.phone.trim(),
    correo: c.email.trim().toLowerCase(),
    servicio: pick(SERVICES, a.service)?.label || '',
    etapa: pick(STAGES, a.stage)?.label || '',
    tamano: pick(SIZES, a.size)?.label || '',
    ubicacion: pick(PLACES, a.location)?.label || '',
    cuando: pick(TIMINGS, a.timing)?.label || '',
    detalles: (a.details || '').trim().slice(0, 600),
    boton: meta.cta,
    pagina: meta.page,
    ...meta.attribution,
  };
}

/** Mensaje de WhatsApp con el nombre de quien escribe. */
export function messageWithName(a: Answers, name: string, ref: string) {
  const first = name.trim().split(/\s+/)[0];
  const m = message(a, ref);
  return first ? m.replace('Hola, Galezo Studio.', `Hola, Galezo Studio. Soy ${first}.`) : m;
}
