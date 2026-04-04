import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { getProvinces } from "../services/api";
import "../styles/AdminModal.css";

export default function FoodModal({ mode, data, onSave, onClose }) {
  const [formData, setFormData] = useState(data || {});
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provs = await getProvinces();
        setProvinces(provs);
      } catch (err) {
        console.error("Error loading provinces:", err);
      }
    };
    loadProvinces();
  }, []);
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const foodTypes = ["nhà hàng", "quán bình dân", "quán nước", "phố ẩm thực", "quán ăn vặt", "quán ăn nhanh"];

  return (
    <FormModal title={mode === "add" ? "Thêm món ăn mới" : "Chỉnh sửa món ăn"} onClose={onClose}>
      <div className="form-modal__fields">
        <input
          type="text"
          placeholder="Tên món ăn"
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
            {foodTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-select">
          <select
            value={formData.provinceId || ""}
            onChange={(e) => setFormData({ ...formData, provinceId: parseInt(e.target.value) })}
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
          placeholder="Giá ước tính (VND)"
          value={formData.estimatedPrice || ""}
          onChange={(e) => setFormData({ ...formData, estimatedPrice: parseInt(e.target.value) })}
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
          <button
            onClick={async () => {
              try {
                await onSave(formData);
                onClose();
              } catch (err) {
                // ignore here — parent will set toast on error
                console.error('FoodModal save error', err);
              }
            }}
            className="btn btn-primary"
          >Lưu</button>
        </div>
      </div>
    </FormModal>
  );
}
