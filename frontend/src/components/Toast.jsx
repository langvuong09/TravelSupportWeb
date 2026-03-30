import "../styles/Toast.css";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "info" && "ℹ️"}
      </div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button className="toast__close" onClick={onClose}>✕</button>
    </div>
  );
}
