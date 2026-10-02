import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderTotals, product } from '../src/config/product.js';
import { createMetaPurchaseParameters } from '../src/utils/metaPixel.js';
import { createOrderHelpUrl, createOrderPayload, createOrderSuccessMessage, createSubmissionGate, submitOrder } from '../src/utils/order.js';

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
    assert.equal(payload.shippingFee, 50);
    assert.equal(payload.total, 2000 * quantity + 50);
    assert.equal(payload.finalPrice, `EGP ${(2000 * quantity + 50).toLocaleString('en-US')}`);
  });
}

for (const governorate of ['Cairo', 'Giza', 'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Dakahlia', 'Damietta', 'Faiyum', 'Gharbia', 'Ismailia', 'Kafr El Sheikh', 'Luxor', 'Matrouh', 'Minya', 'Monufia', 'New Valley', 'North Sinai', 'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai', 'Suez']) {
  test(`${governorate} charges shipping once per order`, () => {
    const shippingFee = ['Cairo', 'Giza'].includes(governorate) ? 50 : 75;
    const payload = createOrderPayload({ form: { ...form, governorate }, language: 'en', quantity: 2, product });
    assert.equal(payload.shippingFee, shippingFee);
    assert.equal(payload.subtotal, 4000);
    assert.equal(payload.total, 4000 + shippingFee);
    assert.equal(payload.finalPrice, `EGP ${(4000 + shippingFee).toLocaleString('en-US')}`);
  });
}

test('shipping and total remain pending before a governorate is selected', () => {
  assert.deepEqual(calculateOrderTotals({ quantity: 1, governorate: '' }), {
    subtotal: 2000,
    shippingFee: null,
    total: null,
  });
});

test('successful acknowledgement resolves with the backend orderId', async () => {
  const payload = { orderId: 'JUZUR-TEMP' };
  const result = await submitOrder(payload, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-583500', emailStatus: 'sent' })),
  });
  assert.deepEqual(result, { ok: true, orderId: 'ST-583500', emailStatus: 'sent' });
});

test('successful acknowledgement does not require matching the temporary orderId', async () => {
  const result = await submitOrder(
    { orderId: 'JUZUR-EXPECTED' },
    { fetchImpl: async () => new Response(JSON.stringify({ ok: true, orderId: 'ST-583501' })) },
  );
  assert.equal(result.orderId, 'ST-583501');
});

test('Meta Purchase data uses the official backend orderId', () => {
  const parameters = createMetaPurchaseParameters({
    orderId: 'ST-583500',
    product,
    quantity: 2,
    subtotal: 4000,
  });

  assert.equal(parameters.order_id, 'ST-583500');
  assert.equal(parameters.num_items, 2);
  assert.equal(parameters.value, 4000);
});

test('customer success message displays the official backend orderId', () => {
  const message = createOrderSuccessMessage({
    successMessage: 'Your order has been registered successfully.',
    language: 'en',
    orderId: 'ST-583500',
  });

  assert.equal(message, 'Your order has been registered successfully. Order ID: ST-583500');
});

test('uncertain order handoff includes the original attempt reference and delivery details', () => {
  const payload = createOrderPayload({ form, language: 'ar', quantity: 2, product, now: () => 1000, random: () => 0.5 });
  const url = new URL(createOrderHelpUrl(payload, 'ar'));
  const message = url.searchParams.get('text');
  assert.equal(url.origin, 'https://wa.me');
  assert.match(message, new RegExp(payload.orderId));
  assert.match(message, /01012345678/);
  assert.match(message, /1 Test Street, Nasr City, Cairo/);
  assert.match(message, /سعر المنتجات: 4,000 جنيه/);
  assert.match(message, /الشحن: 50 جنيه/);
  assert.match(message, /الإجمالي شامل الشحن: 4,050 جنيه/);
  assert.match(message, /قبل إنشاء طلب جديد/);
});

test('English order handoff separates products, shipping and the full total', () => {
  const payload = createOrderPayload({ form: { ...form, governorate: 'Alexandria' }, language: 'en', quantity: 1, product });
  const message = new URL(createOrderHelpUrl(payload, 'en')).searchParams.get('text');
  assert.match(message, /Product subtotal: EGP 2,000/);
  assert.match(message, /Shipping: EGP 75/);
  assert.match(message, /Total including shipping: EGP 2,075/);
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
