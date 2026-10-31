import type { APIRoute } from 'astro';
import { SITE } from '../lib/seo';

/** Índice de sitemaps. El de páginas lista solo las indexables (el blog y las páginas de servicio se suman cuando estén listas). */
export const GET: APIRoute = () => {
  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap-paginas.xml</loc><lastmod>${now}</lastmod></sitemap>
</sitemapindex>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
