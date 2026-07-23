import { useLanguage } from '../i18n/LanguageContext.jsx';
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="footer-brand">
        <h3>چذور</h3>
        <p>Crafted for Better Living</p>
      </div>
      <span>{t.footer.tagline}</span>
    </footer>
  );
}
