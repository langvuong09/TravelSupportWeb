import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", username: "", email: "",
    phone: "", birthDate: "", password: "", confirm: "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())           e.fullName  = "Vui lòng nhập họ tên";
    if (form.username.trim().length < 3) e.username  = "Tên đăng nhập tối thiểu 3 ký tự";
    if (!form.email.includes("@"))       e.email     = "Email không hợp lệ";
    if (!form.phone.match(/^0\d{9}$/))   e.phone     = "Số điện thoại 10 số, bắt đầu bằng 0";
    if (form.password.length < 6)        e.password  = "Mật khẩu tối thiểu 6 ký tự";
    if (form.password !== form.confirm)  e.confirm   = "Mật khẩu không khớp";
    return e;
  };

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:  form.fullName,
          username:  form.username,
          email:     form.email,
          phone:     form.phone,
          birthDate: form.birthDate,
          password:  form.password,
          // role mặc định là USER – backend tự set, không cần gửi
        }),
      });

      const data = await res.json();

      if (data.error) {
        if (data.error === "username_taken") {
          setErrors({ username: "Tên đăng nhập đã tồn tại, hãy chọn tên khác" });
        } else {
          setErrors({ _form: data.error });
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setErrors({ _form: "Không thể kết nối tới server. Hãy kiểm tra backend." });
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80" alt="bg" />
        <div className="auth-bg-overlay" />
      </div>
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Đăng ký thành công!</h2>
        <p style={{ color: "var(--text-muted)" }}>Đang chuyển tới trang đăng nhập...</p>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80" alt="bg" />
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">✈</div>
          <h1>Tạo tài khoản</h1>
          <p>Bắt đầu hành trình khám phá Việt Nam</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field k="fullName"  label="Họ và tên *"         placeholder="Nguyễn Văn A"   form={form} onChange={handleChange} errors={errors} />
            <Field k="username"  label="Tên đăng nhập *"     placeholder="nguyenvana"      form={form} onChange={handleChange} errors={errors} />
            <Field k="email"     label="Email *"             type="email" placeholder="abc@gmail.com" form={form} onChange={handleChange} errors={errors} />
            <Field k="phone"     label="Số điện thoại *"     type="tel"   placeholder="0901234567"    form={form} onChange={handleChange} errors={errors} />
            <Field k="birthDate" label="Ngày sinh"           type="date"  form={form} onChange={handleChange} errors={errors} />
            <div /> {/* spacer */}
            <Field k="password"  label="Mật khẩu *"          type="password" placeholder="Tối thiểu 6 ký tự"   form={form} onChange={handleChange} errors={errors} />
            <Field k="confirm"   label="Xác nhận mật khẩu *" type="password" placeholder="Nhập lại mật khẩu"    form={form} onChange={handleChange} errors={errors} />
          </div>

          {/* Thông báo role */}
          <div style={{
            background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8,
            padding: "10px 14px", fontSize: 13, color: "#0369a1",
          }}>
            ℹ️ Tài khoản đăng ký sẽ có quyền <strong>Người dùng</strong> – có thể xem địa điểm, tour và đặt chuyến đi.
          </div>

          {errors._form && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
              {errors._form}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 18 }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

/* ── Reusable field ── */
function Field({ k, label, type = "text", placeholder = "", form, onChange, errors }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={(e) => onChange(k, e.target.value)}
        style={errors[k] ? { borderColor: "var(--danger)" } : {}}
      />
      {errors[k] && (
        <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{errors[k]}</p>
      )}
    </div>
  );
}