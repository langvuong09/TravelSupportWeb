import "../styles/AdminModal.css";

// Modal wrapper chung cho tất cả add/edit forms
export default function FormModal({ title, children, onClose }) {
  return (
    <div className="form-modal">
      <div className="form-modal__content">
        <div className="form-modal__header">
          <h3 className="form-modal__title">{title}</h3>
          <button onClick={onClose} className="form-modal__close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
