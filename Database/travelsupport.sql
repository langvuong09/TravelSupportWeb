-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 02, 2026 lúc 07:50 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `travelsupport`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `foods`
--

CREATE TABLE `foods` (
  `food_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `estimated_price` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `foods`
--

INSERT INTO `foods` (`food_id`, `description`, `estimated_price`, `image`, `name`, `province_id`, `type`) VALUES
(1, 'Quán phở gia truyền nổi tiếng Hà Nội', 50000, 'pho_ha_noi.jpg', 'Phở Bát Đàn', 1, 'quán bình dân'),
(2, 'Quán cơm tấm ngon Sài Gòn', 60000, 'com_tam.jpg', 'Cơm Tấm Ba Ghiền', 2, 'nhà hàng'),
(3, 'Quán mì Quảng đặc sản Đà Nẵng', 45000, 'mi_quang.jpg', 'Mì Quảng Bà Mua', 3, 'nhà hàng'),
(4, 'Quán bánh đa cua Hải Phòng', 40000, 'banh_da_cua.jpg', 'Bánh đa cua Cô Yến', 4, 'nhà hàng'),
(5, 'Quán hủ tiếu miền Tây', 35000, 'hu_tieu.jpg', 'Hủ Tiếu Cần Thơ', 5, 'nhà hàng'),
(6, 'Quán lẩu mắm nổi tiếng', 120000, 'lau_mam.jpg', 'Lẩu mắm An Giang', 6, 'nhà hàng'),
(7, 'Hải sản tươi sống Vũng Tàu', 150000, 'hai_san.jpg', 'Gành Hào', 7, 'nhà hàng'),
(8, 'Quán bún đậu mắm tôm Bắc Giang', 40000, 'bun_dau.jpg', 'Bún đậu phố', 8, 'nhà hàng'),
(9, 'Quán bánh phu thê Bắc Ninh', 30000, 'banh_phu_the.jpg', 'Bánh phu thê Đình Bảng', 9, 'nhà hàng'),
(10, 'Quán ăn sinh thái Bến Tre', 70000, 'ben_tre_food.jpg', 'Ẩm thực Cồn Phụng', 10, 'nhà hàng'),
(11, 'Quán buffet Bình Dương', 150000, 'buffet.jpg', 'Buffet Đại Nam', 11, 'nhà hàng'),
(12, 'Hải sản Quy Nhơn tươi ngon', 120000, 'seafood_qn.jpg', 'Hải sản Kỳ Co', 12, 'nhà hàng'),
(13, 'Quán ăn Mũi Né Bình Thuận', 80000, 'mui_ne_food.jpg', 'Quán Cây Bàng', 13, 'nhà hàng'),
(14, 'Quán cua Cà Mau', 200000, 'cua_ca_mau.jpg', 'Cua Năm Căn', 14, 'nhà hàng'),
(15, 'Quán cà phê Tây Nguyên', 50000, 'coffee.jpg', 'Cafe Buôn Ma Thuột', 15, 'nhà hàng'),
(16, 'Quán gà nướng Đồng Nai', 100000, 'ga_nuong.jpg', 'Gà nướng Bửu Long', 16, 'nhà hàng'),
(17, 'Quán ăn sen Đồng Tháp', 60000, 'sen_food.jpg', 'Ẩm thực Đồng Sen', 17, 'nhà hàng'),
(18, 'Quán cơm lam Gia Lai', 70000, 'com_lam.jpg', 'Cơm lam Pleiku', 18, 'nhà hàng'),
(19, 'Quán bánh bèo Hà Tĩnh', 30000, 'banh_beo.jpg', 'Bánh bèo Hà Tĩnh', 19, 'nhà hàng'),
(20, 'Quán bánh đậu xanh Hải Dương', 25000, 'banh_dau_xanh.jpg', 'Bánh đậu xanh gia truyền', 20, 'nhà hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `estimated_cost` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `nice_time` varchar(255) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `locations`
--

INSERT INTO `locations` (`location_id`, `description`, `estimated_cost`, `image`, `name`, `nice_time`, `province_id`, `type`) VALUES
(2, 'Nhà thờ lớn tại trung tâm TP.HCM', NULL, 'nha_tho_duc_ba.jpg', 'Nhà thờ Đức Bà', 'Tháng 12 - Tháng 4', 2, 'Văn hóa'),
(3, 'Cây cầu nổi tiếng có rồng phun lửa', 0, 'cau_rong.jpg', 'Cầu Rồng', 'Tháng 2 - Tháng 8', 3, 'Giải trí'),
(4, 'Khu du lịch biển nổi tiếng Hải Phòng', 50000, 'do_son.jpg', 'Đồ Sơn', 'Tháng 5 - Tháng 8', 4, 'Biển đảo'),
(5, 'Chợ nổi đặc trưng miền Tây', 100000, 'cai_rang.jpg', 'Chợ nổi Cái Răng', 'Tháng 11 - Tháng 4', 5, 'Văn hóa'),
(6, 'Khu du lịch tâm linh nổi tiếng', 200000, 'nui_cam.jpg', 'Núi Cấm', 'Tháng 12 - Tháng 4', 6, 'Thiên nhiên'),
(7, 'Bãi biển đẹp gần TP.HCM', 100000, 'vung_tau.jpg', 'Bãi Sau Vũng Tàu', 'Tháng 11 - Tháng 4', 7, 'Biển đảo'),
(8, 'Di tích lịch sử Bắc Giang', 0, 'chua_vinh_nghiem.jpg', 'Chùa Vĩnh Nghiêm', 'Tháng 1 - Tháng 3', 8, 'Văn hóa'),
(9, 'Chùa nổi tiếng Bắc Ninh', 0, 'chua_dau.jpg', 'Chùa Dâu', 'Tháng 1 - Tháng 3', 9, 'Văn hóa'),
(10, 'Cồn du lịch sinh thái', 50000, 'con_phung.jpg', 'Cồn Phụng', 'Tháng 12 - Tháng 4', 10, 'Nghỉ dưỡng'),
(11, 'Khu du lịch Đại Nam', 200000, 'dai_nam.jpg', 'Đại Nam', 'Quanh năm', 11, 'Giải trí'),
(12, 'Biển Quy Nhơn đẹp', 0, 'ky_co.jpg', 'Kỳ Co', 'Tháng 3 - Tháng 9', 12, 'Biển đảo'),
(13, 'Đồi cát nổi tiếng', 50000, 'mui_ne.jpg', 'Đồi cát Mũi Né', 'Tháng 11 - Tháng 4', 13, 'Thiên nhiên'),
(14, 'Mũi cực Nam Việt Nam', 100000, 'mui_ca_mau.jpg', 'Mũi Cà Mau', 'Tháng 12 - Tháng 4', 14, 'Thiên nhiên'),
(15, 'Thác nước đẹp Tây Nguyên', 50000, 'dray_nur.jpg', 'Thác Dray Nur', 'Tháng 11 - Tháng 4', 15, 'Thiên nhiên'),
(16, 'Khu du lịch sinh thái Đồng Nai', 80000, 'buu_long.jpg', 'Bửu Long', 'Quanh năm', 16, 'Nghỉ dưỡng'),
(17, 'Cánh đồng sen nổi tiếng', 30000, 'dong_sen.jpg', 'Đồng Sen Tháp Mười', 'Tháng 5 - Tháng 8', 17, 'Thiên nhiên'),
(18, 'Biển Hồ Pleiku', 0, 'bien_ho.jpg', 'Biển Hồ', 'Tháng 11 - Tháng 4', 18, 'Thiên nhiên'),
(19, 'Khu di tích lịch sử Hà Tĩnh', 0, 'nga_ba_dong_loc.jpg', 'Ngã ba Đồng Lộc', 'Tháng 1 - Tháng 4', 19, 'Văn hóa'),
(20, 'Côn Sơn Kiếp Bạc', 50000, 'con_son.jpg', 'Côn Sơn Kiếp Bạc', 'Tháng 1 - Tháng 3', 20, 'Văn hóa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `provinces`
--

CREATE TABLE `provinces` (
  `province_id` int(11) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `provinces`
--

INSERT INTO `provinces` (`province_id`, `latitude`, `longitude`, `name`) VALUES
(1, 21.0285, 105.8542, 'Ha Noi'),
(2, 10.8231, 106.6297, 'Ho Chi Minh'),
(3, 16.0544, 108.2022, 'Da Nang'),
(4, 20.8449, 106.6881, 'Hai Phong'),
(5, 10.0452, 105.7469, 'Can Tho'),
(6, 10.5216, 105.1259, 'An Giang'),
(7, 10.5417, 107.2428, 'Ba Ria - Vung Tau'),
(8, 21.2819, 106.1977, 'Bac Giang'),
(9, 21.1214, 106.111, 'Bac Ninh'),
(10, 10.2434, 106.3756, 'Ben Tre'),
(11, 11.3254, 106.477, 'Binh Duong'),
(12, 13.782, 109.2197, 'Binh Dinh'),
(13, 11.0904, 108.0721, 'Binh Thuan'),
(14, 9.1768, 105.1524, 'Ca Mau'),
(15, 12.6667, 108.05, 'Dak Lak'),
(16, 11.0686, 107.1676, 'Dong Nai'),
(17, 10.4938, 105.6882, 'Dong Thap'),
(18, 13.9833, 108, 'Gia Lai'),
(19, 18.3559, 105.8877, 'Ha Tinh'),
(20, 20.9373, 106.3146, 'Hai Duong'),
(21, 16.4637, 107.5909, 'Hue'),
(22, 12.2388, 109.1967, 'Khanh Hoa'),
(23, 11.9404, 108.4583, 'Lam Dong'),
(24, 10.6956, 106.2431, 'Long An'),
(25, 20.4388, 106.1621, 'Nam Dinh'),
(26, 19.2342, 104.92, 'Nghe An'),
(27, 20.2506, 105.9745, 'Ninh Binh'),
(28, 10.2899, 103.984, 'Phu Quoc'),
(29, 15.5394, 108.0191, 'Quang Nam'),
(30, 15.1205, 108.7923, 'Quang Ngai'),
(31, 9.6037, 105.98, 'Soc Trang'),
(32, 11.31, 106.0983, 'Tay Ninh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE `tours` (
  `tour_id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`tour_id`, `created_at`, `name`, `user_id`) VALUES
