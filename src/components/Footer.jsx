import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="site-container footer-layout">
        <strong>Juzur</strong>
        <span>{t.footer.tagline}</span>
        <a className="footer-contact" href="tel:+201095306518" aria-label={t.footer.call}>{t.footer.contact}</a>
      </div>
    </footer>
  );
}
