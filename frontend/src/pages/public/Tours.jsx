import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTours, formatPrice } from "../../services/api";
import { Ic, EmptyState } from "../../components/UI";

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);
      const data = await getTours();
      setTours(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    loadTours();
  }, []);

  if (loading) return <div className="page-wrap">Đang tải...</div>;

  return (
    <div className="page-wrap">
      <h1 className="page-title">Khám phá Tour</h1>
      <p className="page-subtitle">Những hành trình tuyệt vời nhất đã sẵn sàng dành cho bạn</p>

      {tours.length === 0 ? (
        <EmptyState emoji="🏕️" title="Chưa có tour nào" desc="Quay lại sau để xem các tour mới nhất nhé!" />
      ) : (
        <div className="grid-3 stagger">
          {tours.map((tour) => (
            <div key={tour.tourId} className="anim-fadeUp" style={{ 
                background: "#fff", 
                borderRadius: "var(--radius-lg)", 
                overflow: "hidden", 
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                  <img 
                    src={tour.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80"} 
                    alt={tour.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <div style={{ 
                    position: "absolute", top: 12, right: 12, 
                    background: "rgba(255,255,255,0.9)", padding: "4px 10px", 
                    borderRadius: 20, fontSize: 12, fontWeight: 700, color: "var(--primary)"
                  }}>
                    ⭐ {tour.rating || "4.0"}
                  </div>
              </div>
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{tour.name}</h3>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 13, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Ic.Home style={{ width: 14 }} /> {tour.days || 3} ngày
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Ic.User style={{ width: 14 }} /> Khuyên dùng
                    </span>
                </div>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 16 }}>
                    <div>
                        <div style={{ fontSize: 11, color: "var(--text-light)", fontWeight: 600 }}>Giá từ</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(tour.price || 0)}</div>
                    </div>
                    <Link to={`/book/${tour.tourId}`} className="btn btn-primary btn-sm">Đặt ngay</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
