# 🟢 Backend API - Spring Boot

Đây là hệ thống trung tâm xử lý logic nghiệp vụ, quản lý dữ liệu và kết nối giữa các dịch vụ trong dự án **TravelSupportWeb**.

---

## 🛠️ Yêu cầu hệ thống
- **Java:** JDK 17 hoặc mới hơn.
- **Maven:** Phiên bản 3.6 trở lên.
- **MySQL:** 8.0+.

## 🚀 Hướng dẫn cài đặt

### 1. Cấu hình Database
Mở tệp `src/main/resources/application.properties` và chỉnh sửa các thông số sau cho phù hợp với máy của bạn:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/travelsupport?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.jpa.hibernate.ddl-auto=update
```

### 2. Chạy ứng dụng
Dùng lệnh Maven để khởi động:
```bash
mvn clean spring-boot:run
```
Ứng dụng sẽ chạy tại: `http://localhost:8080`

---

## 📂 Cấu trúc mã nguồn
- `entity/`: Định nghĩa các bảng trong DB (User, Tour, Booking, Location...).
- `repository/`: Interface truy vấn dữ liệu (Spring Data JPA).
- `service/`: Xử lý logic nghiệp vụ chi tiết.
- `controller/`: Định nghĩa các API endpoints cho Frontend gọi.
- `config/`: Cấu hình hệ thống (CORS, AI Client...).

---

## 📡 Các API chính
- **Xác thực:** `/api/auth/login`, `/api/auth/register`
- **Địa điểm & Tỉnh thành:** `/api/locations`, `/api/provinces`
- **Quản lý Tour:** `/api/tours` (Lấy danh sách, tạo tour cá nhân)
- **Gợi ý thông minh (AI):** `/api/recommendations` (Kết nối và xếp hạng dựa trên AI Service).
- **Quản trị AI (Admin):** `POST /api/admin/train-ai` (Kích hoạt huấn luyện lại mô hình ALS).
- **Ghi nhận hành vi:** `POST /api/interactions/log` (Ghi lại view, click, booking).

---

## 🤖 Tính năng AI & Tự động hóa

### 1. Theo dõi hành vi (Behavior Tracking)
Hệ thống tự động ghi lại các tương tác của người dùng để làm đầu vào cho mô hình Collaborative Filtering:
- **View**: Ghi lại khi xem chi tiết địa điểm (sau 5 giây).
- **Click**: Ghi lại khi nhấn vào các gợi ý hoặc thẻ địa điểm.
- **Booking**: Ghi lại khi người dùng lưu địa điểm vào hành trình.

### 2. Lập lịch tự động (Cron Job)
Dự án tích hợp **Spring Scheduling** để tự động cập nhật mô hình AI mà không cần quản trị viên can thiệp:
- **Vị trí**: `com.example.backend.scheduler.AIScheduler`
- **Lịch trình**: Mặc định chạy mỗi ngày vào lúc 2:00 AM (Có thể cấu hình lại bằng Cron Expression).

---

---

## 🔑 Lưu ý bảo mật
- Hệ thống hỗ trợ xử lý CORS để cho phép Frontend React gọi API.
- Mật khẩu hiện tại được lưu trữ phù hợp với môi trường phát triển (cần mã hóa thêm khi đưa vào thực tế).
- Thư mục `/uploads` được dùng để lưu trữ hình ảnh tải lên từ Admin.
