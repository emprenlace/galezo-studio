/**
 * Maquetas axonométricas (isométricas) generadas al compilar, en el estilo de las maquetas blancas de estudio.
 * Cada caja se dibuja con sus tres caras visibles (arriba, frente izquierdo, frente derecho) y sus aristas.
 * Cada pieza lleva un orden de armado (--d) y un nivel (--lv) para la vista explotada al pasar el mouse.
 */

export type Tone = 'paper' | 'old' | 'new' | 'water' | 'wood' | 'glass' | 'dark' | 'soft';

interface Box {
  x: number;
  y: number;
  z: number;
  w: number; // a lo largo de x
  h: number; // alto (y)
  d: number; // a lo largo de z
  tone: Tone;
  lv: number;
  at: number;
  group: string;
}

interface Tree {
  x: number;
  z: number;
  r: number;
  h: number;
  at: number;
}

export interface Piece {
  faces: { d: string; cls: string }[];
  edges: string;
  lv: number;
  at: number;
  kind: 'box' | 'tree' | 'person';
  group: string;
}

export interface Model {
  w: number;
  h: number;
  pieces: Piece[];
  /** Puntos con nombre ya proyectados al lienzo (para ubicar elementos HTML sobre la maqueta) */
  marks: Record<string, [number, number]>;
}

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const f1 = (n: number) => Math.round(n * 10) / 10;

export class Iso {
  boxes: Box[] = [];
  trees: Tree[] = [];
  people: { x: number; y: number; z: number; at: number }[] = [];
  points: Record<string, [number, number, number]> = {};
  /** Grupo de las cajas que se agregan desde aquí (para animarlas aparte) */
  group = '';
  mark(name: string, x: number, y: number, z: number) {
    this.points[name] = [x, y, z];
    return this;
  }
  /** Figura humana a escala (1,7 m), como en las maquetas de estudio */
  person(x: number, y: number, z: number, at = 0.9) {
    this.people.push({ x, y, z, at });
    return this;
  }
  box(x: number, y: number, z: number, w: number, h: number, d: number, tone: Tone = 'paper', lv = 0, at = 0) {
    this.boxes.push({ x, y, z, w, h, d, tone, lv, at, group: this.group });
    return this;
  }
  tree(x: number, z: number, r: number, h: number, at = 0) {
    this.trees.push({ x, z, r, h, at });
    return this;
  }

