import { useLanguage } from '../i18n/LanguageContext.jsx';
import { responsiveImageSet } from '../utils/assets.js';

export default function Gallery() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const images = [
    [`${assetsBase}juzur-tray-studio.webp`, t.images.details, ''],
    [`${assetsBase}juzur-tray-lifestyle.webp`, t.images.cozy, 'gallery-portrait'],
    [`${assetsBase}juzur-packaging-open.webp`, t.images.boxOpen, ''],
    [`${assetsBase}juzur-tray-sofa-real.webp`, t.images.sofa, 'gallery-portrait'],
    [`${assetsBase}juzur-packaging-closed.webp`, t.images.boxClosed, ''],
    [`${assetsBase}juzur-packaging-natural.webp`, t.images.packaging, ''],
  ];

  return <section className="gallery" id="gallery"><div className="section-head dark reveal"><p className="eyebrow dark">{t.gallery.eyebrow}</p><h2>{t.gallery.title}</h2></div><div className="gallery-grid">{images.map(([src, alt, className]) => <button key={src} className={`gallery-image-button reveal lightbox ${className}`} type="button" data-lightbox-src={src} data-lightbox-alt={alt} aria-label={`${t.images.enlarge}: ${alt}`}><img src={src} srcSet={responsiveImageSet(src)} sizes="(max-width: 560px) calc(100vw - 48px), (max-width: 860px) 45vw, 280px" alt={alt} width="960" height="686" loading="lazy" decoding="async" /></button>)}</div></section>;
}
