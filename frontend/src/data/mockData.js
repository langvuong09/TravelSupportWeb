// ============================================================
// MOCK DATA – cập nhật theo schema DB mới
// Thay bằng fetch API thực sau khi có backend
// ============================================================

// TABLE: users  (firstName + lastName thay fullName)
export const mockUsers = [
  { userId: 1, username: "admin",  password: "admin",  firstName: "Admin",    lastName: "System",    email: "admin@travel.vn",  role: "ADMIN" },
  { userId: 2, username: "user1",  password: "123456", firstName: "Nguyễn Thị", lastName: "Lan",    email: "lan@gmail.com",    role: "USER"  },
  { userId: 3, username: "user2",  password: "123456", firstName: "Trần Văn", lastName: "Minh",     email: "minh@gmail.com",   role: "USER"  },
  { userId: 4, username: "user3",  password: "123456", firstName: "Lê Thu",   lastName: "Hương",    email: "huong@gmail.com",  role: "USER"  },
];

// Helper: lấy fullName từ firstName + lastName
export const getFullName = (user) =>
  user ? `${user.firstName} ${user.lastName}`.trim() : "Khách hàng";

// TABLE: provinces (32 tỉnh thành)
export const mockProvinces = [
  { provinceId: 1,  name: "An Giang" },
  { provinceId: 2,  name: "Bà Rịa - Vũng Tàu" },
  { provinceId: 3,  name: "Bắc Giang" },
  { provinceId: 4,  name: "Bắc Kạn" },
  { provinceId: 5,  name: "Bắc Ninh" },
  { provinceId: 6,  name: "Bến Tre" },
  { provinceId: 7,  name: "Bình Định" },
  { provinceId: 8,  name: "Bình Dương" },
  { provinceId: 9,  name: "Bình Phước" },
  { provinceId: 10, name: "Bình Thuận" },
  { provinceId: 11, name: "Cà Mau" },
  { provinceId: 12, name: "Cao Bằng" },
  { provinceId: 13, name: "Đà Nẵng" },
  { provinceId: 14, name: "Đắk Lắk" },
  { provinceId: 15, name: "Đắk Nông" },
  { provinceId: 16, name: "Điện Biên" },
  { provinceId: 17, name: "Đồng Nai" },
  { provinceId: 18, name: "Đồng Tháp" },
  { provinceId: 19, name: "Gia Lai" },
  { provinceId: 20, name: "Hà Giang" },
  { provinceId: 21, name: "Hà Nam" },
  { provinceId: 22, name: "Hà Nội" },
  { provinceId: 23, name: "Hà Tĩnh" },
  { provinceId: 24, name: "Hải Dương" },
  { provinceId: 25, name: "Hải Phòng" },
  { provinceId: 26, name: "Hòa Bình" },
  { provinceId: 27, name: "Hưng Yên" },
  { provinceId: 28, name: "Khánh Hòa" },
  { provinceId: 29, name: "Kiên Giang" },
  { provinceId: 30, name: "Kon Tum" },
  { provinceId: 31, name: "Lai Châu" },
  { provinceId: 32, name: "Lâm Đồng" },
];

