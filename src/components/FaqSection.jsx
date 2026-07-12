const faqs = [
  ['How long does delivery take?', 'Delivery usually takes 4-7 days after we confirm your order details.'],
  ['What wood is used?', 'SofaTray is made from Zan wood for a warm, premium furniture feel.'],
  [
    'What can it hold?',
    'It is made for coffee, phones, remotes, snacks, and small daily essentials beside the sofa.',
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
