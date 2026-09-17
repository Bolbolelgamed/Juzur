import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Modal() {
  const { t } = useLanguage();
  return (
    <div className="modal" id="modal" role="dialog" aria-modal="true" aria-label={t.modal.label}>
      <div className="modal-content">
        <button className="modal-close" type="button" aria-label={t.modal.close}>&times;</button>
        <button className="modal-nav modal-prev" type="button" aria-label={t.modal.previous}>&#8249;</button>
        <img alt="" />
        <button className="modal-nav modal-next" type="button" aria-label={t.modal.next}>&#8250;</button>
      </div>
    </div>
  );
}
