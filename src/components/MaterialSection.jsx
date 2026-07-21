import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function MaterialSection() {
  const { t } = useLanguage();
  return (
    <section className="material-section" id="material">
      <div className="site-container material-layout reveal">
        <div className="material-heading">
          <p className="eyebrow dark">{t.material.eyebrow}</p>
          <h2>{t.material.title}</h2>
        </div>
        <div className="material-copy"><p>{t.material.text}</p></div>
      </div>
    </section>
  );
}
