import test from 'node:test';
import assert from 'node:assert/strict';
import { product } from '../src/config/product.js';
import { createOrderPayload, createSubmissionGate, submitOrder } from '../src/utils/order.js';

const form = {
  fullName: 'Test Customer',
  phone: '010 1234 5678',
  governorate: 'Cairo',
  areaCity: 'Nasr City',
  detailedAddress: '1 Test Street',
  landmark: '',
};

for (const quantity of [1, 2, 3]) {
  test(`quantity ${quantity} uses the complete order total`, () => {
    const payload = createOrderPayload({
      form,
      language: 'en',
      quantity,
      product,
      now: () => 1000,
      random: () => 0.5,
    });

    assert.equal(payload.quantity, quantity);
    assert.equal(payload.unitPrice, 2000);
    assert.equal(payload.subtotal, 2000 * quantity);
    assert.equal(payload.finalPrice, `EGP ${(2000 * quantity).toLocaleString('en-US')}`);
  });
}

test('successful acknowledgement resolves with the backend orderId', async () => {
  const payload = { orderId: 'JUZUR-TEMP' };
  const result = await submitOrder(payload, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-000001', emailStatus: 'sent' })),
  });
  assert.deepEqual(result, { ok: true, orderId: 'ST-000001', emailStatus: 'sent' });
});

test('successful acknowledgement does not require matching the temporary orderId', async () => {
  const result = await submitOrder(
    { orderId: 'JUZUR-EXPECTED' },
    { fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-000002' })) },
  );
  assert.equal(result.orderId, 'ST-000002');
});

test('unverified response is rejected', async () => {
  await assert.rejects(
    submitOrder(
      { orderId: 'JUZUR-EXPECTED' },
      { fetchImpl: async () => new Response(JSON.stringify({ ok: false, orderId: 'JUZUR-EXPECTED' })) },
    ),
    /acknowledgement/,
  );
});

test('backend error message is preserved', async () => {
  await assert.rejects(
    submitOrder(
      { orderId: 'JUZUR-EXPECTED' },
      { fetchImpl: async () => new Response(JSON.stringify({ ok: false, error: 'quantity is invalid' })) },
    ),
    /quantity is invalid/,
  );
});

test('invalid JSON is rejected', async () => {
  await assert.rejects(
    submitOrder(
      { orderId: 'JUZUR-EXPECTED' },
      { fetchImpl: async () => new Response('not-json') },
    ),
    /invalid JSON/,
  );
});

test('HTTP failure is rejected', async () => {
  await assert.rejects(
    submitOrder(
      { orderId: 'JUZUR-EXPECTED' },
      { fetchImpl: async () => new Response('{}', { status: 500 }) },
    ),
    /error response/,
  );
});

test('request timeout is rejected without a false success', async () => {
  const fetchImpl = async (_url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
  });

  await assert.rejects(
    submitOrder({ orderId: 'JUZUR-EXPECTED' }, { fetchImpl, timeoutMs: 5 }),
    /Timed out/,
  );
});

test('submission gate prevents duplicate requests until completion', () => {
  const gate = createSubmissionGate();
  assert.equal(gate.tryStart(), true);
  assert.equal(gate.tryStart(), false);
  gate.finish();
  assert.equal(gate.tryStart(), true);
});
