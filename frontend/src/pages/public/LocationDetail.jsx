import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getLocation, getProvince, getToursByLocation,
  getReviewsByTour, formatPrice, avgRating, getUserById, getFullName,
} from "../../data/mockData";
import { Ic, StarRating } from "../../components/UI";

export default function LocationDetail() {
  const { id } = useParams();
  const locationId = parseInt(id);
  const loc      = getLocation(locationId);
  const province = loc ? getProvince(loc.provinceId) : null;
  const { user } = useAuth();

  if (!loc) {
    return <div className="page-wrap">Không tìm thấy địa điểm.</div>;
  }

  const tours = getToursByLocation(locationId);

  // Tổng hợp reviews từ tất cả tours liên quan
  const reviews = tours.flatMap((t) => getReviewsByTour(t.tourId));
  const rating  = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      {/* Hero image */}
      <div style={{ position: "relative", height: 420, overflow: "hidden", borderRadius: "0 0 32px 32px" }}>
        <img src={loc.image} alt={loc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 10 }}>
            <Link to="/locations" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>Địa điểm</Link>
            <span>›</span>
            <span>{province?.name}</span>
            <span>›</span>
            <span>{loc.name}</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 900, margin: "0 0 10px", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
            {loc.name}
          </h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
              <Ic.Pin /> {province?.name}
            </span>
            <span style={{
              background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
              padding: "2px 12px", borderRadius: 20,
              color: "#fff", fontSize: 13, fontWeight: 600,
            }}>
              {loc.type}
            </span>
            {rating && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#fbbf24", fontSize: 14, fontWeight: 700 }}>
                ★ {rating} ({reviews.length} đánh giá)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        {/* Left */}
        <div>
          {/* Info cards */}
          <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
            {[
              ["📍", "Tỉnh/thành",         province?.name || "—"],
              ["🕐", "Thời điểm lý tưởng", loc.bestTimeToVisit],
              ["💰", "Chi phí ước tính",   formatPrice(loc.estimatedCost) + "/người"],
            ].map(([e, l, v]) => (
              <div key={l} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "16px 18px", flex: 1, minWidth: 160,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{e}</div>
                <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: 28, border: "1px solid var(--border)", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Giới thiệu</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: 15 }}>{loc.description}</p>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Đánh giá từ khách hàng</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {reviews.map((r) => {
                  const u    = getUserById(r.userId);
                  const name = getFullName(u);
                  return (
                    <div key={r.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, fontSize: 15,
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
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ position: "sticky", top: "calc(var(--nav-h) + 20px)", height: "fit-content" }}>
          <div style={{
            background: "linear-gradient(135deg,var(--primary),var(--secondary))",
            borderRadius: "var(--radius-xl)", padding: 28, color: "#fff", marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Đặt tour ngay</h3>
            <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Có {tours.length} tour ghé thăm {loc.name}. Đặt sớm để nhận ưu đãi!
            </p>
            <Link
              to={user ? `/create-tour` : "/login"}
              className="btn"
              style={{ width: "100%", background: "#fff", color: "var(--primary)", fontWeight: 700, justifyContent: "center" }}
            >
              {user ? "Tạo tour" : "Đăng nhập để đặt"}
            </Link>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Thông tin nhanh</h4>
            {[
              ["🏙️ Tỉnh/thành:",  province?.name || "—"],
              ["🏷️ Loại hình:",   loc.type],
              ["🏕️ Số tour:",     `${tours.length} tour`],
              ["💰 Chi phí từ:",  formatPrice(loc.estimatedCost)],
              ["🌤️ Lý tưởng:",   loc.bestTimeToVisit],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
