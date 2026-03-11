import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockLocations, mockLocationDetails, mockTours, mockReviews, formatPrice } from "../../data/mockData";
import LocationCard from "../../components/LocationCard";
import TourCard from "../../components/TourCard";
import { Ic, StarRating } from "../../components/UI";
import "./Home.css";

const STATS = [
  { emoji: "🗺️", value: "8+",    label: "Địa điểm nổi bật" },
  { emoji: "🏕️", value: "20+",   label: "Tour du lịch" },
  { emoji: "👥", value: "1,200+", label: "Khách hàng" },
  { emoji: "⭐", value: "4.8",    label: "Đánh giá trung bình" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) nav(`/locations?q=${encodeURIComponent(search.trim())}`);
  };

  const featuredLocations = mockLocations.slice(0, 6);
  const featuredTours     = mockTours.slice(0, 3);
  const recentReviews     = mockReviews.slice(0, 3);

  const getUserName = (userId) => {
    const users = { 2: "Nguyễn Thị Lan", 3: "Trần Văn Minh", 4: "Lê Thu Hương" };
    return users[userId] || "Khách hàng";
  };
  const getTourName = (tourId) => mockTours.find(t => t.tourId === tourId)?.name || "";

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80" alt="hero" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <p className="hero-eyebrow anim-fadeUp">🇻🇳 Khám phá Việt Nam</p>
          <h1 className="hero-title anim-fadeUp" style={{ animationDelay: "0.1s" }}>
            Hành trình đẹp nhất<br />bắt đầu từ đây
          </h1>
          <p className="hero-sub anim-fadeUp" style={{ animationDelay: "0.2s" }}>
            Tìm kiếm, khám phá và đặt tour đến hàng trăm địa điểm du lịch tuyệt đẹp trên khắp Việt Nam
          </p>

          {/* Search bar */}
          <form className="hero-search anim-fadeUp" style={{ animationDelay: "0.3s" }} onSubmit={handleSearch}>
            <Ic.Search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm địa điểm, tỉnh thành, tour..."
            />
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
          </form>

          {/* Quick tags */}
          <div className="hero-tags anim-fadeUp" style={{ animationDelay: "0.4s" }}>
            {["Hạ Long", "Hội An", "Đà Lạt", "Sapa", "Phú Quốc"].map(tag => (
              <button key={tag} onClick={() => nav(`/locations?q=${tag}`)} className="hero-tag">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid stagger">
            {STATS.map(s => (
              <div key={s.label} className="stat-card anim-fadeUp">
                <div className="stat-emoji">{s.emoji}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Locations ── */}
      <section className="section container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h2 className="section-title">Địa điểm nổi bật</h2>
            <p className="section-sub">Những điểm đến hấp dẫn nhất Việt Nam</p>
          </div>
          <Link to="/locations" className="btn btn-outline btn-sm">Xem tất cả <Ic.Arrow /></Link>
        </div>
        <div className="grid-3 stagger">
          {featuredLocations.map(loc => {
            const detail = mockLocationDetails.find(d => d.locationId === loc.locationId);
            return detail ? (
              <div key={loc.locationId} className="anim-fadeUp">
                <LocationCard location={loc} detail={detail} />
              </div>
            ) : null;
          })}
        </div>
      </section>

      {/* ── Featured Tours ── */}
      <section className="section tours-section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h2 className="section-title">Tour hot nhất</h2>
              <p className="section-sub">Được yêu thích và đặt nhiều nhất</p>
            </div>
            <Link to="/tours" className="btn btn-outline btn-sm">Xem tất cả <Ic.Arrow /></Link>
          </div>
          <div className="grid-3 stagger">
            {featuredTours.map(tour => (
              <div key={tour.tourId} className="anim-fadeUp">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="section container">
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-title">Khách hàng nói gì</h2>
          <p className="section-sub">Đánh giá thật từ những chuyến đi thật</p>
        </div>
        <div className="reviews-grid stagger">
          {recentReviews.map(r => (
            <div key={r.id} className="review-card card anim-fadeUp">
              <div className="review-header">
                <div className="review-avatar">{getUserName(r.userId)[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{getUserName(r.userId)}</div>
                  <StarRating rating={r.rating} size={13} />
                </div>
                <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-light)" }}>{r.createdAt}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginBottom: 8 }}>
                🏕️ {getTourName(r.tourId)}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                Sẵn sàng cho chuyến đi tiếp theo?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>
                Đăng ký ngay để nhận ưu đãi và khám phá hàng trăm tour hấp dẫn
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <Link to="/tours" className="btn" style={{ background: "#fff", color: "var(--primary)", fontWeight: 700 }}>
                Xem tour ngay
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}>
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
