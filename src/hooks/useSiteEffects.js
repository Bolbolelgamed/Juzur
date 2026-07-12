import { useEffect } from 'react';

const GOOGLE_SHEETS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwSe1QGurJhBKVmZCCwlsrltcZ6PTHpZlpQkqvt2sCAxdMQxjoCifCeC0ZDAqx9JEGxLA/exec';
const PRODUCT_ORIGINAL_PRICE = 'EGP 2,499';
const PRODUCT_DISCOUNT = '20%';
const PRODUCT_FINAL_PRICE = 'EGP 1,999';

export function useSiteEffects() {
  useEffect(() => {
    const cleanups = [];
    const nav = document.getElementById('nav');
    const glow = document.querySelector('.cursor-glow');
    const word = document.getElementById('word');
    const modal = document.getElementById('modal');
    const words = ['Relax zone.', 'Coffee time.', 'Quiet living.'];
    let wordIndex = 0;

    if (word) {
      const wordTimer = window.setInterval(() => {
        wordIndex = (wordIndex + 1) % words.length;
        word.textContent = words[wordIndex];
      }, 1500);
      cleanups.push(() => window.clearInterval(wordTimer));
    }

    const onScroll = () => {
      nav?.classList.toggle('scrolled', window.scrollY > 30);
      document.querySelectorAll('.parallax').forEach((el) => {
        el.style.translate = `0 ${window.scrollY * -0.04}px`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const onMouseMove = (event) => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };
    window.addEventListener('mousemove', onMouseMove);
    cleanups.push(() => window.removeEventListener('mousemove', onMouseMove));

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.15 },
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    cleanups.push(() => revealObserver.disconnect());

    const openLightbox = (event) => {
      if (!modal) return;
      modal.querySelector('img').src = event.currentTarget.src;
      modal.classList.add('open');
    };
    document.querySelectorAll('.lightbox').forEach((img) => {
      img.addEventListener('click', openLightbox);
      cleanups.push(() => img.removeEventListener('click', openLightbox));
    });

    const closeModal = () => modal?.classList.remove('open');
    modal?.addEventListener('click', closeModal);
    cleanups.push(() => modal?.removeEventListener('click', closeModal));

    setupHeroGallery(cleanups);
    setupCheckoutForm(cleanups);
    setupStickyCta(cleanups);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
}

function setupHeroGallery(cleanups) {
  const heroPhotoThumbs = [...document.querySelectorAll('.hero-photo-thumb')];
  const heroGallery = document.getElementById('heroGallery');
  const heroPreviousImage = document.getElementById('heroPreviousImage');
  const heroCurrentImage = document.getElementById('heroCurrentImage');
  const heroImageCache = new Map();
  const HERO_PHOTO_ROTATION_MS = 3000;
  const HERO_PHOTO_RESUME_MS = 1200;
  let heroPhotoIndex = heroPhotoThumbs.findIndex((btn) => btn.classList.contains('active'));
  let heroPhotoTimer;
  let heroPhotoIdleTimer;
  let heroPhotoAnimating = false;
  let queuedHeroPhotoIndex = null;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let dragX = 0;
  let isDragging = false;

  if (heroPhotoIndex < 0) heroPhotoIndex = 0;

  function preloadHeroImage(src) {
    if (heroImageCache.has(src)) return heroImageCache.get(src);
    const request = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.decoding = 'async';
      img.src = src;
    });
    heroImageCache.set(src, request);
    return request;
  }

  function stopHeroAutoplay() {
    window.clearInterval(heroPhotoTimer);
    window.clearTimeout(heroPhotoIdleTimer);
  }

  function scheduleHeroAutoplay() {
    stopHeroAutoplay();
    if (heroPhotoThumbs.length < 2) return;
    heroPhotoIdleTimer = window.setTimeout(() => {
      heroPhotoTimer = window.setInterval(() => showHeroPhoto(heroPhotoIndex + 1), HERO_PHOTO_ROTATION_MS);
    }, HERO_PHOTO_RESUME_MS);
  }

  function setHeroThumbState(index, state) {
    heroPhotoThumbs.forEach((item, itemIndex) => {
      item.classList.toggle('active', itemIndex === index && state === 'active');
      item.classList.toggle('is-pending', itemIndex === index && state === 'pending');
    });
  }

  async function showHeroPhoto(index) {
    if (!heroPreviousImage || !heroCurrentImage || !heroPhotoThumbs.length) return;
    const normalizedIndex = (index + heroPhotoThumbs.length) % heroPhotoThumbs.length;
    if (heroPhotoAnimating) {
      queuedHeroPhotoIndex = normalizedIndex;
      return;
    }
    const btn = heroPhotoThumbs[normalizedIndex];
    const nextSrc = btn.dataset.img;
    if (!nextSrc || heroCurrentImage.src.endsWith(nextSrc)) return;

    stopHeroAutoplay();
    setHeroThumbState(normalizedIndex, 'pending');

    try {
      await preloadHeroImage(nextSrc);
    } catch {
      setHeroThumbState(heroPhotoIndex, 'active');
      scheduleHeroAutoplay();
      return;
    }

    heroPhotoAnimating = true;
    const oldSrc = heroCurrentImage.getAttribute('src');
    heroPreviousImage.src = oldSrc;
    heroPreviousImage.className = 'hero-gallery-layer hero-gallery-layer-previous is-visible';
    heroCurrentImage.src = nextSrc;
    heroCurrentImage.className = 'hero-gallery-layer hero-gallery-layer-current';
    heroPhotoIndex = normalizedIndex;
    setHeroThumbState(heroPhotoIndex, 'active');

    requestAnimationFrame(() => {
      heroGallery?.classList.add('is-transitioning');
      heroPreviousImage.classList.add('is-leaving');
      heroCurrentImage.classList.add('is-visible');
    });

    window.setTimeout(() => {
      heroPreviousImage.className = 'hero-gallery-layer hero-gallery-layer-previous';
      heroCurrentImage.className = 'hero-gallery-layer hero-gallery-layer-current is-visible';
      heroPhotoAnimating = false;
      const queuedIndex = queuedHeroPhotoIndex;
      queuedHeroPhotoIndex = null;
      heroGallery?.classList.remove('is-transitioning');
      if (queuedIndex !== null && queuedIndex !== heroPhotoIndex) {
        showHeroPhoto(queuedIndex);
        return;
      }
      scheduleHeroAutoplay();
    }, 430);
  }

  function releaseDrag() {
    pointerId = null;
    isDragging = false;
    heroGallery?.classList.remove('is-dragging');
  }

  heroPhotoThumbs.forEach((btn) => {
    const src = btn.dataset.img;
    if (src) preloadHeroImage(src).catch(() => {});
  });

  heroPhotoThumbs.forEach((btn, index) => {
    const onClick = () => {
      stopHeroAutoplay();
      showHeroPhoto(index);
    };
    btn.addEventListener('click', onClick);
    btn.addEventListener('mouseenter', stopHeroAutoplay);
    btn.addEventListener('mouseleave', scheduleHeroAutoplay);
    cleanups.push(() => {
      btn.removeEventListener('click', onClick);
      btn.removeEventListener('mouseenter', stopHeroAutoplay);
      btn.removeEventListener('mouseleave', scheduleHeroAutoplay);
    });
  });

  if (heroPhotoThumbs.length > 1) {
    heroPhotoTimer = window.setInterval(() => showHeroPhoto(heroPhotoIndex + 1), HERO_PHOTO_ROTATION_MS);
    cleanups.push(stopHeroAutoplay);
  }

  if (!heroGallery) return;

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragX = 0;
    isDragging = false;
    stopHeroAutoplay();
    heroGallery.setPointerCapture(pointerId);
  };
  const onPointerMove = (event) => {
    if (pointerId !== event.pointerId) return;
    dragX = event.clientX - startX;
    const dragY = event.clientY - startY;
    if (!isDragging) {
      if (Math.abs(dragX) < 8 || Math.abs(dragX) < Math.abs(dragY)) return;
      isDragging = true;
      heroGallery.classList.add('is-dragging');
    }
    event.preventDefault();
  };
  const onPointerUp = (event) => {
    if (pointerId !== event.pointerId) return;
    if (isDragging && Math.abs(dragX) > 64) {
      showHeroPhoto(dragX < 0 ? heroPhotoIndex + 1 : heroPhotoIndex - 1);
    } else {
      scheduleHeroAutoplay();
    }
    releaseDrag();
  };
  const onPointerCancel = () => {
    releaseDrag();
    scheduleHeroAutoplay();
  };

  heroGallery.addEventListener('pointerdown', onPointerDown);
  heroGallery.addEventListener('pointermove', onPointerMove, { passive: false });
  heroGallery.addEventListener('pointerup', onPointerUp);
  heroGallery.addEventListener('pointercancel', onPointerCancel);
  heroGallery.addEventListener('lostpointercapture', releaseDrag);
  cleanups.push(() => {
    heroGallery.removeEventListener('pointerdown', onPointerDown);
    heroGallery.removeEventListener('pointermove', onPointerMove);
    heroGallery.removeEventListener('pointerup', onPointerUp);
    heroGallery.removeEventListener('pointercancel', onPointerCancel);
    heroGallery.removeEventListener('lostpointercapture', releaseDrag);
  });
}

