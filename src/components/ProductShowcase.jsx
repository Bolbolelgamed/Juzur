import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ProductShowcase() {
  const { t } = useLanguage();
  return (
    <section className="product-showcase" id="collection">
      <div className="showcase-copy reveal">
        <p className="eyebrow dark">{t.product.eyebrow}</p>
        <h2>{t.product.title}</h2>
        <p>{t.product.text}</p>
        <ul className="feature-list">
          {t.product.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <a className="btn primary dark" href="#checkout">{t.nav.order}</a>
      </div>
    </section>
  );
}
