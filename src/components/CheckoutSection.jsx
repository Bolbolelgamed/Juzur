export default function CheckoutSection() {
  return (
    <section className="checkout-section" id="checkout">
      <div className="checkout-copy reveal">
        <p className="eyebrow dark">Checkout</p>
        <h2>Complete your order.</h2>
        <p className="checkout-reassurance">Made in Egypt. Delivery within 4-7 days.</p>
        <div className="checkout-price-panel" aria-label="Price offer">
          <div className="price-main">
            <span>Special price</span>
            <strong>EGP 1,999</strong>
          </div>
          <div className="price-details">
            <span className="old-price">EGP 2,499</span>
            <span className="discount-badge">20% off</span>
          </div>
          <p>Launch offer applied at checkout.</p>
        </div>
        <p>Enter your details and we will contact you to confirm delivery.</p>
      </div>
      <form className="checkout-form reveal delay" id="checkoutForm">
        <label>
          <span>Name</span>
          <input type="text" name="name" placeholder="Your full name" required />
        </label>
        <label>
          <span>Address</span>
          <input type="text" name="address" placeholder="Delivery address" required />
        </label>
        <label>
          <span>Phone no.</span>
          <input type="tel" name="phone" placeholder="Your phone number" autoComplete="tel" required />
        </label>
        <label>
          <span>No. of pieces</span>
          <input type="number" name="pieces" min="1" defaultValue="1" inputMode="numeric" required />
        </label>
        <button className="btn primary" type="submit">
          Submit Order
        </button>
        <p className="form-note" id="checkoutNote">
          Your order request will be ready for confirmation.
        </p>
      </form>
    </section>
  );
}
