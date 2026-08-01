import { useLanguage } from '../i18n/LanguageContext.jsx';
import { contact } from '../config/contact.js';

export default function Footer() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  return (
    <footer>
      <div className="footer-brand">
        <img className="footer-logo" src={`${assetsBase}juzur-logo-header.png`} alt="Juzur" />
        <span>{t.footer.tagline}</span>
      </div>
      <div className="footer-links" aria-label={t.footer.contactLabel}>
        <p className="footer-support">{t.footer.support}</p>
        <a className="footer-contact" href={contact.emailUrl}>
          {t.footer.email}: {contact.email}
        </a>
        <a className="footer-contact" href={contact.whatsappUrl} target="_blank" rel="noreferrer">
          {t.footer.whatsapp}: <bdi>{contact.whatsappDisplay}</bdi>
        </a>
      </div>
    </footer>
  );
}
