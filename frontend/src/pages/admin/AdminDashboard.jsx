import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  mockTours, mockLocations, mockUsers, mockBookings,
  mockReviews, mockFoods, mockProvinces,
  avgRating, getProvincesByTour, getTourEstimatedCost, formatPrice,
} from "../../data/mockData";
import {
  AdminTours, AdminLocations, AdminUsers,
  AdminBookings, AdminReviews, AdminFoods,
  AdminTransport, AdminProvinces,
} from "./AdminPages";

/* ── Sidebar nav items ── */
const NAV = [
  { key: "overview",   icon: "📊", label: "Tổng quan"        },
  { key: "tours",      icon: "🏕️", label: "Tours"            },
  { key: "locations",  icon: "📍", label: "Địa điểm"         },
  { key: "provinces",  icon: "🗺️", label: "Tỉnh thành"       },
  { key: "foods",      icon: "🍜", label: "Ẩm thực"           },
  { key: "transport",  icon: "🚗", label: "Phương tiện"       },
  { key: "users",      icon: "👥", label: "Người dùng"        },
  { key: "bookings",   icon: "📋", label: "Đặt tour"          },
  { key: "reviews",    icon: "⭐", label: "Đánh giá"          },
];

/* ── Stat card ── */
function StatCard({ emoji, value, label, sub, color = "var(--primary)" }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "20px 22px",
      boxShadow: "var(--shadow-sm)",
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 700, margin: "2px 0" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

/* ── Overview tab ── */
function Overview() {
  const confirmedBookings = mockBookings.filter((b) => b.status === "confirmed").length;
  const totalReviews      = mockReviews.length;
  const overallRating     = avgRating(mockReviews);

  // Top 3 tours by review count
  const topTours = [...mockTours]
    .map((t) => ({ ...t, reviewCount: mockReviews.filter((r) => r.tourId === t.tourId).length }))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 3);

  // Province coverage
  const coveredProvinces = new Set(
    mockTours.flatMap((t) => getProvincesByTour(t.tourId).map((p) => p.provinceId))
  ).size;

  const stats = [
    { emoji: "🏕️", value: mockTours.length,       label: "Tours",          sub: "Đang hoạt động",            color: "var(--primary)"   },
    { emoji: "📍", value: mockLocations.length,    label: "Địa điểm",      sub: `${coveredProvinces} tỉnh thành`,  color: "#10b981"  },
    { emoji: "👥", value: mockUsers.length,        label: "Người dùng",    sub: `${confirmedBookings} đặt tour`,  color: "#f59e0b"  },
    { emoji: "⭐", value: overallRating.toFixed(1), label: "Rating TB",     sub: `Từ ${totalReviews} đánh giá`,    color: "#ef4444"  },
    { emoji: "🍜", value: mockFoods.length,        label: "Ẩm thực",       sub: "Món ăn đặc sản",                 color: "#8b5cf6"  },
    { emoji: "🗺️", value: mockProvinces.length,   label: "Tỉnh thành",    sub: "Phủ sóng toàn quốc",             color: "#06b6d4"  },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Tổng quan hệ thống</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Top tours */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🏆 Tour được đánh giá nhiều nhất</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {topTours.map((t, i) => {
            const provinces = getProvincesByTour(t.tourId);
            const cost      = getTourEstimatedCost(t.tourId);
            return (
              <div key={t.tourId} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", background: "var(--surface)",
                borderRadius: "var(--radius-sm)",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#cd7c3b",
                  color: "#fff", fontWeight: 900, fontSize: 13,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <Link to={`/tours/${t.tourId}`} style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", textDecoration: "none" }}>
                    {t.name}
                  </Link>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {provinces.map((p) => p.name).join(" → ")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: 14 }}>
                    {cost > 0 ? formatPrice(cost) : "Liên hệ"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.reviewCount} đánh giá</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN AdminDashboard
════════════════════════════════════════ */
export default function AdminDashboard() {
  const [active, setActive] = useState("overview");

  const PAGE = {
    overview:  <Overview />,
    tours:     <AdminTours />,
    locations: <AdminLocations />,
    provinces: <AdminProvinces />,
    foods:     <AdminFoods />,
    transport: <AdminTransport />,
    users:     <AdminUsers />,
    bookings:  <AdminBookings />,
    reviews:   <AdminReviews />,
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - var(--nav-h))" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "#fff", borderRight: "1px solid var(--border)",
        padding: "20px 12px",
        position: "sticky", top: "var(--nav-h)", height: "calc(100vh - var(--nav-h))",
        overflowY: "auto",
      }}>
        <div style={{ fontWeight: 900, fontSize: 13, color: "var(--text-muted)", padding: "0 8px", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
          Admin Panel
        </div>
        {NAV.map((n) => (
          <button key={n.key} onClick={() => setActive(n.key)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              border: "none", cursor: "pointer", textAlign: "left",
              background: active === n.key ? "var(--primary-light)" : "transparent",
              color:      active === n.key ? "var(--primary)"       : "var(--text-muted)",
              fontWeight: active === n.key ? 700 : 500,
              fontSize: 14, transition: "all .15s",
              marginBottom: 2,
            }}>
            <span>{n.icon}</span>
            <span>{n.label}</span>
            {n.key === "bookings" && (
              <span style={{
                marginLeft: "auto", background: "var(--primary)", color: "#fff",
                fontSize: 11, fontWeight: 800, borderRadius: 10, padding: "1px 7px",
              }}>
                {mockBookings.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* ── Content ── */}
      <main style={{ flex: 1, padding: 28, overflowY: "auto", background: "var(--surface)" }}>
        {PAGE[active]}
      </main>
    </div>
  );
}
