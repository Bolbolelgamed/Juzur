import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';

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
await writeFile(target, html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`));
await rm(new URL('../.vite/prerender/', import.meta.url), { recursive: true });
