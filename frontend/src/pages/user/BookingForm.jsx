import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { getTourFullDetails, formatPrice } from "../../services/api";
import { Ic } from "../../components/UI";

export default function BookingForm() {
  const { tourId } = useParams();
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const nav = useNavigate();

  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(1);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  useEffect(() => {
    const loadTour = async () => {
      setLoading(true);
      const data = await getTourFullDetails(tourId);
      setTourData(data);
      setLoading(false);
    };
    loadTour();
  }, [tourId]);

  if (loading) return <div className="page-wrap">Đang tải...</div>;
  if (!tourData || !tourData.tour) return <div className="page-wrap">Không tìm thấy tour.</div>;

  const tour = tourData.tour;
  const provinces = tourData.provinces || [];
  const locations = tourData.locations || [];
  const baseCost = tour.price || 0;
  const total = baseCost * num;
  const thumbnail = tourData.locations?.[0]?.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
        alert("Vui lòng điền đầy đủ thông tin liên hệ");
        return;
    }
    
    setSubmitting(true);
    const payload = {
        userId: user.user_id,
        tourId: tour.tourId,
        numberOfPeople: num,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        note: note
    };

    const result = await addBooking(payload);
    setSubmitting(false);
    
    if (result) {
        setSubmitted(true);
    } else {
        alert("Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.");
    }
  };

  if (submitted) return (
    <div className="page-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Đặt tour thành công!</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Chúng tôi đã nhận được yêu cầu đặt tour của bạn. <br/>
        Mã số đặt tour sẽ sớm được gửi đến email <strong>{form.email}</strong>.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/my-bookings" className="btn btn-primary">Xem tour đã đặt</Link>
        <Link to="/" className="btn btn-outline">Về trang chủ</Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
        <Link to="/" style={{ color: "var(--primary)" }}>Trang chủ</Link>
        <span> / </span>
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>Tours</span>
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
              <div style={{ gridColumn: "span 2" }}>
                <label className="field-label">Họ và tên</label>
                <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="field-label">Số điện thoại</label>
                <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0901234567" />
              </div>
              <div>
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
                type="button"
                onClick={() => setNum(Math.max(1, num - 1))}
                style={{ width: 40, height: 40, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >−</button>
              <span style={{ fontSize: 22, fontWeight: 800, width: 32, textAlign: "center" }}>{num}</span>
              <button
                type="button"
                onClick={() => setNum(num + 1)}
                style={{ width: 40, height: 40, border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >+</button>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>người tham gia</span>
            </div>

            <label className="field-label">Ghi chú thêm</label>
            <textarea
              className="input-field"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Cần hướng dẫn viên tiếng Anh, ăn chay..."
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Hành trình */}
          {provinces.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🗺️ Hành trình dự kiến</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {provinces.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      background: "var(--primary-light)", color: "var(--primary)",
                      padding: "6px 14px", borderRadius: 20, fontWeight: 700, fontSize: 13,
                    }}>{p.province.name}</span>
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
            position: "sticky", top: "20px",
          }}>
            {/* Tour image */}
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
              <img src={thumbnail} alt={tour.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.4 }}>{tour.name}</h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>
              {provinces.map((p) => p.province.name).join(" → ")}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
              {[
                ["Giá tour/người", formatPrice(baseCost)],
                ["Khách tham gia",  `× ${num}`],
                ["Điểm đến",        `${locations.length} địa điểm`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}>
                  <span style={{ color: "var(--text-muted)" }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--border)", paddingTop: 12, marginTop: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>Mức giá dự kiến</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>
                  {baseCost > 0 ? formatPrice(total) : "Liên hệ"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            >
              {submitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
            </button>
            <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center", marginTop: 10 }}>
              Hỗ trợ tư vấn miễn phí 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
