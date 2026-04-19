# TravelSupportWeb - Hệ thống Hỗ trợ và Gợi ý Du lịch Thông minh

Chào mừng bạn đến với **TravelSupportWeb**, một nền tảng toàn diện giúp người dùng khám phá địa điểm, lập kế hoạch và đặt các tour du lịch dựa trên gợi ý từ AI.

---

## 🏗️ Cấu trúc hệ thống

Dự án bao gồm 3 thành phần chính:

1.  **Backend (`/backend`):** Core API xử lý nghiệp vụ, quản lý cơ sở dữ liệu và xác thực người dùng.
2.  **Frontend (`/frontend`):** Giao diện Web hiện đại dành cho người dùng và quản trị viên.
3.  **AI Service (`/ai-service`):** Dịch vụ thông minh cung cấp các đề xuất tour dựa trên sở thích và hành vi của người dùng.

---

## 🛠️ Công nghệ sử dụng

- **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA, MySQL.
- **Frontend:** React, Context API, CSS Vanilla (Rich UI/UX).
- **AI Service:** Python 3.9+, FastAPI, Scikit-learn (Recommendation Engine).
- **Database:** MySQL 8.0.

---

## 🚀 Hướng dẫn bắt đầu nhanh

### 1. Cơ sở dữ liệu

- Tạo database trong MySQL:
  ```sql
  CREATE DATABASE travelsupport CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- Nhập dữ liệu mẫu (nếu có) từ thư mục `/Database` hoặc để hệ thống tự tạo bảng thông qua JPA.

### 2. Khởi chạy AI Service (Cổng 8001)

```bash
cd ai-service
# Cài đặt môi trường ảo và dependencies (Xem chi tiết tại ai-service/README.md)
python -m venv .venv
.\.venv\Scripts\Activate.ps1 # Windows
pip install -r requirements.txt
python -m app.main
```

### 3. Khởi chạy Backend (Cổng 8080)

```bash
cd backend
# Cấu hình DB trong src/main/resources/application.properties
mvn clean spring-boot:run
```

### 4. Khởi chạy Frontend (Cổng 3000)

```bash
cd frontend
npm install
npm start
```

---

## 📱 Tính năng chính

- **Khám phá:** Xem danh sách địa điểm du lịch, ẩm thực và các tour có sẵn.
- **Tạo Tour tùy chỉnh:** Người dùng tự chọn tỉnh thành, địa điểm, phương tiện và AI sẽ tính toán chi phí dự kiến.
- **Đặt Tour:** Quy trình đặt tour tinh gọn, lưu trữ lịch sử và hóa đơn (Booking Invoice).
- **Gợi ý AI:** Tự động đề xuất các hành trình phù hợp nhất dựa trên yêu cầu của người dùng.
- **Quản trị (Admin):** Quản lý người dùng, địa điểm, tour và các đơn đặt hàng.

---

## 📝 Tài khoản mặc định

- **Admin:** `admin` / `admin`
- **User:** `user` / `123456`

---

_Dự án thuộc Đồ án chuyên ngành - Trường Đại học Sài Gòn._
