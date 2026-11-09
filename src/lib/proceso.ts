/**
 * Sección "Cómo trabajamos": dibujos generados al compilar para las etapas 1 y 2 (lote y zonas); las demás usan láminas reales.
 * Lote → zonas (diagrama de burbujas). Ver Proceso.astro para las 9 etapas.
 * Comparte medidas con el plano (lib/plan.ts) y el modelo del boceto (lib/sketch.ts).
 */
import { buildPlan } from './plan';
import { BOXES, PLANES, FLOOR, DECK } from './sketch';

const f1 = (n: number) => Math.round(n * 10) / 10;

export interface Bubble {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  t: string;
  tone: 'social' | 'privado' | 'servicio' | 'agua' | 'exterior';
}
export interface ElevPiece {
  d: string;
  cls: string;
}

export function buildProceso() {
  const W = 1500;
  const H = 1000;
  const p = buildPlan(W, H);
  const at = p.at;
  const rect = (x0: number, z0: number, x1: number, z1: number) => {
    const [a, b] = at(x0, z0);
    const [c, d] = at(x1, z1);
    return `M${a} ${b}H${c}V${d}H${a}Z`;
  };

  // ---------- 1. El lote ----------
  const lot = rect(-17.5, -10.5, 17.5, 11.8);
  const lotTrees = [
    { x: -15.3, z: -8.6, r: 1.5 },
    { x: 15.6, z: 9.8, r: 1.7 },
    { x: -15.8, z: 9.6, r: 1.2 },
    ...p.trees.map(() => null),
  ]
    .filter(Boolean)
    .map((t) => {
      const [x, y] = at(t!.x, t!.z);
      const [x2] = at(t!.x + t!.r, t!.z);
      return { x, y, r: f1(x2 - x) };
    });
  const [lx0, ly0] = at(-17.5, -10.5);
  const [lx1, ly1] = at(17.5, 11.8);
  const tick = (x: number, y: number) => `M${f1(x - 8)} ${f1(y + 8)}L${f1(x + 8)} ${f1(y - 8)}`;
  const lotDims =
    `M${lx0} ${ly1 + 34}H${lx1}` +
    tick(lx0, ly1 + 34) +
    tick(lx1, ly1 + 34) +
    `M${lx1 + 34} ${ly0}V${ly1}` +
    tick(lx1 + 34, ly0) +
    tick(lx1 + 34, ly1);
  const lotLabels = [
    { x: f1((lx0 + lx1) / 2), y: f1(ly1 + 26), t: 'frente' },
    { x: f1(lx1 + 26), y: f1((ly0 + ly1) / 2), t: 'fondo', r: -90 },
  ];
  // vía de acceso, flecha de entrada, mojones y curvas de nivel del terreno
  const road = `M${f1(lx0 - 80)} ${f1(ly1 + 92)}H${f1(lx1 + 80)}`;
  const [ax, ay] = at(-6.5, 11.8);
  const access = `M${ax} ${f1(ly1 + 80)}V${f1(ay - 70)}M${f1(ax - 12)} ${f1(ay - 56)}L${ax} ${f1(ay - 72)}L${f1(ax + 12)} ${f1(ay - 56)}`;
  const markers = [
    [lx0, ly0],
    [lx1, ly0],
    [lx1, ly1],
    [lx0, ly1],
  ].map(([x, y]) => `M${f1(x - 9)} ${f1(y - 9)}h18v18h-18Z`).join('');
  const contours: string[] = [];
  for (let k = 0; k < 4; k++) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      const x = lx0 + (lx1 - lx0) * u;
      const y = ly0 + (ly1 - ly0) * (0.18 + k * 0.22) + Math.sin(u * 5.2 + k * 1.3) * 34 + Math.sin(u * 11 + k) * 10;
      pts.push([x, y]);
    }
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += `Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(m[0])} ${f1(m[1])}`;
    }
    contours.push(d + `L${f1(pts[12][0])} ${f1(pts[12][1])}`);
  }
  const roadLabel = { x: f1(lx1 - 120), y: f1(ly1 + 140) };

  // ---------- 2. Zonas (burbujas) ----------
  const bub = (x: number, z: number, rx: number, rz: number, t: string, tone: Bubble['tone']): Bubble => {
    const [cx, cy] = at(x, z);
    const [ex, ey] = at(x + rx, z + rz);
    return { cx, cy, rx: f1(ex - cx), ry: f1(ey - cy), t, tone };
  };
  const bubbles: Bubble[] = [
    bub(-6.3, -3.6, 4.6, 2.6, 'social', 'social'),
    bub(1.3, -4.8, 2.0, 1.8, 'cocina', 'servicio'),
    bub(7, -2.6, 2.6, 4.2, 'privado', 'privado'),
    bub(4.2, 5.6, 4.6, 1.6, 'piscina', 'agua'),
    bub(-5.2, 3.3, 5.2, 2.1, 'terraza', 'exterior'),
  ];
  // flechas de relación entre zonas, brisa y sol
  const link = (a: Bubble, b: Bubble) => {
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const L = Math.hypot(dx, dy);
    const ux = dx / L;
    const uy = dy / L;
    const sa = 1 / Math.hypot(ux / a.rx, uy / a.ry);
    const sb = 1 / Math.hypot(ux / b.rx, uy / b.ry);
    const x0 = a.cx + ux * (sa + 10);
    const y0 = a.cy + uy * (sa + 10);
    const x1 = b.cx - ux * (sb + 10);
    const y1 = b.cy - uy * (sb + 10);
    const mx = (x0 + x1) / 2 - uy * 18;
    const my = (y0 + y1) / 2 + ux * 18;
    return `M${f1(x0)} ${f1(y0)}Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}`;
  };
  const links = [link(bubbles[0], bubbles[1]), link(bubbles[0], bubbles[4]), link(bubbles[2], bubbles[3]), link(bubbles[4], bubbles[3])].join('');
  const [bx0, by0] = at(-16.5, -9.5);
  const breeze = [0, 1, 2].map((i) => `M${f1(bx0)} ${f1(by0 + 70 + i * 34)}q60 -18 120 0t120 0`).join('');
  const sunAt = at(14.5, -9);

  // ---------- 4. Fachada principal (vista frontal, con materiales) ----------
  const es = 46;
  const ex0 = W / 2;
  const eyBase = 740;
  const E = (x: number, y: number): [number, number] => [f1(ex0 + x * es), f1(eyBase - y * es)];
  const er = (x0: number, y0: number, x1: number, y1: number) => {
    const [a, b] = E(x0, y1);
    const [c, d] = E(x1, y0);
    return `M${a} ${b}H${c}V${d}H${a}Z`;
  };
  const [platform, social, privado, roofA, roofB, ...rest] = BOXES;
  const columns = rest.slice(0, 4);
  const steps = rest.slice(4);
  const bx = (b: (typeof BOXES)[number]) => [b.x - b.w / 2, b.y, b.x + b.w / 2, b.y + b.h] as const;
  const elev: ElevPiece[] = [];
  const glassP = PLANES.find((q) => q.hatch === 'glass')!;
  const louvre = PLANES.find((q) => q.hatch === 'louvre')!;
  elev.push({ d: er(...bx(social)), cls: 'e-wall' });
  elev.push({ d: er(...bx(privado)), cls: 'e-wall' });
  elev.push({ d: er(glassP.o[0], glassP.o[1], glassP.o[0] + glassP.u[0], glassP.o[1] + glassP.v[1]), cls: 'e-glass' });
  // reflejos del vidrio
  const refl: string[] = [];
  for (let i = 0; i < 6; i++) {
    const x = glassP.o[0] + 0.6 + i * 2.25;
    const [a, b] = E(x, FLOOR + 0.3);
    const [c, d] = E(x + 0.9, FLOOR + 2.6);
    refl.push(`M${a} ${b}L${f1(a + 16)} ${b}L${f1(c + 16)} ${d}L${c} ${d}Z`);
  }
  elev.push({ d: refl.join(''), cls: 'e-refl' });
  // parteluces
  const mull: string[] = [];
  for (let i = 0; i <= 8; i++) {
    const [a, b] = E(glassP.o[0] + i * 1.7, glassP.o[1]);
    const [, d] = E(0, glassP.o[1] + glassP.v[1]);
    mull.push(`M${a} ${b}V${d}`);
  }
  elev.push({ d: mull.join(''), cls: 'e-mull' });
  // celosía en madera
  elev.push({ d: er(louvre.o[0], louvre.o[1], louvre.o[0] + louvre.u[0], louvre.o[1] + louvre.v[1]), cls: 'e-wood-bg' });
  const slats: string[] = [];
  for (let x = louvre.o[0] + 0.06; x < louvre.o[0] + louvre.u[0] - 0.05; x += 0.2) slats.push(er(x, louvre.o[1], x + 0.1, louvre.o[1] + louvre.v[1]));
  elev.push({ d: slats.join(''), cls: 'e-wood' });
  // cubiertas con sombra debajo
  for (const r of [roofA, roofB]) {
    const [x0, y0, x1, y1] = bx(r);
    elev.push({ d: er(x0 + 0.3, y0 - 0.6, x1 - 0.3, y0), cls: 'e-shadow' });
    elev.push({ d: er(x0, y0, x1, y1), cls: 'e-roof' });
  }
  for (const c of columns) elev.push({ d: er(...bx(c)), cls: 'e-col' });
  elev.push({ d: er(-12.2, DECK - 0.06, 12.2, DECK), cls: 'e-deck' });
  elev.push({ d: er(...bx(platform)), cls: 'e-conc' });
  for (const st of steps) elev.push({ d: er(...bx(st)), cls: 'e-conc' });
  const [gx0, gy] = E(-15.5, 0);
  const [gx1] = E(15.5, 0);
  const ground = `M${gx0} ${gy}H${gx1}`;
  const elevTrees = [
    { x: -14.2, h: 6.4, r: 2.3 },
    { x: 14.6, h: 5.6, r: 2.0 },
  ].map((t) => {
    const [x, y] = E(t.x, t.h - t.r * 0.8);
    const [, yb] = E(t.x, 0);
    return { x, y, r: f1(t.r * es), trunk: `M${x} ${yb}V${f1(y + t.r * es * 0.4)}` };
  });
  const elevNotes = [
    { at: E(-7, FLOOR + 1.9), t: 'vidrio piso a techo', to: E(-7.6, 6.1) },
    { at: E(7.6, DECK + 2.1), t: 'celosía en madera', to: E(3.6, 6.4) },
    { at: E(-4, 0.22), t: 'concreto a la vista', to: E(-4.6, -1.9) },
  ];

  // ---------- 5. Cantidades: zonas pintadas sobre el plano ----------
  return {
    w: W,
    h: H,
    plan: p,
    lot,
    lotTrees,
    lotDims,
    lotLabels,
    road,
    access,
    markers,
    contours,
    roadLabel,
    bubbles,
    links,
    breeze,
    sun: { x: sunAt[0], y: sunAt[1] },
    elev,
    ground,
    elevTrees,
    elevNotes,
  };
}
