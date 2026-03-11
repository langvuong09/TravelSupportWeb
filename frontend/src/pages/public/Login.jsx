import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // giả lập loading
    const res = login(form.username, form.password);
    setLoading(false);
    if (res.success) {
      nav(res.user.role === "ADMIN" ? "/admin" : from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=80" alt="bg" />
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✈</div>
          <h1>TravelSupport</h1>
          <p>Chào mừng trở lại</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="field-label">Tên đăng nhập</label>
            <input
              className="input-field"
              type="text"
              placeholder="admin / user1"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label">Mật khẩu</label>
            <input
              className="input-field"
              type="password"
              placeholder="admin / 123456"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}

          {/* Demo accounts hint */}
          <div style={{ background: "var(--primary-light)", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#0369a1" }}>
            <strong>Demo:</strong> Admin: <code>admin/admin</code> · User: <code>user1/123456</code>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 20 }}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng ký ngay</Link>
        </p>

        <div className="auth-divider"><span>hoặc</span></div>

        <Link to="/" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          Tiếp tục không đăng nhập
        </Link>
      </div>
    </div>
  );
}