  build(W = 400, H = 300, pad = 6): Model {
    const raw = (x: number, y: number, z: number): [number, number] => [(x - z) * C, (x + z) * S - y];
    // encuadre
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const grow = (p: [number, number]) => {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    };
    for (const b of this.boxes)
      for (const dx of [0, b.w]) for (const dy of [0, b.h]) for (const dz of [0, b.d]) grow(raw(b.x + dx, b.y + dy, b.z + dz));
    for (const t of this.trees) {
      grow(raw(t.x, 0, t.z));
      const c = raw(t.x, t.h + t.r, t.z);
      grow([c[0] - t.r * 1.05, c[1] - t.r]);
      grow([c[0] + t.r * 1.05, c[1] + t.r]);
    }
    const s = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY));
    const ox = (W - (maxX - minX) * s) / 2 - minX * s;
    const oy = (H - (maxY - minY) * s) / 2 - minY * s;
    const P = (x: number, y: number, z: number) => {
      const [a, b] = raw(x, y, z);
      return `${f1(a * s + ox)} ${f1(b * s + oy)}`;
    };

    type Item = { depth: number; piece: Piece; b: [number, number, number, number, number, number] };
    const items: Item[] = [];
    for (const b of this.boxes) {
      const { x, y, z, w, h, d } = b;
      const x1 = x + w;
      const y1 = y + h;
      const z1 = z + d;
      const top = `M${P(x, y1, z)}L${P(x1, y1, z)}L${P(x1, y1, z1)}L${P(x, y1, z1)}Z`;
      const left = `M${P(x, y, z1)}L${P(x1, y, z1)}L${P(x1, y1, z1)}L${P(x, y1, z1)}Z`; // cara z+ (frente izquierdo)
      const right = `M${P(x1, y, z)}L${P(x1, y, z1)}L${P(x1, y1, z1)}L${P(x1, y1, z)}Z`; // cara x+ (frente derecho)
      const edges =
        `M${P(x, y1, z)}L${P(x1, y1, z)}L${P(x1, y1, z1)}L${P(x, y1, z1)}Z` +
        `M${P(x, y, z1)}L${P(x1, y, z1)}L${P(x1, y, z)}` +
        `M${P(x, y, z1)}L${P(x, y1, z1)}M${P(x1, y, z1)}L${P(x1, y1, z1)}M${P(x1, y, z)}L${P(x1, y1, z)}`;
      items.push({
        depth: x + z,
        b: [x, x1, y, y1, z, z1],
        piece: {
          faces: [
            { d: top, cls: `t-${b.tone} f-top` },
            { d: left, cls: `t-${b.tone} f-left` },
            { d: right, cls: `t-${b.tone} f-right` },
          ],
          edges,
          lv: b.lv,
          at: b.at,
          kind: 'box',
          group: b.group,
        },
      });
    }
    for (const t of this.trees) {
      const base = P(t.x, 0, t.z);
      const [bx, by] = base.split(' ').map(Number);
      const top = raw(t.x, t.h, t.z);
      const ty = top[1] * s + oy;
      const cy = (top[1] - t.r) * s + oy;
      const r = t.r * s;
      items.push({
        depth: t.x + t.z,
        b: [t.x - t.r * 0.6, t.x + t.r * 0.6, 0, t.h + t.r * 2, t.z - t.r * 0.6, t.z + t.r * 0.6],
        piece: {
          faces: [
            { d: `M${bx - r * 0.9} ${by}a${r * 0.9} ${r * 0.45} 0 1 0 ${r * 1.8} 0a${r * 0.9} ${r * 0.45} 0 1 0 ${-r * 1.8} 0`, cls: 'tree-shadow' },
            { d: `M${bx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`, cls: 'tree-crown' },
          ],
          edges: `M${bx} ${by}L${bx} ${f1(ty)}M${bx - r} ${f1(cy)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0`,
          lv: 0,
          at: t.at,
          kind: 'tree',
          group: '',
        },
      });
    }
    for (const q of this.people) {
      const foot = raw(q.x, q.y, q.z);
      const fx = foot[0] * s + ox;
      const fy = foot[1] * s + oy;
      const hgt = 1.7 * s;
      const hr = hgt * 0.11;
      const body = `M${f1(fx)} ${f1(fy)}L${f1(fx)} ${f1(fy - hgt * 0.72)}M${f1(fx - hgt * 0.12)} ${f1(fy - hgt * 0.5)}L${f1(fx)} ${f1(fy - hgt * 0.62)}L${f1(fx + hgt * 0.12)} ${f1(fy - hgt * 0.5)}M${f1(fx)} ${f1(fy - hgt * 0.28)}L${f1(fx - hgt * 0.09)} ${f1(fy)}M${f1(fx)} ${f1(fy - hgt * 0.28)}L${f1(fx + hgt * 0.09)} ${f1(fy)}`;
      items.push({
        depth: q.x + q.z,
        b: [q.x - 0.2, q.x + 0.2, q.y, q.y + 1.7, q.z - 0.2, q.z + 0.2],
        piece: {
          faces: [{ d: `M${f1(fx - hr)} ${f1(fy - hgt + hr)}a${f1(hr)} ${f1(hr)} 0 1 0 ${f1(2 * hr)} 0a${f1(hr)} ${f1(hr)} 0 1 0 ${f1(-2 * hr)} 0`, cls: 'person-head' }],
          edges: body,
          lv: 0,
          at: q.at,
          kind: 'person',
          group: '',
        },
      });
    }
    // Orden de dibujo: A va detrás de B si están separados en algún eje y A queda del lado de atrás
    // (menor x, menor z o más abajo). Orden topológico de esas relaciones.
    const behind = (a: Item, c: Item) => {
      const [ax0, ax1, ay0, ay1, az0, az1] = a.b;
      const [cx0, cx1, cy0, cy1, cz0, cz1] = c.b;
      if (ax1 <= cx0 + 1e-6) return true;
      if (cx1 <= ax0 + 1e-6) return false;
      if (az1 <= cz0 + 1e-6) return true;
      if (cz1 <= az0 + 1e-6) return false;
      if (ay1 <= cy0 + 1e-6) return true;
      if (cy1 <= ay0 + 1e-6) return false;
      return a.depth < c.depth;
    };
    const n = items.length;
    const indeg = new Array(n).fill(0);
    const adj: number[][] = items.map(() => []);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        if (behind(items[i], items[j]) && !behind(items[j], items[i])) {
          adj[i].push(j);
          indeg[j]++;
        }
      }
    const order: number[] = [];
    const ready = items.map((_, i) => i).filter((i) => indeg[i] === 0);
    while (ready.length) {
      ready.sort((a, b) => items[a].depth - items[b].depth);
      const i = ready.shift()!;
      order.push(i);
      for (const j of adj[i]) if (--indeg[j] === 0) ready.push(j);
    }
    if (order.length < n) for (let i = 0; i < n; i++) if (!order.includes(i)) order.push(i);
    const marks: Record<string, [number, number]> = {};
    for (const [k, [x, y, z]] of Object.entries(this.points)) {
      const [a, b] = raw(x, y, z);
      marks[k] = [f1(a * s + ox), f1(b * s + oy)];
    }
    return { w: W, h: H, pieces: order.map((i) => items[i].piece), marks };
  }
}

