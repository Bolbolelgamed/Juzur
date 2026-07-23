const reviews = [
  [
    'It keeps everything beside me without needing another table. Coffee, phone, remote, all in one clean place.',
    'Living room customer',
  ],
  [
    'The wooden feel is warm and premium. It looks natural on the sofa and does not feel like plastic accessories.',
    'Home decor customer',
  ],
  [
    'Very practical as a gift. The size is clear, useful, and easy to understand from the first look.',
    'Gift customer',
  ],
];

export default function Reviews() {
  return (
    <section className="feedback-section" id="reviews">
      <div className="section-head reveal">
        <p className="eyebrow">Customer reviews</p>
        <h2>Simple moments, better organized.</h2>
        <p>Early feedback from homes using چذور Sofa tray for coffee, remotes, snacks, and quiet living-room routines.</p>
      </div>
      <div className="review-grid reveal">
        {reviews.map(([quote, author]) => (
          <article className="review-card" key={author}>
            <div className="review-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p>“{quote}”</p>
            <strong>{author}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
