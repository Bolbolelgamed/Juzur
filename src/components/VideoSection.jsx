const videos = [
  ['Product demo', 'Opening, tray layout, and daily use', 'main-video'],
  ['Coffee setup', 'Short demo video', ''],
  ['Daily essentials', 'Phone, remote, snacks, and cup', ''],
];

export default function VideoSection() {
  return (
    <section className="video-section" id="video">
      <div className="section-head reveal">
        <p className="eyebrow dark">Video</p>
        <h2>See SofaTray in action.</h2>
        <p>
          Watch how SofaTray by Juzur keeps your coffee, phone, remote and snacks beside you beautifully and
          without clutter.
        </p>
      </div>
      <div className="video-grid reveal">
        {videos.map(([title, subtitle, extraClass]) => (
          <div key={title} className={`video-card ${extraClass}`.trim()}>
            <div className="video-placeholder">
              <span className="play-icon">Play</span>
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
