import { useLanguage } from '../i18n/LanguageContext.jsx';
import { contact } from '../config/contact.js';

const icons = {
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6.5h16v11H4z" />
      <path d="m4.8 7.2 7.2 5.4 7.2-5.4" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.2a7.7 7.7 0 0 0-6.5 11.8l-.9 3.5 3.6-.9A7.7 7.7 0 1 0 12 4.2Z" />
      <path d="M9.4 8.6c-.2-.4-.4-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.5.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2l-.8 1c-.1.2-.3.2-.6.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2.1-.4 0-.6l-.8-2.2Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8.2h2V4.8c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2v2.9H4.8v3.8H8v7.1h4v-7.1h3.1l.6-3.8H12v-2.5c0-1.1.3-2 2-2Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="16.5" cy="7.5" r=".8" />
    </svg>
  ),
};

export default function Footer() {
  const { t } = useLanguage();
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const contactItems = [
    { key: 'whatsapp', href: contact.whatsappUrl, value: contact.whatsappDisplay },
    { key: 'facebook', href: contact.facebookUrl, value: contact.facebookDisplay },
    { key: 'instagram', href: contact.instagramUrl, value: contact.instagramDisplay },
    { key: 'email', href: contact.emailUrl, value: contact.email },
  ];

  return (
    <footer>
      <div className="footer-brand">
        <img className="footer-logo" src={`${assetsBase}juzur-logo-header.png`} alt="Juzur" />
        <span>{t.footer.tagline}</span>
      </div>
      <div className="footer-links" aria-label={t.footer.contactLabel}>
        <p className="footer-support">{t.footer.support}</p>
        <div className="footer-contact-list">
          {contactItems.map((item) => (
            <a
              key={item.key}
              className="footer-contact"
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              aria-label={`${t.footer[item.key]} ${item.value}`}
              title={t.footer[item.key]}
            >
              <span className="footer-contact-icon">{icons[item.key]}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
