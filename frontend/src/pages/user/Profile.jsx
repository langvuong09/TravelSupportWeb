import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, RoleBadge } from "../../components/UI";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const [tab, setTab]     = useState("info");

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ k, label, type = "text" }) => (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="input-field"
        type={type}
        value={form[k] || ""}
        onChange={e => { setForm({ ...form, [k]: e.target.value }); setSaved(false); }}
      />
    </div>
  );

  return (
    <div className="page-wrap" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Hồ sơ cá nhân</h1>
      <p className="page-subtitle">Quản lý thông tin tài khoản của bạn</p>

      {/* Profile header */}
      <div style={{ background: "linear-gradient(135deg,var(--primary),var(--secondary))", borderRadius: "var(--radius-xl)", padding: "28px 32px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20, color: "#fff" }}>
        <Avatar name={user.fullName} size={72} />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{user.fullName}</h2>
          <div style={{ opacity: 0.85, fontSize: 14, marginBottom: 8 }}>@{user.username} · {user.email}</div>
          <RoleBadge role={user.role} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#f1f5f9", padding: 4, borderRadius: "var(--radius-md)", width: "fit-content" }}>
        {[["info","Thông tin cá nhân"],["password","Đổi mật khẩu"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", border: "none",
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "var(--text)" : "var(--text-muted)",
            borderRadius: "var(--radius-sm)", fontWeight: tab === t ? 700 : 400,
            fontSize: 14, cursor: "pointer", boxShadow: tab === t ? "var(--shadow-xs)" : "none",
          }}>{l}</button>
        ))}
      </div>

      {tab === "info" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28 }}>
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <Field k="fullName"  label="Họ và tên" />
              <Field k="username"  label="Tên đăng nhập" />
              <Field k="email"     label="Email" type="email" />
              <Field k="phone"     label="Số điện thoại" type="tel" />
              <Field k="birthDate" label="Ngày sinh" type="date" />
            </div>

            {saved && (
              <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#16a34a", marginBottom: 14 }}>
                ✓ Thông tin đã được lưu thành công!
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              {saved ? "✓ Đã lưu" : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, maxWidth: 420 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Mật khẩu hiện tại","password"],["Mật khẩu mới","password"],["Xác nhận mật khẩu mới","password"]].map(([l, t]) => (
              <div key={l}>
                <label className="field-label">{l}</label>
                <input className="input-field" type={t} placeholder="••••••••" />
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: "fit-content" }}>Đổi mật khẩu</button>
          </div>
        </div>
      )}
    </div>
  );
}
