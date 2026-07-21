import { useLanguage } from '../i18n/LanguageContext.jsx';

const giftPhotos = [
  ['/assets/juzur-packaging-open.jpg', 'boxOpen', 1469, 1071],
  ['/assets/juzur-packaging-natural.jpg', 'packaging', 1472, 1069],
  ['/assets/juzur-tray-lifestyle.jpg', 'lifestyle', 1122, 1402],
];

export default function GiftSection() {
  const { t } = useLanguage();
  return (
    <section className="gift-section" id="gift">
      <div className="site-container gift-layout">
        <div className="gift-copy reveal">
          <p className="eyebrow dark">{t.gift.eyebrow}</p>
          <h2>{t.gift.title}</h2>
          {t.gift.text && <p>{t.gift.text}</p>}
          <ul className="benefit-list" aria-label={t.gift.reasons}>
            {t.gift.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <a className="btn primary dark" href="#checkout">{t.gift.cta}</a>
        </div>

        <div className="gift-media reveal delay" aria-label={t.gift.photos}>
          <button className="gift-feature lightbox" type="button" data-lightbox-src="/assets/juzur-packaging-closed.jpg" data-lightbox-alt={t.gift.boxAlt} aria-label={`${t.images.enlarge}: ${t.gift.boxAlt}`}>
            <img src="/assets/juzur-packaging-closed.jpg" width="1448" height="1086" alt={t.gift.boxAlt} loading="lazy" decoding="async" />
            <span className="gift-caption"><small>{t.gift.ready}</small><strong>{t.gift.presented}</strong><span>{t.gift.caption}</span></span>
          </button>
          <div className="gift-photo-strip">
            {giftPhotos.map(([src, key, width, height]) => (
              <button className="gift-photo-button lightbox" type="button" key={src} data-lightbox-src={src} data-lightbox-alt={t.images[key]} aria-label={`${t.images.enlarge}: ${t.images[key]}`}>
                <img src={src} width={width} height={height} alt={t.images[key]} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
