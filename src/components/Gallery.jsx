import { useLanguage } from '../i18n/LanguageContext.jsx';
import { responsiveImageSet } from '../utils/assets.js';

export default function Gallery() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const images = [
    [`${assetsBase}new-photos/juzur-photo-02.webp`, t.images.details, 'gallery-portrait', 1484, 1979],
    [`${assetsBase}new-photos/juzur-photo-01.webp`, t.images.cozy, 'gallery-portrait', 702, 863],
    [`${assetsBase}new-photos/juzur-photo-05.webp`, t.images.details, 'gallery-portrait', 1484, 1979],
    [`${assetsBase}new-photos/juzur-photo-03.webp`, t.images.sofa, 'gallery-portrait', 1484, 1979],
    [`${assetsBase}new-photos/juzur-photo-09.webp`, t.images.details, '', 1484, 1113],
    [`${assetsBase}new-photos/juzur-photo-10.webp`, t.images.side, '', 1484, 1113],
  ];

  return <section className="gallery" id="gallery"><div className="section-head dark reveal"><p className="eyebrow dark">{t.gallery.eyebrow}</p><h2>{t.gallery.title}</h2></div><div className="gallery-grid">{images.map(([src, alt, className, width, height]) => <button key={src} className={`gallery-image-button reveal lightbox ${className}`} type="button" data-lightbox-src={src} data-lightbox-alt={alt} aria-label={`${t.images.enlarge}: ${alt}`}><img src={src} srcSet={responsiveImageSet(src)} sizes="(max-width: 560px) calc(100vw - 48px), (max-width: 860px) 45vw, 280px" alt={alt} width={width} height={height} loading="lazy" decoding="async" /></button>)}</div></section>;
}