// TABLE: locations  (gộp located_details vào, thêm lat/long, provinceId)
export const mockLocations = [
  {
    locationId: 1, provinceId: 1,
    name: "Vịnh Hạ Long",
    description: "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ, hang động huyền bí và làn nước xanh ngọc bích.",
    estimatedCost: 1200000,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80",
    latitude: 20.9101, longitude: 107.1839,
    bestTimeToVisit: "Tháng 3 – Tháng 6",
    type: "Thiên nhiên",
  },
  {
    locationId: 2, provinceId: 2,
    name: "Phố Cổ Hội An",
    description: "Phố cổ với kiến trúc độc đáo pha trộn Đông Tây, đèn lồng lung linh về đêm và ẩm thực phong phú.",
    estimatedCost: 800000,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80",
    latitude: 15.8801, longitude: 108.3380,
    bestTimeToVisit: "Tháng 2 – Tháng 4",
    type: "Văn hóa",
  },
  {
    locationId: 3, provinceId: 3,
    name: "Thành phố Đà Lạt",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thác nước hùng vĩ, đồi thông xanh mướt.",
    estimatedCost: 950000,
    image: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=900&q=80",
    latitude: 11.9404, longitude: 108.4583,
    bestTimeToVisit: "Tháng 12 – Tháng 3",
    type: "Nghỉ dưỡng",
  },
  {
    locationId: 4, provinceId: 4,
    name: "Sapa & Fansipan",
    description: "Vùng núi tây bắc với ruộng bậc thang tuyệt đẹp, văn hóa dân tộc thiểu số đặc sắc và đỉnh Fansipan hùng vĩ.",
    estimatedCost: 1100000,
    image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=900&q=80",
    latitude: 22.3364, longitude: 103.8438,
    bestTimeToVisit: "Tháng 9 – Tháng 11",
    type: "Thiên nhiên",
  },
  {
    locationId: 5, provinceId: 5,
    name: "Đảo Phú Quốc",
    description: "Đảo ngọc với bãi biển cát trắng dài bất tận, rừng nguyên sinh và hải sản tươi ngon.",
    estimatedCost: 1500000,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80",
    latitude: 10.2899, longitude: 103.9840,
    bestTimeToVisit: "Tháng 11 – Tháng 4",
    type: "Biển đảo",
  },
  {
    locationId: 6, provinceId: 6,
    name: "Mũi Né – Phan Thiết",
    description: "Thiên đường resort với đồi cát đỏ, đồi cát trắng huyền ảo, bờ biển hoang sơ.",
    estimatedCost: 750000,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    latitude: 10.9289, longitude: 108.2867,
    bestTimeToVisit: "Tháng 11 – Tháng 4",
    type: "Biển đảo",
  },
  {
    locationId: 7, provinceId: 7,
    name: "Tràng An – Ninh Bình",
    description: "Vùng đất cố đô với núi non trùng điệp, sông nước hữu tình. Nổi tiếng với Tràng An và chùa Bái Đính.",
    estimatedCost: 600000,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=80",
    latitude: 20.2539, longitude: 105.9691,
    bestTimeToVisit: "Tháng 3 – Tháng 5",
    type: "Văn hóa",
  },
  {
    locationId: 8, provinceId: 8,
    name: "Cố đô Huế",
    description: "Cố đô triều Nguyễn với hệ thống di tích lịch sử phong phú, ẩm thực cung đình tinh tế.",
    estimatedCost: 700000,
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=80",
    latitude: 16.4637, longitude: 107.5909,
    bestTimeToVisit: "Tháng 2 – Tháng 4",
    type: "Văn hóa",
  },
  {
    locationId: 9, provinceId: 9,
    name: "Bà Nà Hills – Đà Nẵng",
    description: "Khu du lịch trên đỉnh núi với cầu Vàng nổi tiếng thế giới, khí hậu mát mẻ và kiến trúc Pháp.",
    estimatedCost: 900000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    latitude: 15.9979, longitude: 107.9888,
    bestTimeToVisit: "Tháng 3 – Tháng 8",
    type: "Giải trí",
  },
];

// TABLE: tours  (tourId là string, có userId FK)
export const mockTours = [
  {
    tourId: "TOUR-001", userId: 1,
    name: "Hạ Long – Đảo ngọc phương Bắc",
    createdAt: "2026-01-10",
  },
  {
    tourId: "TOUR-002", userId: 1,
    name: "Hội An & Cố đô Huế – Di sản miền Trung",
    createdAt: "2026-01-15",
  },
  {
    tourId: "TOUR-003", userId: 1,
    name: "Đà Lạt Mộng Mơ – Thành phố ngàn hoa",
    createdAt: "2026-01-20",
  },
  {
    tourId: "TOUR-004", userId: 1,
    name: "Chinh phục Fansipan – Nóc nhà Đông Dương",
    createdAt: "2026-02-01",
  },
  {
    tourId: "TOUR-005", userId: 1,
    name: "Phú Quốc Thiên Đường – Đảo ngọc phương Nam",
    createdAt: "2026-02-10",
  },
  {
    tourId: "TOUR-006", userId: 1,
    name: "Mũi Né Cát Vàng – Biển gió và cát",
    createdAt: "2026-02-15",
  },
  {
    tourId: "TOUR-007", userId: 1,
    name: "Hành trình Di sản: Huế – Hội An – Đà Nẵng",
    createdAt: "2026-03-01",
  },
];

