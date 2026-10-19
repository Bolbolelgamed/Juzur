import { createContext, useContext, useEffect, useMemo } from 'react';
import { locales } from './locales.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLanguage = 'ar' }) {
  // Each URL has a stable language, shared by the static HTML and hydration.
  const language = initialLanguage === 'en' ? 'en' : 'ar';
  const value = useMemo(() => ({ language, isRtl: language === 'ar', t: locales[language] }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = locales[language].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', locales[language].meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', locales[language].meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', locales[language].meta.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', locales[language].meta.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', locales[language].meta.description);
    try { localStorage.setItem('juzur-language', language); } catch { /* Storage can be unavailable in private contexts. */ }
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
