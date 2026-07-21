import { formatPrice, product } from '../config/product.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Hero() {
  const { language, t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const heroPhotos = [[`${assetsBase}juzur-tray-studio.jpg`, t.images.studio, '50% 50%'], [`${assetsBase}product-2.jpg`, t.images.side, '50% 50%'], [`${assetsBase}juzur-tray-lifestyle.jpg`, t.images.lifestyle, '50% 72%'], [`${assetsBase}product-4.jpg`, t.images.top, '50% 50%']];
  return <section className="hero hero-carousel" aria-label={t.hero.label}>
    <div className="hero-copy reveal"><p className="eyebrow">{t.hero.eyebrow}</p><h1>{t.hero.title1}<br /><span>{t.hero.title2}</span></h1><p className="hero-support">{t.hero.support}</p><p className="hero-text">{t.hero.text}</p></div>
    <div className="hero-product-gallery reveal delay" id="heroGallery">
      <div className="hero-main-photo"><video id="heroVideo" className="hero-gallery-video is-visible" src={`${assetsBase}juzur-hero-video.mp4`} autoPlay muted loop controls playsInline preload="auto" poster={`${assetsBase}juzur-tray-studio.jpg`} aria-label={t.hero.videoAlt} /><img id="heroPreviousImage" className="hero-gallery-layer hero-gallery-layer-previous" src={`${assetsBase}juzur-tray-studio.jpg`} alt="" aria-hidden="true" style={{ objectPosition: '50% 50%' }} /><img id="heroCurrentImage" className="hero-gallery-layer hero-gallery-layer-current is-visible" src={`${assetsBase}juzur-tray-studio.jpg`} alt={t.images.studio} fetchPriority="high" style={{ objectPosition: '50% 50%' }} /></div>
      <div className="hero-photo-thumbs" aria-label={t.hero.mediaLabel}><button className="hero-photo-thumb hero-media-thumb active" type="button" data-kind="video" aria-label={t.hero.videoPlay}><video src={`${assetsBase}juzur-hero-video.mp4`} muted playsInline preload="metadata" aria-hidden="true" /></button>{heroPhotos.map(([src, alt, position], index) => <button key={src} className="hero-photo-thumb hero-media-thumb" type="button" data-kind="image" data-img={src} data-alt={alt} data-position={position} aria-label={alt}><img src={src} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: position }} /></button>)}</div>
      <div className="hero-actions"><a className="btn primary" href="#checkout" data-hero-cta>{t.nav.order}</a><a className="btn glass" href="#video">{t.hero.view}</a></div>
      <div className="hero-price launch-price" aria-label={language === 'ar' ? 'السعر الحالي، ٢٬٠٠٠ جنيه، بدلًا من ٢٬٥٠٠ جنيه، وفر ٥٠٠ جنيه' : 'Current price EGP 2,000, previously EGP 2,500, save EGP 500'}><div><span>{language === 'ar' ? 'السعر الحالي' : 'Current price'}</span><span className="price-comparison"><del><bdi>{formatPrice(product.listUnitPrice, language)}</bdi></del><strong><bdi>{formatPrice(product.finalUnitPrice, language)}</bdi></strong></span></div><span className="discount-badge">{language === 'ar' ? 'وفر ٥٠٠ جنيه' : 'Save EGP 500'}</span></div>
      <div className="hero-trust" aria-label={t.hero.trustLabel}><span>{t.hero.wood}</span><span>{t.hero.payment}</span><span>{t.hero.delivery}</span></div>
    </div><div className="scroll-hint">{t.hero.scroll}</div>
  </section>;
}
