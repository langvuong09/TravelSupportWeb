import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ic } from "./UI";
import { formatPrice } from "../services/api";

export default function TourCard({ tour }) {
  const { user } = useAuth();
  const nav = useNavigate();
  
  // Default values when full tour data isn't included
  const tourName = tour.name || `Tour ${tour.tourId}`;
  const thumbnail = tour.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80";
  const cost = tour.estimatedCost || 0;

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
          alt={tourName}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
          borderRadius: 8, padding: "4px 10px",
          color: "#fff", fontSize: 12, fontWeight: 700,
        }}>
          🗺️ Tour
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 12, marginBottom: 6 }}>
          <Ic.Pin /> Việt Nam
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>
          {tourName}
        </h3>
        <p style={{
          fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 12, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          Khám phá những điểm đến độc đáo của Việt Nam qua tour được thiết kế đặc biệt cho bạn.
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-light)" }}>Từ</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>
              {cost > 0 ? formatPrice(cost) : "Có sẵn"}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleBook}>
            Xem chi tiết
          </button>
        </div>
      </div>
    </Link>
  );
}
