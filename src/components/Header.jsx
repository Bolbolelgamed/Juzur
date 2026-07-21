import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Header() {
  const { language, t, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ['#collection', t.nav.product],
    ['#video', t.nav.video],
    ['#material', t.nav.wood],
    ['#gift', t.nav.gift],
    ['#faq', t.nav.faq],
  ];

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 920) setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const changeLanguage = () => {
    toggleLanguage();
    closeMenu();
  };

  return (
    <header className="nav" id="nav">
      <a className="brand" href="#top" aria-label="Juzur" onClick={closeMenu}>
        <img className="brand-logo" src="/assets/juzur-logo-header.png" width="427" height="200" alt="Juzur" />
      </a>
      <nav id="primary-navigation" className={menuOpen ? 'mobile-menu-open' : ''} aria-label={t.nav.label}>
        {navItems.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="language-switch" type="button" onClick={changeLanguage} aria-label={t.nav.switchLanguage}>
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
        <a className="nav-cta" href="#checkout" onClick={closeMenu}>{t.nav.order}</a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
