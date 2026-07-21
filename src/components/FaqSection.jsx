import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function FaqSection() {
  const { t } = useLanguage();
  return (
    <section className="faq-section" id="faq">
      <div className="site-container">
        <div className="section-heading reveal">
          <p className="eyebrow dark">{t.faq.eyebrow}</p>
          <h2>{t.faq.title}</h2>
        </div>
        <div className="faq-grid reveal">
          {t.faq.items.map(([question, answer], index) => (
            <article className="faq-item" key={question}>
              <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
