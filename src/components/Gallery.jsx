import { useLanguage } from '../i18n/LanguageContext.jsx';

const galleryImages = [
  ['/assets/juzur-tray-studio.jpg', 'details', '', 1484, 1060],
  ['/assets/juzur-tray-lifestyle.jpg', 'cozy', 'gallery-portrait', 1122, 1402],
  ['/assets/juzur-packaging-open.jpg', 'boxOpen', '', 1469, 1071],
  ['/assets/juzur-tray-sofa-real.jpg', 'sofa', 'gallery-portrait', 1086, 1448],
  ['/assets/juzur-packaging-closed.jpg', 'boxClosed', '', 1448, 1086],
  ['/assets/juzur-packaging-natural.jpg', 'packaging', '', 1472, 1069],
];

export default function Gallery() {
  const { t } = useLanguage();
  return (
    <section className="gallery-section" id="gallery">
      <div className="site-container">
        <div className="section-heading reveal">
          <p className="eyebrow dark">{t.gallery.eyebrow}</p>
          <h2>{t.gallery.title}</h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map(([src, key, className, width, height]) => (
            <button
              key={src}
              className={`gallery-image-button reveal lightbox ${className}`.trim()}
              type="button"
              data-lightbox-src={src}
              data-lightbox-alt={t.images[key]}
              aria-label={`${t.images.enlarge}: ${t.images[key]}`}
            >
              <img src={src} width={width} height={height} alt={t.images[key]} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
