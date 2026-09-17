import { formatPrice, product } from '../config/product.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { thumbnailImage } from '../utils/assets.js';

export default function Hero() {
  const { language, t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  return <section className="hero hero-carousel" aria-label={t.hero.label}>
    <div className="hero-copy reveal"><p className="eyebrow">{t.hero.eyebrow}</p><h1>{t.hero.title1}<br /><span>{t.hero.title2}</span></h1><p className="hero-support">{t.hero.support}</p><p className="hero-text">{t.hero.text}</p></div>
    <div className="hero-product-gallery reveal delay" id="heroVideoCard">
      <div className="hero-main-photo"><video id="heroVideo" className="hero-gallery-video" src={`${assetsBase}juzur-hero-video.mp4`} muted loop controls playsInline preload="none" poster={`${assetsBase}new-photos/juzur-photo-08.webp`} aria-label={t.hero.videoAlt} /></div>
      <div className="hero-actions"><a className="btn primary" href="#checkout" data-hero-cta>{t.nav.order}</a><a className="btn glass" href="#video">{t.hero.view}</a></div>
      <div className="hero-price launch-price" aria-label={t.hero.priceLabel}><div><span>{t.hero.special}</span><span className="price-comparison"><del><bdi>{formatPrice(product.listUnitPrice, language)}</bdi></del><strong><bdi>{formatPrice(product.finalUnitPrice, language)}</bdi></strong></span></div><span className="discount-badge">{language === 'ar' ? 'وفّر 500 جنيه' : 'Save EGP 500'}</span></div>
      <div className="hero-trust" aria-label={t.hero.trustLabel}><span>{t.hero.wood}</span><span>{t.hero.payment}</span><span>{t.hero.delivery}</span></div>
    </div><div className="scroll-hint">{t.hero.scroll}</div>
  </section>;
}

export function HeroPhotos() {
  const { language, t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const heroPhotos = [
    [`${assetsBase}new-photos/juzur-photo-08.webp`, t.images.top],
    [`${assetsBase}new-photos/juzur-photo-10.webp`, t.images.side],
    [`${assetsBase}new-photos/juzur-photo-01.webp`, t.images.lifestyle],
    [`${assetsBase}new-photos/juzur-photo-02.webp`, t.images.details],
    [`${assetsBase}new-photos/juzur-extra-3680.webp`, language === 'ar' ? 'ترابيزة جذور على ذراع الكنبة من الأعلى' : 'Juzur tray on the sofa arm from above'],
    [`${assetsBase}new-photos/juzur-extra-3672.webp`, language === 'ar' ? 'ترابيزة جذور مفتوحة توضح الأجزاء الخشبية' : 'Opened Juzur tray showing its wooden parts', 'contain'],
    [`${assetsBase}new-photos/juzur-extra-3688.webp`, language === 'ar' ? 'ترابيزة جذور مفتوحة توضح مساحة التخزين' : 'Opened Juzur tray showing the storage space', 'contain'],
    [`${assetsBase}new-photos/juzur-extra-3697.webp`, language === 'ar' ? 'ترابيزة جذور على ذراع الكنبة من الجانب' : 'Juzur tray on the sofa arm from the side'],
  ];
  return <section className="hero-photos-section" aria-label={t.hero.mediaLabel}>
    <div className="hero-product-gallery reveal" id="heroGallery">
      <div className="hero-main-photo">
        <img id="heroPreviousImage" className="hero-gallery-layer hero-gallery-layer-previous" src={heroPhotos[0][0]} alt="" aria-hidden="true" width="1484" height="1113" />
        <img id="heroCurrentImage" className="hero-gallery-layer hero-gallery-layer-current is-visible" src={heroPhotos[0][0]} alt={heroPhotos[0][1]} width="1484" height="1113" decoding="async" />
        <button className="hero-photo-nav hero-photo-prev" type="button" aria-label={t.modal.previous}>&#8249;</button>
        <button className="hero-photo-nav hero-photo-next" type="button" aria-label={t.modal.next}>&#8250;</button>
      </div>
      <div className="hero-photo-thumbs" aria-label={t.hero.mediaLabel}>{heroPhotos.map(([src, alt, fit], index) => <button key={src} className={`hero-photo-thumb hero-media-thumb${index === 0 ? ' active' : ''}`} type="button" data-img={src} data-alt={alt} data-fit={fit || 'cover'} aria-label={alt} aria-pressed={index === 0}><img src={thumbnailImage(src)} alt="" width="480" height="343" loading="lazy" decoding="async" /></button>)}</div>
    </div>
  </section>;
}
