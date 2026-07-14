const galleryImages = [
  ['/assets/juzur-tray-studio.jpg', 'SofaTray product details on a clean studio background', ''],
  ['/assets/juzur-tray-lifestyle.jpg', 'SofaTray with coffee, phone and remote in a cozy living room', 'gallery-portrait'],
  ['/assets/juzur-packaging-open.jpg', 'Open Juzur gift box with the SofaTray inside', ''],
  ['/assets/juzur-tray-sofa-real.jpg', 'SofaTray opened across a sofa arm', 'gallery-portrait'],
  ['/assets/juzur-packaging-closed.jpg', 'Closed eco-friendly Juzur product box', ''],
  ['/assets/juzur-packaging-natural.jpg', 'Juzur product packaging in a natural living space', ''],
];

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="section-head dark reveal">
        <p className="eyebrow dark">Gallery</p>
        <h2>Handmade details with a premium natural feel.</h2>
      </div>
      <div className="gallery-grid">
        {galleryImages.map(([src, alt, className]) => (
          <button
            key={src}
            className={`gallery-image-button reveal lightbox ${className}`}
            type="button"
            data-lightbox-src={src}
            data-lightbox-alt={alt}
            aria-label={`Enlarge ${alt}`}
          >
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </section>
  );
}