function setupCheckoutForm(cleanups) {
  const checkoutForm = document.getElementById('checkoutForm');
  let checkoutIsSubmitting = false;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (checkoutIsSubmitting) return;
    checkoutIsSubmitting = true;
    const note = document.getElementById('checkoutNote');
    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }
    const formData = new FormData(checkoutForm);
    const payload = {
      orderId: `JUZUR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: (formData.get('name') || '').toString().trim(),
      address: (formData.get('address') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      pieces: (formData.get('pieces') || '1').toString().trim(),
      originalPrice: PRODUCT_ORIGINAL_PRICE,
      discount: PRODUCT_DISCOUNT,
      finalPrice: PRODUCT_FINAL_PRICE,
      submittedAt: new Date().toISOString(),
    };

    if (note) {
      note.textContent = 'Submitting your order...';
      note.classList.add('success');
    }

    try {
      const sheetsRequest = fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });
      await Promise.race([sheetsRequest, new Promise((resolve) => window.setTimeout(resolve, 4500))]);
      if (note) note.textContent = 'Thank you. Your order was submitted and we will contact you to confirm delivery.';
      checkoutForm.reset();
      if (checkoutForm.elements.pieces) checkoutForm.elements.pieces.value = '1';
    } catch {
      if (note) {
        note.textContent = 'The order could not be sent. Please try again or contact us directly.';
        note.classList.remove('success');
      }
    } finally {
      checkoutIsSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Order';
      }
    }
  };

  checkoutForm?.addEventListener('submit', onSubmit);
  cleanups.push(() => checkoutForm?.removeEventListener('submit', onSubmit));
}

function setupStickyCta(cleanups) {
  const checkoutSection = document.getElementById('checkout');
  const heroCta = document.querySelector('[data-hero-cta]');
  const inlineOrderCtas = [...document.querySelectorAll('a.btn.primary[href="#checkout"]')];

  function setHeroCtaVisibilityState(isVisible) {
    document.body.classList.add('sticky-cta-ready');
    document.body.classList.toggle('hero-cta-in-view', isVisible);
  }

  function setInlineOrderCtaVisibilityState() {
    const hasVisibleOrderCta = inlineOrderCtas.some((cta) => {
      const rect = cta.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
    document.body.classList.add('sticky-cta-ready');
    document.body.classList.toggle('order-cta-in-view', hasVisibleOrderCta);
  }

  if (heroCta) {
    const heroCtaObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setHeroCtaVisibilityState(entry.isIntersecting)),
      { threshold: 0.01 },
    );
    heroCtaObserver.observe(heroCta);
    cleanups.push(() => heroCtaObserver.disconnect());
  }

  if (inlineOrderCtas.length) {
    const inlineOrderCtaObserver = new IntersectionObserver(setInlineOrderCtaVisibilityState, { threshold: 0.01 });
    inlineOrderCtas.forEach((cta) => inlineOrderCtaObserver.observe(cta));
    setInlineOrderCtaVisibilityState();
    window.addEventListener('scroll', setInlineOrderCtaVisibilityState, { passive: true });
    window.addEventListener('resize', setInlineOrderCtaVisibilityState);
    cleanups.push(() => {
      inlineOrderCtaObserver.disconnect();
      window.removeEventListener('scroll', setInlineOrderCtaVisibilityState);
      window.removeEventListener('resize', setInlineOrderCtaVisibilityState);
    });
  }

  if (checkoutSection) {
    const checkoutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          document.body.classList.toggle('checkout-in-view', entry.isIntersecting);
        });
      },
      { threshold: 0.08 },
    );
    checkoutObserver.observe(checkoutSection);
    cleanups.push(() => checkoutObserver.disconnect());
  }
}
