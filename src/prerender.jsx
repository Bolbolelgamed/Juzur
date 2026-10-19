import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

export function render(language = 'ar') {
  return renderToString(<LanguageProvider initialLanguage={language}><App /></LanguageProvider>);
}
