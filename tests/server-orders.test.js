import test from 'node:test';
import assert from 'node:assert/strict';
import { handleOrderRequest } from '../server/index.js';

const env = { APPS_SCRIPT_ORDER_URL: 'https://example.test/orders' };

function orderRequest(orderId = 'JUZUR-TEST') {
  return new Request('https://juzur.test/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
}

test('proxy returns the backend-generated orderId', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-000001', emailStatus: 'sent' })),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, orderId: 'ST-000001', emailStatus: 'sent' });
});

test('proxy accepts the legacy successful acknowledgement', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => Response.json({ ok: true, emailStatus: 'sent' }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, emailStatus: 'sent', orderId: 'JUZUR-TEST' });
});

test('proxy accepts a backend orderId that differs from the temporary orderId', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-000002' })),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, orderId: 'ST-000002' });
});

test('proxy preserves backend failure messages', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => Response.json({ ok: false, error: 'quantity is invalid' }),
  });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, error: 'quantity is invalid' });
});

test('proxy rejects an upstream HTTP failure', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => new Response('{}', { status: 500 }),
  });
  assert.equal(response.status, 502);
});

test('proxy rejects invalid upstream JSON', async () => {
  const response = await handleOrderRequest(orderRequest(), env, {
    fetchImpl: async () => new Response('not-json'),
  });
  assert.equal(response.status, 502);
});

test('proxy reports an upstream timeout', async () => {
  const fetchImpl = async (_url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
  });
  const response = await handleOrderRequest(orderRequest(), env, { fetchImpl, timeoutMs: 5 });
  assert.equal(response.status, 504);
});
