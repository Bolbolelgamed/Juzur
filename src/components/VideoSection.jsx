import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function VideoSection() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;

  return (
    <section className="video-section" id="video">
      <div className="section-head reveal">
        <p className="eyebrow dark">{t.video.eyebrow}</p>
        <h2>{t.video.title}</h2>
        <p>{t.video.text}</p>
      </div>
      <div className="video-grid video-grid-single reveal">
        <div className="video-card main-video">
          <video className="main-video-player" controls playsInline preload="auto" aria-label={t.video.demoLabel}>
            <source src={`${assetsBase}juzur-sofatray-demo.mp4`} type="video/mp4" />
            {t.video.unsupported}
          </video>
        </div>
      </div>
    </section>
  );
}
