import { Link } from "react-router-dom";
import { Ic, StarRating } from "./UI";
import { formatPrice, avgRating, mockTours } from "../data/mockData";

export default function LocationCard({ location, detail }) {
  const toursCount = mockTours.filter((t) => t.locationId === location.locationId).length;
  const rating = avgRating(
    mockTours.find((t) => t.locationId === location.locationId)?.tourId
  );

  return (
    <Link
      to={`/locations/${location.locationId}`}
      className="card card-hover"
      style={{ display: "block", overflow: "hidden", textDecoration: "none" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={detail.image}
          alt={location.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
          borderRadius: 20, padding: "4px 10px",
          color: "#fff", fontSize: 12, fontWeight: 600,
        }}>
          Miền {location.region}
        </div>
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(245,158,11,0.9)", borderRadius: 8,
          padding: "4px 10px", color: "#fff", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          ★ {rating || "Mới"}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 12, marginBottom: 6 }}>
          <Ic.Pin /> {location.province}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
          {location.name}
        </h3>
        <p style={{
          fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {detail.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>Thời điểm lý tưởng</div>
            <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>{detail.bestTimeToVisit}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>Từ</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--primary)" }}>{formatPrice(detail.price)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
