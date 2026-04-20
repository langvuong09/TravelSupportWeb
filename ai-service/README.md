# 🧠 AI Recommendation Service - Python FastAPI

Dịch vụ cung cấp khả năng đề xuất thông minh cho hệ thống TravelSupport, giúp người dùng tìm thấy các tour du lịch phù hợp nhất thông qua thuật toán máy học.

---

## 🛠️ Yêu cầu hệ thống
- **Python:** 3.9 hoặc mới hơn.
- **pip:** Quản lý gói thư viện Python.

## 🚀 Hướng dẫn cài đặt

### 1. Tạo môi trường ảo (Khuyên dùng)
```bash
cd ai-service
python -m venv .venv

# Kích hoạt trên Windows:
.\.venv\Scripts\Activate.ps1

# Kích hoạt trên Linux/macOS:
source .venv/bin/activate
```

### 2. Cài đặt thư viện
```bash
pip install -r requirements.txt
```

### 3. Chạy dịch vụ
```bash
python -m app.main
```
Dịch vụ sẽ lắng nghe tại: `http://localhost:8001`

---

## 🧠 Huấn luyện Model (Training)

Nếu bạn cập nhật dữ liệu huấn luyện hoặc muốn train lại model NLP:

### 1. Huấn luyện NLP Intent
Script này sẽ xử lý file `data/intent_data.json` và tạo ra model `data/intent_pipeline.pkl`.
```bash
python app/nlp_trainer.py
```

### 2. Chèn dữ liệu mẫu (Massive Mock Data)
Sử dụng script này để populate database MySQL với dữ liệu người dùng, địa điểm và tương tác thực tế (dành cho Recommendation Engine):
```bash
# Đứng tại thư mục gốc của project hoặc dùng đường dẫn tương đối
python ../Database/insert_data.py 
```
*(Lưu ý: Bạn cần chỉnh sửa `host`, `user`, `password` trong file `insert_data.py` để khớp với MySQL của bạn).*

---

## Kiểm tra system recommend
python -m app.evaluator

## 🧪 Kiểm tra API
Bạn có thể kiểm tra tính năng gợi ý bằng `curl`:
```bash
curl -X POST http://localhost:8001/predict \
     -H "Content-Type: application/json" \
     -d '{"query": "tour biển", "top_k": 3, "participants": 2, "candidates": []}'
```

---

## 📂 Giải thích thư mục
- **`app/main.py`**: Điểm khởi đầu của ứng dụng FastAPI.
- **`app/logic/`**: Chứa các thuật toán xử lý dữ liệu và tính toán điểm tương đồng (Recommendation Logic).
- **`data/`**: Chứa dữ liệu huấn luyện hoặc cấu hình cho model.

---

## ⚡ Các thông số đầu vào (Predict)
Dịch vụ nhận vào:
- `query`: Sở thích người dùng nhập vào.
- `days`: Số ngày dự kiến.
- `budget`: Mức ngân sách.
- `top_k`: Số lượng kết quả muốn lấy ra.
- `candidates`: Danh sách các tour từ database để AI đánh giá và xếp hạng.
