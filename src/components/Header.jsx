import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Header() {
  const { language, t, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [['#collection', t.nav.product], ['#video', t.nav.video], ['#material', t.nav.wood], ['#gift', t.nav.gift], ['#faq', t.nav.faq]];
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="nav" id="nav">
      <a className="brand brand-wordmark" href="#top" aria-label="چذور - Crafted for Better Living" onClick={closeMenu}>
        <span className="brand-name">چذور</span>
        <span className="brand-tagline">Crafted for Better Living</span>
      </a>
      <nav id="primary-navigation" className={menuOpen ? 'mobile-menu-open' : ''} aria-label={t.nav.label}>
        {navItems.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="language-switch" type="button" onClick={toggleLanguage} aria-label={t.nav.switchLanguage}>{language === 'ar' ? 'EN' : 'عربي'}</button>
        <a className="nav-cta" href="#checkout" onClick={closeMenu}>{t.nav.order}</a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
      </div>
    </header>
  );
}
