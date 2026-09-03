import { formatPrice } from '../config/product.js';

export const ORDER_ENDPOINT = '/api/orders';
export const ORDER_TIMEOUT_MS = 10000;

export function normalizeEgyptianMobile(value) {
  let compact = String(value).trim().replace(/[\s()-]/g, '');

  if (compact.startsWith('+20')) {
    compact = `0${compact.slice(3)}`;
  } else if (compact.startsWith('0020')) {
    compact = `0${compact.slice(4)}`;
  }

  return compact;
}

export function isValidEgyptianMobile(value) {
  return /^01[0125]\d{8}$/.test(normalizeEgyptianMobile(value));
}

export function createSubmissionGate() {
  let active = false;
  return {
    tryStart() {
      if (active) return false;
      active = true;
      return true;
    },
    finish() {
      active = false;
    },
  };
}

export function createOrderPayload({ form, language, quantity, product, now = Date.now, random = Math.random }) {
  const subtotal = product.finalUnitPrice * quantity;
  const timestamp = now();
  const submissionTimestamp = new Date(timestamp).toISOString();

  const getCookieValue = (name) => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
  };

  return {
    orderId: `JUZUR-${timestamp}-${random().toString(36).slice(2, 8).toUpperCase()}`,
    productName: product.name,
    fullName: form.fullName.trim(),
    phone: normalizeEgyptianMobile(form.phone),
    governorate: form.governorate,
    areaCity: form.areaCity.trim(),
    detailedAddress: form.detailedAddress.trim(),
    landmark: form.landmark.trim(),
    quantity,
    unitPrice: product.finalUnitPrice,
    subtotal,
    paymentMethod: product.paymentMethod,
    deliveryNote: product.deliveryFeeMessage,
    submissionTimestamp,

    fbp: getCookieValue('_fbp'),
    fbc: getCookieValue('_fbc'),
    userAgent:
      typeof navigator !== 'undefined'
        ? navigator.userAgent
        : '',
    eventSourceUrl:
      typeof window !== 'undefined'
        ? window.location.href
        : '',

    name: form.fullName.trim(),
    address: `${form.detailedAddress.trim()}, ${form.areaCity.trim()}, ${form.governorate}`,
    pieces: String(quantity),
    finalPrice: formatPrice(subtotal, 'en'),
    submittedAt: submissionTimestamp,
    language,
  };
}

export function createOrderSuccessMessage({ successMessage, language, orderId }) {
  const orderLabel = language === 'ar' ? 'رقم الطلب:' : 'Order ID:';
  return `${successMessage} ${orderLabel} ${orderId}`;
}

export async function submitOrder(
  payload,
  { fetchImpl = fetch, timeoutMs = ORDER_TIMEOUT_MS } = {},
) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('Order endpoint returned an error response.');

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('Order endpoint returned invalid JSON.');
    }

    if (result?.ok !== true) {
      throw new Error(result?.error || 'Order acknowledgement could not be verified.');
    }

    return { ...result, orderId: result.orderId || payload.orderId };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
