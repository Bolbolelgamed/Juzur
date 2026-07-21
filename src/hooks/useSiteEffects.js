import { useEffect } from 'react';

export function useSiteEffects(language, imagePreviewFallback) {
  useEffect(() => {
    const cleanups = [];
    const nav = document.getElementById('nav');
    const glow = document.querySelector('.cursor-glow');
    const modal = document.getElementById('modal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousModalFocus = null;

    const onScroll = () => {
      nav?.classList.toggle('scrolled', window.scrollY > 30);
      if (!reducedMotion) {
        document.querySelectorAll('.parallax').forEach((el) => {
          el.style.translate = `0 ${window.scrollY * -0.04}px`;
        });
      }
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

    if (reducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
        { threshold: 0.15 },
      );
      document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
      cleanups.push(() => revealObserver.disconnect());
    }

    const openLightbox = (event) => {
      if (!modal) return;
      const previewImage = modal.querySelector('img');
      previousModalFocus = event.currentTarget;
      previewImage.src = event.currentTarget.dataset.lightboxSrc;
      previewImage.alt = event.currentTarget.dataset.lightboxAlt || imagePreviewFallback;
      modal.classList.add('open');
      modal.querySelector('.modal-close')?.focus();
    };
    document.querySelectorAll('.lightbox').forEach((button) => {
      button.addEventListener('click', openLightbox);
      cleanups.push(() => button.removeEventListener('click', openLightbox));
    });

    const closeModal = () => {
      modal?.classList.remove('open');
      previousModalFocus?.focus();
    };
    const onModalClick = (event) => {
      if (event.target === modal || event.target.closest('.modal-close')) closeModal();
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
    };
    modal?.addEventListener('click', onModalClick);
    window.addEventListener('keydown', onKeyDown);
    cleanups.push(() => modal?.removeEventListener('click', onModalClick));
    cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

    setupHeroGallery(cleanups);
    setupStickyCta(cleanups);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [language, imagePreviewFallback]);
}

function setupHeroGallery(cleanups) {
  const heroPhotoThumbs = [...document.querySelectorAll('.hero-media-thumb')];
  const heroGallery = document.getElementById('heroGallery');
  const heroVideo = document.getElementById('heroVideo');
  const heroPreviousImage = document.getElementById('heroPreviousImage');
  const heroCurrentImage = document.getElementById('heroCurrentImage');
  const heroImageCache = new Map();
  const HERO_PHOTO_ROTATION_MS = 3000;
  const HERO_VIDEO_START_SECONDS = 0.25;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroPhotoIndex = heroPhotoThumbs.findIndex((btn) => btn.classList.contains('active'));
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
    window.clearTimeout(heroPhotoIdleTimer);
  }

  function scheduleHeroAutoplay() {
    stopHeroAutoplay();
    if (heroPhotoThumbs.length < 2 || motionQuery.matches) return;
    if (heroPhotoThumbs[heroPhotoIndex]?.dataset.kind === 'video') return;
    heroPhotoIdleTimer = window.setTimeout(
      () => showHeroPhoto(heroPhotoIndex + 1),
      HERO_PHOTO_ROTATION_MS,
    );
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
    const isVideo = btn.dataset.kind === 'video';
    if (isVideo) {
      stopHeroAutoplay();
      queuedHeroPhotoIndex = null;
      heroPhotoAnimating = false;
      heroPreviousImage.className = 'hero-gallery-layer hero-gallery-layer-previous';
      heroCurrentImage.className = 'hero-gallery-layer hero-gallery-layer-current';
      heroVideo?.classList.add('is-visible');
      if (heroVideo?.readyState >= 2) heroVideo.classList.add('is-ready');
      heroVideo?.play().catch(() => {});
      heroPhotoIndex = normalizedIndex;
      setHeroThumbState(heroPhotoIndex, 'active');
      heroGallery?.classList.remove('is-transitioning');
      return;
    }
    const nextSrc = btn.dataset.img;
    const nextAlt = btn.dataset.alt || 'SofaTray by Juzur product view';
    const nextPosition = btn.dataset.position || '50% 50%';
    const videoWasVisible = heroVideo?.classList.contains('is-visible');
    if (!nextSrc || (!videoWasVisible && heroCurrentImage.src.endsWith(nextSrc))) {
      scheduleHeroAutoplay();
      return;
    }

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
    heroVideo?.pause();
    heroVideo?.classList.remove('is-visible');
    const oldSrc = heroCurrentImage.getAttribute('src');
    if (!videoWasVisible) {
      heroPreviousImage.src = oldSrc;
      heroPreviousImage.style.objectPosition = heroCurrentImage.style.objectPosition || '50% 50%';
      heroPreviousImage.className = 'hero-gallery-layer hero-gallery-layer-previous is-visible';
    }
    heroCurrentImage.src = nextSrc;
    heroCurrentImage.alt = nextAlt;
    heroCurrentImage.style.objectPosition = nextPosition;
    heroCurrentImage.className = 'hero-gallery-layer hero-gallery-layer-current';
    heroPhotoIndex = normalizedIndex;
    setHeroThumbState(heroPhotoIndex, 'active');

    requestAnimationFrame(() => {
      heroGallery?.classList.add('is-transitioning');
      if (!videoWasVisible) heroPreviousImage.classList.add('is-leaving');
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
    }, motionQuery.matches ? 0 : 430);
  }

  function releaseDrag() {
    pointerId = null;
    isDragging = false;
    heroGallery?.classList.remove('is-dragging');
  }

  heroPhotoThumbs.forEach((btn) => {
    if (btn.dataset.kind === 'video') return;
    const src = btn.dataset.img;
    if (src) preloadHeroImage(src).catch(() => {});
  });

  heroPhotoThumbs.forEach((btn, index) => {
    const onClick = () => {
      stopHeroAutoplay();
      if (index === heroPhotoIndex && btn.dataset.kind === 'video') heroVideo?.play().catch(() => {});
      else if (index === heroPhotoIndex) scheduleHeroAutoplay();
      else showHeroPhoto(index);
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

  if (heroPhotoThumbs.length > 1 && !motionQuery.matches) {
    scheduleHeroAutoplay();
    cleanups.push(stopHeroAutoplay);
  }

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    const skipOpeningBlackFrame = () => {
      if (heroVideo.currentTime >= HERO_VIDEO_START_SECONDS || Number.isNaN(heroVideo.duration)) return;
      heroVideo.currentTime = Math.min(HERO_VIDEO_START_SECONDS, Math.max(0, heroVideo.duration - 0.1));
    };
    const markHeroVideoReady = () => {
      skipOpeningBlackFrame();
      heroVideo.classList.add('is-ready');
    };
    const startHeroVideo = () => {
      if (heroPhotoThumbs[heroPhotoIndex]?.dataset.kind !== 'video') return;
      if (heroVideo.readyState >= 2) markHeroVideoReady();
      heroVideo.play().catch(() => {});
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') startHeroVideo();
    };

    startHeroVideo();
    heroVideo.addEventListener('loadedmetadata', skipOpeningBlackFrame);
    heroVideo.addEventListener('loadeddata', markHeroVideoReady);
    heroVideo.addEventListener('canplay', startHeroVideo);
    document.addEventListener('visibilitychange', onVisibilityChange);
    cleanups.push(() => {
      heroVideo.removeEventListener('loadedmetadata', skipOpeningBlackFrame);
      heroVideo.removeEventListener('loadeddata', markHeroVideoReady);
      heroVideo.removeEventListener('canplay', startHeroVideo);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      heroVideo.pause();
    });
  }

  const onMotionPreferenceChange = () => {
    if (motionQuery.matches) stopHeroAutoplay();
    else scheduleHeroAutoplay();
  };
  motionQuery.addEventListener('change', onMotionPreferenceChange);
  cleanups.push(() => motionQuery.removeEventListener('change', onMotionPreferenceChange));

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

function setupStickyCta(cleanups) {
  const checkoutSection = document.getElementById('checkout');
  const footer = document.querySelector('footer');
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

  if (footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => document.body.classList.toggle('footer-in-view', entry.isIntersecting));
      },
      { threshold: 0.01 },
    );
    footerObserver.observe(footer);
    cleanups.push(() => footerObserver.disconnect());
  }
}
