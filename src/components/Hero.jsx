import { formatPrice, product } from '../config/product.js';

const heroPhotos = [
  ['/assets/juzur-tray-studio.jpg', 'SofaTray studio product view', '50% 50%'],
  ['/assets/product-2.jpg', 'SofaTray handcrafted side view', '50% 50%'],
  ['/assets/juzur-tray-lifestyle.jpg', 'SofaTray arranged for a cozy sofa moment', '50% 72%'],
  ['/assets/product-4.jpg', 'SofaTray top view', '50% 50%'],
];

export default function Hero() {
  return (
    <section className="hero hero-carousel" aria-label="SofaTray by Juzur hero">
      <div className="hero-copy reveal">
        <p className="eyebrow">Premium Wooden Sofa Tray</p>
        <h1>
          Everything you need.
          <br />
          <span>Right beside you.</span>
        </h1>
        <p className="hero-support">Designed to make life easier.</p>
        <p className="hero-text">Coffee. Phone. Remote. Beautifully organized.</p>
      </div>

      <div className="hero-product-gallery reveal delay" id="heroGallery">
        <div className="hero-main-photo">
          <video
            id="heroVideo"
            className="hero-gallery-video is-visible"
            src="/assets/juzur-hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="SofaTray by Juzur in use"
          />
          <img
            id="heroPreviousImage"
            className="hero-gallery-layer hero-gallery-layer-previous"
            src="/assets/juzur-tray-studio.jpg"
            alt=""
            aria-hidden="true"
            style={{ objectPosition: '50% 50%' }}
          />
          <img
            id="heroCurrentImage"
            className="hero-gallery-layer hero-gallery-layer-current"
            src="/assets/juzur-tray-studio.jpg"
            alt="SofaTray studio product view"
            fetchPriority="high"
            style={{ objectPosition: '50% 50%' }}
          />
        </div>
        <div className="hero-photo-thumbs" aria-label="Choose hero product media">
          <button
            className="hero-photo-thumb hero-media-thumb active"
            type="button"
            data-kind="video"
            aria-label="Play SofaTray hero video"
          >
            <video src="/assets/juzur-hero-video.mp4" muted playsInline preload="metadata" aria-hidden="true" />
          </button>
          {heroPhotos.map(([src, alt, position], index) => (
            <button
              key={src}
              className="hero-photo-thumb hero-media-thumb"
              type="button"
              data-kind="image"
              data-img={src}
              data-alt={alt}
              data-position={position}
            >
              <img
                src={src}
                alt={alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: position }}
              />
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
            <strong>{formatPrice(product.finalUnitPrice)}</strong>
          </div>
          <span className="old-price">{formatPrice(product.originalUnitPrice)}</span>
          <span className="discount-badge">{product.discountLabel}</span>
        </div>
        <div className="hero-trust" aria-label="Product trust signals">
          <span>Handcrafted Zan Wood</span>
          <span>{product.paymentMethod}</span>
          <span>Delivery {product.deliveryTime}</span>
        </div>
      </div>

      <div className="scroll-hint">Scroll</div>
    </section>
  );
}
