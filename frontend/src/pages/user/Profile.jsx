import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  mockBookings, mockTours,
  getFullName, getTourThumbnail, getTourEstimatedCost,
  getProvincesByTour, formatPrice,
} from "../../data/mockData";
import { Link } from "react-router-dom";

/* ── Avatar ── */
function Avatar({ user, size = 80, avatarUrl = null }) {
  const name = getFullName(user);
  
  if (avatarUrl) {
    return (
      <img 
        src={avatarUrl} 
        alt={name}
        style={{
          width: size, 
          height: size, 
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  
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
const TABS = ["Thông tin"];

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab,  setTab]  = useState("Thông tin");
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    email:     user?.email     || "",
    phone:     user?.phone     || "",
    birthDate: user?.birthDate || "",
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const [changePassword, setChangePassword] = useState({ current: "", new: "", confirm: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [saved, setSaved] = useState(false);

  const myBookings = mockBookings.filter((b) => b.userId === user?.userId);

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
        <Avatar user={user} size={72} avatarUrl={avatarUrl} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{getFullName(user)}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{user?.email}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 18 }}>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowChangePassword(!showChangePassword)} className="btn btn-outline"
            style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}>
            Đổi mật khẩu
          </button>
          <button onClick={logout} className="btn btn-outline"
            style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}>
            Đăng xuất
          </button>
        </div>
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
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 28, maxWidth: 700 }}>
          {/* Change Password Section */}
          {showChangePassword && (
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Đổi mật khẩu</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                <div>
                  <label className="field-label">Mật khẩu hiện tại</label>
                  <input 
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className="input-field" 
                    value={changePassword.current}
                    onChange={(e) => setChangePassword({ ...changePassword, current: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="field-label">Mật khẩu mới</label>
                  <input 
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="input-field" 
                    value={changePassword.new}
                    onChange={(e) => setChangePassword({ ...changePassword, new: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="field-label">Nhập lại mật khẩu mới</label>
                  <input 
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="input-field" 
                    value={changePassword.confirm}
                    onChange={(e) => setChangePassword({ ...changePassword, confirm: e.target.value })} 
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button 
                  onClick={() => {
                    if (changePassword.new !== changePassword.confirm) {
                      alert("Mật khẩu nhập lại không trùng khớp");
                      return;
                    }
                    setPasswordSaved(true);
                    setTimeout(() => { setPasswordSaved(false); setShowChangePassword(false); }, 2000);
                  }} 
                  className="btn btn-primary"
                >
                  Cập nhật mật khẩu
                </button>
                <button 
                  onClick={() => {
                    setShowChangePassword(false);
                    setChangePassword({ current: "", new: "", confirm: "" });
                  }} 
                  className="btn btn-outline"
                >
                  Huỷ
                </button>
                {passwordSaved && <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600, alignSelf: "center" }}>✓ Đã lưu!</span>}
              </div>
            </div>
          )}

          {/* Profile Info Section */}
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Chỉnh sửa thông tin</h2>
          
          {/* Avatar Upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
            <div>
              <Avatar user={user} size={100} avatarUrl={avatarUrl} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "var(--text)" }}>Ảnh đại diện</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setAvatarUrl(ev.target?.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ marginBottom: 8 }}
              />
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>Chọn ảnh JPG, PNG (tối đa 5MB)</p>
              {avatarUrl && (
                <button 
                  onClick={() => setAvatarUrl(null)}
                  style={{ marginTop: 8, padding: "4px 12px", background: "#fee2e2", border: "none", borderRadius: 6, color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                >
                  Xoá ảnh
                </button>
              )}
            </div>
          </div>
          
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
            <div>
              <label className="field-label">Số điện thoại</label>
              <input className="input-field" type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Ngày sinh</label>
              <input className="input-field" type="date" value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
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
    </div>
  );
}
