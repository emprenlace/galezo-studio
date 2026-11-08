/**
 * Indicativos telefónicos de todos los países y territorios (UIT), para el WhatsApp del cotizador.
 * El nombre sale del navegador en español (Intl.DisplayNames), así no hay que mantener una lista de nombres.
 * Los del plan norteamericano (+1) se distinguen por el código de área que escribe la persona.
 */
const DIAL: Record<string, string> = {
  AF: '93', AX: '358', AL: '355', DZ: '213', AS: '1', AD: '376', AO: '244', AI: '1', AG: '1', AR: '54', AM: '374', AW: '297',
  AU: '61', AT: '43', AZ: '994', BS: '1', BH: '973', BD: '880', BB: '1', BY: '375', BE: '32', BZ: '501', BJ: '229', BM: '1',
  BT: '975', BO: '591', BQ: '599', BA: '387', BW: '267', BR: '55', VG: '1', BN: '673', BG: '359', BF: '226', BI: '257',
  KH: '855', CM: '237', CA: '1', CV: '238', KY: '1', CF: '236', TD: '235', CL: '56', CN: '86', CX: '61', CC: '61', CO: '57',
  KM: '269', CG: '242', CD: '243', CK: '682', CR: '506', CI: '225', HR: '385', CU: '53', CW: '599', CY: '357', CZ: '420',
  DK: '45', DJ: '253', DM: '1', DO: '1', EC: '593', EG: '20', SV: '503', GQ: '240', ER: '291', EE: '372', SZ: '268',
  ET: '251', FK: '500', FO: '298', FJ: '679', FI: '358', FR: '33', GF: '594', PF: '689', GA: '241', GM: '220', GE: '995',
  DE: '49', GH: '233', GI: '350', GR: '30', GL: '299', GD: '1', GP: '590', GU: '1', GT: '502', GG: '44', GN: '224',
  GW: '245', GY: '592', HT: '509', HN: '504', HK: '852', HU: '36', IS: '354', IN: '91', ID: '62', IR: '98', IQ: '964',
  IE: '353', IM: '44', IL: '972', IT: '39', JM: '1', JP: '81', JE: '44', JO: '962', KZ: '7', KE: '254', KI: '686', XK: '383',
  KW: '965', KG: '996', LA: '856', LV: '371', LB: '961', LS: '266', LR: '231', LY: '218', LI: '423', LT: '370', LU: '352',
  MO: '853', MG: '261', MW: '265', MY: '60', MV: '960', ML: '223', MT: '356', MH: '692', MQ: '596', MR: '222', MU: '230',
  YT: '262', MX: '52', FM: '691', MD: '373', MC: '377', MN: '976', ME: '382', MS: '1', MA: '212', MZ: '258', MM: '95',
  NA: '264', NR: '674', NP: '977', NL: '31', NC: '687', NZ: '64', NI: '505', NE: '227', NG: '234', NU: '683', NF: '672',
  KP: '850', MK: '389', MP: '1', NO: '47', OM: '968', PK: '92', PW: '680', PS: '970', PA: '507', PG: '675', PY: '595',
  PE: '51', PH: '63', PL: '48', PT: '351', PR: '1', QA: '974', RE: '262', RO: '40', RU: '7', RW: '250', BL: '590', SH: '290',
  KN: '1', LC: '1', MF: '590', PM: '508', VC: '1', WS: '685', SM: '378', ST: '239', SA: '966', SN: '221', RS: '381',
  SC: '248', SL: '232', SG: '65', SX: '1', SK: '421', SI: '386', SB: '677', SO: '252', ZA: '27', KR: '82', SS: '211',
  ES: '34', LK: '94', SD: '249', SR: '597', SJ: '47', SE: '46', CH: '41', SY: '963', TW: '886', TJ: '992', TZ: '255',
  TH: '66', TL: '670', TG: '228', TK: '690', TO: '676', TT: '1', TN: '216', TR: '90', TM: '993', TC: '1', TV: '688',
  UG: '256', UA: '380', AE: '971', GB: '44', US: '1', UY: '598', VI: '1', UZ: '998', VU: '678', VA: '39', VE: '58',
  VN: '84', WF: '681', EH: '212', YE: '967', ZM: '260', ZW: '263',
};

/** Los que más cotizan: van arriba de la lista */
export const FRECUENTES = ['CO', 'ES', 'US', 'MX', 'PA'];

export const dialOf = (iso: string) => DIAL[iso] || '57';

export interface Pais { iso: string; dial: string; name: string }

/** Todos los países con su nombre en español, en orden alfabético */
export function paises(locale = 'es'): Pais[] {
  let dn: Intl.DisplayNames | null = null;
  try { dn = new Intl.DisplayNames([locale], { type: 'region' }); } catch { dn = null; }
  return Object.entries(DIAL)
    .map(([iso, dial]) => ({ iso, dial, name: dn?.of(iso) || iso }))
    .sort((x, y) => x.name.localeCompare(y.name, locale));
}

// Zona horaria → país, para preseleccionar el indicativo de quien visita desde fuera (sin pedir ubicación)
const TZ: Record<string, string> = {
  'America/Bogota': 'CO', 'Europe/Madrid': 'ES', 'Atlantic/Canary': 'ES', 'Africa/Ceuta': 'ES', 'America/Mexico_City': 'MX',
  'America/Monterrey': 'MX', 'America/Cancun': 'MX', 'America/Tijuana': 'MX', 'America/Merida': 'MX', 'America/Chihuahua': 'MX',
  'America/Hermosillo': 'MX', 'America/Mazatlan': 'MX', 'America/Panama': 'PA', 'America/Caracas': 'VE', 'America/Guayaquil': 'EC',
  'America/Lima': 'PE', 'America/Santiago': 'CL', 'America/Argentina/Buenos_Aires': 'AR', 'America/Buenos_Aires': 'AR',
  'America/Montevideo': 'UY', 'America/Asuncion': 'PY', 'America/La_Paz': 'BO', 'America/Costa_Rica': 'CR',
  'America/Guatemala': 'GT', 'America/El_Salvador': 'SV', 'America/Tegucigalpa': 'HN', 'America/Managua': 'NI',
  'America/Santo_Domingo': 'DO', 'America/Puerto_Rico': 'PR', 'America/Havana': 'CU', 'America/Aruba': 'AW', 'America/Curacao': 'CW',
  'America/Sao_Paulo': 'BR', 'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Montreal': 'CA',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Phoenix': 'US', 'America/Los_Angeles': 'US',
  'America/Anchorage': 'US', 'Pacific/Honolulu': 'US', 'America/Detroit': 'US', 'America/Indiana/Indianapolis': 'US',
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Lisbon': 'PT', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT',
  'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
};

/**
 * País por defecto, sin pedir ubicación: 1) la zona horaria del visitante (la más confiable: un colombiano con el
 * teléfono en inglés sigue en America/Bogota); 2) si la zona no está en la tabla, la región del idioma del teléfono
 * (ja-JP → Japón); 3) Colombia.
 */
export function paisPorDefecto(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const iso = TZ[tz];
    if (iso && DIAL[iso]) return iso;
    if (!tz.startsWith('America/')) {
      for (const l of navigator.languages || [navigator.language]) {
        const r = l.split('-')[1]?.toUpperCase();
        if (r && r.length === 2 && DIAL[r]) return r;
      }
    }
  } catch { /* sin Intl: Colombia */ }
  return 'CO';
}
