import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTour, getLocation, getLocationDetail, formatPrice } from "../../data/mockData";
import { Ic } from "../../components/UI";

export default function BookingForm() {
  const { tourId } = useParams();
  const tour   = getTour(parseInt(tourId));
  const loc    = getLocation(tour?.locationId);
  const detail = getLocationDetail(tour?.locationId);
  const { user } = useAuth();
  const nav = useNavigate();

  const [num, setNum]         = useState(1);
  const [note, setNote]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName:  user?.fullName  || "",
    email:     user?.email     || "",
    phone:     user?.phone     || "",
    birthDate: user?.birthDate || "",
  });

  if (!tour) return <div className="page-wrap">Không tìm thấy tour.</div>;

  const total = tour.price * num;
  const nights = Math.max(0, Math.round((new Date(tour.endDate) - new Date(tour.startDate)) / 86400000));
  const duration = nights === 0 ? "1 ngày" : `${nights + 1}N${nights}Đ`;

  if (submitted) return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Đặt tour thành công!</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Chúng tôi sẽ liên hệ xác nhận qua email <strong>{form.email}</strong> trong vòng 24 giờ.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/my-bookings" className="btn btn-primary">Xem đặt tour của tôi</Link>
        <Link to="/tours" className="btn btn-outline">Khám phá thêm</Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
        <Link to="/tours" style={{ color: "var(--primary)" }}>Tours</Link>
        <span>›</span>
        <Link to={`/tours/${tour.tourId}`} style={{ color: "var(--primary)" }}>{tour.name}</Link>
        <span>›</span>
        <span>Đặt tour</span>
      </div>

      <h1 className="page-title" style={{ marginBottom: 28 }}>Xác nhận đặt tour</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* Left - form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Customer info */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Ic.User /> Thông tin khách hàng
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["fullName","Họ và tên","text"],["email","Email","email"],["phone","Số điện thoại","tel"],["birthDate","Ngày sinh","date"]].map(([k,l,t]) => (
                <div key={k}>
                  <label className="field-label">{l}</label>
                  <input className="input-field" type={t} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
            </div>
          </div>

          {/* Booking details */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Ic.Tour /> Chi tiết đặt tour
            </h2>

            <label className="field-label">Số người tham gia</label>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <button
                onClick={() => setNum(Math.max(1, num - 1))}
                style={{ width: 38, height: 38, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 20, cursor: "pointer" }}
              >−</button>
              <span style={{ fontSize: 20, fontWeight: 800, width: 32, textAlign: "center" }}>{num}</span>
              <button
                onClick={() => setNum(Math.min(tour.maxParticipants, num + 1))}
                style={{ width: 38, height: 38, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 20, cursor: "pointer" }}
              >+</button>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Tối đa {tour.maxParticipants} người</span>
            </div>

            <label className="field-label">Yêu cầu đặc biệt</label>
            <textarea
              className="input-field"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: ăn chay, dị ứng thức ăn, cần hỗ trợ đặc biệt..."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Right - summary */}
        <div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, boxShadow: "var(--shadow-md)", position: "sticky", top: "calc(var(--nav-h) + 20px)" }}>
            {/* Tour image */}
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
              <img src={detail?.image} alt={tour.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            </div>

            <span style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
              {duration}
            </span>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "10px 0 4px", lineHeight: 1.4 }}>{tour.name}</h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 18 }}>
              <Ic.Pin /> {loc?.name}, {loc?.province}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
              {[
                ["Giá/người",     formatPrice(tour.price)],
                ["Số người",      `× ${num}`],
                ["Khởi hành",     tour.startDate],
                ["Kết thúc",      tour.endDate],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}>
                  <span style={{ color: "var(--text-muted)" }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--border)", paddingTop: 12, marginTop: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>Tổng cộng</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            >
              Xác nhận đặt tour
            </button>

            <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center", marginTop: 10 }}>
              Miễn phí huỷ trong vòng 24h sau khi đặt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
