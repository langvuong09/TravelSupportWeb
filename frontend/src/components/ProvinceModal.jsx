import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import "../styles/AdminModal.css";

export default function ProvinceModal({ mode, data, onSave, onChange, onClose }) {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    setFormData(data || {});
  }, [data]);
  
  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    if (onChange) {
      onChange(newFormData);
    }
  };
  
  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <FormModal title={mode === "add" ? "Thêm tỉnh mới" : "Chỉnh sửa tỉnh"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên tỉnh / thành phố"
          value={formData.name || ""}
          onChange={(e) => handleFormDataChange({ ...formData, name: e.target.value })}
          className="form-field"
        />
        <input
          type="number"
          placeholder="Vĩ độ (Latitude)"
          value={formData.latitude || ""}
          onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || "" })}
          className="form-field"
          step="0.0001"
        />
        <input
          type="number"
          placeholder="Kinh độ (Longitude)"
          value={formData.longitude || ""}
          onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || "" })}
          className="form-field"
          step="0.0001"
        />
        <div className="form-actions">
          <button onClick={onClose} className="btn btn-outline">Huỷ</button>
          <button onClick={handleSubmit} className="btn btn-primary">Lưu</button>
        </div>
      </div>
    </FormModal>
  );
}
