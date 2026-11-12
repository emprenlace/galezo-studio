/**
 * Imágenes diferidas por cercanía (protocolo de LazyImg): <img src=PIXEL data-lz="" data-src data-srcset>.
 * La carga diferida del navegador no basta: en redes lentas Chrome adelanta todo lo que esté a ~2.500 px.
 * Cada sección pide sus imágenes cuando está a menos de media pantalla; las data-lz="later" (otras diapositivas),
 * después de que la página terminó de cargar y de a una. Módulo: se ejecuta una sola vez por página.
 */
const load = (im: HTMLImageElement) => {
  if (im.dataset.srcset) im.srcset = im.dataset.srcset;
  im.src = im.dataset.src!;
  im.removeAttribute('data-lz');
};
const fill = (root: Element) => {
  root.querySelectorAll<HTMLImageElement>('img[data-lz=""]').forEach(load);
  const rest = [...root.querySelectorAll<HTMLImageElement>('img[data-lz="later"]')];
  const later = () => rest.forEach((im, i) => setTimeout(() => load(im), 600 + i * 250));
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
};
const roots = new Set<Element>();
document.querySelectorAll('img[data-lz]').forEach((im) => roots.add(im.closest('section') || document.body));
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } }),
  { rootMargin: '60% 0px' },
);
// Lo que ya está en pantalla se pide de una; lo demás empieza a observarse cuando la página terminó de cargar
// (antes, las secciones cercanas competían con el texto y la imagen principal).
const watch = () => roots.forEach((r) => io.observe(r));
roots.forEach((r) => {
  const b = r.getBoundingClientRect();
  if (b.top < innerHeight && b.bottom > 0) { fill(r); roots.delete(r); }
});
if (document.readyState === 'complete') watch();
else addEventListener('load', watch, { once: true });
export {};
