import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ic, StarRating } from "./UI";
import {
  getTourThumbnail,
  getTourEstimatedCost,
  getLocationsByTour,
  getProvincesByTour,
  avgRating,
  formatPrice,
} from "../data/mockData";

export default function TourCard({ tour }) {
  const locations = getLocationsByTour(tour.tourId);
  const provinces = getProvincesByTour(tour.tourId);
  const thumbnail = getTourThumbnail(tour.tourId);
  const cost      = getTourEstimatedCost(tour.tourId);
  const rating    = avgRating(tour.tourId);
  const { user }  = useAuth();
  const nav       = useNavigate();

  // Tỉnh chính (tỉnh đầu tiên trong lịch trình)
  const mainProvince = provinces[0]?.name || "Việt Nam";

  // Mô tả ngắn: list các địa điểm
  const locationNames = locations.map((l) => l.name).join(" · ");

  const handleBook = (e) => {
    e.preventDefault();
    if (!user) { nav("/login"); return; }
    nav(`/book/${tour.tourId}`);
  };

  return (
    <Link
      to={`/tours/${tour.tourId}`}
      className="card card-hover"
      style={{ display: "flex", flexDirection: "column", overflow: "hidden", textDecoration: "none" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 186, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={thumbnail}
          alt={tour.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Provinces badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
          borderRadius: 8, padding: "4px 10px",
          color: "#fff", fontSize: 12, fontWeight: 700,
        }}>
          {provinces.length} tỉnh/thành
        </div>
        {Number(rating) > 0 && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(245,158,11,0.9)", borderRadius: 8,
            padding: "4px 10px", color: "#fff", fontSize: 12, fontWeight: 700,
          }}>
            ★ {rating}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 12, marginBottom: 6 }}>
          <Ic.Pin /> {mainProvince}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>
          {tour.name}
        </h3>
        <p style={{
          fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 12, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {locationNames || "Khám phá các địa điểm độc đáo của Việt Nam"}
        </p>

        {/* Location chips */}
        {locations.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
            {locations.slice(0, 3).map((loc) => (
              <span key={loc.locationId} style={{
                background: "var(--primary-light)", color: "var(--primary)",
                fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              }}>
                {loc.name}
              </span>
            ))}
            {locations.length > 3 && (
              <span style={{ fontSize: 10, color: "var(--text-muted)", padding: "2px 4px" }}>
                +{locations.length - 3} nơi
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-light)" }}>Chi phí ước tính từ</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>
              {cost > 0 ? formatPrice(cost) : "Liên hệ"}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleBook}>
            Đặt ngay
          </button>
        </div>
      </div>
    </Link>
  );
}
