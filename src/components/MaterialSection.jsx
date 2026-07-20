import { useLanguage } from '../i18n/LanguageContext.jsx';
export default function MaterialSection() { const { t } = useLanguage(); return <section className="intro split reveal" id="material"><div><p className="eyebrow dark">{t.material.eyebrow}</p><h2>{t.material.title}</h2></div><p>{t.material.text}</p></section>; }
