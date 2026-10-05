import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { locales } from './locales.js';

const LanguageContext = createContext(null);

function initialLanguage() {
  try { return localStorage.getItem('juzur-language') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
}

export function LanguageProvider({ children }) {
  // Match the pre-rendered Arabic HTML before restoring a saved preference.
  const [language, setLanguage] = useState('ar');
  const [preferenceReady, setPreferenceReady] = useState(false);
  useEffect(() => {
    setLanguage(initialLanguage());
    setPreferenceReady(true);
  }, []);
  const value = useMemo(() => ({ language, isRtl: language === 'ar', t: locales[language], toggleLanguage: () => setLanguage((current) => current === 'ar' ? 'en' : 'ar') }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = locales[language].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', locales[language].meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', locales[language].meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', locales[language].meta.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', locales[language].meta.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', locales[language].meta.description);
    if (preferenceReady) {
      try { localStorage.setItem('juzur-language', language); } catch { /* Storage can be unavailable in private contexts. */ }
    }
  }, [language, preferenceReady]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
