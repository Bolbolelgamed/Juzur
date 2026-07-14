export default function Modal() {
  return (
    <div className="modal" id="modal" role="dialog" aria-modal="true" aria-label="Product image preview">
      <div className="modal-content">
        <button className="modal-close" type="button" aria-label="Close image preview">
          &times;
        </button>
        <img src="" alt="" />
      </div>
    </div>
  );
}
