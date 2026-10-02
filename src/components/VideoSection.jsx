import { useLanguage } from '../i18n/LanguageContext.jsx';
import { uploadedVideos } from '../config/media.js';
import DeferredVideo from './DeferredVideo.jsx';

export default function VideoSection() {
  const { language, t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;

  return (
    <section className="video-section" id="video">
      <div className="section-head reveal">
        <p className="eyebrow dark">{t.video.eyebrow}</p>
        <h2>{t.video.title}</h2>
        <p>{t.video.text}</p>
      </div>
      <div className="video-grid uploaded-video-grid">
        <article className="uploaded-video-card reveal">
          <DeferredVideo src={`${assetsBase}juzur-sofatray-demo.mp4`} poster={`${assetsBase}new-photos/juzur-photo-08-480.webp`} label={t.video.demoLabel} playLabel={t.video.playLabel} unsupported={t.video.unsupported} />
          <h3>{t.video.demoLabel}</h3>
        </article>
        {uploadedVideos.map((video) => <article className="uploaded-video-card reveal" key={video.file}>
          <DeferredVideo src={`${assetsBase}uploads/${video.file}`} poster={`${assetsBase}uploads/${video.poster}`} posterSrcSet={`${assetsBase}uploads/${video.poster.replace('.webp', '-480.webp')} 480w, ${assetsBase}uploads/${video.poster} 720w`} width={video.width} height={video.height} label={video.title[language]} playLabel={t.video.playLabel} unsupported={t.video.unsupported} />
          <h3>{video.title[language]}</h3>
        </article>)}
      </div>
    </section>
  );
}
