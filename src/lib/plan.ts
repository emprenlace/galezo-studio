/**
 * Planta técnica de la misma casa (vista superior, líneas limpias de CAD), generada al compilar.
 * Es el contraste con el boceto: del trazo a mano al plano que recibe el cliente.
 */

export interface PlanSVG {
  w: number;
  h: number;
  walls: string; // rellenos negros (muros cortados)
  thin: string; // líneas finas: plataforma, muebles, deck
  hidden: string; // líneas discontinuas: cubierta encima
  water: string; // achurado de la piscina
  glass: string;
  dims: string; // cotas en azul
  labels: { x: number; y: number; t: string; a?: 'start' | 'middle' | 'end'; r?: number }[];
  path: string; // recorrido virtual (Catmull-Rom → Bézier)
  trees: { x: number; y: number; r: number }[];
  /** Zonas para el estado de cantidades */
  floor: string;
  pool: string;
  /** Convierte coordenadas de la casa (m) al lienzo */
  at: (x: number, z: number) => [number, number];
}

const f1 = (n: number) => Math.round(n * 10) / 10;

export function buildPlan(W = 1500, H = 1000): PlanSVG {
  const s = Math.min((W - 220) / 25, (H - 200) / 16.5);
  const ox = (W - 25 * s) / 2 + 12.5 * s;
  const oy = (H - 16.5 * s) / 2 + 8 * s + 10;
  const X = (x: number) => f1(x * s + ox);
  const Y = (z: number) => f1(z * s + oy);
  const rect = (x: number, z: number, w: number, d: number) =>
    `M${X(x - w / 2)} ${Y(z - d / 2)}H${X(x + w / 2)}V${Y(z + d / 2)}H${X(x - w / 2)}Z`;

  const WT = 0.22;
  const walls = [
    rect(-4, -6.89, 14, WT),
    rect(-10.89, -4, WT, 6),
    rect(2.89, -4, WT, 6),
    rect(7, -7.39, 6.2, WT),
    rect(7, 2.59, 6.2, WT),
    rect(4.01, -2.4, WT, 10.2),
    rect(9.99, -2.4, WT, 10.2),
    rect(-0.6, -5.6, 0.16, 2.6),
    rect(7, -4.2, 5.8, 0.16),
    rect(7, -0.9, 5.8, 0.16),
    ...[0, 1, 2, 3].map((i) => rect(-10.8 + i * 4.4, 3.1, 0.22, 0.22)),
  ].join('');

  const thin: string[] = [rect(0, 0.25, 25, 16.5)];
  // deck: tablas
  for (let z = -0.6; z < 8.2; z += 0.45) thin.push(`M${X(-12.2)} ${Y(z)}H${X(12.2)}`);
  // muebles
  thin.push(
    rect(-8.3, -5.9, 3.2, 0.9),
    rect(-9.7, -4.6, 0.9, 2.0),
    rect(-8.0, -4.4, 1.3, 0.75),
    rect(-3.6, -4.1, 2.3, 1.0),
    rect(1.0, -3.4, 2.6, 0.95),
    rect(0.8, -6.45, 4.2, 0.62),
    rect(7.4, -5.85, 2.0, 2.2),
    rect(7.4, -2.55, 2.0, 2.2),
    rect(8.9, 0.15, 1.6, 0.6),
    rect(0.6, 2.2, 2.6, 0.8),
    rect(-8.4, 1.5, 0.8, 2.0),
  );
  // sillas del comedor
  for (const dx of [-0.7, 0, 0.7]) thin.push(rect(-3.6 + dx, -4.85, 0.45, 0.4), rect(-3.6 + dx, -3.35, 0.45, 0.4));
  // celosía
  for (let i = 0; i < 13; i++) thin.push(rect(4.15 + i * 0.475, 2.95, 0.1, 0.55));
  // escalones
  thin.push(rect(-6.5, 8.75, 4.2, 0.4), rect(-6.5, 9.15, 4.2, 0.4));

  // cubiertas encima (discontinuas)
  const hidden = [rect(-4.2, -2.1, 16.4, 11.6), rect(7, -2.0, 7.4, 11.4)].join('');

  // vidrio: doble línea con parteluces
  const glass: string[] = [`M${X(-10.8)} ${Y(-0.98)}H${X(2.8)}M${X(-10.8)} ${Y(-0.9)}H${X(2.8)}`];
  for (let i = 0; i <= 8; i++) glass.push(`M${X(-10.9 + i * 1.7)} ${Y(-1.02)}V${Y(-0.86)}`);

  // piscina: contorno y achurado diagonal
  const water: string[] = [rect(4.2, 5.65, 10, 3.1)];
  for (let k = -3.1; k < 10; k += 0.5) {
    const x0 = Math.max(-0.8, -0.8 + k);
    const z0 = k < 0 ? 4.1 - k : 4.1;
    const x1 = Math.min(9.2, -0.8 + k + 3.1);
    const z1 = 4.1 + (x1 - (-0.8 + k));
    if (x1 > x0) water.push(`M${X(x0)} ${Y(Math.min(z0, 7.2))}L${X(x1)} ${Y(Math.min(z1, 7.2))}`);
  }

  // cotas en azul (marcas a 45°)
  const tick = (x: number, y: number) => `M${f1(x - 7)} ${f1(y + 7)}L${f1(x + 7)} ${f1(y - 7)}`;
  const top = Y(-8) - 46;
  const left = X(-12.5) - 46;
  const dims = [
    `M${X(-12.5)} ${top}H${X(12.5)}`,
    tick(X(-12.5), top),
    tick(X(12.5), top),
    `M${X(-12.5)} ${top - 12}V${Y(-8) - 8}M${X(12.5)} ${top - 12}V${Y(-8) - 8}`,
    `M${left} ${Y(-8)}V${Y(8.5)}`,
    tick(left, Y(-8)),
    tick(left, Y(8.5)),
    `M${left - 12} ${Y(-8)}H${X(-12.5) - 8}M${left - 12} ${Y(8.5)}H${X(-12.5) - 8}`,
  ].join('');

  const labels: PlanSVG['labels'] = [
    { x: f1((X(-12.5) + X(12.5)) / 2), y: f1(top - 12), t: '25,00', a: 'middle' },
    { x: f1(left - 14), y: f1((Y(-8) + Y(8.5)) / 2), t: '16,50', a: 'middle', r: -90 },
    { x: X(-6.5), y: Y(-2.6), t: 'Sala · comedor', a: 'middle' },
    { x: X(1.2), y: Y(-5.0), t: 'Cocina', a: 'middle' },
    { x: X(7), y: Y(-6.9) + 22, t: 'Habitación', a: 'middle' },
    { x: X(4.2), y: Y(5.75), t: 'Piscina', a: 'middle' },
    { x: X(-4.6), y: Y(1.8), t: 'Terraza', a: 'middle' },
  ];

  // recorrido virtual
  const pts: [number, number][] = [
    [-14.5, 2.6],
    [-8.5, 1.6],
    [-4.2, -3.2],
    [1.6, -4.6],
    [6.2, -5.6],
    [7.4, -2.4],
    [5.6, 1.2],
    [2.4, 3.0],
  ].map(([x, z]) => [X(x), Y(z)]);
  let path = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${p2[0]} ${p2[1]}`;
  }

  const trees = [
    { x: X(-14.6), y: Y(5.6), r: 1.5 * s },
    { x: X(14.4), y: Y(-5.8), r: 1.7 * s },
  ];

  const floor = [rect(-4, -4, 13.8, 5.8), rect(7, -2.4, 6, 10)].join('');
  const pool = rect(4.2, 5.65, 10, 3.1);
  const at = (x: number, z: number): [number, number] => [X(x), Y(z)];
  return { w: W, h: H, walls, thin: thin.join(''), hidden, water: water.join(''), glass: glass.join(''), dims, labels, path, trees, floor, pool, at };
}