/* ---------- Las cuatro maquetas ---------- */

export function campestre(): Model {
  const m = new Iso();
  m.box(0, 0, 0, 16, 0.4, 11, 'soft', 0, 0) // plataforma
    .box(8.6, 0.4, 6.4, 6, 0.06, 3, 'water', 0, 0.35) // piscina
    .box(1, 0.4, 0.8, 8.5, 3, 4.6, 'paper', 1, 0.15) // volumen social
    .box(9.8, 0.4, 0.8, 4.6, 3.4, 5, 'paper', 1, 0.25) // volumen privado
    .box(1.6, 0.42, 5.4, 6.4, 0.08, 4.2, 'wood', 0, 0.3) // terraza
    .box(0.4, 3.4, 0.2, 9.8, 0.3, 9.6, 'paper', 2, 0.55) // cubierta en voladizo
    .box(9.4, 3.8, 0.4, 5.4, 0.3, 5.8, 'paper', 2, 0.65)
    .tree(-1.6, 9.5, 1.5, 2.2, 0.7)
    .tree(17.2, 1.5, 1.2, 1.8, 0.8)
    .person(4.2, 0.5, 7.4)
    .person(13.2, 0.4, 9.6, 0.95);
  // puntos para anotar la maqueta (página de vivienda)
  m.mark('alero', 5, 3.7, 9.8).mark('brisa', 9.6, 2.2, 3).mark('terreno', 15.6, 0.2, 10.6).mark('vista', 11.6, 0.45, 7.9).mark('sol', 8, 9, 5);
  return m.build(400, 300);
}

export function urbana(): Model {
  const m = new Iso();
  m.box(-1.2, 0, 0, 1, 4.2, 9, 'soft', 0, 0) // medianera (vecino), baja y atrás
    .box(0, 0, 0, 8, 0.25, 10, 'soft', 0, 0.05) // lote
    .box(0, 0.25, 0.4, 7.4, 3, 7.2, 'paper', 1, 0.2) // primer piso
    .box(0.6, 0.27, 7.6, 3.2, 0.06, 2, 'wood', 0, 0.3) // antejardín
    .box(-0.2, 3.25, 0.2, 7.8, 0.25, 7.6, 'paper', 2, 0.35) // entrepiso con alero
    .box(0, 3.5, 0.4, 5.2, 2.8, 6.4, 'paper', 2, 0.45) // segundo piso retrocedido
    .box(5.2, 3.5, 0.4, 2.2, 0.06, 6.4, 'wood', 2, 0.5) // terraza del segundo piso
    .box(-0.2, 6.3, 0.2, 5.6, 0.25, 6.8, 'paper', 3, 0.6) // cubierta
    .tree(8.8, 9.2, 0.9, 1.4, 0.75)
    .person(5.4, 0.25, 9.0);
  m.mark('frente', 4, 0.25, 10).mark('luz', 6.3, 3.6, 3.5).mark('pisos', 2.6, 4.9, 6.8).mark('privacidad', 4.6, 1.9, 7.6).mark('vecino', -0.7, 4.2, 4.5);
  return m.build(400, 300);
}

