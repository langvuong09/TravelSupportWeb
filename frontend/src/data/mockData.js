// ============================================================
// MOCK DATA – theo đúng schema DB
// Thay bằng fetch API thực sau khi có backend
// ============================================================

// TABLE: users
export const mockUsers = [
  { userId: 1, username: "admin",  password: "admin",  fullName: "Administrator",     email: "admin@travel.vn",          phone: "0901234567", birthDate: "1990-01-01", role: "ADMIN" },
  { userId: 2, username: "user1",  password: "123456", fullName: "Nguyễn Thị Lan",    email: "lan@gmail.com",             phone: "0912345678", birthDate: "1995-05-20", role: "USER"  },
  { userId: 3, username: "user2",  password: "123456", fullName: "Trần Văn Minh",     email: "minh@gmail.com",            phone: "0923456789", birthDate: "1998-08-15", role: "USER"  },
  { userId: 4, username: "user3",  password: "123456", fullName: "Lê Thu Hương",      email: "huong@gmail.com",           phone: "0934567890", birthDate: "2000-03-10", role: "USER"  },
];

// TABLE: locations
export const mockLocations = [
  { locationId: 1, name: "Vịnh Hạ Long",      province: "Quảng Ninh",         region: "Bắc"  },
  { locationId: 2, name: "Phố Cổ Hội An",     province: "Quảng Nam",          region: "Trung" },
  { locationId: 3, name: "Đà Lạt",            province: "Lâm Đồng",           region: "Nam"  },
  { locationId: 4, name: "Sapa",              province: "Lào Cai",            region: "Bắc"  },
  { locationId: 5, name: "Phú Quốc",          province: "Kiên Giang",         region: "Nam"  },
  { locationId: 6, name: "Mũi Né",            province: "Bình Thuận",         region: "Nam"  },
  { locationId: 7, name: "Ninh Bình",         province: "Ninh Bình",          region: "Bắc"  },
  { locationId: 8, name: "Huế",               province: "Thừa Thiên Huế",     region: "Trung" },
];

