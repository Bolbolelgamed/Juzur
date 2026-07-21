import { useEffect } from 'react';

export function useSiteEffects(language, imagePreviewFallback) {
  useEffect(() => {
    const cleanups = [];
    const nav = document.getElementById('nav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 30);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', updateNav));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        }),
        { threshold: 0.12, rootMargin: '0px 0px -40px' },
      );
      document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
      cleanups.push(() => revealObserver.disconnect());
    }

    setupHeroGallery(cleanups, reducedMotion, imagePreviewFallback);
    setupLightbox(cleanups, imagePreviewFallback);
    setupStickyCta(cleanups);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [language, imagePreviewFallback]);
}

function setupHeroGallery(cleanups, reducedMotion, imagePreviewFallback) {
  const gallery = document.getElementById('heroGallery');
  const hero = document.getElementById('top');
  const video = document.getElementById('heroVideo');
  const image = document.getElementById('heroCurrentImage');
  const videoBadge = document.getElementById('heroVideoBadge');
  const videoPlayButton = document.getElementById('heroVideoPlay');
  const thumbs = [...document.querySelectorAll('.hero-media-thumb')];
  if (!gallery || !video || !image || !thumbs.length) return;

  let activeIndex = Math.max(0, thumbs.findIndex((button) => button.classList.contains('active')));
  let heroInView = true;
  let transitionTimer;

  video.muted = true;
  video.defaultMuted = true;

  const syncVideoUi = () => {
    const videoIsActive = thumbs[activeIndex]?.dataset.kind === 'video';
    videoBadge?.classList.toggle('is-visible', videoIsActive);
    videoPlayButton?.classList.toggle('is-hidden', !videoIsActive || !video.paused);
  };

  const playActiveVideo = () => {
    if (
      reducedMotion
      || !heroInView
      || document.visibilityState !== 'visible'
      || thumbs[activeIndex]?.dataset.kind !== 'video'
    ) {
      syncVideoUi();
      return;
    }
    video.play().then(syncVideoUi).catch(syncVideoUi);
  };

  const selectMedia = (index) => {
    const next = thumbs[index];
    if (!next) return;
    thumbs.forEach((button, itemIndex) => {
      button.classList.toggle('active', itemIndex === index);
      button.setAttribute('aria-pressed', itemIndex === index ? 'true' : 'false');
    });
    activeIndex = index;

    if (next.dataset.kind === 'video') {
      window.clearTimeout(transitionTimer);
      image.classList.remove('is-visible');
      video.classList.add('is-visible');
      playActiveVideo();
      syncVideoUi();
      return;
    }

    const swapImage = () => {
      image.src = next.dataset.img;
      image.alt = next.dataset.alt || imagePreviewFallback;
      image.style.objectPosition = next.dataset.position || '50% 50%';
      video.pause();
      video.classList.remove('is-visible');
      image.classList.add('is-visible');
      syncVideoUi();
    };

    if (reducedMotion) {
      swapImage();
    } else {
      image.classList.remove('is-visible');
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(swapImage, 150);
    }
  };

  thumbs.forEach((button, index) => {
    const onClick = () => selectMedia(index);
    button.setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  const onVideoReady = () => playActiveVideo();
  const onVideoStateChange = () => syncVideoUi();
  const onVideoPlayClick = () => {
    video.play().then(syncVideoUi).catch(syncVideoUi);
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') playActiveVideo();
    else video.pause();
  };

  video.addEventListener('loadeddata', onVideoReady);
  video.addEventListener('canplay', onVideoReady);
  video.addEventListener('play', onVideoStateChange);
  video.addEventListener('pause', onVideoStateChange);
  video.addEventListener('ended', onVideoStateChange);
  videoPlayButton?.addEventListener('click', onVideoPlayClick);
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (hero && 'IntersectionObserver' in window) {
    const heroVideoObserver = new IntersectionObserver((entries) => {
      heroInView = entries.some((entry) => entry.isIntersecting);
      if (heroInView) playActiveVideo();
      else video.pause();
    }, { threshold: 0.15 });
    heroVideoObserver.observe(hero);
    cleanups.push(() => heroVideoObserver.disconnect());
  }

  selectMedia(activeIndex);

  const onKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !gallery.contains(document.activeElement)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (activeIndex + direction + thumbs.length) % thumbs.length;
    selectMedia(nextIndex);
    thumbs[nextIndex].focus();
  };
  gallery.addEventListener('keydown', onKeyDown);
  cleanups.push(() => {
    gallery.removeEventListener('keydown', onKeyDown);
    video.removeEventListener('loadeddata', onVideoReady);
    video.removeEventListener('canplay', onVideoReady);
    video.removeEventListener('play', onVideoStateChange);
    video.removeEventListener('pause', onVideoStateChange);
    video.removeEventListener('ended', onVideoStateChange);
    videoPlayButton?.removeEventListener('click', onVideoPlayClick);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.clearTimeout(transitionTimer);
    video.pause();
  });
}

function setupLightbox(cleanups, imagePreviewFallback) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const previewImage = modal.querySelector('img');
  const closeButton = modal.querySelector('.modal-close');
  let previousFocus = null;

  const open = (event) => {
    previousFocus = event.currentTarget;
    previewImage.src = event.currentTarget.dataset.lightboxSrc;
    previewImage.alt = event.currentTarget.dataset.lightboxAlt || imagePreviewFallback;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    closeButton?.focus();
  };

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    previewImage.removeAttribute('src');
    previewImage.alt = '';
    previousFocus?.focus();
  };

  document.querySelectorAll('.lightbox').forEach((button) => {
    button.addEventListener('click', open);
    cleanups.push(() => button.removeEventListener('click', open));
  });

  const onModalClick = (event) => {
    if (event.target === modal || event.target.closest('.modal-close')) close();
  };
  const onKeyDown = (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton?.focus();
    }
  };

  modal.addEventListener('click', onModalClick);
  window.addEventListener('keydown', onKeyDown);
  cleanups.push(() => {
    modal.removeEventListener('click', onModalClick);
    window.removeEventListener('keydown', onKeyDown);
    document.body.classList.remove('modal-open');
  });
}

function setupStickyCta(cleanups) {
  const stickyCta = document.querySelector('.mobile-sticky-cta');
  const heroCta = document.querySelector('[data-hero-cta]');
  const videoSection = document.getElementById('video');
  const checkout = document.getElementById('checkout');
  const footer = document.querySelector('footer');
  if (!stickyCta || !('IntersectionObserver' in window)) return;

  const state = { hero: true, video: false, checkout: false, footer: false };
  const update = () => {
    stickyCta.classList.toggle('is-visible', !state.hero && !state.video && !state.checkout && !state.footer);
  };
  const observe = (element, key, threshold = 0.01) => {
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { state[key] = entry.isIntersecting; });
      update();
    }, { threshold });
    observer.observe(element);
    cleanups.push(() => observer.disconnect());
  };

  observe(heroCta, 'hero');
  observe(videoSection, 'video', 0.08);
  observe(checkout, 'checkout', 0.05);
  observe(footer, 'footer');
}
