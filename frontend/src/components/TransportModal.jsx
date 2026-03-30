import React, { useState } from "react";
import FormModal from "./FormModal";
import "../styles/AdminModal.css";

export default function TransportModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});

  return (
    <FormModal title={mode === "add" ? "Thêm phương tiện mới" : "Chỉnh sửa phương tiện"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên phương tiện"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-field"
        />
        <input
          type="number"
          placeholder="Chi phí / km (VND)"
          value={formData.costPerKm || ""}
          onChange={(e) => setFormData({ ...formData, costPerKm: parseInt(e.target.value) })}
          className="form-field"
        />
        <div className="form-actions">
          <button onClick={onClose} className="btn btn-outline">Huỷ</button>
          <button onClick={() => onSave(formData)} className="btn btn-primary">Lưu</button>
        </div>
      </div>
    </FormModal>
  );
}
