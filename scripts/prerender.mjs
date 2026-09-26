import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render, pages as routes, siteBase as base } from '../dist-ssr/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
function escape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}
for (const route of routes) {
  const canonical = `${base}${route.path}`;
  const head = `<title>${escape(route.title)}</title>
    <meta name="description" content="${escape(route.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Laabh Gupta" />
    <meta property="og:title" content="${escape(route.title)}" />
    <meta property="og:description" content="${escape(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${base}/social-card.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Laabh Gupta — AI/ML, Software Engineering, MLOps and DevOps" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(route.title)}" />
    <meta name="twitter:description" content="${escape(route.description)}" />
    <meta name="twitter:image" content="${base}/social-card.png" />
    ${route.path === '/404' ? '<meta name="robots" content="noindex" />' : ''}
    ${route.schema ? `<script type="application/ld+json" data-portfolio-schema>${JSON.stringify({ '@context': 'https://schema.org', ...route.schema }).replaceAll('<', '\\u003c')}</script>` : ''}`;
  const rendered = await render(route.path);
  const html = template
    .replace('<!--page-head-->', head)
    .replace('<div id="root">', `<div id="root" data-route="${route.path}">`)
    .replace('<!--app-html-->', () => rendered);
  const directory = route.path === '/' ? 'dist' : `dist${route.path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
  // Vite preview and static hosts resolve clean paths through path.html.
  if (route.path !== '/') await writeFile(`dist${route.path}.html`, html);
  console.log(`Prerendered ${route.path}`);
}
