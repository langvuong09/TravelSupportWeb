import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ fullName:"", username:"", email:"", phone:"", birthDate:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName  = "Vui lòng nhập họ tên";
    if (!form.username.trim())  e.username  = "Vui lòng nhập tên đăng nhập";
    if (!form.email.includes("@")) e.email  = "Email không hợp lệ";
    if (!form.phone.match(/^0\d{9}$/)) e.phone = "Số điện thoại không hợp lệ";
    if (form.password.length < 6)  e.password = "Mật khẩu tối thiểu 6 ký tự";
    if (form.password !== form.confirm) e.confirm = "Mật khẩu không khớp";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => nav("/login"), 2000);
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
        <p style={{ color: "var(--text-muted)" }}>Đang chuyển đến trang đăng nhập...</p>
      </div>
    </div>
  );

  const Field = ({ k, label, type="text", placeholder="" }) => (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="input-field"
        type={type} placeholder={placeholder}
        value={form[k]}
        onChange={e => { setForm({...form,[k]:e.target.value}); setErrors({...errors,[k]:""}); }}
        style={errors[k] ? { borderColor: "var(--danger)" } : {}}
      />
      {errors[k] && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{errors[k]}</p>}
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
            <Field k="fullName"  label="Họ và tên *"         placeholder="Nguyễn Văn A" />
            <Field k="username"  label="Tên đăng nhập *"     placeholder="nguyenvana" />
            <Field k="email"     label="Email *"             type="email" placeholder="abc@gmail.com" />
            <Field k="phone"     label="Số điện thoại *"     type="tel"   placeholder="0901234567" />
            <Field k="birthDate" label="Ngày sinh"           type="date" />
            <div /> {/* spacer */}
            <Field k="password"  label="Mật khẩu *"          type="password" placeholder="Tối thiểu 6 ký tự" />
            <Field k="confirm"   label="Xác nhận mật khẩu *" type="password" placeholder="Nhập lại mật khẩu" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
            Đăng ký
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
