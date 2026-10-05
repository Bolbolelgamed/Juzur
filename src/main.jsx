import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/fonts.css';
import './styles/base.css';
import './styles/latest.css';
import './styles/checkout.css';
import './styles/media.css';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

const app = (
  <React.StrictMode>
    <LanguageProvider><App /></LanguageProvider>
  </React.StrictMode>,
);
const root = document.getElementById('root');
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
