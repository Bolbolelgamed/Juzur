import { useLanguage } from '../i18n/LanguageContext.jsx';
export default function Footer() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  return (
    <footer>
      <img className="footer-logo" src={`${assetsBase}juzur-logo-header.png`} alt="Juzur" />
      <span>{t.footer.tagline}</span>
    </footer>
  );
}