// TABLE: tour_provinces  (tour ghé qua tỉnh nào, theo thứ tự)
export const mockTourProvinces = [
  // TOUR-001: Hạ Long
  { id: 1, tourId: "TOUR-001", visitOrder: 1, provinceId: 10 }, // Hà Nội (xuất phát)
  { id: 2, tourId: "TOUR-001", visitOrder: 2, provinceId: 1  }, // Quảng Ninh

  // TOUR-002: Hội An + Huế
  { id: 3, tourId: "TOUR-002", visitOrder: 1, provinceId: 8  }, // Huế
  { id: 4, tourId: "TOUR-002", visitOrder: 2, provinceId: 2  }, // Quảng Nam

  // TOUR-003: Đà Lạt
  { id: 5, tourId: "TOUR-003", visitOrder: 1, provinceId: 3  }, // Lâm Đồng

  // TOUR-004: Sapa
  { id: 6, tourId: "TOUR-004", visitOrder: 1, provinceId: 10 }, // Hà Nội
  { id: 7, tourId: "TOUR-004", visitOrder: 2, provinceId: 4  }, // Lào Cai

  // TOUR-005: Phú Quốc
  { id: 8, tourId: "TOUR-005", visitOrder: 1, provinceId: 5  }, // Kiên Giang

  // TOUR-006: Mũi Né
  { id: 9, tourId: "TOUR-006", visitOrder: 1, provinceId: 6  }, // Bình Thuận

  // TOUR-007: Di sản miền Trung
  { id: 10, tourId: "TOUR-007", visitOrder: 1, provinceId: 8  }, // Huế
  { id: 11, tourId: "TOUR-007", visitOrder: 2, provinceId: 9  }, // Đà Nẵng
  { id: 12, tourId: "TOUR-007", visitOrder: 3, provinceId: 2  }, // Quảng Nam
];

// TABLE: tour_locations  (địa điểm trong từng tour)
export const mockTourLocations = [
  // TOUR-001
  { id: 1, tourId: "TOUR-001", locationId: 1 },

  // TOUR-002
  { id: 2, tourId: "TOUR-002", locationId: 2 },
  { id: 3, tourId: "TOUR-002", locationId: 8 },

  // TOUR-003
  { id: 4, tourId: "TOUR-003", locationId: 3 },

  // TOUR-004
  { id: 5, tourId: "TOUR-004", locationId: 4 },

  // TOUR-005
  { id: 6, tourId: "TOUR-005", locationId: 5 },

  // TOUR-006
  { id: 7, tourId: "TOUR-006", locationId: 6 },

  // TOUR-007
  { id: 8,  tourId: "TOUR-007", locationId: 8 },
  { id: 9,  tourId: "TOUR-007", locationId: 9 },
  { id: 10, tourId: "TOUR-007", locationId: 2 },
];

