import { product } from '../config/product.js';

export default function ProductShowcase() {
  return (
    <section className="product-showcase" id="collection">
      <div className="showcase-copy reveal">
        <p className="eyebrow dark">Product features</p>
        <h2>Daily essentials, beautifully organized.</h2>
        <p>
          A smart wooden sofa tray designed to keep your coffee, phone, remote, snacks and small daily essentials
          beside you neatly and within easy reach.
        </p>
        <ul>
          <li>Sliding / folding tray design</li>
          <li>Cup holder, phone slot and essentials area</li>
          <li>Premium Zan wood feel with rounded edges</li>
        </ul>
        <div className="dimension-badge" aria-label="Product dimensions">
          {product.dimensions}
        </div>
        <a className="btn primary dark" href="#checkout">
          Order Now
        </a>
      </div>
    </section>
  );
}