// TABLE: located_details  (1-1 với locations)
export const mockLocationDetails = [
  { locationId: 1, address: "Vịnh Hạ Long, Quảng Ninh",    description: "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ, hang động huyền bí và làn nước xanh ngọc bích. Một trong những vịnh đẹp nhất thế giới được UNESCO công nhận.",          price: 1200000, image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80", bestTimeToVisit: "Tháng 3 – Tháng 6" },
  { locationId: 2, address: "Hội An, Quảng Nam",            description: "Phố cổ với kiến trúc độc đáo pha trộn Đông Tây, đèn lồng lung linh về đêm và ẩm thực phong phú. UNESCO công nhận là di sản văn hóa thế giới.",                                           price: 800000,  image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80", bestTimeToVisit: "Tháng 2 – Tháng 4" },
  { locationId: 3, address: "Đà Lạt, Lâm Đồng",            description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thác nước hùng vĩ, đồi thông xanh mướt và kiến trúc Pháp độc đáo – điểm đến lý tưởng quanh năm.",                                       price: 950000,  image: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=900&q=80", bestTimeToVisit: "Tháng 12 – Tháng 3" },
  { locationId: 4, address: "Sapa, Lào Cai",                description: "Vùng núi tây bắc với ruộng bậc thang tuyệt đẹp, văn hóa dân tộc thiểu số đặc sắc và đỉnh Fansipan hùng vĩ – nóc nhà Đông Dương.",                                                        price: 1100000, image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=900&q=80", bestTimeToVisit: "Tháng 9 – Tháng 11" },
  { locationId: 5, address: "Phú Quốc, Kiên Giang",         description: "Đảo ngọc với bãi biển cát trắng dài bất tận, rừng nguyên sinh và hải sản tươi ngon. Thiên đường nghỉ dưỡng hàng đầu Đông Nam Á.",                                                        price: 1500000, image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80", bestTimeToVisit: "Tháng 11 – Tháng 4" },
  { locationId: 6, address: "Mũi Né, Bình Thuận",           description: "Thiên đường resort với đồi cát đỏ, đồi cát trắng huyền ảo, bờ biển hoang sơ và nắng gió lý tưởng cho thể thao nước.",                                                                      price: 750000,  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80", bestTimeToVisit: "Tháng 11 – Tháng 4" },
  { locationId: 7, address: "Ninh Bình, Ninh Bình",         description: "Vùng đất cố đô với núi non trùng điệp, sông nước hữu tình. Nổi tiếng với Tràng An, chùa Bái Đính và cố đô Hoa Lư lịch sử.",                                                               price: 600000,  image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=80", bestTimeToVisit: "Tháng 3 – Tháng 5" },
  { locationId: 8, address: "Huế, Thừa Thiên Huế",          description: "Cố đô triều Nguyễn với hệ thống di tích lịch sử phong phú, ẩm thực cung đình tinh tế và những lăng tẩm, chùa chiền tráng lệ.",                                                             price: 700000,  image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=80", bestTimeToVisit: "Tháng 2 – Tháng 4" },
];

// TABLE: tours
export const mockTours = [
  { tourId: 1, locationId: 1, name: "Khám Phá Hạ Long 3N2Đ",      description: "Ngủ đêm trên vịnh, khám phá hang Sửng Sốt, chèo kayak qua các đảo nhỏ và tắm biển tại bãi Ti Tốp.",                 price: 3500000, maxParticipants: 20, startDate: "2026-04-10", endDate: "2026-04-12" },
  { tourId: 2, locationId: 2, name: "Hội An – Mỹ Sơn 2N1Đ",       description: "Tham quan phố cổ, thánh địa Mỹ Sơn và trải nghiệm làm đèn lồng truyền thống cùng nghệ nhân địa phương.",             price: 1800000, maxParticipants: 15, startDate: "2026-04-15", endDate: "2026-04-16" },
  { tourId: 3, locationId: 3, name: "Đà Lạt Mộng Mơ 3N2Đ",        description: "Thăm vườn hoa, dinh Bảo Đại, thác Prenn và thưởng thức ẩm thực đặc sản như bánh tráng nướng, sữa đậu nành.",         price: 2200000, maxParticipants: 25, startDate: "2026-04-20", endDate: "2026-04-22" },
  { tourId: 4, locationId: 4, name: "Chinh Phục Fansipan 4N3Đ",    description: "Leo núi Fansipan, khám phá bản làng H'Mông và ngắm ruộng bậc thang vàng óng mùa lúa chín.",                          price: 4200000, maxParticipants: 12, startDate: "2026-05-01", endDate: "2026-05-04" },
  { tourId: 5, locationId: 5, name: "Phú Quốc Thiên Đường 4N3Đ",   description: "Nghỉ dưỡng resort 5*, lặn ngắm san hô, tham quan vinpearl safari và khám phá chợ đêm Phú Quốc sôi động.",            price: 6800000, maxParticipants: 18, startDate: "2026-05-10", endDate: "2026-05-13" },
  { tourId: 6, locationId: 6, name: "Mũi Né Cát Vàng 2N1Đ",        description: "Trượt cát, cưỡi ngựa, ngắm bình minh trên đồi cát đỏ và thưởng thức hải sản tươi sống bên bờ biển.",                 price: 1500000, maxParticipants: 30, startDate: "2026-05-15", endDate: "2026-05-16" },
  { tourId: 7, locationId: 7, name: "Tràng An – Bái Đính 1N",      description: "Tham quan quần thể danh thắng Tràng An bằng thuyền, viếng chùa Bái Đính lớn nhất Đông Nam Á.",                       price: 900000,  maxParticipants: 40, startDate: "2026-05-20", endDate: "2026-05-20" },
  { tourId: 8, locationId: 8, name: "Huế Cố Đô 2N1Đ",              description: "Thăm Đại Nội, lăng Tự Đức, chùa Thiên Mụ và thưởng thức ẩm thực cung đình: bún bò, cơm hến, bánh khoái.",           price: 1400000, maxParticipants: 20, startDate: "2026-06-01", endDate: "2026-06-02" },
];

// TABLE: reviews
export const mockReviews = [
  { id: "r1", userId: 2, rating: 5, comment: "Chuyến đi tuyệt vời! Vịnh Hạ Long đẹp hơn tôi tưởng. Hướng dẫn viên nhiệt tình và chuyên nghiệp.",                                 createdAt: "2026-02-15", tourId: 1 },
  { id: "r2", userId: 3, rating: 4, comment: "Hội An rất đẹp và thơ mộng. Ẩm thực địa phương ngon tuyệt. Chỉ tiếc là quá đông khách du lịch.",                                    createdAt: "2026-02-20", tourId: 2 },
  { id: "r3", userId: 4, rating: 5, comment: "Đà Lạt luôn là điểm đến trong mơ của tôi. Tour được tổ chức rất chu đáo, ăn ở tốt, hướng dẫn viên vui tính.",                       createdAt: "2026-03-01", tourId: 3 },
  { id: "r4", userId: 2, rating: 4, comment: "Leo Fansipan rất thú vị nhưng khá vất vả. Cảnh đẹp không thể tả. Cần chuẩn bị thể lực tốt trước khi đi.",                           createdAt: "2026-03-05", tourId: 4 },
  { id: "r5", userId: 3, rating: 5, comment: "Phú Quốc đẹp không tả được! Resort sang trọng, dịch vụ tuyệt vời, biển trong vắt. Nhất định sẽ quay lại!",                          createdAt: "2026-03-10", tourId: 5 },
  { id: "r6", userId: 4, rating: 4, comment: "Mũi Né hoang sơ, ít người, giá cả phải chăng. Rất hợp cho những bạn muốn trốn khỏi thành phố náo nhiệt.",                           createdAt: "2026-03-15", tourId: 6 },
];

// TABLE: bookings
export const mockBookings = [
  { id: "b1", userId: 2, bookingDate: "2026-03-01", numberOfPeople: 2, totalPrice: 7000000,  status: "confirmed", tourId: 1 },
  { id: "b2", userId: 2, bookingDate: "2026-03-10", numberOfPeople: 4, totalPrice: 8800000,  status: "pending",   tourId: 3 },
  { id: "b3", userId: 2, bookingDate: "2026-02-20", numberOfPeople: 1, totalPrice: 4200000,  status: "completed", tourId: 4 },
  { id: "b4", userId: 3, bookingDate: "2026-03-05", numberOfPeople: 2, totalPrice: 3600000,  status: "confirmed", tourId: 2 },
  { id: "b5", userId: 4, bookingDate: "2026-03-12", numberOfPeople: 3, totalPrice: 20400000, status: "pending",   tourId: 5 },
];

// ── Helpers ─────────────────────────────────────────
export const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

export const getLocationDetail = (locationId) =>
  mockLocationDetails.find((d) => d.locationId === locationId);

export const getLocation = (locationId) =>
  mockLocations.find((l) => l.locationId === locationId);

export const getTour = (tourId) =>
  mockTours.find((t) => t.tourId === tourId);

export const getUserById = (userId) =>
  mockUsers.find((u) => u.userId === userId);

export const getReviewsByTour = (tourId) =>
  mockReviews.filter((r) => r.tourId === tourId);

export const getBookingsByUser = (userId) =>
  mockBookings.filter((b) => b.userId === userId);

export const avgRating = (tourId) => {
  const rs = getReviewsByTour(tourId);
  if (!rs.length) return 0;
  return (rs.reduce((s, r) => s + r.rating, 0) / rs.length).toFixed(1);
};
