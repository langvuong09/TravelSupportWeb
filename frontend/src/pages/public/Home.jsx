import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLocations } from "../../services/api";
import LocationCard from "../../components/LocationCard";
import { Ic, StarRating } from "../../components/UI";
import "./Home.css";

const STATS = [
  { emoji: "🗺️", value: "9+",    label: "Địa điểm nổi bật" },
  { emoji: "🏕️", value: "7+",   label: "Tour du lịch" },
  { emoji: "👥", value: "1,200+", label: "Khách hàng" },
  { emoji: "⭐", value: "4.7",    label: "Đánh giá trung bình" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      const res = await getLocations({ size: 6 }); // Only need 6 for featured
      setLocations(res.content || []);
      setIsLoading(false);
    };
    loadLocations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
      nav("/login");
      return;
    }
    if (search.trim()) nav(`/locations?q=${encodeURIComponent(search.trim())}`);
  };

  const featuredLocations = Array.isArray(locations) ? locations : [];

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

          <form className="hero-search anim-fadeUp" style={{ animationDelay: "0.3s" }} onSubmit={handleSearch}>
            <Ic.Search />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm địa điểm, tỉnh thành, tour..."
            />
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
          </form>

          <div className="hero-tags anim-fadeUp" style={{ animationDelay: "0.4s" }}>
            {["Hạ Long", "Hội An", "Đà Lạt", "Sapa", "Phú Quốc"].map((tag) => (
              <button
                key={tag}
                onClick={() => user ? nav(`/locations?q=${tag}`) : nav("/login")}
                className="hero-tag"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner đăng nhập cho khách ── */}
      {!user && (
        <div style={{
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
          flexWrap: "wrap",
        }}>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>
            🔒 Đăng nhập để xem địa điểm, tour và đặt chuyến đi!
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" className="btn btn-sm" style={{ background: "#fff", color: "#0ea5e9", fontWeight: 700 }}>
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-sm btn-outline" style={{ borderColor: "rgba(255,255,255,0.7)", color: "#fff" }}>
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid stagger">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card anim-fadeUp">
                <div className="stat-emoji">{s.emoji}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Locations (preview – blur nếu chưa login) ── */}
      <section className="section container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h2 className="section-title">Địa điểm nổi bật</h2>
            <p className="section-sub">Những điểm đến hấp dẫn nhất Việt Nam</p>
          </div>
          {user
            ? <Link to="/locations" className="btn btn-outline btn-sm">Xem tất cả <Ic.Arrow /></Link>
            : <Link to="/login"     className="btn btn-primary btn-sm">Đăng nhập để xem <Ic.Arrow /></Link>
          }
        </div>

        {user ? (
          <div className="grid-3 stagger">
            {featuredLocations.map((loc) => (
              <div key={loc.locationId} className="anim-fadeUp">
                <LocationCard location={loc} />
              </div>
            ))}
          </div>
        ) : (
          /* Preview mờ khi chưa đăng nhập */
          <div style={{ position: "relative" }}>
            <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }} className="grid-3">
              {featuredLocations.slice(0, 3).map((loc) => (
                <div key={loc.locationId}>
                  <LocationCard location={loc} />
                </div>
              ))}
            </div>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 14,
            }}>
              <div style={{ fontSize: 40 }}>🔒</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Đăng nhập để xem địa điểm</p>
              <Link to="/login" className="btn btn-primary">Đăng nhập ngay</Link>
            </div>
          </div>
        )}
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
              {user ? (
                <Link to="/create-tour" className="btn" style={{ background: "#fff", color: "var(--primary)", fontWeight: 700 }}>
                  Tạo tour
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn" style={{ background: "#fff", color: "var(--primary)", fontWeight: 700 }}>
                    Đăng ký miễn phí
                  </Link>
                  <Link to="/login" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}>
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}