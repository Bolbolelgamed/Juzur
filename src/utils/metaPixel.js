const pixelId = String(import.meta.env.VITE_META_PIXEL_ID || '').trim();

let initialized = false;
let initialPageViewTracked = false;
let initialViewContentTracked = false;

function hasValidPixelId() {
  return /^\d+$/.test(pixelId);
}

export function initializeMetaPixel() {
  if (initialized || !hasValidPixelId() || typeof window === 'undefined') return false;

  const fbq = function metaPixelQueue(...args) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = window.fbq || fbq;
  window._fbq = window._fbq || window.fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', pixelId);
  initialized = true;
  return true;
}

export function trackMetaEvent(eventName, parameters = {}) {
  if (!initializeMetaPixel()) {
    if (!initialized) return false;
  }

  window.fbq('track', eventName, parameters);
  return true;
}

export function trackInitialMetaPageView() {
  if (initialPageViewTracked) return false;
  const tracked = trackMetaEvent('PageView');
  if (tracked) initialPageViewTracked = true;
  return tracked;
}

export function trackInitialMetaViewContent(parameters) {
  if (initialViewContentTracked) return false;
  const tracked = trackMetaEvent('ViewContent', parameters);
  if (tracked) initialViewContentTracked = true;
  return tracked;
}

export function isMetaPixelEnabled() {
  return hasValidPixelId();
}
