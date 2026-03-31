import React, { useState } from "react";
import FormModal from "./FormModal";
import "../styles/AdminModal.css";

export default function UserModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});

  return (
    <FormModal title={mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên"
          value={formData.firstName || ""}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="form-field"
        />
        <input
          type="text"
          placeholder="Họ"
          value={formData.lastName || ""}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="form-field"
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username || ""}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="form-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-field"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={formData.password || ""}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="form-field"
        />
        <div className="form-select">
          <select
            value={formData.role || ""}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="form-actions">
          <button onClick={onClose} className="btn btn-outline">Huỷ</button>
          <button onClick={() => onSave(formData)} className="btn btn-primary">Lưu</button>
        </div>
      </div>
    </FormModal>
  );
}
