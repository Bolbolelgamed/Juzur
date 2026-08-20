import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('production metadata uses the canonical storefront domain', async () => {
  const html = await read('index.html');
  assert.match(html, /rel="canonical" href="https:\/\/www\.techwood-art\.com\/"/);
  assert.doesNotMatch(html, /bolbolelgamed\.github\.io/);
  assert.match(html, /"@type": "Product"/);
  assert.match(html, /"price": "2000"/);
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
