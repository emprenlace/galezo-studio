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
  const later = () => rest.forEach((im, i) => setTimeout(() => load(im), 1200 + i * 300));
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
};
const roots = new Set<Element>();
document.querySelectorAll('img[data-lz]').forEach((im) => roots.add(im.closest('section') || document.body));
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } }),
  { rootMargin: '60% 0px' },
);
roots.forEach((r) => io.observe(r));
export {};
