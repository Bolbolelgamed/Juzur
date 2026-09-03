import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('production metadata uses the canonical storefront domain', async () => {
  const html = await read('index.html');
  assert.match(html, /rel="canonical" href="https:\/\/www\.techwood-art\.com\/"/);
  assert.doesNotMatch(html, /rel="canonical" href="https:\/\/bolbolelgamed\.github\.io/);
  assert.match(html, /"@type": "Product"/);
  assert.match(html, /"price": "2000"/);
});

test('the GitHub Pages mirror redirects checkout traffic to the production storefront', async () => {
  const html = await read('index.html');
  assert.match(html, /window\.location\.hostname === 'bolbolelgamed\.github\.io'/);
  assert.match(html, /new URL\('https:\/\/www\.techwood-art\.com\/'\)/);
  assert.match(html, /window\.location\.replace\(destination\.toString\(\)\)/);
});

test('crawler files point to the production storefront', async () => {
  const [robots, sitemap] = await Promise.all([
    read('public/robots.txt'),
    read('public/sitemap.xml'),
  ]);
  assert.match(robots, /Sitemap: https:\/\/www\.techwood-art\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.techwood-art\.com\/<\/loc>/);
});

test('Cloudflare security headers include core browser protections', async () => {
  const headers = await read('public/_headers');
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /Permissions-Policy:/);
});

test('heavy media is deferred and storefront images use WebP', async () => {
  const [hero, effects, videoSection, gallery, gift] = await Promise.all([
    read('src/components/Hero.jsx'),
    read('src/hooks/useSiteEffects.js'),
    read('src/components/VideoSection.jsx'),
    read('src/components/Gallery.jsx'),
    read('src/components/GiftSection.jsx'),
  ]);

  assert.doesNotMatch(hero, /autoPlay/);
  assert.match(hero, /preload="none"/);
  assert.match(effects, /requestIdleCallback\(startHeroVideo/);
  assert.match(effects, /heroVideo\.play\(\)/);
  assert.match(videoSection, /preload="none"/);
  assert.doesNotMatch(`${hero}${gallery}${gift}`, /\.jpg/);
  assert.match(`${hero}${gallery}${gift}`, /\.webp/);
});

test('fonts are self-hosted and responsive images are available', async () => {
  const [html, fonts, gallery, gift] = await Promise.all([
    read('index.html'),
    read('src/styles/fonts.css'),
    read('src/components/Gallery.jsx'),
    read('src/components/GiftSection.jsx'),
  ]);

  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(html, /noto-kufi-arabic\.woff2/);
  assert.match(fonts, /inter-latin\.woff2/);
  assert.match(fonts, /playfair-latin\.woff2/);
  assert.match(`${gallery}${gift}`, /srcSet=/);
  assert.match(`${gallery}${gift}`, /sizes=/);
});
