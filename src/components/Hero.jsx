const heroPhotos = [
  ['/assets/product-2.jpg', 'SofaTray side view'],
  ['/assets/product-3.jpg', 'SofaTray low side view'],
  ['/assets/product-4.jpg', 'SofaTray top view'],
  ['/assets/product-5.jpg', 'SofaTray compartments view'],
];

export default function Hero() {
  return (
    <section className="hero hero-carousel" aria-label="SofaTray by Juzur hero">
      <div className="hero-copy reveal">
        <p className="eyebrow">Premium Wooden Sofa Tray</p>
        <h1>
          Everything you need.
          <br />
          <span id="word">Right beside you.</span>
        </h1>
        <p className="hero-support">Designed to make life easier.</p>
        <p className="hero-text">☕ Coffee. 📱 Phone. 📺 Remote.</p>
      </div>

      <div className="hero-product-gallery reveal delay" id="heroGallery">
        <div className="hero-main-photo">
          <img
            id="heroPreviousImage"
            className="hero-gallery-layer hero-gallery-layer-previous"
            src="/assets/product-2.jpg"
            alt=""
            aria-hidden="true"
          />
          <img
            id="heroCurrentImage"
            className="hero-gallery-layer hero-gallery-layer-current is-visible"
            src="/assets/product-2.jpg"
            alt="SofaTray by Juzur main product view"
          />
        </div>
        <div className="hero-photo-thumbs" aria-label="Choose hero product photo">
          {heroPhotos.map(([src, alt], index) => (
            <button
              key={src}
              className={`hero-photo-thumb${index === 0 ? ' active' : ''}`}
              type="button"
              data-img={src}
            >
              <img src={src} alt={alt} />
            </button>
          ))}
        </div>
        <div className="hero-actions">
          <a className="btn primary" href="#checkout" data-hero-cta>
            Order Now
          </a>
          <a className="btn glass" href="#video">
            View Product
          </a>
        </div>
        <div className="hero-price" aria-label="Product price">
          <div>
            <span>Special price</span>
            <strong>EGP 1,999</strong>
          </div>
          <span className="old-price">EGP 2,499</span>
          <span className="discount-badge">20% off</span>
        </div>
        <div className="hero-trust" aria-label="Product trust signals">
          <span>Handcrafted Zan Wood</span>
          <span>Delivery in 4-7 Days</span>
          <span>Secure Checkout</span>
        </div>
      </div>

      <div className="scroll-hint">Scroll</div>
    </section>
  );
}
