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

    const lightboxButtons = [...document.querySelectorAll('.lightbox')];
    let activePhotos = [];
    let activePhotoIndex = 0;
    let touchStartX = null;

    const showModalPhoto = (index) => {
      if (!modal || !activePhotos.length) return;
      activePhotoIndex = (index + activePhotos.length) % activePhotos.length;
      const photo = activePhotos[activePhotoIndex];
      const previewImage = modal.querySelector('.modal-content img');
      previewImage.src = photo.dataset.lightboxSrc;
      previewImage.alt = photo.dataset.lightboxAlt || imagePreviewFallback;
      modal.querySelectorAll('.modal-nav').forEach((button) => {
        button.hidden = activePhotos.length < 2;
      });
    };
    const openLightbox = (event) => {
      if (!modal) return;
      const button = event.currentTarget;
      previousModalFocus = button;
      // The gift strip and product grid each keep their own photo order.
      const group = button.closest('.gift-photo-strip, .gallery-grid');
      activePhotos = group ? [...group.querySelectorAll('.lightbox')] : lightboxButtons;
      showModalPhoto(activePhotos.indexOf(button));
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      modal.querySelector('.modal-close')?.focus();
    };
    lightboxButtons.forEach((button) => {
      button.addEventListener('click', openLightbox);
      cleanups.push(() => button.removeEventListener('click', openLightbox));
    });

    const closeModal = () => {
      modal?.classList.remove('open');
      document.body.classList.remove('modal-open');
      activePhotos = [];
      previousModalFocus?.focus();
    };
    const onModalClick = (event) => {
      if (event.target === modal || event.target.closest('.modal-close')) closeModal();
      else if (event.target.closest('.modal-prev')) showModalPhoto(activePhotoIndex - 1);
      else if (event.target.closest('.modal-next')) showModalPhoto(activePhotoIndex + 1);
    };
    const onKeyDown = (event) => {
      if (!modal?.classList.contains('open')) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') { event.preventDefault(); showModalPhoto(activePhotoIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showModalPhoto(activePhotoIndex + 1); }
      if (event.key === 'Tab') {
        const controls = [...modal.querySelectorAll('button:not([hidden])')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onTouchStart = (event) => { touchStartX = event.touches[0]?.clientX ?? null; };
    const onTouchEnd = (event) => {
      if (touchStartX === null) return;
      const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) > 50) showModalPhoto(activePhotoIndex + (distance < 0 ? 1 : -1));
    };
    modal?.addEventListener('click', onModalClick);
    modal?.addEventListener('touchstart', onTouchStart, { passive: true });
    modal?.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    cleanups.push(() => modal?.removeEventListener('click', onModalClick));
    cleanups.push(() => modal?.removeEventListener('touchstart', onTouchStart));
    cleanups.push(() => modal?.removeEventListener('touchend', onTouchEnd));
    cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

    setupHeroVideo(cleanups);
    setupHeroGallery(cleanups);
    setupStickyCta(cleanups);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [language, imagePreviewFallback]);
}

function setupHeroVideo(cleanups) {
  const heroVideo = document.getElementById('heroVideo');
  if (!heroVideo) return;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let startTimer;
  let idleId;
  let started = false;

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  const skipOpeningFrame = () => {
    if (heroVideo.currentTime < 0.25 && Number.isFinite(heroVideo.duration)) {
      heroVideo.currentTime = Math.min(0.25, Math.max(0, heroVideo.duration - 0.1));
    }
  };
  const startHeroVideo = () => {
    if (motionQuery.matches || document.visibilityState !== 'visible') return;
    started = true;
    heroVideo.play().catch(() => {});
  };
  const scheduleStart = () => {
    startTimer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(startHeroVideo, { timeout: 2500 });
      } else startHeroVideo();
    }, 400);
  };
  const onVisibilityChange = () => {
    if (started && document.visibilityState === 'visible') startHeroVideo();
  };
  const onMotionChange = () => {
    if (motionQuery.matches) heroVideo.pause();
    else startHeroVideo();
  };

  if (document.readyState === 'complete') scheduleStart();
  else window.addEventListener('load', scheduleStart, { once: true });
  heroVideo.addEventListener('loadedmetadata', skipOpeningFrame);
  document.addEventListener('visibilitychange', onVisibilityChange);
  motionQuery.addEventListener('change', onMotionChange);
  cleanups.push(() => {
    window.removeEventListener('load', scheduleStart);
    window.clearTimeout(startTimer);
    if (idleId) window.cancelIdleCallback?.(idleId);
    heroVideo.removeEventListener('loadedmetadata', skipOpeningFrame);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    motionQuery.removeEventListener('change', onMotionChange);
    heroVideo.pause();
  });
}

