/**
 * Boceto a mano de la casa campestre, generado al compilar (cero JavaScript en el navegador).
 *
 * Se proyecta un modelo simple de la casa en perspectiva a dos puntos (cámara a la altura de los ojos,
 * verticales paralelas, como se dibuja a mano) y cada arista se traza con pulso de lápiz:
 * pequeñas desviaciones, trazos que se pasan de las esquinas y líneas de construcción hacia los puntos de fuga.
 * El sombreado se hace con achurado en 3D, así respeta la perspectiva.
 *
 * Cada trazo lleva su momento de aparición (--d) y duración (--t) para animarlo con CSS.
 */

type V3 = [number, number, number];
type V2 = [number, number];

export interface Stroke {
  d: string;
  /** retraso en segundos */
  at: number;
  /** duración en segundos */
  dur: number;
  w: number;
  o: number;
  kind: 'cons' | 'edge' | 'hatch' | 'tree' | 'ground' | 'note' | 'fill' | 'wash' | 'people' | 'scene';
  /** color de relleno (solo aguadas) */
  fill?: string;
}

/** Tramo que recorre el lápiz: segmentos [x1,y1,x2,y2,...] dibujados entre at y at+dur. */
export interface RouteStep {
  a: number;
  d: number;
  s: number[];
}

export interface Note {
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  at: number;
  arrow?: string;
  id?: string;
}

export type MatId = 'madera' | 'concreto' | 'piedra' | 'vidrio';
export interface Material {
  wash: { d: string; fill: string; o: number };
  /** capas extra sobre la textura (luz y sombra del sol) */
  over?: { d: string; fill: string; o: number }[];
  lines: { d: string; w: number; o: number }[];
}

/** Casa pintada: polígonos con material (color, textura o degradado) en la misma perspectiva del boceto. */
export interface Paint {
  d: string;
  fill: string;
  o: number;
}
export type TexImg = 'deck' | 'techo' | 'listones' | 'concreto' | 'piedra';
/** Textura proyectada sobre una cara: módulo de tw × th metros, matriz afín del plano a la lámina. */
export interface Tex {
  id: string;
  img: TexImg;
  tw: number;
  th: number;
  m: number[];
}
export interface Grad {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: [number, string, number][];
}

export interface Sketch {
  w: number;
  h: number;
  strokes: Stroke[];
  notes: Note[];
  route: RouteStep[];
  rest: V2;
  backWash: Stroke[];
  frontWash: Stroke[];
  /** Acabados intercambiables de la fachada del volumen privado (solo en la versión panorámica) */
  mats?: Record<MatId, Material>;
  matAnchor?: V2;
}

// ---------- utilidades ----------
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};
const f1 = (n: number) => Math.round(n * 10) / 10;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- modelo ----------
export interface Box {
  x: number;
  z: number;
  y: number; // base
  w: number;
  h: number;
  d: number;
  order: number; // fase de dibujo
  hatch?: 'glass' | 'soffit' | 'deck' | 'water';
  cons?: boolean; // genera líneas de construcción
}

export const FLOOR = 0.45;
export const DECK = 0.5;

export const BOXES: Box[] = [
  { x: 0, z: 0.25, y: 0, w: 25, h: FLOOR, d: 16.5, order: 0, cons: true }, // plataforma
  { x: -4, z: -4, y: FLOOR, w: 14, h: 3.2, d: 6, order: 1, cons: true }, // volumen social
  { x: 7, z: -2.4, y: FLOOR, w: 6.2, h: 3.6, d: 10.2, order: 1.2, cons: true }, // volumen privado
  { x: -4.2, z: -2.1, y: FLOOR + 3.2, w: 16.4, h: 0.32, d: 11.6, order: 2, hatch: 'soffit', cons: true }, // cubierta A
  { x: 7, z: -2.0, y: FLOOR + 3.6, w: 7.4, h: 0.32, d: 11.4, order: 2.2, hatch: 'soffit', cons: true }, // cubierta B
  ...[0, 1, 2, 3].map((i) => ({ x: -10.8 + i * 4.4, z: 3.1, y: DECK, w: 0.22, h: 2.7, d: 0.22, order: 2.6 })), // columnas
  // escalones de acceso
  { x: -6.5, z: 8.95, y: 0, w: 4.2, h: 0.15, d: 0.4, order: 2.8 },
  { x: -6.5, z: 8.75, y: 0.15, w: 4.2, h: 0.15, d: 0.4, order: 2.85 },
];

/** Planos con achurado: vidrio de la fachada, deck y agua de la piscina. */
export interface Plane {
  o: V3;
  u: V3;
  v: V3;
  hatch: 'glass' | 'deck' | 'water' | 'louvre';
  order: number;
}
export const PLANES: Plane[] = [
  { o: [-10.8, FLOOR, -0.98], u: [13.6, 0, 0], v: [0, 3.0, 0], hatch: 'glass', order: 3 },
  { o: [-12.2, DECK, -0.7], u: [24.4, 0, 0], v: [0, 0, 8.9], hatch: 'deck', order: 3.2 },
  { o: [-0.8, DECK + 0.01, 4.1], u: [10, 0, 0], v: [0, 0, 3.1], hatch: 'water', order: 3.4 },
  { o: [3.95, DECK, 2.95], u: [6.1, 0, 0], v: [0, 3.4, 0], hatch: 'louvre', order: 3.1 },
];