// TABLE: foods  (địa điểm ăn uống, có lat/long + provinceId)
export const mockFoods = [
  { foodId: 1, name: "Bánh Mì Phượng",       description: "Tiệm bánh mì nổi tiếng thế giới tại Hội An", estimatedPrice: 30000,  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", type: "Bánh mì", latitude: 15.8798, longitude: 108.3300, provinceId: 2 },
  { foodId: 2, name: "Bún Bò Huế Bà Tuyết",  description: "Quán bún bò Huế trứ danh, nước dùng đậm đà", estimatedPrice: 45000,  image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80", type: "Bún bò", latitude: 16.4600, longitude: 107.5950, provinceId: 8 },
  { foodId: 3, name: "Nem Ninh Bình",         description: "Nem nướng đặc sản vùng cố đô Hoa Lư",       estimatedPrice: 60000,  image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", type: "Nem nướng", latitude: 20.2500, longitude: 105.9700, provinceId: 7 },
  { foodId: 4, name: "Hải Sản Phú Quốc",      description: "Nhà hàng hải sản tươi sống ngay bến cảng",  estimatedPrice: 250000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", type: "Hải sản", latitude: 10.2900, longitude: 103.9800, provinceId: 5 },
  { foodId: 5, name: "Cà Phê Đà Lạt",         description: "Cà phê chồn nổi tiếng, view đồi thông",     estimatedPrice: 80000,  image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", type: "Cà phê", latitude: 11.9450, longitude: 108.4400, provinceId: 3 },
  { foodId: 6, name: "Gỏi Cuốn Mũi Né",       description: "Đặc sản hải sản tươi ven biển Mũi Né",      estimatedPrice: 70000,  image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80", type: "Hải sản", latitude: 10.9300, longitude: 108.2900, provinceId: 6 },
];

// TABLE: tour_foods
export const mockTourFoods = [
  { id: 1, tourId: "TOUR-002", foodId: 1 }, // Hội An – Bánh Mì Phượng
  { id: 2, tourId: "TOUR-002", foodId: 2 }, // Huế – Bún Bò
  { id: 3, tourId: "TOUR-007", foodId: 1 },
  { id: 4, tourId: "TOUR-007", foodId: 2 },
  { id: 5, tourId: "TOUR-005", foodId: 4 }, // Phú Quốc – Hải sản
  { id: 6, tourId: "TOUR-003", foodId: 5 }, // Đà Lạt – Cà phê
  { id: 7, tourId: "TOUR-006", foodId: 6 }, // Mũi Né – Hải sản
];

// TABLE: transport_types
export const mockTransportTypes = [
  { transportId: 1, name: "Xe khách",   costPerKm: 800  },
  { transportId: 2, name: "Máy bay",    costPerKm: 3500 },
  { transportId: 3, name: "Tàu hỏa",   costPerKm: 600  },
  { transportId: 4, name: "Cáp treo",   costPerKm: 0    }, // giá cố định
  { transportId: 5, name: "Tàu thuyền", costPerKm: 1200 },
];

// TABLE: tour_transport  (phương tiện giữa các tỉnh trong tour)
export const mockTourTransport = [
  // TOUR-001: Hà Nội → Hạ Long bằng xe khách
  { id: 1, tourId: "TOUR-001", fromProvince: 10, toProvince: 1, transportId: 1 },
  // TOUR-001: Hạ Long tour thuyền
  { id: 2, tourId: "TOUR-001", fromProvince: 1,  toProvince: 1, transportId: 5 },

  // TOUR-002: Huế → Hội An bằng xe khách
  { id: 3, tourId: "TOUR-002", fromProvince: 8,  toProvince: 2, transportId: 1 },

  // TOUR-004: Hà Nội → Sapa bằng tàu hỏa
  { id: 4, tourId: "TOUR-004", fromProvince: 10, toProvince: 4, transportId: 3 },
  // TOUR-004: Cáp treo Fansipan
  { id: 5, tourId: "TOUR-004", fromProvince: 4,  toProvince: 4, transportId: 4 },

  // TOUR-005: Bay đến Phú Quốc
  { id: 6, tourId: "TOUR-005", fromProvince: 10, toProvince: 5, transportId: 2 },

  // TOUR-007: Máy bay đến Huế, xe khách di chuyển nội tỉnh
  { id: 7, tourId: "TOUR-007", fromProvince: 10, toProvince: 8, transportId: 2 },
  { id: 8, tourId: "TOUR-007", fromProvince: 8,  toProvince: 9, transportId: 1 },
  { id: 9, tourId: "TOUR-007", fromProvince: 9,  toProvince: 2, transportId: 1 },
];

// TABLE: reviews (giữ nguyên cấu trúc, tourId đổi sang string)
export const mockReviews = [
  { id: "r1", userId: 2, rating: 5, comment: "Chuyến đi tuyệt vời! Vịnh Hạ Long đẹp hơn tôi tưởng. Hướng dẫn viên nhiệt tình và chuyên nghiệp.",   createdAt: "2026-02-15", tourId: "TOUR-001" },
  { id: "r2", userId: 3, rating: 4, comment: "Hội An rất đẹp và thơ mộng. Ẩm thực địa phương ngon tuyệt. Chỉ tiếc là quá đông khách du lịch.",       createdAt: "2026-02-20", tourId: "TOUR-002" },
  { id: "r3", userId: 4, rating: 5, comment: "Đà Lạt luôn là điểm đến trong mơ của tôi. Tour được tổ chức rất chu đáo, ăn ở tốt, hướng dẫn viên vui tính.", createdAt: "2026-03-01", tourId: "TOUR-003" },
  { id: "r4", userId: 2, rating: 4, comment: "Leo Fansipan rất thú vị nhưng khá vất vả. Cảnh đẹp không thể tả. Cần chuẩn bị thể lực tốt.",             createdAt: "2026-03-05", tourId: "TOUR-004" },
  { id: "r5", userId: 3, rating: 5, comment: "Phú Quốc đẹp không tả được! Resort sang trọng, dịch vụ tuyệt vời, biển trong vắt. Sẽ quay lại!",         createdAt: "2026-03-10", tourId: "TOUR-005" },
  { id: "r6", userId: 4, rating: 4, comment: "Mũi Né hoang sơ, ít người, giá cả phải chăng. Rất hợp cho những bạn muốn trốn khỏi thành phố ồn ào.",     createdAt: "2026-03-15", tourId: "TOUR-006" },
];

// TABLE: bookings (tourId đổi sang string)
export const mockBookings = [
  { id: "b1", userId: 2, bookingDate: "2026-03-01", numberOfPeople: 2, totalPrice: 7000000,  status: "confirmed", tourId: "TOUR-001" },
  { id: "b2", userId: 2, bookingDate: "2026-03-10", numberOfPeople: 4, totalPrice: 8800000,  status: "pending",   tourId: "TOUR-003" },
  { id: "b3", userId: 2, bookingDate: "2026-02-20", numberOfPeople: 1, totalPrice: 4200000,  status: "completed", tourId: "TOUR-004" },
  { id: "b4", userId: 3, bookingDate: "2026-03-05", numberOfPeople: 2, totalPrice: 3600000,  status: "confirmed", tourId: "TOUR-002" },
  { id: "b5", userId: 4, bookingDate: "2026-03-12", numberOfPeople: 3, totalPrice: 20400000, status: "pending",   tourId: "TOUR-005" },
];

// ── Helpers ─────────────────────────────────────────────────

export const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

// Users
export const getUserById = (userId) => mockUsers.find((u) => u.userId === userId);

// Provinces
export const getProvince = (provinceId) => mockProvinces.find((p) => p.provinceId === provinceId);

// Locations
export const getLocation = (locationId) => mockLocations.find((l) => l.locationId === locationId);

export const getLocationsByProvince = (provinceId) =>
  mockLocations.filter((l) => l.provinceId === provinceId);

// Tours
export const getTour = (tourId) => mockTours.find((t) => t.tourId === tourId);

// Lấy danh sách locations của 1 tour (theo tourId)
export const getLocationsByTour = (tourId) => {
  const locationIds = mockTourLocations
    .filter((tl) => tl.tourId === tourId)
    .map((tl) => tl.locationId);
  return locationIds.map((id) => getLocation(id)).filter(Boolean);
};

// Lấy danh sách provinces của 1 tour (theo visitOrder)
export const getProvincesByTour = (tourId) => {
  return mockTourProvinces
    .filter((tp) => tp.tourId === tourId)
    .sort((a, b) => a.visitOrder - b.visitOrder)
    .map((tp) => getProvince(tp.provinceId))
    .filter(Boolean);
};

// Lấy foods của 1 tour
export const getFoodsByTour = (tourId) => {
  const foodIds = mockTourFoods
    .filter((tf) => tf.tourId === tourId)
    .map((tf) => tf.foodId);
  return foodIds.map((id) => mockFoods.find((f) => f.foodId === id)).filter(Boolean);
};

// Lấy transport của 1 tour với thông tin đầy đủ
export const getTransportByTour = (tourId) => {
  return mockTourTransport
    .filter((tt) => tt.tourId === tourId)
    .map((tt) => ({
      ...tt,
      fromProvinceName: getProvince(tt.fromProvince)?.name,
      toProvinceName:   getProvince(tt.toProvince)?.name,
      transportType:    mockTransportTypes.find((t) => t.transportId === tt.transportId),
    }));
};

// Lấy ảnh đại diện của tour (ảnh của location đầu tiên)
export const getTourThumbnail = (tourId) => {
  const locations = getLocationsByTour(tourId);
  return locations[0]?.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80";
};

// Lấy estimatedCost tổng của tour (tổng estimatedCost của các locations)
export const getTourEstimatedCost = (tourId) => {
  const locations = getLocationsByTour(tourId);
  return locations.reduce((sum, l) => sum + (l.estimatedCost || 0), 0);
};

// Lấy description tóm tắt của tour từ locations
export const getTourDescription = (tourId) => {
  const locations = getLocationsByTour(tourId);
  return locations.map((l) => l.name).join(" → ");
};

// Reviews
export const getReviewsByTour = (tourId) => mockReviews.filter((r) => r.tourId === tourId);

export const avgRating = (tourId) => {
  const rs = getReviewsByTour(tourId);
  if (!rs.length) return 0;
  return Math.round((rs.reduce((s, r) => s + r.rating, 0) / rs.length) * 10) / 10;
};

// Bookings
export const getBookingsByUser = (userId) => mockBookings.filter((b) => b.userId === userId);

// Lấy tours liên quan đến 1 location
export const getToursByLocation = (locationId) => {
  const tourIds = mockTourLocations
    .filter((tl) => tl.locationId === locationId)
    .map((tl) => tl.tourId);
  return tourIds.map((id) => getTour(id)).filter(Boolean);
};