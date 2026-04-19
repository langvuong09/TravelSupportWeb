# 🔵 Frontend Web - React

Giao diện người dùng của **TravelSupportWeb** được xây dựng với trải nghiệm hiện đại, mượt mà và tối ưu hóa cho việc khám phá du lịch.

---

## 🛠️ Yêu cầu hệ thống
- **Node.js:** v16.x hoặc v18.x trở lên.
- **npm:** v8.x trở lên.

## 🚀 Hướng dẫn khởi chạy

### 1. Cài đặt thư viện
```bash
cd frontend
npm install
```

### 2. Chạy môi trường phát triển
```bash
npm start
```
Website sẽ hiển thị tại: `http://localhost:3000`

---

## 📦 Cấu trúc Layout & Components
- **`src/context/`**: Quản lý trạng thái đăng nhập (`AuthContext`) và giỏ hàng/đặt tour (`BookingContext`).
- **`src/services/api.js`**: Trung tâm xử lý tất cả các yêu cầu gửi lên Backend.
- **`src/pages/public/`**: Các trang xem tự do (Trang chủ, Địa điểm, Tour).
- **`src/pages/user/`**: Các trang yêu cầu đăng nhập (Tạo tour, Đặt tour, Lịch sử).
- **`src/pages/admin/`**: Giao diện dành riêng cho quản trị viên.

---

## ✨ Tính năng nổi bật trên Giao diện
- **Smooth Animations:** Sử dụng CSS keyframes cho các hiệu ứng chuyển trang và hiển thị card.
- **Interactive Map Logic:** Tích chọn địa điểm trực quan trong trang tạo tour.
- **Rich UI:** Giao diện cao cấp với hệ thống màu sắc hài hòa và typography hiện đại.
- **Booking Invoice:** Form hạch toán chi tiết sau khi đặt tour thành công.

---

## 🌐 Cấu hình kết nối
Nếu Backend chạy ở cổng khác 8080, hãy cập nhật biến môi trường hoặc thay đổi `API_BASE` trong `src/services/api.js`:
```javascript
const API_BASE = "http://localhost:8080";
```