// ---------- cámara ----------
export function buildSketch(opts: { w?: number; h?: number; seed?: number; fit?: [number, number, number, number]; tall?: boolean; id?: string } = {}): Sketch {
  const W = opts.w ?? 1500;
  const H = opts.h ?? 1000;
  const rnd = rng(opts.seed ?? 7);
  const jit = (k: number) => (rnd() * 2 - 1) * k;

  // Ojo a 1,9 m mirando en horizontal: verticales paralelas (perspectiva a dos puntos)
  const az = (-40 * Math.PI) / 180;
  const dist = 27;
  const eye: V3 = [Math.sin(az) * dist + 1.5, 2.7, Math.cos(az) * dist + 1];
  const fwd = norm([-eye[0] + 1.5, 0, -eye[2] + 0.5]);
  const right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const raw = (p: V3): V2 => {
    const q = sub(p, eye);
    const z = dot(q, fwd);
    return [dot(q, right) / z, -dot(q, up) / z];
  };

  // Encaje: se ajusta la casa al lienzo con margen
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const corners = (b: Box): V3[] => {
    const xs = [b.x - b.w / 2, b.x + b.w / 2];
    const ys = [b.y, b.y + b.h];
    const zs = [b.z - b.d / 2, b.z + b.d / 2];
    const out: V3[] = [];
    for (const x of xs) for (const y of ys) for (const z of zs) out.push([x, y, z]);
    return out;
  };
  for (const c of BOXES.flatMap(corners))
    {
      const [x, y] = raw(c);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  // La casa encaja en un rectángulo del lienzo (fracciones), apoyada en su borde inferior
  const [fx0, fy0, fx1, fy1] = opts.fit ?? [0.05, 0.13, 0.95, 0.87];
  const s = Math.min((W * (fx1 - fx0)) / (maxX - minX), (H * (fy1 - fy0)) / (maxY - minY));
  const ox = (W * (fx0 + fx1)) / 2 - ((minX + maxX) / 2) * s;
  const oy = H * fy1 - maxY * s;
  const P = (p: V3): V2 => {
    const [x, y] = raw(p);
    return [x * s + ox, y * s + oy];
  };

  const strokes: Stroke[] = [];
  const back: Stroke[] = []; // detrás de todo: aguadas de cielo y suelo, montañas
  const route: RouteStep[] = [];

  /** Línea a pulso: se pasa un poco de los extremos y se curva apenas en el medio. */
  const handLine = (a: V2, b: V2, over = 6, wob = 1.1): string => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const o1 = rnd() * over;
    const o2 = rnd() * over;
    const A: V2 = [a[0] - ux * o1 + jit(0.6), a[1] - uy * o1 + jit(0.6)];
    const B: V2 = [b[0] + ux * o2 + jit(0.6), b[1] + uy * o2 + jit(0.6)];
    const m: V2 = [(A[0] + B[0]) / 2 - uy * jit(wob), (A[1] + B[1]) / 2 + ux * jit(wob)];
    return `M${f1(A[0])} ${f1(A[1])}Q${f1(m[0])} ${f1(m[1])} ${f1(B[0])} ${f1(B[1])}`;
  };

  // Caras de una caja con su normal
  const faces = (b: Box) => {
    const x0 = b.x - b.w / 2;
    const x1 = b.x + b.w / 2;
    const y0 = b.y;
    const y1 = b.y + b.h;
    const z0 = b.z - b.d / 2;
    const z1 = b.z + b.d / 2;
    return [
      { n: [0, 0, 1] as V3, p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] as V3[] },
      { n: [0, 0, -1] as V3, p: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]] as V3[] },
      { n: [1, 0, 0] as V3, p: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]] as V3[] },
      { n: [-1, 0, 0] as V3, p: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]] as V3[] },
      { n: [0, 1, 0] as V3, p: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] as V3[] },
      { n: [0, -1, 0] as V3, p: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] as V3[] },
    ];
  };
  const visible = (f: { n: V3; p: V3[] }) => {
    const c = mul(f.p.reduce((a, b) => add(a, b), [0, 0, 0] as V3), 0.25);
    return dot(f.n, sub(eye, c)) > 0;
  };
  const sun = norm([0.55, 0.75, 0.35]);

  // Achurado en 3D sobre un paralelogramo o: origen, u y v: lados
  const hatch3 = (o: V3, u: V3, v: V3, step: number, along: 'u' | 'v' | 'diag', extra = 0): string => {
    const parts: string[] = [];
    const lu = Math.hypot(...u);
    const lv = Math.hypot(...v);
    if (along === 'u') {
      const n = Math.max(1, Math.floor(lv / step));
      for (let i = 1; i < n; i++) {
        const t = i / n + jit(0.15 / n);
        const a = add(o, mul(v, t));
        const b = add(a, u);
        parts.push(handLine(P(a), P(b), 2 + extra, 0.6));
      }
    } else if (along === 'v') {
      const n = Math.max(1, Math.floor(lu / step));
      for (let i = 1; i < n; i++) {
        const t = i / n + jit(0.15 / n);
        const a = add(o, mul(u, t));
        const b = add(a, v);
        parts.push(handLine(P(a), P(b), 2 + extra, 0.6));
      }
    } else {
      const n = Math.max(2, Math.floor((lu + lv) / step));
      for (let i = 1; i < n; i++) {
        const t = (i / n) * 2 - 1; // desplazamiento en v
        const s0 = Math.max(0, t);
        const s1 = Math.min(1, 1 + t);
        if (s1 - s0 < 0.02) continue;
        const a = add(add(o, mul(u, s0)), mul(v, s0 - t));
        const b = add(add(o, mul(u, s1)), mul(v, s1 - t));
        parts.push(handLine(P(a), P(b), 1.5, 0.5));
      }
    }
    return parts.join('');
  };

  // ---------- suelo: líneas de piso en perspectiva, que se desvanecen ----------
  {
    const g: string[] = [];
    for (let i = 0; i < 6; i++) {
      const z = 10 + i * 2.6;
      g.push(handLine(P([-30 + rnd() * 4, 0, z]), P([28 - rnd() * 5, 0, z]), 10, 1.5));
    }
    for (let i = 0; i < 6; i++) {
      const x = -12 + i * 4.6;
      g.push(handLine(P([x, 0, 9.2]), P([x - 0.3, 0, 12 + rnd() * 5]), 6, 1.5));
    }
    // línea de borde del lote hacia los lados
    g.push(handLine(P([-34, 0, 3]), P([-12.6, 0, 3]), 6, 2), handLine(P([12.6, 0, -6]), P([36, 0, -6]), 6, 2));
    strokes.push({ d: g.join(''), at: 1.0, dur: 1.2, w: 0.7, o: 0.32, kind: 'ground' });
  }

  // ---------- cajas: pintor (de atrás hacia adelante): relleno de papel + aristas ----------
  const sorted = [...BOXES].sort((a, b) => {
    const da = Math.hypot(...sub([a.x, a.y + a.h / 2, a.z], eye));
    const db = Math.hypot(...sub([b.x, b.y + b.h / 2, b.z], eye));
    return db - da;
  });
  const consLines: string[] = [];
  for (const b of sorted) {
    const vf = faces(b).filter(visible);
    const fill = vf.map((f) => 'M' + f.p.map((p) => P(p).map(f1).join(' ')).join('L') + 'Z').join('');
    strokes.push({ d: fill, at: 0, dur: 0, w: 0, o: 1, kind: 'fill' });

    // aristas únicas de las caras visibles
    const seen = new Set<string>();
    const edges: string[] = [];
    const segs: number[] = [];
    for (const f of vf) {
      for (let i = 0; i < 4; i++) {
        const a = f.p[i];
        const c = f.p[(i + 1) % 4];
        const k = [a.join(), c.join()].sort().join('|');
        if (seen.has(k)) continue;
        seen.add(k);
        const big = b.w > 2 || b.d > 2;
        edges.push(handLine(P(a), P(c), big ? 9 : 3, big ? 1.4 : 0.5));
        if (big) segs.push(...P(a), ...P(c));
        // doble pasada en las aristas principales, como un trazo repasado
        if (big && rnd() < 0.45) edges.push(handLine(P(a), P(c), 4, 1.8));
        // líneas de construcción: prolongaciones largas y tenues
        if (b.cons && rnd() < 0.55) {
          const A = P(a);
          const C = P(c);
          const dx = C[0] - A[0];
          const dy = C[1] - A[1];
          const k1 = 0.25 + rnd() * 0.6;
          consLines.push(handLine([A[0] - dx * k1, A[1] - dy * k1], [C[0] + dx * k1 * 0.6, C[1] + dy * k1 * 0.6], 0, 2));
        }
      }
      // sombreado diagonal en las caras que no ve el sol
      if (b.w > 1 && b.h > 1 && dot(f.n, sun) < 0.1 && f.n[1] === 0) {
        const [o, p1, , p3] = f.p;
        strokes.push({ d: hatch3(o, sub(p1, o), sub(p3, o), 0.55, 'diag'), at: 2.3 + b.order * 0.1, dur: 0.9, w: 0.55, o: 0.5, kind: 'hatch' });
      }
    }
    strokes.push({ d: edges.join(''), at: 0.35 + b.order * 0.32, dur: b.w > 2 ? 0.9 : 0.35, w: b.w > 2 ? 1.5 : 1.1, o: 0.92, kind: 'edge' });
    if (segs.length) route.push({ a: 0.35 + b.order * 0.32, d: 0.9, s: segs.map(f1) });

    // achurado del alero (cara inferior visible desde la altura de los ojos)
    if (b.hatch === 'soffit') {
      const x0 = b.x - b.w / 2;
      const z0 = b.z - b.d / 2;
      strokes.push({
        d: hatch3([x0, b.y, z0], [b.w, 0, 0], [0, 0, b.d], 0.28, 'u'),
        at: 1.9 + b.order * 0.1,
        dur: 1.0,
        w: 0.6,
        o: 0.55,
        kind: 'hatch',
      });
    }
  }

  // ---------- planos: vidrio, deck, agua, celosía ----------
  for (const pl of PLANES) {
    const o = pl.o;
    if (pl.hatch === 'glass') {
      // parteluces + reflejos diagonales + sombra del alero en la parte alta
      const mull: string[] = [];
      for (let i = 0; i <= 8; i++) {
        const a = add(o, [i * 1.7, 0, 0]);
        mull.push(handLine(P(a), P(add(a, pl.v)), 2, 0.4));
      }
      strokes.push({ d: mull.join(''), at: 2.0, dur: 0.6, w: 1.05, o: 0.9, kind: 'edge' });
      strokes.push({ d: hatch3(o, pl.u, pl.v, 0.12, 'v'), at: 2.4, dur: 1.1, w: 0.45, o: 0.42, kind: 'hatch' });
      strokes.push({ d: hatch3(add(o, [0, 2.2, 0]), pl.u, [0, 0.8, 0], 0.09, 'u'), at: 2.7, dur: 0.8, w: 0.5, o: 0.55, kind: 'hatch' });
      // reflejos: pocos trazos diagonales cortos
      const refl: string[] = [];
      for (let i = 0; i < 7; i++) {
        const t = 0.08 + i * 0.13 + jit(0.03);
        const a = add(o, add(mul(pl.u, t), [0, 0.4, 0]));
        const b2 = add(a, [0.9, 1.6, 0]);
        refl.push(handLine(P(a), P(b2), 1, 0.4));
      }
      strokes.push({ d: refl.join(''), at: 2.9, dur: 0.5, w: 0.5, o: 0.35, kind: 'hatch' });
    } else if (pl.hatch === 'deck') {
      strokes.push({ d: hatch3(o, pl.u, pl.v, 0.42, 'u'), at: 2.1, dur: 1.0, w: 0.5, o: 0.32, kind: 'hatch' });
    } else if (pl.hatch === 'water') {
      const fill = 'M' + [o, add(o, pl.u), add(add(o, pl.u), pl.v), add(o, pl.v)].map((p) => P(p).map(f1).join(' ')).join('L') + 'Z';
      strokes.push({ d: fill, at: 0, dur: 0, w: 0, o: 1, kind: 'fill' });
      const edge = [o, add(o, pl.u), add(add(o, pl.u), pl.v), add(o, pl.v), o];
      const e: string[] = [];
      for (let i = 0; i < 4; i++) e.push(handLine(P(edge[i]), P(edge[i + 1]), 3, 0.6));
      strokes.push({ d: e.join(''), at: 1.9, dur: 0.6, w: 1.1, o: 0.9, kind: 'edge' });
      const waves: string[] = [];
      for (let i = 0; i < 16; i++) {
        const a = add(o, add(mul(pl.u, 0.06 + rnd() * 0.8), mul(pl.v, 0.1 + rnd() * 0.8)));
        waves.push(handLine(P(a), P(add(a, [0.7 + rnd() * 0.8, 0, 0])), 0, 0.8));
      }
      strokes.push({ d: waves.join(''), at: 2.8, dur: 0.6, w: 0.6, o: 0.5, kind: 'hatch' });
    } else if (pl.hatch === 'louvre') {
      continue; // la fachada es intercambiable (ver acabados)
      strokes.push({ d: hatch3(o, pl.u, pl.v, 0.47, 'v', 2), at: 2.2, dur: 0.8, w: 0.9, o: 0.75, kind: 'edge' });
    }
  }

  // ---------- líneas de construcción y fugas (encima, muy tenues) ----------
  {
    // hacia los puntos de fuga desde las esquinas principales
    const vpL = P(add(eye, mul(norm([-1, 0, 0]), 1e5)));
    const vpR = P(add(eye, mul(norm([0, 0, -1]), 1e5)));
    for (const c of [
      [-12.5, 0, 8.5],
      [-12.4, FLOOR + 3.52, 3.7],
      [12.5, 0, 8.5],
      [10.7, FLOOR + 3.92, 3.7],
      [-11, FLOOR + 3.2, -7],
    ] as V3[]) {
      const p = P(c);
      for (const vp of [vpL, vpR]) {
        const k = 0.18 + rnd() * 0.25;
        consLines.push(handLine(p, [p[0] + (vp[0] - p[0]) * k, p[1] + (vp[1] - p[1]) * k], 0, 1.5));
      }
    }
    strokes.push({ d: consLines.join(''), at: 0.05, dur: 1.1, w: 0.55, o: 0.3, kind: 'cons' });
    // línea de horizonte
    const hy = P(add(eye, mul(fwd, 1e5)))[1];
    strokes.push({ d: handLine([W * 0.04, hy], [W * 0.96, hy + jit(2)], 0, 2), at: 0.0, dur: 0.9, w: 0.6, o: 0.22, kind: 'cons' });
  }

  // ---------- árbol: ramas que crecen por niveles ----------
  const tree = (base: V3, height: number, at: number, scaleW = 1) => {
    const b2 = P(base);
    const top = P(add(base, [0, height, 0]));
    const len0 = (b2[1] - top[1]) * 0.4;
    // 5 niveles y ramificación contenida: misma silueta, ~70 % menos trazos (el árbol pesaba más que la casa)
    const levels: string[][] = [[], [], [], [], []];
    const grow = (x: number, y: number, ang: number, len: number, lv: number) => {
      if (lv >= levels.length || len < 6) return;
      const x2 = x + Math.cos(ang) * len;
      const y2 = y + Math.sin(ang) * len;
      levels[lv].push(handLine([x, y], [x2, y2], 0, len * 0.05));
      const n = lv === 0 ? 3 : lv < 3 ? 2 + (rnd() < 0.4 ? 1 : 0) : 2;
      for (let i = 0; i < n; i++) {
        const spread = 0.3 + rnd() * 0.4;
        const a = ang + (i - (n - 1) / 2) * spread + jit(0.25);
        grow(x2, y2, a, len * (0.62 + rnd() * 0.2), lv + 1);
      }
    };
    grow(b2[0], b2[1], -Math.PI / 2 + jit(0.05), len0, 0);
    levels.forEach((lv, i) => {
      if (!lv.length) return;
      strokes.push({ d: lv.join(''), at: at + i * 0.2, dur: 0.55, w: Math.max(0.5, (2.6 - i * 0.42) * scaleW), o: 0.85, kind: 'tree' });
    });
    // sombra del tronco en el piso
    strokes.push({ d: handLine([b2[0] - 4, b2[1] + 2], [b2[0] + 38 * scaleW, b2[1] + 6], 0, 1), at: at + 0.2, dur: 0.4, w: 0.6, o: 0.45, kind: 'hatch' });
  };
  tree([-14.6, 0, 6.6], 6.2, 1.6, 0.9);

  // ---------- notas a mano en azul ----------
  const notes: Note[] = [];
  const noteAt = (text: string, anchor: V3, dx: number, dy: number, at: number, align: Note['anchor'], id?: string) => {
    const a = P(anchor);
    const t: V2 = [a[0] + dx, a[1] + dy];
    const sx = t[0] + (align === 'end' ? 8 : align === 'start' ? -8 : 0);
    const sy = t[1] + (dy < 0 ? 10 : -22);
    const c: V2 = [(sx + a[0]) / 2 + jit(10), Math.min(sy, a[1]) - 12];
    // flecha: curva + punta
    const ang = Math.atan2(a[1] - c[1], a[0] - c[0]);
    const h1: V2 = [a[0] - Math.cos(ang - 0.45) * 10, a[1] - Math.sin(ang - 0.45) * 10];
    const h2: V2 = [a[0] - Math.cos(ang + 0.45) * 10, a[1] - Math.sin(ang + 0.45) * 10];
    const arrow = `M${f1(sx)} ${f1(sy)}Q${f1(c[0])} ${f1(c[1])} ${f1(a[0])} ${f1(a[1])}M${f1(h1[0])} ${f1(h1[1])}L${f1(a[0])} ${f1(a[1])}L${f1(h2[0])} ${f1(h2[1])}`;
    notes.push({ text, x: f1(t[0]), y: f1(t[1]), anchor: align, at, arrow, id });
  };
  if (opts.tall) {
    noteAt('voladizo', [-9.5, FLOOR + 3.2, 3.7], -10, -95, 3.1, 'middle');
    noteAt('vidrio piso a techo', [-3.5, FLOOR + 1.6, -0.95], 150, -215, 3.3, 'middle');
    noteAt('celosía en madera', [8.6, DECK + 2.2, 2.95], 30, -112, 3.5, 'end', 'mat');
  } else {
    noteAt('voladizo', [-9.5, FLOOR + 3.2, 3.7], 40, -120, 3.1, 'middle');
    noteAt('vidrio piso a techo', [-3.5, FLOOR + 1.6, -0.95], 90, -190, 3.3, 'middle');
    noteAt('celosía en madera', [8.6, DECK + 2.2, 2.95], 70, -120, 3.5, 'start', 'mat');
  }
  noteAt('piscina', [6.5, DECK, 7.2], 60, 70, 3.7, 'start');

  // cota del frente de la plataforma (marcas a 45°, como en los planos)
  {
    const a = P([-12.5, 0, 8.5]);
    const b = P([12.5, 0, 8.5]);
    const off = 58;
    const A: V2 = [a[0], a[1] + off];
    const B: V2 = [b[0], b[1] + off];
    const tick = (p: V2) => `M${f1(p[0] - 6)} ${f1(p[1] + 6)}L${f1(p[0] + 6)} ${f1(p[1] - 6)}`;
    const d =
      handLine(A, B, 10, 1) +
      handLine([a[0], a[1] + 8], [a[0], a[1] + off + 10], 0, 0.5) +
      handLine([b[0], b[1] + 8], [b[0], b[1] + off + 10], 0, 0.5) +
      tick(A) +
      tick(B);
    strokes.push({ d, at: 3.0, dur: 0.7, w: 1, o: 0.9, kind: 'note' });
    const mid: V2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    notes.push({ text: '25,00', x: f1(mid[0]), y: f1(mid[1] - 10), anchor: 'middle', at: 3.3 });
  }

  // ================= Paisaje: la lámina se extiende de borde a borde =================
  const hy = P(add(eye, mul(fwd, 1e5)))[1];
  const smooth = (pts: V2[], close = false) => {
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const m: V2 = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += `Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(m[0])} ${f1(m[1])}`;
    }
    const l = pts[pts.length - 1];
    d += `L${f1(l[0])} ${f1(l[1])}`;
    return close ? d + 'Z' : d;
  };
  /** Mancha de acuarela: elipse con borde irregular. */
  const blob = (cx: number, cy: number, rx: number, ry: number, n = 40) => {
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    const pts: V2[] = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + 0.12 * Math.sin(a * 3 + ph[0]) + 0.07 * Math.sin(a * 7 + ph[1]) + 0.04 * Math.sin(a * 13 + ph[2]);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return smooth(pts, true);
  };
  const wash = (to: Stroke[], d: string, fill: string, o: number, at: number, layers = 3, spread = 0.04) => {
    for (let i = 0; i < layers; i++) to.push({ d, at: at + i * 0.18, dur: 1.6, w: 0, o, kind: 'wash', fill });
    void spread;
  };
  const washBlob = (to: Stroke[], cx: number, cy: number, rx: number, ry: number, fill: string, o: number, at: number, layers = 3) => {
    for (let i = 0; i < layers; i++) {
      const k = 1 - i * 0.12;
      to.push({ d: blob(cx + jit(rx * 0.05), cy + jit(ry * 0.05), rx * k, ry * k), at: at + i * 0.2, dur: 1.7, w: 0, o, kind: 'wash', fill });
    }
  };

  // Cielo: aguada azul de la marca en la esquina superior izquierda (atenuada)
  washBlob(back, W * 0.02, H * -0.04, W * 0.34, H * 0.28, '#0080c1', 0.016, 3.5, 2);
  
  // Montañas: dos cordilleras a mano detrás de la casa
  const ridge = (base: number, amp: number, seedPh: number, step: number) => {
    const pts: V2[] = [];
    for (let x = -40; x <= W + 40; x += step) {
      const u = x / W;
      const hgt = amp * (0.55 + 0.3 * Math.sin(u * 7.1 + seedPh) + 0.18 * Math.sin(u * 17.3 + seedPh * 2) + 0.08 * Math.sin(u * 41 + seedPh));
      pts.push([x, base - Math.max(0, hgt) + jit(2)]);
    }
    return pts;
  };
  const far = ridge(hy - 6, H * 0.12, 1.3, 46);
  const near = ridge(hy + 4, H * 0.075, 4.1, 34);
  back.push({ d: smooth(far), at: 0.6, dur: 1.6, w: 0.8, o: 0.32, kind: 'scene' });
  back.push({ d: smooth(near), at: 0.9, dur: 1.5, w: 1.0, o: 0.48, kind: 'scene' });
  wash(back, smooth([...far, [W + 40, hy + 20], [-40, hy + 20]], true), '#7f9fb8', 0.07, 3.7, 2);
  wash(back, smooth([...near, [W + 40, hy + 30], [-40, hy + 30]], true), '#6f8f86', 0.07, 3.9, 2);
  // sombreado de laderas: trazos cortos inclinados bajo la cresta cercana
  {
    const hs: string[] = [];
    for (let i = 2; i < near.length - 2; i += 1) {
      if (rnd() < 0.45) continue;
      const [x, y] = near[i];
      const L = 10 + rnd() * 18;
      hs.push(handLine([x, y + 4], [x + L * 0.5, y + 4 + L], 0, 0.5));
    }
    back.push({ d: hs.join(''), at: 2.4, dur: 1.0, w: 0.6, o: 0.3, kind: 'hatch' });
  }

  // Suelo: aguada verde del jardín
  {
    const c = P([0, 0, 2]);
    washBlob(back, c[0], hy + (H - hy) * 0.42, W * 0.62, (H - hy) * 0.5, '#7fa463', 0.075, 3.6, 3);
  }

  // Nubes y pájaros a los lados (el centro queda libre para el título)
  // Cielo: dos o tres trazos horizontales sueltos a cada lado, como en un boceto de arquitecto
  const skyLines = (cx: number, cy: number, w: number, at: number) => {
    const d: string[] = [];
    for (let i = 0; i < 3; i++) {
      const ww = w * (1 - i * 0.28) * (0.85 + rnd() * 0.3);
      const x0 = cx + i * w * 0.12 + jit(w * 0.05);
      const y = cy + i * 14 + jit(3);
      d.push(handLine([x0, y], [x0 + ww, y + jit(3)], 0, 2.5));
    }
    back.push({ d: d.join(''), at, dur: 1.0, w: 0.8, o: 0.28, kind: 'scene' });
  };
  if (!opts.tall) {
    skyLines(W * 0.04, H * 0.24, W * 0.11, 1.2);
    skyLines(W * 0.84, H * 0.17, W * 0.11, 1.4);
  }
  const birds: string[] = [];
  for (const [bx, by, bs] of [
    [0.16, 0.33, 14],
    [0.19, 0.31, 10],
    [0.215, 0.345, 8],
    [0.83, 0.42, 11],
    [0.855, 0.405, 8],
  ] as [number, number, number][]) {
    const x = W * bx;
    const y = H * by;
    birds.push(`M${f1(x - bs)} ${f1(y - bs * 0.35)}Q${f1(x - bs * 0.45)} ${f1(y - bs * 0.55)} ${f1(x)} ${f1(y)}Q${f1(x + bs * 0.45)} ${f1(y - bs * 0.55)} ${f1(x + bs)} ${f1(y - bs * 0.4)}`);
  }
  back.push({ d: birds.join(''), at: 2.9, dur: 0.6, w: 1.1, o: 0.55, kind: 'scene' });

  // Árboles extra hacia los bordes
  tree([-27, 0, 9], 7.5, 2.2, 1.05);
  tree([-23, 0, -9], 5.2, 2.5, 0.7);
  tree([25, 0, 7], 6.5, 2.4, 0.95);
  // copas en aguada verde
  for (const [x, z, hgt, r] of [
    [-14.6, 6.6, 6.2, 2.4],
    [-27, 9, 7.5, 2.9],
    [-23, -9, 5.2, 2],
    [25, 7, 6.5, 2.6],
  ] as [number, number, number, number][]) {
    const c = P([x, hgt * 0.78, z]);
    const e = P([x + r, hgt * 0.78, z]);
    const rr = Math.abs(e[0] - c[0]);
    washBlob(strokes, c[0], c[1], rr * 1.05, rr * 0.8, '#6f9a55', 0.13, 4.0 + rnd() * 0.4, 2);
  }

  // Matas de pasto en primer plano: pocas, en grupos, con briznas de distinto largo y curva
  {
    const g: string[] = [];
    for (let c = 0; c < 9; c++) {
      const cx = -26 + rnd() * 52;
      const cz = 10 + rnd() * 8;
      const n = 2 + Math.floor(rnd() * 3);
      for (let i = 0; i < n; i++) {
        const p = P([cx + jit(1.4), 0, cz + jit(0.8)]);
        if (p[1] > H - 4) continue;
        const blades = 3 + Math.floor(rnd() * 3);
        for (let b = 0; b < blades; b++) {
          const len = 6 + rnd() * 12;
          const lean = jit(0.9);
          const tip: V2 = [p[0] + lean * len, p[1] - len];
          const ctrl: V2 = [p[0] + lean * len * 0.2 + jit(2), p[1] - len * 0.6];
          g.push(`M${f1(p[0] + jit(3))} ${f1(p[1])}Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(tip[0])} ${f1(tip[1])}`);
        }
      }
    }
    strokes.push({ d: g.join(''), at: 2.6, dur: 1.0, w: 0.7, o: 0.38, kind: 'hatch' });
  }

  // Figuras humanas de escala (1,72 m)
  const person = (base: V3, at: number, stride = 0.2, arm = 0) => {
    const f = P(base);
    const top = P(add(base, [0, 1.72, 0]));
    const L = f[1] - top[1];
    const x = f[0];
    const y = f[1];
    const hr = L * 0.068;
    const sh = y - L * 0.8;
    const hip = y - L * 0.47;
    const d =
      `M${f1(x)} ${f1(top[1] + hr)}m${f1(-hr)} 0a${f1(hr)} ${f1(hr)} 0 1 0 ${f1(hr * 2)} 0a${f1(hr)} ${f1(hr)} 0 1 0 ${f1(-hr * 2)} 0` +
      `M${f1(x - L * 0.1)} ${f1(sh)}L${f1(x + L * 0.1)} ${f1(sh)}L${f1(x + L * 0.07)} ${f1(hip)}L${f1(x - L * 0.07)} ${f1(hip)}Z` +
      `M${f1(x - L * 0.04)} ${f1(hip)}L${f1(x - L * stride * 0.5)} ${f1(y)}M${f1(x + L * 0.04)} ${f1(hip)}L${f1(x + L * stride * 0.4)} ${f1(y)}` +
      `M${f1(x - L * 0.1)} ${f1(sh + 2)}L${f1(x - L * (0.13 + arm))} ${f1(hip + L * 0.04)}M${f1(x + L * 0.1)} ${f1(sh + 2)}L${f1(x + L * 0.14)} ${f1(hip + L * 0.02)}`;
    strokes.push({ d, at, dur: 0.6, w: 1.1, o: 0.8, kind: 'people' });
  };
  // (sin figuras humanas: pedido del usuario)
  void person;

  // Aguadas de la casa: vidrio, madera y piscina
  {
    const quad = (o: V3, u: V3, v: V3) => 'M' + [o, add(o, u), add(add(o, u), v), add(o, v)].map((p) => P(p).map(f1).join(' ')).join('L') + 'Z';
    wash(strokes, quad([-10.8, FLOOR, -0.98], [13.6, 0, 0], [0, 3.0, 0]), '#5f8aa6', 0.14, 3.9, 2);
    wash(strokes, quad([-12.2, DECK, -0.7], [24.4, 0, 0], [0, 0, 8.9]), '#c79a6b', 0.12, 4.0, 2);
    wash(strokes, quad([-0.8, DECK + 0.01, 4.1], [10, 0, 0], [0, 0, 3.1]), '#2f9fd6', 0.32, 4.1, 2);
  }

  // Donde reposa el lápiz al terminar
  const rest = opts.tall ? P([7.5, 0, 9.6]) : P([10.5, 0, 12.6]);
  // ---------- Acabados intercambiables de la fachada del volumen privado ----------
  let mats: Record<MatId, Material> | undefined;
  let matAnchor: V2 | undefined;
  {
    const o: V3 = [3.95, DECK, 2.99];
    const u: V3 = [6.1, 0, 0];
    const v: V3 = [0, 3.4, 0];
    const at = (a: number, b: number): V3 => add(add(o, mul(u, a)), mul(v, b));
    const quadD = 'M' + [o, add(o, u), add(add(o, u), v), add(o, v)].map((p) => P(p).map(f1).join(' ')).join('L') + 'Z';
    const seg = (a1: number, b1: number, a2: number, b2: number, over = 1, wob = 0.4) => handLine(P(at(a1, b1)), P(at(a2, b2)), over, wob);

    // Piedra: hiladas irregulares con juntas trabadas
    const stone: string[] = [];
    let b = 0;
    while (b < 0.999) {
      const hgt = 0.075 + rnd() * 0.05;
      const nb = Math.min(1, b + hgt);
      stone.push(seg(0, nb, 1, nb, 1, 0.6));
      let a = rnd() * 0.08;
      while (a < 1) {
        a += 0.07 + rnd() * 0.1;
        if (a < 0.99) stone.push(seg(a + jit(0.01), b, a + jit(0.01), nb, 0, 0.3));
      }
      b = nb;
    }
    // Concreto: juntas de formaleta y pasadores
    const joints: string[] = [];
    for (const a of [0.25, 0.5, 0.75]) joints.push(seg(a, 0, a, 1, 0, 0.3));
    for (const bb of [0.34, 0.67]) joints.push(seg(0, bb, 1, bb, 0, 0.3));
    const ties: string[] = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 3; j++) {
        const p = P(at(0.125 + i * 0.25, 0.17 + j * 0.33));
        ties.push(`M${f1(p[0] - 1.6)} ${f1(p[1])}a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0`);
      }
    // Vidrio: parales, travesaño y reflejos
    const mull: string[] = [];
    for (const a of [0, 0.2, 0.4, 0.6, 0.8, 1]) mull.push(seg(a, 0, a, 1, 0, 0.2));
    mull.push(seg(0, 0.72, 1, 0.72, 0, 0.2));
    const refl: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = 0.05 + i * 0.16;
      refl.push(seg(a, 0.15, a + 0.08, 0.55, 0, 0.2), seg(a + 0.03, 0.12, a + 0.07, 0.3, 0, 0.2));
    }

    mats = {
      madera: {
        wash: { d: quadD, fill: '#a0703f', o: 0.26 },
        lines: [{ d: hatch3(o, u, v, 0.47, 'v', 2), w: 0.9, o: 0.78 }],
      },
      concreto: {
        wash: { d: quadD, fill: '#9d9b96', o: 0.34 },
        lines: [
          { d: joints.join(''), w: 0.8, o: 0.5 },
          { d: ties.join(''), w: 1, o: 0.55 },
        ],
      },
      piedra: {
        wash: { d: quadD, fill: '#c3ab84', o: 0.38 },
        lines: [{ d: stone.join(''), w: 0.7, o: 0.6 }],
      },
      vidrio: {
        wash: { d: quadD, fill: '#6aa6cc', o: 0.36 },
        lines: [
          { d: mull.join(''), w: 1.1, o: 0.85 },
          { d: refl.join(''), w: 0.7, o: 0.45 },
        ],
      },
    };
    matAnchor = P(at(0.97, 0.45));
  }

  // Las aguadas se separan en dos capas (detrás y delante de las líneas) para animarlas sin repintar el dibujo
  const backWash = back.filter((s) => s.kind === 'wash');
  const frontWash = strokes.filter((s) => s.kind === 'wash');
  const lines = [...back.filter((s) => s.kind !== 'wash'), ...strokes.filter((s) => s.kind !== 'wash')];
  return { w: W, h: H, strokes: lines, backWash, frontWash, notes, route, rest, mats, matAnchor };
}
