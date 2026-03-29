import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  mockBookings, mockReviews, mockTours,
  getFullName, getTourThumbnail, getTourEstimatedCost,
  getProvincesByTour, formatPrice,
} from "../../data/mockData";
import { Link } from "react-router-dom";
import { StarRating } from "../../components/UI";

/* ── Avatar ── */
function Avatar({ user, size = 80 }) {
  const name = getFullName(user);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 900, fontSize: size * 0.38,
      flexShrink: 0,
    }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

/* ── Tab bar ── */
const TABS = ["Thông tin", "Đặt tour", "Đánh giá"];

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab,  setTab]  = useState("Thông tin");
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    email:     user?.email     || "",
  });
  const [saved, setSaved] = useState(false);

  const myBookings = mockBookings.filter((b) => b.userId === user?.userId);
  const myReviews  = mockReviews.filter((r) => r.userId === user?.userId);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-wrap">
      {/* Profile header */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        borderRadius: "var(--radius-xl)", padding: "32px 28px",
        display: "flex", alignItems: "center", gap: 24, marginBottom: 28,
        color: "#fff",
      }}>
        <Avatar user={user} size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{getFullName(user)}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{user?.email}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 18 }}>
            {[
              ["🏕️", myBookings.length, "tour đã đặt"],
              ["⭐", myReviews.length,  "đánh giá"],
            ].map(([emoji, n, label]) => (
              <div key={label}>
                <span style={{ fontWeight: 800 }}>{emoji} {n} </span>
                <span style={{ opacity: 0.75, fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={logout} className="btn btn-outline"
          style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}>
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "9px 20px", borderRadius: 30,
              border: "1.5px solid var(--border)",
              background: tab === t ? "var(--primary)" : "#fff",
              color: tab === t ? "#fff" : "var(--text-muted)",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              transition: "all .2s",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab: Thông tin ── */}
      {tab === "Thông tin" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 28, maxWidth: 560 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Chỉnh sửa thông tin</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="field-label">Họ</label>
              <input className="input-field" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Tên</label>
              <input className="input-field" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="field-label">Email</label>
              <input className="input-field" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
            <button onClick={handleSave} className="btn btn-primary">Lưu thay đổi</button>
            {saved && <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>✓ Đã lưu!</span>}
          </div>
        </div>
      )}

      {/* ── Tab: Đặt tour ── */}
      {tab === "Đặt tour" && (
        <div>
          {myBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48 }}>🏕️</div>
              <p style={{ color: "var(--text-muted)", marginTop: 12 }}>Chưa có đặt tour nào</p>
              <Link to="/create-tour" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>
                Khám phá tour ngay
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myBookings.map((b) => {
                const tour      = mockTours.find((t) => t.tourId === b.tourId);
                const thumbnail = getTourThumbnail(b.tourId);
                const provinces = getProvincesByTour(b.tourId);
                const cost      = getTourEstimatedCost(b.tourId);
                if (!tour) return null;
                return (
                  <div key={b.bookingId} style={{
                    background: "#fff", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 18,
                    display: "flex", gap: 16, alignItems: "center",
                    boxShadow: "var(--shadow-sm)",
                  }}>
                    <img src={thumbnail} alt={tour.name}
                      style={{ width: 88, height: 66, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>
                        {tour.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "3px 0 6px" }}>
                        {provinces.map((p) => p.name).join(" → ")}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        <span style={{
                          background: b.status === "confirmed" ? "#dcfce7" : "#fef9c3",
                          color:      b.status === "confirmed" ? "#16a34a" : "#ca8a04",
                          padding: "2px 10px", borderRadius: 20, fontWeight: 700, fontSize: 12,
                        }}>
                          {b.status === "confirmed" ? "✓ Đã xác nhận" : "⏳ Chờ xác nhận"}
                        </span>
                      </div>
                    </div>
                    {cost > 0 && (
                      <div style={{ fontWeight: 800, color: "var(--primary)", fontSize: 15 }}>
                        {formatPrice(cost)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Đánh giá ── */}
      {tab === "Đánh giá" && (
        <div>
          {myReviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48 }}>✍️</div>
              <p style={{ color: "var(--text-muted)", marginTop: 12 }}>Chưa có đánh giá nào</p>
              <Link to="/my-reviews" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>
                Viết đánh giá ngay
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myReviews.map((r) => {
                const tour = mockTours.find((t) => t.tourId === r.tourId);
                const thumbnail = getTourThumbnail(r.tourId);
                return (
                  <div key={r.id} style={{
                    background: "#fff", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 18,
                    display: "flex", gap: 14,
                    boxShadow: "var(--shadow-sm)",
                  }}>
                    <img src={thumbnail} alt={tour?.name}
                      style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <Link to={`/tours/${tour?.tourId}`} style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", textDecoration: "none" }}>
                        {tour?.name}
                      </Link>
                      <StarRating rating={r.rating} size={13} style={{ margin: "4px 0" }} />
                      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{r.comment}</p>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-light)", flexShrink: 0 }}>{r.createdAt}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
