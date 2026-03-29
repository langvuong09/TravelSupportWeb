import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getTour, getLocationsByTour, getProvincesByTour,
  getTourThumbnail, getTourEstimatedCost, formatPrice,
} from "../../data/mockData";
import { Ic } from "../../components/UI";

export default function BookingForm() {
  const { tourId } = useParams();
  const tour       = getTour(tourId); // tourId là string rồi
  const { user }   = useAuth();
  const nav        = useNavigate();

  const locations  = tour ? getLocationsByTour(tourId) : [];
  const provinces  = tour ? getProvincesByTour(tourId) : [];
  const thumbnail  = tour ? getTourThumbnail(tourId) : null;
  const baseCost   = tour ? getTourEstimatedCost(tourId) : 0;

  const [num,  setNum]  = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    email:     user?.email     || "",
  });

  if (!tour) return <div className="page-wrap">Không tìm thấy tour.</div>;

  const total = baseCost * num;

  const handleSubmit = () => {
    if (!form.firstName || !form.email) return;
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Đặt tour thành công!</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Chúng tôi sẽ liên hệ xác nhận qua email <strong>{form.email}</strong> trong vòng 24 giờ.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/my-bookings" className="btn btn-primary">Xem đặt tour của tôi</Link>
        <Link to="/create-tour" className="btn btn-outline">Tạo tour mới</Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
        <Link to="/create-tour" style={{ color: "var(--primary)" }}>Tours</Link>
        <span> / </span>
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>Chuỗi tour</span>
        <span>›</span>
        <span>Đặt tour</span>
      </div>

      <h1 className="page-title" style={{ marginBottom: 28 }}>Xác nhận đặt tour</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Thông tin khách hàng */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Ic.User /> Thông tin khách hàng
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="field-label">Họ</label>
                <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Nguyễn" />
              </div>
              <div>
                <label className="field-label">Tên</label>
                <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Văn A" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="field-label">Email</label>
                <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="abc@gmail.com" />
              </div>
            </div>
          </div>

          {/* Chi tiết đặt tour */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Ic.Tour /> Chi tiết đặt tour
            </h2>

            <label className="field-label">Số người tham gia</label>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <button
                onClick={() => setNum(Math.max(1, num - 1))}
                style={{ width: 40, height: 40, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >−</button>
              <span style={{ fontSize: 22, fontWeight: 800, width: 32, textAlign: "center" }}>{num}</span>
              <button
                onClick={() => setNum(num + 1)}
                style={{ width: 40, height: 40, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >+</button>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>người tham gia</span>
            </div>

            <label className="field-label">Yêu cầu đặc biệt</label>
            <textarea
              className="input-field"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: ăn chay, dị ứng thức ăn, cần hỗ trợ đặc biệt..."
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Hành trình */}
          {provinces.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🗺️ Hành trình tour</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {provinces.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      background: "var(--primary-light)", color: "var(--primary)",
                      padding: "6px 14px", borderRadius: 20, fontWeight: 700, fontSize: 13,
                    }}>{p.name}</span>
                    {i < provinces.length - 1 && <span style={{ margin: "0 4px", color: "var(--text-muted)" }}>→</span>}
                  </div>
                ))}
              </div>

              {/* Địa điểm */}
              {locations.length > 0 && (
                <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {locations.map((loc) => (
                    <span key={loc.locationId} style={{
                      background: "#f1f5f9", color: "var(--text-muted)",
                      fontSize: 12, padding: "3px 10px", borderRadius: 20,
                    }}>📍 {loc.name}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right – summary */}
        <div>
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)", padding: 24,
            boxShadow: "var(--shadow-md)",
            position: "sticky", top: "calc(var(--nav-h) + 20px)",
          }}>
            {/* Tour image */}
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
              <img src={thumbnail} alt={tour.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.4 }}>{tour.name}</h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>
              {provinces.map((p) => p.name).join(" → ")}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
              {[
                ["Chi phí ước tính/người", formatPrice(baseCost)],
                ["Số người",               `× ${num}`],
                ["Địa điểm",              `${locations.length} điểm tham quan`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}>
                  <span style={{ color: "var(--text-muted)" }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--border)", paddingTop: 12, marginTop: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>Tổng ước tính</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>
                  {baseCost > 0 ? formatPrice(total) : "Liên hệ"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
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
