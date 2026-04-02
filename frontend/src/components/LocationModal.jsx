import React, { useEffect,useState } from "react";
import FormModal from "./FormModal";
import { mockProvinces } from "../data/mockData";
import "../styles/AdminModal.css";

export default function LocationModal({ mode, data, onSave, onClose, onSaved }) {
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
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleSave = async () => {
    // basic validation
    if (!formData.name || !formData.provinceId) {
      console.error('Tên địa điểm và tỉnh không được để trống');
      return;
    }

    // prepare payload matching backend entity fields
    const payload = {
      ...(formData.locationId ? { locationId: formData.locationId } : {}),
      provinceId: formData.provinceId ? Number(formData.provinceId) : null,
      name: formData.name,
      description: formData.description || null,
      estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : null,
      image: formData.image || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      type: formData.type || null,
      niceTime: formData.niceTime || null,
    };

    try {
      const res = await fetch('http://localhost:8080/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const saved = await res.json();
      if (onSaved) onSaved(saved);
      if (onSave) onSave(saved);
      onClose();
    } catch (err) {
      console.error('Lưu địa điểm thất bại', err);
    }
  };
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
          value={formData.niceTime || ""}
          onChange={(e) => setFormData({ ...formData, niceTime: e.target.value })}
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
          <button onClick={handleSave} className="btn btn-primary">Lưu</button>
        </div>
      </div>
    </FormModal>
  );
}