function setupHeroGallery(cleanups) {
  const gallery = document.getElementById('heroGallery');
  const surface = gallery?.querySelector('.hero-main-photo');
  const current = document.getElementById('heroCurrentImage');
  const previous = document.getElementById('heroPreviousImage');
  const thumbs = [...(gallery?.querySelectorAll('.hero-media-thumb') || [])];
  if (!gallery || !surface || !current || !previous || !thumbs.length) return;

  let index = 0;
  let requestId = 0;
  let transitionTimer;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let dragX = 0;
  let dragging = false;
  const cache = new Map();
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function preload(src) {
    if (!cache.has(src)) cache.set(src, new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    }));
    return cache.get(src);
  }

  async function show(nextIndex) {
    const next = (nextIndex + thumbs.length) % thumbs.length;
    if (next === index) return;
    const target = thumbs[next];
    const src = target.dataset.img;
    const ticket = ++requestId;
    target.classList.add('is-pending');
    try {
      await preload(src);
    } catch {
      target.classList.remove('is-pending');
      return;
    }
    target.classList.remove('is-pending');
    if (ticket !== requestId) return;

    window.clearTimeout(transitionTimer);
    previous.src = current.getAttribute('src');
    previous.style.objectPosition = current.style.objectPosition || '50% 50%';
    previous.className = 'hero-gallery-layer hero-gallery-layer-previous is-visible';
    current.className = 'hero-gallery-layer hero-gallery-layer-current';
    current.src = src;
    current.alt = target.dataset.alt || '';
    current.style.objectPosition = target.dataset.position || '50% 50%';
    index = next;
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('active', thumbIndex === next);
      thumb.setAttribute('aria-pressed', String(thumbIndex === next));
    });
    requestAnimationFrame(() => {
      current.classList.add('is-visible');
      previous.classList.add('is-leaving');
    });
    transitionTimer = window.setTimeout(() => {
      previous.className = 'hero-gallery-layer hero-gallery-layer-previous';
    }, motionQuery.matches ? 0 : 430);
  }

  thumbs.forEach((thumb, thumbIndex) => {
    const onClick = () => show(thumbIndex);
    thumb.addEventListener('click', onClick);
    cleanups.push(() => thumb.removeEventListener('click', onClick));
  });

  const prev = gallery.querySelector('.hero-photo-prev');
  const next = gallery.querySelector('.hero-photo-next');
  const onPrev = () => show(index - 1);
  const onNext = () => show(index + 1);
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  cleanups.push(() => {
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    window.clearTimeout(transitionTimer);
  });

  const release = (event) => {
    if (event && surface.hasPointerCapture?.(event.pointerId)) {
      surface.releasePointerCapture(event.pointerId);
    }
    pointerId = null;
    dragging = false;
    gallery.classList.remove('is-dragging');
  };
  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('button')) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragX = 0;
    dragging = false;
    surface.setPointerCapture(pointerId);
  };
  const onPointerMove = (event) => {
    if (pointerId !== event.pointerId) return;
    dragX = event.clientX - startX;
    const dragY = event.clientY - startY;
    if (!dragging) {
      if (Math.abs(dragX) < 8 || Math.abs(dragX) < Math.abs(dragY)) return;
      dragging = true;
      gallery.classList.add('is-dragging');
    }
    event.preventDefault();
  };
  const onPointerUp = (event) => {
    if (pointerId !== event.pointerId) return;
    if (dragging && Math.abs(dragX) > 64) show(index + (dragX < 0 ? 1 : -1));
    release(event);
  };
  const onPointerCancel = (event) => release(event);
  const onLostPointerCapture = (event) => {
    if (pointerId === event.pointerId) release();
  };
  surface.addEventListener('pointerdown', onPointerDown);
  surface.addEventListener('pointermove', onPointerMove, { passive: false });
  surface.addEventListener('pointerup', onPointerUp);
  surface.addEventListener('pointercancel', onPointerCancel);
  surface.addEventListener('lostpointercapture', onLostPointerCapture);
  cleanups.push(() => {
    surface.removeEventListener('pointerdown', onPointerDown);
    surface.removeEventListener('pointermove', onPointerMove);
    surface.removeEventListener('pointerup', onPointerUp);
    surface.removeEventListener('pointercancel', onPointerCancel);
    surface.removeEventListener('lostpointercapture', onLostPointerCapture);
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