('1', '2026-03-31 18:31:50.000000', 'Tour Hà Nội 1 ngày', 2),
('2', '2026-03-31 18:31:50.000000', 'Tour Sài Gòn khám phá', 2),
('3', '2026-03-31 18:31:50.000000', 'Tour Đà Nẵng biển xanh', 2),
('4', '2026-03-31 18:31:50.000000', 'Tour Huế cổ kính', 2),
('5', '2026-03-31 18:31:50.000000', 'Tour Phú Quốc nghỉ dưỡng', 3),
('6', '2026-03-31 18:33:13.000000', 'Tour Nha Trang vui chơi', 3),
('7', '2026-03-31 18:32:51.000000', 'Tour Sapa săn mây', 3),
('8', '2026-03-31 18:32:51.000000', 'Tour Đà Lạt lãng mạn', 3),
('9', '2026-03-31 18:32:51.000000', 'Tour Cần Thơ miền Tây', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_foods`
--

CREATE TABLE `tour_foods` (
  `id` int(11) NOT NULL,
  `food_id` int(11) DEFAULT NULL,
  `tour_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_foods`
--

INSERT INTO `tour_foods` (`id`, `food_id`, `tour_id`) VALUES
(1, 1, '1'),
(2, 2, '1'),
(3, 3, '2'),
(4, 4, '2'),
(5, 5, '2'),
(6, 6, '3'),
(7, 7, '4'),
(8, 8, '4'),
(9, 9, '5'),
(10, 10, '5'),
(11, 11, '5'),
(12, 12, '6'),
(13, 13, '7'),
(14, 14, '7'),
(15, 15, '8'),
(16, 16, '8'),
(17, 17, '8'),
(18, 18, '9'),
(19, 19, '9'),
(20, 20, '9');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_locations`
--

CREATE TABLE `tour_locations` (
  `id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `tour_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_locations`
--

INSERT INTO `tour_locations` (`id`, `location_id`, `tour_id`) VALUES
(1, 1, '1'),
(2, 2, '1'),
(3, 3, '2'),
(4, 4, '2'),
(5, 5, '2'),
(6, 6, '3'),
(7, 7, '4'),
(8, 8, '4'),
(9, 9, '5'),
(10, 10, '5'),
(11, 11, '5'),
(12, 12, '6'),
(13, 13, '7'),
(14, 14, '7'),
(15, 15, '8'),
(16, 16, '8'),
(17, 16, '8'),
(18, 17, '9'),
(19, 18, '9'),
(20, 19, '9');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_provinces`
--

CREATE TABLE `tour_provinces` (
  `id` int(11) NOT NULL,
  `province_id` int(11) DEFAULT NULL,
  `tour_id` varchar(255) DEFAULT NULL,
  `visit_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_provinces`
--

INSERT INTO `tour_provinces` (`id`, `province_id`, `tour_id`, `visit_order`) VALUES
(1, 1, '1', 1),
(2, 2, '1', 2),
(3, 3, '2', 1),
(4, 4, '2', 2),
(5, 5, '2', 3),
(6, 6, '3', 1),
(7, 7, '4', 1),
(8, 8, '4', 2),
(9, 9, '5', 1),
(10, 10, '5', 2),
(11, 11, '5', 3),
(12, 12, '6', 1),
(13, 13, '7', 1),
(14, 14, '7', 2),
(15, 15, '8', 1),
(16, 16, '8', 2),
(17, 17, '9', 1),
(18, 18, '9', 2),
(19, 19, '9', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_transport`
--

CREATE TABLE `tour_transport` (
  `id` int(11) NOT NULL,
  `from_province` int(11) DEFAULT NULL,
  `to_province` int(11) DEFAULT NULL,
  `tour_id` varchar(255) DEFAULT NULL,
  `transport_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transport_types`
--

CREATE TABLE `transport_types` (
  `transport_id` int(11) NOT NULL,
  `cost_per_km` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `transport_types`
--

INSERT INTO `transport_types` (`transport_id`, `cost_per_km`, `name`) VALUES
(1, 800, 'Xe khách'),
(2, 3500, 'Máy bay'),
(3, 600, 'Tàu hỏa'),
(5, 1200, 'Tàu thuyền');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `birth_date` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `birth_date`, `email`, `first_name`, `last_name`, `password`, `phone`, `role`, `username`, `image`) VALUES
(1, NULL, NULL, NULL, NULL, 'admin', NULL, 'ADMIN', 'admin', ''),
(2, '2004-01-20', 'cuongcaotien9a@gmail.com', 'Cuong', '', 'cuong10a07', '0962385165', 'USER', 'cuonghero9a', ''),
(3, '2004-01-20', 'cuongcaotien9a@gmail.com', 'Cường', '', 'cuonghero9a', '0962385165', 'USER', 'cuonghero10a07', '');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`food_id`);

--
-- Chỉ mục cho bảng `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Chỉ mục cho bảng `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`province_id`);

--
-- Chỉ mục cho bảng `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`tour_id`);

--
-- Chỉ mục cho bảng `tour_foods`
--
ALTER TABLE `tour_foods`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tour_locations`
--
ALTER TABLE `tour_locations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tour_provinces`
--
ALTER TABLE `tour_provinces`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tour_transport`
--
ALTER TABLE `tour_transport`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `transport_types`
--
ALTER TABLE `transport_types`
  ADD PRIMARY KEY (`transport_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `foods`
--
ALTER TABLE `foods`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `provinces`
--
ALTER TABLE `provinces`
  MODIFY `province_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `tour_foods`
--
ALTER TABLE `tour_foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `tour_locations`
--
ALTER TABLE `tour_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `tour_provinces`
--
ALTER TABLE `tour_provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `tour_transport`
--
ALTER TABLE `tour_transport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `transport_types`
--
ALTER TABLE `transport_types`
  MODIFY `transport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