export function ampliacion(): Model {
  const m = new Iso();
  m.box(0, 0, 0, 15, 0.25, 10, 'soft', 0, 0) // lote
    .box(0.8, 0.25, 0.8, 7.5, 3, 7, 'old', 0, 0.1) // casa existente
    .box(0.6, 3.25, 0.6, 7.9, 0.25, 7.4, 'old', 0, 0.15) // cubierta existente
    .box(8.3, 0.25, 0.8, 5.4, 3, 6, 'new', 1, 0.45) // ampliación lateral
    .box(0.8, 3.5, 0.8, 7.5, 2.8, 5, 'new', 2, 0.6) // segundo piso nuevo
    .box(0.6, 6.3, 0.6, 7.9, 0.25, 5.4, 'new', 3, 0.75) // cubierta nueva
    .tree(14.2, 9, 1.1, 1.6, 0.8)
    .person(4.5, 0.25, 9.0);
  return m.build(400, 300);
}

export function interiores(): Model {
  const m = new Iso();
  m.box(0, 0, 0, 10, 0.25, 8, 'soft', 0, 0) // piso
    .box(0, 0.25, 0, 10, 3.2, 0.25, 'paper', 0, 0.05) // muro de fondo
    .box(0, 0.25, 0, 0.25, 3.2, 8, 'paper', 0, 0.05) // muro lateral
    .box(1.2, 0.25, 2.6, 3.6, 0.04, 2.6, 'wood', 1, 0.3) // tapete
    .box(1.2, 0.25, 0.7, 3.6, 0.45, 1, 'paper', 2, 0.4) // sofá
    .box(1.2, 0.7, 0.7, 3.6, 0.5, 0.3, 'paper', 2, 0.45) // espaldar
    .box(2.3, 0.25, 3.3, 1.4, 0.4, 0.9, 'wood', 2, 0.5) // mesa de centro
    .box(6.2, 0.25, 0.5, 3.2, 0.9, 0.7, 'paper', 2, 0.55) // mesón de cocina
    .box(6.4, 0.25, 3, 2.8, 0.9, 1.2, 'paper', 2, 0.6) // isla
    .box(6.2, 2, 0.3, 3.2, 0.8, 0.4, 'wood', 3, 0.7) // muebles altos
    .box(0.3, 1.2, 4.6, 0.06, 1.4, 2.2, 'glass', 1, 0.35) // ventana
    .tree(8.8, 6.8, 0.5, 0.7, 0.8) // planta
    .person(5.2, 0.25, 5.6);
  return m.build(400, 300);
}

export function comercial(): Model {
  const m = new Iso();
  m.box(0, 0, 0, 12, 0.25, 9, 'soft', 0, 0) // andén y lote
    .box(0.6, 0.25, 0.6, 10.8, 3.4, 5.6, 'paper', 1, 0.15) // local
    .box(0.9, 0.3, 6.2, 10.2, 2.6, 0.06, 'glass', 1, 0.3) // vitrina
    .box(0.4, 3.65, 0.4, 11.2, 0.3, 7.4, 'paper', 2, 0.45) // marquesina
    .box(3.6, 3.95, 6.1, 4.8, 0.7, 0.12, 'wood', 3, 0.6) // aviso
    .tree(11.2, 8.2, 0.8, 1.3, 0.75)
    .person(2.4, 0.25, 7.6)
    .person(9.4, 0.25, 8.0, 0.95);
  return m.build(400, 300);
}

export function institucional(): Model {
  // Colegio en claustro: tres alas alrededor de un patio con cancha, la del fondo de dos pisos
  const m = new Iso();
  m.box(0, 0, 0, 18, 0.25, 14, 'soft', 0, 0) // lote
    .box(0.8, 0.25, 0.8, 16.4, 3, 3.4, 'paper', 1, 0.12) // ala del fondo, primer piso
    .box(0.6, 3.25, 0.6, 16.8, 0.22, 3.8, 'paper', 2, 0.3) // entrepiso
    .box(0.8, 3.47, 0.8, 16.4, 2.8, 3.4, 'paper', 2, 0.42) // segundo piso
    .box(0.6, 6.27, 0.6, 16.8, 0.25, 3.8, 'paper', 3, 0.56) // cubierta
    .box(0.8, 0.25, 4.2, 3.4, 3, 8.4, 'paper', 1, 0.2) // ala izquierda
    .box(0.6, 3.25, 4.2, 3.8, 0.25, 8.6, 'paper', 2, 0.48) // su cubierta
    .box(13.8, 0.25, 4.2, 3.4, 3, 8.4, 'paper', 1, 0.24) // ala derecha
    .box(13.6, 3.25, 4.2, 3.8, 0.25, 8.6, 'paper', 2, 0.52) // su cubierta
    .box(5.4, 0.27, 5.6, 7.2, 0.06, 5.6, 'new', 0, 0.36) // cancha del patio
    .tree(4.9, 12.8, 0.8, 1.2, 0.7)
    .tree(13.2, 12.9, 0.7, 1.1, 0.78)
    .person(9, 0.33, 8.4);
  return m.build(400, 300);
}

