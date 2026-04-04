import "../styles/AdminModal.css";

// Chung cho tất cả delete confirmations
export default function ConfirmDialog({ title, desc, onConfirm, onCancel }) {
  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog__content">
        <div className="confirm-dialog__icon">⚠️</div>
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__desc">{desc}</p>
        <div className="confirm-dialog__actions">
          <button onClick={onCancel} className="btn btn-outline">Huỷ</button>
          <button onClick={onConfirm} className="btn" style={{ background: "#ef4444", color: "#fff" }}>Xoá</button>
        </div>
      </div>
    </div>
  );
}
