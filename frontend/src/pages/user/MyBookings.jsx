import { useAuth } from "../../context/AuthContext";
import { getBookingsByUser, getTour, getLocationsByTour, getTourThumbnail, formatPrice } from "../../data/mockData";
import { StatusBadge, EmptyState, Ic } from "../../components/UI";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const { user }   = useAuth();
  const bookings   = getBookingsByUser(user.userId);

  return (
    <div className="page-wrap">
      <h1 className="page-title">Đặt tour của tôi</h1>
      <p className="page-subtitle">Quản lý tất cả các đơn đặt tour</p>

      {bookings.length === 0 ? (
        <EmptyState emoji="📋" title="Chưa có đơn đặt nào" desc="Khám phá và đặt tour ngay hôm nay!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bookings.map((b) => {
            const tour      = getTour(b.tourId);
            const locations = tour ? getLocationsByTour(tour.tourId) : [];
            const thumbnail = tour ? getTourThumbnail(tour.tourId) : null;

            return (
              <div key={b.id} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)", overflow: "hidden",
                display: "grid", gridTemplateColumns: "200px 1fr",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ overflow: "hidden" }}>
                  <img src={thumbnail} alt={tour?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "22px 26px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>{tour?.name || "Tour không xác định"}</h3>
                    <StatusBadge status={b.status} />
                  </div>

                  {locations.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {locations.slice(0, 3).map((loc) => (
                        <span key={loc.locationId} style={{
                          background: "var(--primary-light)", color: "var(--primary)",
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        }}>
                          {loc.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
                    {[
                      ["Mã tour",   b.tourId],
                      ["Ngày đặt",  b.bookingDate],
                      ["Số người",  `${b.numberOfPeople} người`],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
                    <div>
                      <span style={{ fontSize: 11, color: "var(--text-light)" }}>Tổng tiền</span>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(b.totalPrice)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {b.status === "completed" && (
                        <Link to="/my-reviews" className="btn btn-sm" style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }}>
                          Viết đánh giá
                        </Link>
                      )}
                      {b.status === "pending" && (
                        <button className="btn btn-danger btn-sm">Huỷ đặt</button>
                      )}
                      {tour && (
                        <Link to={`/tours/${b.tourId}`} className="btn btn-outline btn-sm">Xem tour</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bookings.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/tours" className="btn btn-primary">Đặt thêm tour</Link>
        </div>
      )}
    </div>
  );
}
