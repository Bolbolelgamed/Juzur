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
          <img src="/assets/product-2.jpg" alt="SofaTray gift presentation" />
          <div className="gift-video-caption">
            <span className="play-icon">Play</span>
            <strong>Gift unboxing moment</strong>
            <small>Show the product, the wooden details, and how it fits beside the sofa.</small>
          </div>
        </div>
        <div className="gift-photo-strip">
          <img className="lightbox" src="/assets/product-3.jpg" alt="SofaTray gift side view" />
          <img className="lightbox" src="/assets/product-4.jpg" alt="SofaTray top view as a gift" />
          <img className="lightbox" src="/assets/product-5.jpg" alt="SofaTray storage gift detail" />
        </div>
      </div>
    </section>
  );
}
