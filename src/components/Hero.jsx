import { formatPrice, product } from '../config/product.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Hero() {
  const { language, t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const heroPhotos = [[`${assetsBase}juzur-tray-studio.webp`, t.images.studio, '50% 50%'], [`${assetsBase}product-2.webp`, t.images.side, '50% 50%'], [`${assetsBase}juzur-tray-lifestyle.webp`, t.images.lifestyle, '50% 72%'], [`${assetsBase}product-4.webp`, t.images.top, '50% 50%']];
  return <section className="hero hero-carousel" aria-label={t.hero.label}>
    <div className="hero-copy reveal"><p className="eyebrow">{t.hero.eyebrow}</p><h1>{t.hero.title1}<br /><span>{t.hero.title2}</span></h1><p className="hero-support">{t.hero.support}</p><p className="hero-text">{t.hero.text}</p></div>
    <div className="hero-product-gallery reveal delay" id="heroGallery">
      <div className="hero-main-photo"><video id="heroVideo" className="hero-gallery-video is-visible" src={`${assetsBase}juzur-hero-video.mp4`} muted loop controls playsInline preload="none" poster={`${assetsBase}juzur-tray-studio.webp`} aria-label={t.hero.videoAlt} /><img id="heroPreviousImage" className="hero-gallery-layer hero-gallery-layer-previous" src={`${assetsBase}juzur-tray-studio.webp`} alt="" aria-hidden="true" width="1484" height="1060" style={{ objectPosition: '50% 50%' }} /><img id="heroCurrentImage" className="hero-gallery-layer hero-gallery-layer-current is-visible" src={`${assetsBase}juzur-tray-studio.webp`} alt={t.images.studio} width="1484" height="1060" fetchPriority="high" decoding="async" style={{ objectPosition: '50% 50%' }} /></div>
      <div className="hero-photo-thumbs" aria-label={t.hero.mediaLabel}><button className="hero-photo-thumb hero-media-thumb active" type="button" data-kind="video" aria-label={t.hero.videoPlay}><img src={`${assetsBase}juzur-tray-studio.webp`} alt="" width="1484" height="1060" loading="lazy" decoding="async" /></button>{heroPhotos.map(([src, alt, position]) => <button key={src} className="hero-photo-thumb hero-media-thumb" type="button" data-kind="image" data-img={src} data-alt={alt} data-position={position} aria-label={alt}><img src={src} alt="" width="1484" height="1060" loading="lazy" decoding="async" style={{ objectPosition: position }} /></button>)}</div>
      <div className="hero-actions"><a className="btn primary" href="#checkout" data-hero-cta>{t.nav.order}</a><a className="btn glass" href="#video">{t.hero.view}</a></div>
      <div className="hero-price launch-price" aria-label={t.hero.priceLabel}><div><span>{t.hero.special}</span><span className="price-comparison"><del><bdi>{formatPrice(product.listUnitPrice, language)}</bdi></del><strong><bdi>{formatPrice(product.finalUnitPrice, language)}</bdi></strong></span></div><span className="discount-badge">{language === 'ar' ? 'وفّر 500 جنيه' : 'Save EGP 500'}</span></div>
      <div className="hero-trust" aria-label={t.hero.trustLabel}><span>{t.hero.wood}</span><span>{t.hero.payment}</span><span>{t.hero.delivery}</span></div>
    </div><div className="scroll-hint">{t.hero.scroll}</div>
  </section>;
}
