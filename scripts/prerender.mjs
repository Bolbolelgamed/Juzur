import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { seoHead } from '../src/config/seo.js';

// Render the same React components at build time; no runtime server is needed.
await build({
  publicDir: false,
  // Vite normalizes relative bases to '/' in SSR builds. Match the client.
  define: { 'import.meta.env.BASE_URL': JSON.stringify('./') },
  build: {
    ssr: 'src/prerender.jsx',
    outDir: '.vite/prerender',
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'entry.mjs' } },
  },
});
const { render } = await import('../.vite/prerender/entry.mjs');
const target = new URL('../dist/client/index.html', import.meta.url);
const html = await readFile(target, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('Missing React root for pre-rendering');
for (const language of ['ar', 'en']) {
  const localizedHtml = html
    .replace(/<html lang="ar" dir="rtl">/, `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace(/    <!-- SEO:START -->[\s\S]*?    <!-- SEO:END -->/, () => seoHead(language))
    .replace('<div id="root"></div>', () => `<div id="root">${render(language)}</div>`);
  // Cloudflare Pages serves en.html at /en, keeping relative asset URLs at the root.
  await writeFile(language === 'ar' ? target : new URL('../dist/client/en.html', import.meta.url), localizedHtml);
}
await rm(new URL('../.vite/prerender/', import.meta.url), { recursive: true });
