/**
 * Medición: un solo `track()` hacia el dataLayer.
 * - Solo viajan parámetros de la lista de permitidos (nada de texto libre ni datos de contacto).
 * - Cada push vacía las claves del evento anterior (GTM las recuerda entre eventos).
 * - Los eventos de lead llevan la atribución guardada (primer y último toque).
 */
type Params = Record<string, string | number | boolean | undefined>;

export const ALLOWED = [
  'cta_id',
  'service_id',
  'step',
  'answer',
  'stage',
  'size',
  'location',
  'timing',
  'lead_quality',
  'lead_ref',
  'lead_value',
  'event_id',
  'shared_details',
  'reason',
  'link_type',
  'first_source',
  'first_medium',
  'first_campaign',
  'first_content',
  'first_term',
  'last_source',
  'last_medium',
  'last_campaign',
  'last_content',
  'last_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'ttclid',
  'fbp',
  'fbc',
  'landing_page',
] as const;
const allowed = new Set<string>(ALLOWED);
let lastKeys: string[] = [];

/** Deja solo los parámetros permitidos y con valor. */
export function sanitize(params: Params): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) if (allowed.has(k) && v !== undefined && v !== '') out[k] = v;
  return out;
}

export function track(event: string, params: Params = {}) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const clean = sanitize(params);
  const reset: Record<string, undefined> = {};
  for (const k of lastKeys) if (!(k in clean)) reset[k] = undefined;
  w.dataLayer.push({ event, ...reset, ...clean });
  lastKeys = Object.keys(clean);
}

// ---------- Atribución (primer y último toque) ----------
const KEY = 'gz_attr';
const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid'] as const;
interface Touch {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landing: string;
  ids: Record<string, string>;
  at: number;
}

export function captureAttribution() {
  try {
    const u = new URL(location.href);
    const q = u.searchParams;
    const ids: Record<string, string> = {};
    for (const k of CLICK_IDS) if (q.get(k)) ids[k] = q.get(k)!;
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    const external = ref && ref !== location.hostname;
    const hasUtm = q.get('utm_source');
    if (!hasUtm && !Object.keys(ids).length && !external) return; // navegación interna: no cambia el toque
    const touch: Touch = {
      source: q.get('utm_source') || (ids.gclid || ids.gbraid || ids.wbraid ? 'google' : ids.fbclid ? 'facebook' : ref || '(direct)'),
      medium: q.get('utm_medium') || (ids.gclid || ids.gbraid || ids.wbraid || ids.fbclid ? 'cpc' : external ? 'referral' : '(none)'),
      campaign: q.get('utm_campaign') || '',
      content: q.get('utm_content') || '',
      term: q.get('utm_term') || '',
      landing: u.pathname,
      ids,
      at: Date.now(),
    };
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    localStorage.setItem(KEY, JSON.stringify({ first: saved.first || touch, last: touch }));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export function attribution(): Params {
  try {
    const { first, last } = JSON.parse(localStorage.getItem(KEY) || '{}') as { first?: Touch; last?: Touch };
    const t = last || first;
    const { fbp, fbc } = metaCookies(t?.ids.fbclid, t?.at);
    return {
      first_source: first?.source,
      first_medium: first?.medium,
      first_campaign: first?.campaign,
      first_content: first?.content,
      first_term: first?.term,
      last_source: t?.source,
      last_medium: t?.medium,
      last_campaign: t?.campaign,
      last_content: t?.content,
      last_term: t?.term,
      gclid: t?.ids.gclid,
      gbraid: t?.ids.gbraid,
      wbraid: t?.ids.wbraid,
      fbclid: t?.ids.fbclid,
      ttclid: t?.ids.ttclid,
      fbp,
      fbc,
      landing_page: first?.landing,
    };
  } catch {
    return {};
  }
}

/** Cookies de Meta para la coincidencia de la API de Conversiones: _fbp (navegador) y _fbc (clic).
 *  Si llegó con fbclid y el píxel aún no creó _fbc, se arma con el formato de Meta: fb.1.<marca de tiempo>.<fbclid>. */
export function metaCookies(fbclid?: string, at?: number) {
  const ck = (n: string) => document.cookie.split('; ').find((x) => x.startsWith(n + '='))?.split('=')[1];
  const fbp = ck('_fbp');
  const fbc = ck('_fbc') || (fbclid ? `fb.1.${at || Date.now()}.${fbclid}` : undefined);
  return { fbp, fbc };
}
