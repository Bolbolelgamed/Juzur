import { product } from '../config/product.js';

const faqs = [
  [
    'How long does delivery take?',
    `Delivery usually takes ${product.deliveryTime.toLowerCase()} after we confirm your order details.`,
  ],
  ['What wood is used?', 'SofaTray is made from Zan wood for a warm, premium furniture feel.'],
  [
    'What can it hold?',
    'It is made for coffee, phones, remotes, snacks, and small daily essentials beside the sofa.',
  ],
  ['How do I pay?', `Payment is ${product.paymentMethod} when your order is delivered.`],
  [
    'How is the delivery fee calculated?',
    `${product.deliveryFeeMessage}. We will confirm it with you before delivery.`,
  ],
];

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      <div className="section-head reveal">
        <p className="eyebrow dark">FAQ</p>
        <h2>Quick answers before you order.</h2>
      </div>
      <div className="faq-grid reveal">
        {faqs.map(([question, answer]) => (
          <article className="faq-item" key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
