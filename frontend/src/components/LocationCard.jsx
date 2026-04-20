import { Link } from "react-router-dom";
import { Ic } from "./UI";
import { formatPrice, logInteraction } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80";

export default function LocationCard({ location }) {
  const { user } = useAuth();
  return (
    <Link
      to={`/locations/${location.locationId}`}
      onClick={() => {
        if (user && location.locationId) {
          logInteraction(user.user_id, location.locationId, "click");
        }
      }}
      className="card card-hover"
      style={{ display: "block", overflow: "hidden", textDecoration: "none" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={location.image || DEFAULT_IMAGE}
          alt={location.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
          borderRadius: 20, padding: "4px 10px",
          color: "#fff", fontSize: 12, fontWeight: 600,
        }}>
          {location.type}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 12, marginBottom: 6 }}>
          <Ic.Pin /> Việt Nam
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
          {location.name}
        </h3>
        <p style={{
          fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {location.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>Thời điểm lý tưởng</div>
            <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>{location.bestTimeToVisit || location.niceTime || "—"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>Chi phí từ</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--primary)" }}>{formatPrice(location.estimatedCost)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