export function ejecutivo(): Model {
  // Proyecto ejecutivo: el edificio "abierto" para ver su estructura (columnas y losas en azul) y parte ya cerrada
  const m = new Iso();
  m.box(0, 0, 0, 14, 0.25, 10, 'soft', 0, 0); // lote
  const cols: [number, number][] = [[1, 1], [6.5, 1], [12, 1], [1, 8], [6.5, 8], [12, 8]];
  for (const [lvl, y] of [[1, 0.25], [2, 3.5]] as const) {
    for (const [x, z] of cols) m.box(x, y, z, 0.5, 3, 0.5, 'new', lvl, 0.1 + lvl * 0.2 + x * 0.005);
    m.box(0.6, y + 3, 0.6, 12.4, 0.25, 8.4, 'new', lvl + 1, 0.25 + lvl * 0.2); // losa
  }
  m.box(1, 0.25, 1, 5.5, 3, 7.5, 'paper', 1, 0.2) // primer piso cerrado (arquitectura)
    .tree(13.4, 9.4, 0.7, 1.1, 0.8)
    .person(9.5, 0.25, 9.2);
  return m.build(400, 300);
}

/* ---------- 404: dos cuatros construidos y, en medio, el lote del cero por construir ---------- */

export function cuatroCeroCuatro(): Model {
  const m = new Iso();
  const D = 1; // fondo de cada número: poco, para que se lean de frente
  const y0 = 0.3; // sobre la plataforma
  const t = 1.25; // grueso del trazo
  const W = 3.7; // ancho de cada número
  const H = 5.6; // alto
  const g = 1.7; // espacio entre números
  const bar = 2.1; // altura de la barra del cuatro
  const four = (x: number, at: number) =>
    m
      .box(x, y0 + bar, 0, t, H - bar, D, 'paper', 1, at) // trazo izquierdo, de la barra hacia arriba
      .box(x + t, y0 + bar, 0, W - 2 * t, t, D, 'paper', 1, at + 0.08) // barra
      .box(x + W - t, y0, 0, t, H, D, 'paper', 1, at + 0.16); // trazo derecho
  const z0 = W + g; // el cero
  const x2 = 2 * (W + g); // el segundo cuatro
  m.box(-1.6, 0, -1.8, x2 + W + 3.2, y0, D + 3.8, 'soft', 0, 0); // plataforma
  four(0, 0.12);
  four(x2, 0.3);
  m.group = 'zero';
  m.box(z0, y0, 0, t, H, D, 'paper', 1, 0) // izquierda
    .box(z0 + W - t, y0, 0, t, H, D, 'paper', 1, 0.1) // derecha
    .box(z0 + t, y0, 0, W - 2 * t, t, D, 'paper', 1, 0.2) // abajo
    .box(z0 + t, y0 + H - t, 0, W - 2 * t, t, D, 'paper', 1, 0.3); // arriba
  m.group = 'stake';
  const sx = [z0 - 0.5, z0 + W + 0.5];
  const sz = [-0.6, D + 0.6];
  for (const [x, z] of [[sx[0], sz[0]], [sx[1], sz[0]], [sx[1], sz[1]], [sx[0], sz[1]]]) m.box(x - 0.07, y0, z - 0.07, 0.14, 0.8, 0.14, 'wood', 0, 0.5);
  m.group = '';
  const hy = y0 + 0.62;
  m.mark('s1', sx[0], hy, sz[0]).mark('s2', sx[1], hy, sz[0]).mark('s3', sx[1], hy, sz[1]).mark('s4', sx[0], hy, sz[1]);
  m.mark('top', z0 + W / 2, y0 + H + 0.7, D / 2).mark('lot', z0 + W / 2, y0 + H / 2, D / 2);
  return m.build(600, 400, 10);
}
