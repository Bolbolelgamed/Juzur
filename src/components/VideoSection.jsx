import { useState } from 'react';

const supportingVideos = [
  ['Coffee setup', 'Short demo video', ''],
  ['Daily essentials', 'Phone, remote, snacks, and cup', ''],
];

export default function VideoSection() {
  const [videoNotice, setVideoNotice] = useState('');

  return (
    <section className="video-section" id="video">
      <div className="section-head reveal">
        <p className="eyebrow dark">Video</p>
        <h2>See SofaTray in action.</h2>
        <p>
          Watch how SofaTray by Juzur keeps your coffee, phone, remote and snacks beside you beautifully and
          neatly and within easy reach.
        </p>
      </div>
      <div className="video-grid reveal">
        <div className="video-card main-video">
          <video
            className="main-video-player"
            controls
            playsInline
            preload="auto"
            aria-label="SofaTray product demonstration"
          >
            <source src="/assets/juzur-sofatray-demo.mp4" type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>
        {supportingVideos.map(([title, subtitle, extraClass]) => (
          <div key={title} className={`video-card ${extraClass}`.trim()}>
            <div className="video-placeholder">
              <button
                className="play-icon"
                type="button"
                aria-label={`${title} video coming soon`}
                onClick={() => setVideoNotice(`${title} video will be added soon.`)}
              >
                Play
              </button>
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="video-status" aria-live="polite">
        {videoNotice}
      </p>
    </section>
  );
}
