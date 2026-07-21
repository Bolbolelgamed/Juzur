import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function VideoSection() {
  const { t } = useLanguage();
  const [videoNotice, setVideoNotice] = useState('');

  return (
    <section className="video-section" id="video">
      <div className="site-container">
        <div className="section-heading reveal">
          <p className="eyebrow dark">{t.video.eyebrow}</p>
          <h2>{t.video.title}</h2>
          <p>{t.video.text}</p>
        </div>
        <div className="video-grid reveal">
          <div className="video-card main-video-card">
            <video className="main-video-player" controls playsInline preload="auto" poster="/assets/juzur-tray-studio.jpg" aria-label={t.video.demoLabel}>
              <source src="/assets/juzur-sofatray-demo.mp4" type="video/mp4" />
              {t.video.unsupported}
            </video>
          </div>
          {t.video.items.map(([title, subtitle]) => (
            <article className="video-card supporting-video-card" key={title}>
              <div>
                <span className="coming-soon">{t.video.soonLabel}</span>
                <strong>{title}</strong>
                <p>{subtitle}</p>
              </div>
              <button type="button" onClick={() => setVideoNotice(`${title}: ${t.video.soon}`)}>{t.video.play}<span aria-hidden="true">▶</span></button>
            </article>
          ))}
        </div>
        <p className="video-status" aria-live="polite" role="status">{videoNotice}</p>
      </div>
    </section>
  );
}
