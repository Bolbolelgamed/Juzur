import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ProductShowcase() {
  const { t } = useLanguage();
  return (
    <section className="product-showcase" id="collection">
      <div className="site-container showcase-layout reveal">
        <div className="showcase-heading">
          <p className="eyebrow dark">{t.product.eyebrow}</p>
          <h2>{t.product.title}</h2>
        </div>
        <div className="showcase-support">
          <p>{t.product.text}</p>
          <ul className="feature-list">
            {t.product.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <a className="btn primary dark" href="#checkout">{t.product.cta}</a>
        </div>
      </div>
    </section>
  );
}
