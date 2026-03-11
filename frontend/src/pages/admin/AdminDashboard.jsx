import { Link } from "react-router-dom";
import { mockUsers, mockTours, mockBookings, mockLocations, mockReviews, formatPrice, getTour, getLocation } from "../../data/mockData";
import { StatusBadge, StarRating } from "../../components/UI";

const STATS = [
  { label: "Người dùng",  value: mockUsers.length,    emoji: "👥", color: "#0ea5e9", link: "/admin/users"    },
  { label: "Địa điểm",   value: mockLocations.length, emoji: "🗺️", color: "#6366f1", link: "/admin/locations" },
  { label: "Tours",       value: mockTours.length,     emoji: "🏕️", color: "#f59e0b", link: "/admin/tours"    },
  { label: "Đặt tour",   value: mockBookings.length,  emoji: "📋", color: "#22c55e", link: "/admin/bookings" },
];

export default function AdminDashboard() {
  const totalRevenue = mockBookings
    .filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="page-wrap">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Tổng quan hệ thống TravelSupport</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {STATS.map(s => (
          <Link key={s.label} to={s.link} style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "22px 22px",
            boxShadow: "var(--shadow-sm)", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 16,
            transition: "var(--transition)",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
          >
            <div style={{ width: 50, height: 50, borderRadius: 14, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {s.emoji}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue card */}
      <div style={{
        background: "linear-gradient(135deg,var(--primary),var(--secondary))",
        borderRadius: "var(--radius-xl)", padding: "26px 32px",
        color: "#fff", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 4 }}>Tổng doanh thu (xác nhận + hoàn thành)</div>
          <div style={{ fontSize: 34, fontWeight: 900 }}>{formatPrice(totalRevenue)}</div>
        </div>
        <div style={{ fontSize: 48, opacity: 0.3 }}>💰</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Bookings */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Đặt tour gần đây</h3>
            <Link to="/admin/bookings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>Xem tất cả →</Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Mã đơn", "Tour", "Tiền", "Trạng thái"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBookings.map(b => {
                const t = getTour(b.tourId);
                return (
                  <tr key={b.id} style={{ borderTop: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700 }}>{b.id.toUpperCase()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t?.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>{formatPrice(b.totalPrice)}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={b.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent Reviews */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Đánh giá gần đây</h3>
            <Link to="/admin/reviews" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>Xem tất cả →</Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {mockReviews.slice(0, 4).map(r => {
              const t = getTour(r.tourId);
              const users = { 2:"Nguyễn Thị Lan", 3:"Trần Văn Minh", 4:"Lê Thu Hương" };
              return (
                <div key={r.id} style={{ padding: "12px 22px", borderBottom: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{users[r.userId] || "Khách hàng"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t?.name}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                      <StarRating rating={r.rating} size={12} />
                      <span style={{ fontSize: 11, color: "var(--text-light)" }}>{r.createdAt}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {r.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
