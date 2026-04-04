-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 04, 2026 lúc 04:33 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

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
(1, 'Quán phở gia truyền nổi tiếng Hà Nội', 50000, 'https://tse4.mm.bing.net/th/id/OIP.oW9y1VRk_qIvGm1x89qBHgHaGF?rs=1&pid=ImgDetMain&o=7&rm=3', 'Phở Bát Đàn', 1, 'quán bình dân'),
(2, 'Quán cơm tấm ngon Sài Gòn', 60000, 'https://cdn2.tuoitre.vn/thumb_w/1200/471584752817336320/2023/6/7/com-tam-ba-ghien-1-16861496112601460952627-9-0-1056-2000-crop-1686150543059264631767.jpg', 'Cơm Tấm Ba Ghiền', 2, 'nhà hàng'),
(3, 'Quán mì Quảng đặc sản Đà Nẵng', 45000, 'https://mms.img.susercontent.com/vn-11134513-7r98o-lsvbzll117dl85@resize_ss1242x600!@crop_w1242_h600_cT', 'Mì Quảng Bà Mua', 3, 'nhà hàng'),
(4, 'Quán bánh đa cua Hải Phòng', 40000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaF2rfazK2NY38akSPioEuwfkKFFFfFvkpIg&s', 'Bánh đa cua Cô Yến', 4, 'nhà hàng'),
(5, 'Quán hủ tiếu miền Tây', 35000, 'https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/02_2023/quan-hu-tieu-ngon-o-can-tho-ngoc-lan.jpg', 'Hủ Tiếu Cần Thơ', 5, 'nhà hàng'),
(6, 'Quán lẩu mắm nổi tiếng', 120000, 'https://mia.vn/media/uploads/blog-du-lich/lau-mam-an-giang-mon-an-dai-dien-cho-nen-am-thuc-mien-dat-tay-nam-04-1661323984.jpeg', 'Lẩu mắm An Giang', 6, 'nhà hàng'),
(7, 'Hải sản tươi sống Vũng Tàu', 150000, 'https://thegioigiay.net/wp-content/uploads/2022/12/ganh-hao-Vung-Tau.jpg', 'Gành Hào', 7, 'nhà hàng'),
(8, 'Quán bún đậu mắm tôm Bắc Giang', 40000, 'https://mms.img.susercontent.com/vn-11134513-7r98o-lsvcvqc0b5i16e@resize_ss1242x600!@crop_w1242_h600_cT', 'Bún đậu phố', 8, 'nhà hàng'),
(9, 'Quán bánh phu thê Bắc Ninh', 30000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnJ5GR_WAzIh1KqShuxagNtfytZjbo8sMoQ&s', 'Bánh phu thê Đình Bảng', 9, 'nhà hàng'),
(10, 'Quán ăn sinh thái Bến Tre', 70000, 'https://mia.vn/media/uploads/blog-du-lich/doc-dao-mon-ngon-o-con-lan-con-phung-an-mot-lan-la-nho-mai-02-1665240028.jpg', 'Ẩm thực Cồn Phụng', 10, 'nhà hàng'),
(11, 'Quán buffet Bình Dương', 150000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWWpe5-wiqJJ-AP-f524cW2xUyV47gZ5kb-Q&s', 'Buffet Đại Nam', 11, 'nhà hàng'),
(12, 'Hải sản Quy Nhơn tươi ngon', 120000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdiwRojLcnTVqPwvRmy7PuQ8rrKSGoLkpxMQ&s', 'Hải sản Kỳ Co', 12, 'nhà hàng'),
(13, 'Quán ăn Mũi Né Bình Thuận', 80000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToIc8vkC96VvZc3awjhFEZnQ5xfjWv9y5OUw&s', 'Quán Cây Bàng', 13, 'nhà hàng'),
(14, 'Quán cua Cà Mau', 200000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRywK0Vc1TVLxKKp93yX8Ij7QFt-8HerTNeIQ&s', 'Cua Năm Căn', 14, 'nhà hàng'),
(15, 'Quán cà phê Tây Nguyên', 50000, 'https://simexcodl.com.vn/wp-content/uploads/2023/11/ca-phe-buon-ma-thuot-1.jpg', 'Cafe Buôn Ma Thuột', 15, 'nhà hàng'),
(16, 'Quán gà nướng Đồng Nai', 100000, 'https://buulong.com.vn/wp-content/uploads/2026/03/ga-nuong-o-o-o-nguyen-hong-dao-5.webp', 'Gà nướng Bửu Long', 16, 'nhà hàng'),
(17, 'Quán ăn sen Đồng Tháp', 60000, 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/5/12/1339025/Ve-Dong-Thap-Thuong--03.JPG', 'Ẩm thực Đồng Sen', 17, 'nhà hàng'),
(18, 'Quán cơm lam Gia Lai', 70000, 'https://mia.vn/media/uploads/blog-du-lich/ga-nuong-com-lam-pleiku-dac-san-dan-da-giua-chon-dai-ngan-01-1659364982.jpeg', 'Cơm lam Pleiku', 18, 'nhà hàng'),
(19, 'Quán bánh bèo Hà Tĩnh', 30000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESZGQgB9xPmNnYyQoPjX-6RGajp6_DdrR-g&s', 'Bánh bèo Hà Tĩnh', 19, 'nhà hàng'),
(20, 'Quán bánh đậu xanh Hải Dương', 25000, 'https://nguyenninhhanoi.com/wp-content/uploads/2022/05/66.png', 'Bánh đậu xanh gia truyền', 20, 'nhà hàng');

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
(2, 'Nhà thờ lớn tại trung tâm TP.HCM', NULL, 'https://cdn.xanhsm.com/2024/11/f5d8fc3e-nha-tho-duc-ba-thumbnail-min-1.jpg', 'Nhà thờ Đức Bà', 'Tháng 12 - Tháng 4', 2, 'Văn hóa'),
(3, 'Cây cầu nổi tiếng có rồng phun lửa', NULL, 'https://danangfantasticity.com/wp-content/uploads/2018/03/da-nang-thanh-pho-cua-nhung-cay-cau-07.jpg', 'Cầu Rồng', 'Tháng 2 - Tháng 8', 3, 'Giải trí'),
(4, 'Khu du lịch biển nổi tiếng Hải Phòng', 50000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSizBpON2s8vIu5fA0mYxUGWGvVpMyuWNBigg&s', 'Đồ Sơn', 'Tháng 5 - Tháng 8', 4, 'Biển đảo'),
(5, 'Chợ nổi đặc trưng miền Tây', 100000, 'https://cdn3.ivivu.com/2024/09/cho-noi-cai-rang-iVIVU2.jpg', 'Chợ nổi Cái Răng', 'Tháng 11 - Tháng 4', 5, 'Văn hóa'),
(6, 'Khu du lịch tâm linh nổi tiếng', 200000, 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/nui_cam_6b2b893bcc.jpg', 'Núi Cấm', 'Tháng 12 - Tháng 4', 6, 'Thiên nhiên'),
(7, 'Bãi biển đẹp gần TP.HCM', 100000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShZW13G-MSChXtfqeNi6amonSO_wIO77kRUw&s', 'Bãi Sau Vũng Tàu', 'Tháng 11 - Tháng 4', 7, 'Biển đảo'),
(8, 'Di tích lịch sử Bắc Giang', NULL, 'https://cdn.xanhsm.com/2024/11/b8cb16aa-chua-vinh-nghiem-1.jpg', 'Chùa Vĩnh Nghiêm', 'Tháng 1 - Tháng 3', 8, 'Văn hóa'),
(9, 'Chùa nổi tiếng Bắc Ninh', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxduAc4C_n_N18pMBMoSZLjZ047ps70AOycw&s', 'Chùa Dâu', 'Tháng 1 - Tháng 3', 9, 'Văn hóa'),
(10, 'Cồn du lịch sinh thái', 50000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmOIruLH0VvdIUpeHAAReSnZxA-VszW_nkPw&s', 'Cồn Phụng', 'Tháng 12 - Tháng 4', 10, 'Nghỉ dưỡng'),
(11, 'Khu du lịch Đại Nam', 200000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjbfs0bgrvZ_nlOrmWNcZjo7MjTgFLxTZlzw&s', 'Đại Nam', 'Quanh năm', 11, 'Giải trí'),
(12, 'Biển Quy Nhơn đẹp', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj0v6lXxNGTr7n1wIM83GvNSB_V3Cob785zA&s', 'Kỳ Co', 'Tháng 3 - Tháng 9', 12, 'Biển đảo'),
(13, 'Đồi cát nổi tiếng', 50000, 'https://sacotravel.com/wp-content/uploads/2025/07/297-doi-cat-bay-mui-ne.jpg', 'Đồi cát Mũi Né', 'Tháng 11 - Tháng 4', 13, 'Thiên nhiên'),
(14, 'Mũi cực Nam Việt Nam', 100000, 'https://vuonqgmcm.camau.gov.vn//Datafiles/vuonqgmcm-camau-gov-vn/wps/wcm/connect/vuonquocgiamuicamau/194d34e6-80cb-4060-a8a4-37ce0b688c2c/29-2ba1-jpg-3fmod-3dajperes-26amp-3bcacheid-3droot.png', 'Mũi Cà Mau', 'Tháng 12 - Tháng 4', 14, 'Thiên nhiên'),
(15, 'Thác nước đẹp Tây Nguyên', 50000, 'https://mia.vn/media/uploads/blog-du-lich/thac-dray-nur-01-1695793450.jpg', 'Thác Dray Nur', 'Tháng 11 - Tháng 4', 15, 'Thiên nhiên'),
(16, 'Khu du lịch sinh thái Đồng Nai', 80000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfL-IJKTnSp_DF6RIHq4hszBNrywygi8NM5A&s', 'Bửu Long', 'Quanh năm', 16, 'Nghỉ dưỡng'),
(17, 'Cánh đồng sen nổi tiếng', 30000, 'https://ik.imagekit.io/tvlk/blog/2022/03/khu-du-lich-sinh-thai-dong-sen-thap-muoi-1.jpg?tr=q-70,c-at_max,w-1000,h-600', 'Đồng Sen Tháp Mười', 'Tháng 5 - Tháng 8', 17, 'Thiên nhiên'),
(18, 'Biển Hồ Pleiku', NULL, 'https://mia.vn/media/uploads/blog-du-lich/chiem-nguong-bien-ho-pleiku-bien-ho-tnung-tuyet-dep-01-1659458379.jpg', 'Biển Hồ', 'Tháng 11 - Tháng 4', 18, 'Thiên nhiên'),
(19, 'Khu di tích lịch sử Hà Tĩnh', NULL, 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/7/24/1072425/Nga-Ba-Dong-Loc1.JPG', 'Ngã ba Đồng Lộc', 'Tháng 1 - Tháng 4', 19, 'Văn hóa'),
(20, 'Côn Sơn Kiếp Bạc', 50000, 'https://lh6.googleusercontent.com/-3U0FMb_rPrGXEC5LL_Q6dFqCeKDcfgDZ4RfINk6wdQMPVk7HyuizMX0IR1kf7uDMxzYExkhRsMkX5zVMNsLnihrMhiWfgN7xJrV1M6bZgWhOlt-GjrmwnjtU9CwLBnYHg', 'Côn Sơn Kiếp Bạc', 'Tháng 1 - Tháng 3', 20, 'Văn hóa');

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
