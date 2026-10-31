import type { APIRoute } from 'astro';
import { SITE } from '../lib/seo';
import { servicios } from '../lib/servicios';

// lastmod real: fecha de la última compilación de cada página indexable
// Solo páginas indexables: el inicio y cada servicio marcado como listo (ready) en lib/servicios.ts
const paginas = [{ path: '', priority: '1.0' }, ...servicios.filter((s) => s.ready).map((s) => ({ path: `/servicios/${s.slug}`, priority: '0.8' }))];

export const GET: APIRoute = () => {
  const now = new Date().toISOString();
  const urls = paginas.map((p) => `  <url><loc>${SITE}${p.path || '/'}</loc><lastmod>${now}</lastmod><priority>${p.priority}</priority></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
