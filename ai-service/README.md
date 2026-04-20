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

## 🧠 Kiến trúc Gợi ý (Hybrid Recommendation)

Dịch vụ sử dụng kết hợp 3 kỹ thuật chính:
1.  **Collaborative Filtering (CF)**: Sử dụng thuật toán ALS (Alternating Least Squares) từ thư viện `implicit` để học từ hành vi thực tế của người dùng (view, click, booking).
2.  **Content-Based Filtering (CBF)**: Đề xuất dựa trên thuộc tính địa điểm (giá cả, độ phổ biến) để giải quyến vấn đề người dùng mới (Cold Start).
3.  **Natural Language Processing (NLP)**: Sử dụng `TfidfVectorizer` và `LogisticRegression` để hiểu ý định người dùng (Intent) từ câu truy vấn (query) và khớp với phong cách (styles) của địa điểm.

---

## 🛠️ Các API Endpoint chính

| Endpoint | Method | Chức năng |
| :--- | :--- | :--- |
| `/predict` | `POST` | Dự đoán và xếp hạng các địa điểm gợi ý. |
| `/train` | `POST` | Huấn luyện lại mô hình Collaborative Filtering (ALS) từ dữ liệu tương tác mới. |
| `/train-nlp` | `POST` | Huấn luyện lại bộ phân loại ý định (NLP Intent) từ `intent_data.json`. |
| `/health` | `GET` | Kiểm tra trạng thái hoạt động của dịch vụ. |

---

## 🧠 Huấn luyện Model (Training)

### 1. Huấn luyện qua API (Khuyên dùng)
Bạn có thể kích hoạt huấn luyện trực tiếp qua API (thay vì chạy script thủ công):
```bash
# Huấn luyện CF (ALS)
curl -X POST http://localhost:8001/train -d '[{"user_id":1, "location_id":10, "event_type":"view"}]'

# Huấn luyện NLP
curl -X POST http://localhost:8001/train-nlp
```

---

## 🧪 Đánh giá mô hình (Evaluator)
Để kiểm tra độ chính xác (Hit Rate, MRR) của mô hình trên dữ liệu thực tế:
```bash
python -m app.evaluator
```

---

## 📂 Cấu trúc thư mục
- **`app/main.py`**: Điểm khởi đầu FastAPI.
- **`app/recommend.py`**: Trái tim của hệ thống gợi ý (Hybrid Logic).
- **`app/nlp_utils.py`**: Các tiện ích xử lý ngôn ngữ tự nhiên.
- **`app/schemas.py`**: Định nghĩa cấu trúc dữ liệu Pydantic.

