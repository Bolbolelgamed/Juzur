import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import worker from '../server/index.js';
import { languageUrls, seoHead, structuredData } from '../src/config/seo.js';
import { calculateOrderTotals, product } from '../src/config/product.js';

test('each language is self-canonical and links to both translations', () => {
  for (const language of ['ar', 'en']) {
    const head = seoHead(language);
    assert.ok(head.includes(`rel="canonical" href="${languageUrls[language]}"`));
    for (const [other, href] of Object.entries(languageUrls)) {
      assert.ok(head.includes(`hreflang="${other}-EG" href="${href}"`));
    }
    const graph = structuredData(language)['@graph'];
    const page = graph.find((item) => item['@type'] === 'WebPage');
    assert.equal(page.url, languageUrls[language]);
    assert.equal(page.inLanguage, `${language}-EG`);
  }
});

test('product search price and shipping match the checkout calculation', () => {
  const offer = structuredData('ar')['@graph'].find((item) => item['@type'] === 'Product').offers;
  assert.equal(Number(offer.price), product.finalUnitPrice);
  for (const shipping of offer.shippingDetails) {
    for (const governorate of shipping.shippingDestination.addressRegion) {
      assert.equal(shipping.shippingRate.value, calculateOrderTotals({ quantity: 1, governorate }).shippingFee);
    }
  }
});

test('missing URLs retain their 404 response instead of showing a successful homepage', async () => {
  const requests = [];
  const response = await worker.fetch(new Request('https://www.techwood-art.com/missing-page'), {
    ASSETS: { fetch: async (request) => { requests.push(new URL(request.url).pathname); return new Response('Page not found', { status: 404 }); } },
  });
  assert.equal(response.status, 404);
  assert.deepEqual(requests, ['/missing-page']);
  const html = await readFile(new URL('../public/404.html', import.meta.url), 'utf8');
  assert.match(html, /name="robots" content="noindex, follow"/);
});
