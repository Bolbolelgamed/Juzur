export default function GiftSection() {
  return (
    <section className="gift-section" id="gift">
      <div className="gift-copy reveal">
        <p className="eyebrow dark">Gift idea</p>
        <h2>A practical gift that feels personal.</h2>
        <p>
          SofaTray by Juzur is easy to understand the moment it is opened: a warm wooden piece for coffee, phone,
          remote and relaxed sofa time. It works beautifully for new homes, birthdays, Ramadan gatherings and
          thoughtful everyday gifting.
        </p>
        <div className="gift-points" aria-label="Gift reasons">
          <span>Useful every day</span>
          <span>Premium wooden feel</span>
          <span>Ready for home moments</span>
        </div>
        <a className="btn primary dark" href="#checkout">
          Order as a Gift
        </a>
      </div>
      <div className="gift-media reveal delay" aria-label="Gift presentation photos">
        <div className="gift-video-tile">
          <img
            src="/assets/juzur-packaging-closed.jpg"
            alt="SofaTray in its branded Juzur gift box"
            loading="lazy"
            decoding="async"
          />
          <div className="gift-video-caption">
            <span className="gift-label">Gift ready</span>
            <strong>Presented with care</strong>
            <small>Branded packaging makes the first impression feel as thoughtful as the product inside.</small>
          </div>
        </div>
        <div className="gift-photo-strip">
          {[
            ['/assets/juzur-packaging-open.jpg', 'Open Juzur box with SofaTray inside'],
            ['/assets/juzur-packaging-natural.jpg', 'Closed Juzur box in a natural living space'],
            ['/assets/juzur-tray-lifestyle.jpg', 'SofaTray ready for a relaxed home moment'],
          ].map(([src, alt]) => (
            <button
              className="gift-photo-button lightbox"
              type="button"
              key={src}
              data-lightbox-src={src}
              data-lightbox-alt={alt}
              aria-label={`Enlarge ${alt}`}
            >
              <img src={src} alt={alt} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
