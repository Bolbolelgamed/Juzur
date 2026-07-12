export default function ProductShowcase() {
  return (
    <section className="product-showcase" id="collection">
      <div className="showcase-copy reveal">
        <p className="eyebrow dark">Product features</p>
        <h2>Everything beside you, without clutter.</h2>
        <p>
          A smart wooden sofa tray designed to keep your coffee, phone, remote, snacks and small daily essentials
          beside you beautifully and without clutter.
        </p>
        <ul>
          <li>Sliding / folding tray design</li>
          <li>Cup holder, phone slot and essentials area</li>
          <li>Premium Zan wood feel with rounded edges</li>
        </ul>
        <div className="dimension-badge" aria-label="Product dimensions">
          35 x 24 x 4.5 cm
        </div>
        <a className="btn primary dark" href="#checkout">
          Order Now
        </a>
      </div>
    </section>
  );
}
