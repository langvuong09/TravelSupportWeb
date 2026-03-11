import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTour, getLocation, getLocationDetail, mockReviews, formatPrice, getUserById } from "../../data/mockData";
import { Ic, StarRating } from "../../components/UI";

export default function TourDetail() {
  const { id }   = useParams();
  const tour     = getTour(parseInt(id));
  const { user } = useAuth();
  const nav      = useNavigate();

  if (!tour) return <div className="page-wrap">Không tìm thấy tour.</div>;

  const loc    = getLocation(tour.locationId);
  const detail = getLocationDetail(tour.locationId);
  const reviews = mockReviews.filter(r => r.tourId === tour.tourId);
  const rating  = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const nights   = Math.max(0, Math.round((new Date(tour.endDate) - new Date(tour.startDate)) / 86400000));
  const duration = nights === 0 ? "1 ngày" : `${nights + 1} ngày ${nights} đêm`;

  const handleBook = () => {
    if (!user) { nav("/login"); return; }
    nav(`/book/${tour.tourId}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: 380, overflow: "hidden", borderRadius: "0 0 28px 28px" }}>
        <img src={detail?.image} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ background: "linear-gradient(135deg,var(--primary),var(--secondary))", borderRadius: 8, padding: "4px 12px", color: "#fff", fontSize: 12, fontWeight: 700 }}>
              {duration}
            </span>
            {rating && (
              <span style={{ background: "rgba(245,158,11,0.9)", borderRadius: 8, padding: "4px 12px", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                ★ {rating}
              </span>
            )}
          </div>
          <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 8px", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{tour.name}</h1>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
            <Ic.Pin /> {loc?.name}, {loc?.province}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="page-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
        <div>
          {/* Info row */}
          <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              ["📅", "Ngày khởi hành",   tour.startDate],
              ["🏁", "Ngày kết thúc",    tour.endDate],
              ["👥", "Số người tối đa",  `${tour.maxParticipants} người`],
              ["⏱️", "Thời gian",         duration],
            ].map(([e, l, v]) => (
              <div key={l} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px", flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{e}</div>
                <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26, marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Mô tả chương trình</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: 15, margin: 0 }}>{tour.description}</p>
          </div>

          {/* Reviews */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
              Đánh giá ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                Chưa có đánh giá. Hãy là người đầu tiên!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {reviews.map(r => {
                  const u = getUserById(r.userId);
                  return (
                    <div key={r.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800,
                          }}>{(u?.fullName || "K")[0]}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{u?.fullName || "Khách hàng"}</div>
                            <StarRating rating={r.rating} size={13} />
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--text-light)" }}>{r.createdAt}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{r.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "calc(var(--nav-h) + 20px)", height: "fit-content" }}>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 26, boxShadow: "var(--shadow-md)" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--primary)", marginBottom: 4 }}>{formatPrice(tour.price)}</div>
            <div style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 22 }}>/người · {duration}</div>

            {[
              ["Địa điểm",      `${loc?.name}, ${loc?.province}`],
              ["Khởi hành",     tour.startDate],
              ["Kết thúc",      tour.endDate],
              ["Tối đa",        `${tour.maxParticipants} người`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
                <span style={{ fontWeight: 600, textAlign: "right", maxWidth: 160 }}>{v}</span>
              </div>
            ))}

            <button
              onClick={handleBook}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
            >
              {user ? "Đặt tour ngay" : "Đăng nhập để đặt"}
            </button>

            {!user && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng nhập</Link> hoặc{" "}
                <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng ký</Link> để đặt tour
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
