import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Header() {
  const assetsBase = `${import.meta.env.BASE_URL}assets/`;
  const { language, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [['#collection', t.nav.product], ['#video', t.nav.video], ['#material', t.nav.wood], ['#gift', t.nav.gift], ['#faq', t.nav.faq]];
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="nav" id="nav">
      <a className="brand" href="#top" aria-label="Juzur - Crafted for Better Living" onClick={closeMenu}>
        <img className="brand-logo" src={`${assetsBase}juzur-logo-header.webp`} alt="Juzur" width="427" height="200" decoding="async" />
      </a>
      <nav id="primary-navigation" className={menuOpen ? 'mobile-menu-open' : ''} aria-label={t.nav.label}>
        {navItems.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <a className="language-switch" href={language === 'ar' ? './en' : './'} hrefLang={language === 'ar' ? 'en-EG' : 'ar-EG'} lang={language === 'ar' ? 'en' : 'ar'} aria-label={t.nav.switchLanguage} onClick={(event) => {
          // Keep campaign attribution and the current section when switching.
          const destination = new URL(event.currentTarget.href);
          destination.search = window.location.search;
          destination.hash = window.location.hash;
          event.currentTarget.href = destination.toString();
          closeMenu();
        }}>{language === 'ar' ? 'EN' : 'عربي'}</a>
        <a className="nav-cta" href="#checkout" onClick={closeMenu}>{t.nav.order}</a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
      </div>
    </header>
  );
}
