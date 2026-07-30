const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const UPSTREAM_TIMEOUT_MS = 10000;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export async function handleOrderRequest(
  request,
  env,
  { fetchImpl = fetch, timeoutMs = UPSTREAM_TIMEOUT_MS } = {},
) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
  }

  if (!env.APPS_SCRIPT_ORDER_URL) {
    return jsonResponse({ ok: false, error: 'Order service is not configured.' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  if (!payload?.orderId || typeof payload.orderId !== 'string') {
    return jsonResponse({ ok: false, error: 'A valid orderId is required.' }, 400);
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const upstream = await fetchImpl(env.APPS_SCRIPT_ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return jsonResponse({ ok: false, error: 'Order service returned an error.' }, 502);
    }

    let result;
    try {
      result = await upstream.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Order service returned invalid JSON.' }, 502);
    }

    if (
      result?.ok !== true
      || (result.orderId !== undefined && result.orderId !== payload.orderId)
    ) {
      return jsonResponse({ ok: false, error: 'Order acknowledgement was not verified.' }, 502);
    }

    return jsonResponse({ ok: true, orderId: payload.orderId });
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return jsonResponse(
      { ok: false, error: timedOut ? 'Order service timed out.' : 'Order service is unavailable.' },
      timedOut ? 504 : 502,
    );
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/orders') return handleOrderRequest(request, env);

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};
