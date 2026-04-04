# TravelSupport – Frontend

Website hỗ trợ khám phá địa điểm du lịch thông minh  
**Đồ án chuyên ngành – Trường Đại học Sài Gòn**

---

## Cấu trúc thư mục

```
frontend/
├── public/
│   └── index.html
└── src/
    ├── App.jsx                  # Router chính + phân quyền
    ├── index.js
    ├── styles/
    │   └── global.css           # CSS dùng chung
    ├── context/
    │   └── AuthContext.jsx      # Quản lý đăng nhập (useState)
    ├── components/
    │   ├── UI.jsx               # Icons, StarRating, Badge, Avatar...
    │   ├── Navbar.jsx           # Navbar thay đổi theo role
    │   ├── Navbar.css
    │   ├── LocationCard.jsx     # Card địa điểm
    │   └── TourCard.jsx         # Card tour
    └── pages/
        ├── public/              # Xem được khi CHƯA đăng nhập
        │   ├── Home.jsx         # Trang chủ + hero + stats
        │   ├── Home.css
        │   ├── Locations.jsx    # Danh sách địa điểm + filter
        │   ├── LocationDetail.jsx
        │   ├── Tours.jsx        # Danh sách tour + filter giá/vùng
        │   ├── TourDetail.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Auth.css
        ├── user/                # Chỉ USER đăng nhập
        │   ├── BookingForm.jsx  # Đặt tour
        │   ├── MyBookings.jsx   # Lịch sử đặt tour
        │   ├── MyReviews.jsx    # Viết & xem đánh giá
        │   └── Profile.jsx      # Hồ sơ cá nhân
        └── admin/               # Chỉ ADMIN
            ├── AdminDashboard.jsx
            └── AdminPages.jsx   # Users/Locations/Tours/Bookings/Reviews
```

---

## Phân quyền

| Trang               | Khách | User | Admin |
|---------------------|-------|------|-------|
| Trang chủ           | ✅    | ✅   | ✅    |
| Xem địa điểm        | ✅    | ✅   | ✅    |
| Xem tour            | ✅    | ✅   | ✅    |
| Đặt tour            | ❌*   | ✅   | ❌    |
| Lịch sử đặt tour    | ❌    | ✅   | ❌    |
| Viết đánh giá       | ❌    | ✅   | ❌    |
| Admin Dashboard     | ❌    | ❌   | ✅    |

> *Khách xem được chi tiết tour, bấm "Đặt ngay" sẽ redirect về `/login`

---

## Cài đặt & chạy

```bash
cd frontend
npm install
npm start
```

Mặc định chạy ở `http://localhost:3000`

---

## Kết nối backend

Backend sử dụng Spring Boot tại `http://localhost:8080/api/...`
