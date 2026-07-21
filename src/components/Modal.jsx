import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Modal() {
  const { t } = useLanguage();
  return (
    <div className="modal" id="modal" role="dialog" aria-modal="true" aria-label={t.modal.label} hidden>
      <div className="modal-content">
        <button className="modal-close" type="button" aria-label={t.modal.close}>×</button>
        <img alt="" />
      </div>
    </div>
  );
}
