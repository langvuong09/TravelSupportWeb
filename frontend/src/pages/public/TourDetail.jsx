import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getTour,
  getLocationsByTour,
  getProvincesByTour,
  getFoodsByTour,
  getTransportByTour,
  getTourThumbnail,
  getTourEstimatedCost,
  getReviewsByTour,
  getUserById,
  getFullName,
  formatPrice,
  avgRating,
} from "../../data/mockData";
import { Ic, StarRating } from "../../components/UI";

export default function TourDetail() {
  const { id }   = useParams();
  const tour     = getTour(id);
  const { user } = useAuth();
  const nav      = useNavigate();

  if (!tour) return <div className="page-wrap">Không tìm thấy tour.</div>;

  const locations  = getLocationsByTour(tour.tourId);
  const provinces  = getProvincesByTour(tour.tourId);
  const foods      = getFoodsByTour(tour.tourId);
  const transports = getTransportByTour(tour.tourId);
  const reviews    = getReviewsByTour(tour.tourId);
  const thumbnail  = getTourThumbnail(tour.tourId);
  const totalCost  = getTourEstimatedCost(tour.tourId);
  const rating     = avgRating(tour.tourId);

  const handleBook = () => {
    if (!user) { nav("/login"); return; }
    nav(`/book/${tour.tourId}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: 400, overflow: "hidden", borderRadius: "0 0 28px 28px" }}>
        <img src={thumbnail} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {provinces.map((p, i) => (
              <span key={i} style={{
                background: i === 0 ? "linear-gradient(135deg,var(--primary),var(--secondary))" : "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                borderRadius: 8, padding: "4px 12px",
                color: "#fff", fontSize: 12, fontWeight: 700,
              }}>
                {i === 0 ? "📍" : "→"} {p.name}
              </span>
            ))}
            {Number(rating) > 0 && (
              <span style={{ background: "rgba(245,158,11,0.9)", borderRadius: 8, padding: "4px 12px", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                ★ {rating}
              </span>
            )}
          </div>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: "0 0 8px", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
            {tour.name}
          </h1>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
            {locations.length} địa điểm · {provinces.length} tỉnh/thành
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="page-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
        <div>
          {/* Quick stats */}
          <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              ["🗺️", "Địa điểm",       `${locations.length} điểm tham quan`],
              ["🏙️", "Tỉnh/thành",     `${provinces.length} tỉnh`],
              ["🚌", "Phương tiện",    `${[...new Set(transports.map(t => t.transportType?.name))].join(", ") || "Xe khách"}`],
              ["🍜", "Ẩm thực",        `${foods.length} đặc sản`],
            ].map(([e, l, v]) => (
              <div key={l} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 18px", flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{e}</div>
                <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Lịch trình tỉnh thành */}
          {provinces.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26, marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>🗺️ Hành trình</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                {provinces.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                      color: "#fff", borderRadius: "var(--radius-sm)",
                      padding: "8px 16px", fontWeight: 700, fontSize: 14,
                    }}>
                      {p.name}
                    </div>
                    {i < provinces.length - 1 && (
                      <div style={{ margin: "0 8px", color: "var(--text-muted)", fontSize: 18 }}>→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Các địa điểm tham quan */}
          {locations.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26, marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>📍 Địa điểm tham quan</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {locations.map((loc) => (
                  <Link key={loc.locationId} to={`/locations/${loc.locationId}`} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 16px", border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)", textDecoration: "none",
                    transition: "box-shadow var(--transition), border-color var(--transition)",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
                  >
                    <img src={loc.image} alt={loc.name} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{loc.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {loc.description}
                      </div>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-light)" }}>
                        <span>💰 {formatPrice(loc.estimatedCost)}/người</span>
                        <span>📅 {loc.bestTimeToVisit}</span>
                        <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "1px 8px", borderRadius: 20, fontWeight: 600 }}>{loc.type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Phương tiện di chuyển */}
          {transports.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26, marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>🚌 Phương tiện di chuyển</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {transports.map((t, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", background: "var(--border-light)",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <span style={{ fontSize: 20 }}>
                      {{ "Máy bay": "✈️", "Tàu hỏa": "🚂", "Xe khách": "🚌", "Cáp treo": "🚡", "Tàu thuyền": "⛵" }[t.transportType?.name] || "🚗"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>
                        {t.fromProvinceName} → {t.toProvinceName}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.transportType?.name}</div>
                    </div>
                    {t.transportType?.costPerKm > 0 && (
                      <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>
                        {formatPrice(t.transportType.costPerKm)}/km
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ẩm thực */}
          {foods.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 26, marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>🍜 Đặc sản & Ẩm thực</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {foods.map((food) => (
                  <div key={food.foodId} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <img src={food.image} alt={food.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{food.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>{food.description}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: "#fef3c7", color: "#d97706", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{food.type}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>~{formatPrice(food.estimatedPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Đánh giá */}
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
                {reviews.map((r) => {
                  const u = getUserById(r.userId);
                  const name = getFullName(u);
                  return (
                    <div key={r.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, flexShrink: 0,
                          }}>{name[0]}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
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
            <div style={{ fontSize: 26, fontWeight: 900, color: "var(--primary)", marginBottom: 4 }}>
              {totalCost > 0 ? formatPrice(totalCost) : "Liên hệ"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 22 }}>
              Chi phí ước tính/người
            </div>

            {/* Tóm tắt */}
            {[
              ["Địa điểm",   `${locations.length} điểm tham quan`],
              ["Hành trình", provinces.map((p) => p.name).join(" → ")],
              ["Phương tiện",`${[...new Set(transports.map((t) => t.transportType?.name))].filter(Boolean).join(", ") || "Xe khách"}`],
              ["Ẩm thực",    `${foods.length} đặc sản địa phương`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)", fontSize: 13, gap: 8 }}>
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{l}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
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
