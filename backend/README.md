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
- **Địa điểm:** `/api/locations`, `/api/provinces`
- **Tour:** `/api/tours` (Lấy danh sách, tạo tour mới)
- **Đặt tour (Booking):**
    - `POST /api/bookings`: Đặt tour.
    - `GET /api/bookings/my-bookings/{userId}`: Lịch sử đặt tour.
- **Gợi ý:** `/api/recommendations` (Kết nối với AI Service).

---

## 🔑 Lưu ý bảo mật
- Hệ thống hỗ trợ xử lý CORS để cho phép Frontend React gọi API.
- Mật khẩu hiện tại được lưu trữ phù hợp với môi trường phát triển (cần mã hóa thêm khi đưa vào thực tế).
- Thư mục `/uploads` được dùng để lưu trữ hình ảnh tải lên từ Admin.
