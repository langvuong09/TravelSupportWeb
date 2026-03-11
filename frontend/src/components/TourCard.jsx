import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ic, StarRating } from "./UI";
import { formatPrice, getLocation, getLocationDetail, avgRating } from "../data/mockData";

export default function TourCard({ tour }) {
  const loc    = getLocation(tour.locationId);
  const detail = getLocationDetail(tour.locationId);
  const rating = avgRating(tour.tourId);
  const { user } = useAuth();
  const nav = useNavigate();

  const nights = Math.max(
    0,
    Math.round((new Date(tour.endDate) - new Date(tour.startDate)) / 86400000)
  );
  const duration = nights === 0 ? "1 ngày" : `${nights + 1}N${nights}Đ`;

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
          src={detail?.image}
          alt={tour.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
          borderRadius: 8, padding: "4px 10px",
          color: "#fff", fontSize: 12, fontWeight: 700,
        }}>
          {duration}
        </div>
        {rating > 0 && (
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
          <Ic.Pin /> {loc?.name}, {loc?.province}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>
          {tour.name}
        </h3>
        <p style={{
          fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 12, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {tour.description}
        </p>

        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-light)", marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Ic.Calendar /> {tour.startDate}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Ic.People /> Tối đa {tour.maxParticipants}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 14 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(tour.price)}</span>
            <span style={{ fontSize: 11, color: "var(--text-light)", marginLeft: 3 }}>/người</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleBook}
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </Link>
  );
}
