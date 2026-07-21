import { formatPrice, product } from '../config/product.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const heroImages = [
  ['/assets/juzur-tray-studio.jpg', 'studio', '50% 50%', 1484, 1060],
  ['/assets/product-2.jpg', 'side', '50% 50%', 1280, 960],
  ['/assets/juzur-tray-lifestyle.jpg', 'lifestyle', '50% 72%', 1122, 1402],
  ['/assets/product-4.jpg', 'top', '50% 50%', 900, 1200],
];

export default function Hero() {
  const { language, t } = useLanguage();

  return (
    <section className="hero" id="top" aria-label={t.hero.label}>
      <div className="site-container hero-layout">
        <div className="hero-copy reveal">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title1}<br /><span>{t.hero.title2}</span></h1>
          <p className="hero-support">{t.hero.support}</p>
          <p className="hero-text">{t.hero.text}</p>
        </div>

        <div className="hero-gallery-card reveal delay" id="heroGallery">
          <div className="hero-main-photo">
            <video
              id="heroVideo"
              className="hero-gallery-video is-visible"
              src="/assets/juzur-hero-video.mp4"
              autoPlay
              muted
              loop
              controls
              playsInline
              preload="auto"
              poster="/assets/juzur-tray-studio.jpg"
              aria-label={t.hero.videoAlt}
            />
            <img
              id="heroCurrentImage"
              className="hero-gallery-image"
              src="/assets/juzur-tray-studio.jpg"
              width="1484"
              height="1060"
              alt={t.images.studio}
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero-video-badge is-visible" id="heroVideoBadge">
              <span aria-hidden="true" />
              {t.hero.videoBadge}
            </span>
            <button className="hero-video-play" id="heroVideoPlay" type="button" aria-label={t.hero.videoPlay}>
              <span aria-hidden="true">▶</span>
              <strong>{t.hero.playVideo}</strong>
            </button>
          </div>

          <div className="hero-photo-thumbs" aria-label={t.hero.mediaLabel}>
            <button className="hero-media-thumb active" type="button" data-kind="video" aria-label={t.hero.videoPlay}>
              <video src="/assets/juzur-hero-video.mp4" muted playsInline preload="metadata" aria-hidden="true" />
              <span className="thumb-play" aria-hidden="true">▶</span>
            </button>
            {heroImages.map(([src, key, position, width, height], index) => (
              <button
                key={src}
                className="hero-media-thumb"
                type="button"
                data-kind="image"
                data-img={src}
                data-alt={t.images[key]}
                data-position={position}
                aria-label={t.images[key]}
              >
                <img src={src} width={width} height={height} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: position }} />
              </button>
            ))}
          </div>

          <div className="hero-actions">
            <a className="btn primary" href="#checkout" data-hero-cta>{t.nav.order}</a>
            <a className="btn secondary" href="#video">{t.hero.view}</a>
          </div>

          <div className="price-card hero-price" aria-label={t.hero.priceLabel}>
            <div className="price-copy">
              <span className="price-label">{t.hero.current}</span>
              <div className="price-values">
                <strong><bdi>{formatPrice(product.finalUnitPrice, language)}</bdi></strong>
                <del><bdi>{formatPrice(product.listUnitPrice, language)}</bdi></del>
              </div>
            </div>
            <span className="save-badge">{t.hero.save}</span>
          </div>

          <div className="hero-trust" aria-label={t.hero.trustLabel}>
            <span>{t.hero.wood}</span><span>{t.hero.payment}</span><span>{t.hero.delivery}</span>
          </div>
        </div>
      </div>
      <a className="scroll-hint" href="#video">{t.hero.scroll}<span aria-hidden="true">↓</span></a>
    </section>
  );
}
