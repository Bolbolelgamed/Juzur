const galleryImages = [
  ['/assets/product-1.jpg', 'Wooden tray detail', 'gallery-a'],
  ['/assets/product-6.jpg', 'SofaTray by Juzur side view', 'gallery-b tall'],
  ['/assets/product-3.jpg', 'Wooden product detail', 'gallery-c'],
  ['/assets/product-5.jpg', 'SofaTray by Juzur with storage', 'gallery-d'],
  ['/assets/product-4.jpg', 'SofaTray by Juzur', 'gallery-e'],
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
          <img key={src} className={`reveal lightbox ${className}`} src={src} alt={alt} />
        ))}
      </div>
    </section>
  );
}
