-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 29, 2026 lúc 08:13 PM
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
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `foods`
--

INSERT INTO `foods` (`food_id`, `description`, `estimated_price`, `image`, `latitude`, `longitude`, `name`, `province_id`, `type`) VALUES
(1, 'Pho', 0, '50', 0, 0, '21.0285', 106, '1'),
(2, 'Banh Mi', 0, '20', 0, 0, '10.8231', 107, '2'),
(3, 'Bun Bo Hue', 0, '60', 0, 0, '16.4637', 108, '21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `estimated_cost` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `province_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `locations`
--

INSERT INTO `locations` (`location_id`, `description`, `estimated_cost`, `image`, `latitude`, `longitude`, `name`, `province_id`) VALUES
(1, '1', 0, 'Famous lake in Hanoi', 100, 0, '21.0285', 106),
(2, '2', 0, 'Famous market in HCM', 150, 0, '10.8231', 107),
(3, '3', 0, 'Beautiful beach in Da Nang', 200, 0, '16.0544', 108),
(4, '22', 0, 'Nice beach', 180, 0, '12.2388', 109),
(5, '23', 0, 'Cool city', 120, 0, '11.9404', 108);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `provinces`
--

CREATE TABLE `provinces` (
  `province_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `provinces`
--

INSERT INTO `provinces` (`province_id`, `name`) VALUES
(1, 'Ha Noi'),
(2, 'Ho Chi Minh'),
(3, 'Da Nang'),
(4, 'Hai Phong'),
(5, 'Can Tho'),
(6, 'An Giang'),
(7, 'Ba Ria - Vung Tau'),
(8, 'Bac Giang'),
(9, 'Bac Ninh'),
(10, 'Ben Tre'),
(11, 'Binh Duong'),
(12, 'Binh Dinh'),
(13, 'Binh Thuan'),
(14, 'Ca Mau'),
(15, 'Dak Lak'),
(16, 'Dong Nai'),
(17, 'Dong Thap'),
(18, 'Gia Lai'),
(19, 'Ha Tinh'),
(20, 'Hai Duong'),
(21, 'Hue'),
(22, 'Khanh Hoa'),
(23, 'Lam Dong'),
(24, 'Long An'),
(25, 'Nam Dinh'),
(26, 'Nghe An'),
(27, 'Ninh Binh'),
(28, 'Phu Quoc'),
(29, 'Quang Nam'),
(30, 'Quang Ngai'),
(31, 'Soc Trang'),
(32, 'Tay Ninh');

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
('T1', '0000-00-00 00:00:00.000000', 'Northern Vietnam Tour', 2147483647),
('T2', '0000-00-00 00:00:00.000000', 'Southern Vietnam Tour', 2147483647),
('T3', '0000-00-00 00:00:00.000000', 'Central Vietnam Tour', 2147483647);

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
(1, 0, '1'),
(2, 0, '2'),
(3, 0, '3');

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
(1, 0, '1'),
(2, 0, '2'),
(3, 0, '3'),
(4, 0, '5');

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
(1, 0, '1', 1),
(2, 0, '2', 20),
(3, 0, '1', 2),
(4, 0, '2', 24),
(5, 0, '1', 3),
(6, 0, '2', 22),
(7, 0, '3', 23);

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

--
-- Đang đổ dữ liệu cho bảng `tour_transport`
--

INSERT INTO `tour_transport` (`id`, `from_province`, `to_province`, `tour_id`, `transport_id`) VALUES
(1, 0, 1, '20', 1),
(2, 0, 2, '24', 2),
(3, 0, 3, '22', 3);

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
(1, 0, '1.5'),
(2, 0, '2.5'),
(3, 0, '10.0');

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
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `birth_date`, `email`, `first_name`, `last_name`, `password`, `phone`, `role`, `username`) VALUES
(1, NULL, NULL, NULL, NULL, 'admin', NULL, 'ADMIN', 'admin'),
(2, '2004-01-20', 'cuongcaotien9a@gmail.com', 'Cuong', '', 'cuong10a07', '0962385165', 'USER', 'cuonghero9a'),
(3, '2004-01-20', 'cuongcaotien9a@gmail.com', 'Cường', '', 'cuonghero9a', '0962385165', 'USER', 'cuonghero10a07');

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
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `provinces`
--
ALTER TABLE `provinces`
  MODIFY `province_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `tour_foods`
--
ALTER TABLE `tour_foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tour_locations`
--
ALTER TABLE `tour_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tour_provinces`
--
ALTER TABLE `tour_provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `tour_transport`
--
ALTER TABLE `tour_transport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `transport_types`
--
ALTER TABLE `transport_types`
  MODIFY `transport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
