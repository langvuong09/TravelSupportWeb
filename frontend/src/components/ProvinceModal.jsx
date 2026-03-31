import React, { useState } from "react";
import FormModal from "./FormModal";
import "../styles/AdminModal.css";

export default function ProvinceModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});

  return (
    <FormModal title={mode === "add" ? "Thêm tỉnh mới" : "Chỉnh sửa tỉnh"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên tỉnh / thành phố"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
