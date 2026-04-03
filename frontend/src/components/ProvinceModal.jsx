import React, { useState } from "react";
import FormModal from "./FormModal";
import "../styles/AdminModal.css";

export default function ProvinceModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});
  const [provinces, setProvinces] = useState([]);
  
    const handleSubmit = () => {
    // POST dữ liệu mới vào backend
      fetch("http://localhost:8080/api/provinces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log("Thêm thành công:", data);
          // Cập nhật lại danh sách provinces
          setProvinces(prev => [...prev, data]);
          // reset form
          setFormData({ name: "" });
          // đóng modal nếu muốn
          onClose();
        })
        .catch(err => console.error(err));
    };

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
