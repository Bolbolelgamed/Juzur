import { handleOrderRequest } from '../../server/index.js';

export function onRequest({ request, env }) {
  return handleOrderRequest(request, env);
}
