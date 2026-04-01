import React, { useEffect,useState } from "react";
import FormModal from "./FormModal";
import { mockProvinces } from "../data/mockData";
import "../styles/AdminModal.css";

export default function LocationModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});
  const types = ["Thiên nhiên", "Văn hóa", "Biển đảo", "Nghỉ dưỡng", "Giải trí"];
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/provinces")
      .then(res => res.json())
      .then(data => {
        setProvinces(data);
      })      
    .catch(err => console.error(err));
  }, []);

  
  return (
    <FormModal title={mode === "add" ? "Thêm địa điểm mới" : "Chỉnh sửa địa điểm"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên địa điểm"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-field"
        />
        <textarea
          placeholder="Mô tả"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-textarea"
        />
        <div className="form-select">
          <select
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Chọn loại</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-select">
          <select
            value={formData.provinceId || ""}
            onChange={(e) => {
              const value = e.target.value;

              setFormData({
                ...formData,
                provinceId: value ? parseInt(value) : null
              });
            }}
          >
            <option value="">Chọn tỉnh</option>
            {provinces.map((p) => (
              <option key={p.provinceId} value={p.provinceId}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder="Chi phí ước tính (VND)"
          value={formData.estimatedCost || ""}
          onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) })}
          className="form-field"
        />
        <input
          type="text"
          placeholder="Thời điểm đẹp nhất"
          value={formData.bestTimeToVisit || ""}
          onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
          className="form-field"
        />
        <input
          type="text"
          placeholder="URL hình ảnh"
          value={formData.image || ""}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
