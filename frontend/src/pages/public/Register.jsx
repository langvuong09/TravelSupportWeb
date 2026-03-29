import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ fullName:"", username:"", email:"", phone:"", birthDate:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();
  const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          phone: form.phone,
          birthDate: form.birthDate,
          password: form.password
        })
      });
      const data = await res.json();
      if (data.error) {
        if (data.error === 'username_taken') {
          setErrors({ username: 'Tên đăng nhập đã tồn tại' });
        } else {
          setErrors({ form: data.error });
        }
        return;
      }
      setSuccess(true);
      setTimeout(() => nav('/login'), 1200);
    } catch (err) {
      setErrors({ form: 'Lỗi mạng, thử lại sau' });
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
        <p style={{ color: "var(--text-muted)" }}>Đang chuyển đến trang đăng nhập...</p>
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
            <Field k="fullName"  label="Họ và tên *"         placeholder="Nguyễn Văn A" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field k="username"  label="Tên đăng nhập *"     placeholder="nguyenvana" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field k="email"     label="Email *"             type="email" placeholder="abc@gmail.com" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field k="phone"     label="Số điện thoại *"     type="tel"   placeholder="0901234567" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field k="birthDate" label="Ngày sinh"           type="date" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <div /> {/* spacer */}
            <Field k="password"  label="Mật khẩu *"          type="password" placeholder="Tối thiểu 6 ký tự" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field k="confirm"   label="Xác nhận mật khẩu *" type="password" placeholder="Nhập lại mật khẩu" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          </div>

          {errors.form && (
            <div style={{ color: "var(--danger)", padding: "8px 10px", border: "1px solid #fecaca", borderRadius: 8, marginBottom: 8 }}>{errors.form}</div>
          )}

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

function Field({ k, label, type="text", placeholder="", form, setForm, errors, setErrors }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={e => {
          setForm(prev => ({ ...prev, [k]: e.target.value }));
          setErrors(prev => ({ ...prev, [k]: "" }));
        }}
        style={errors[k] ? { borderColor: "var(--danger)" } : {}}
      />
      {errors[k] && (
        <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
          {errors[k]}
        </p>
      )}
    </div>
  );
}