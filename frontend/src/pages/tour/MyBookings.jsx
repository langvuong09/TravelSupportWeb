import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTours, formatPrice } from "../../services/api";
import { Ic, EmptyState } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getMyTours(user.user_id);
      setTours(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    loadTours();
  }, [user]);

  if (loading) return <div className="page-wrap"><div className="loading-spinner"></div> Đang tải hành trình...</div>;
  if (!user) return <div className="page-wrap">Vui lòng đăng nhập để xem hành trình.</div>;

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>Hành trình của tôi</h1>
        <p className="page-subtitle" style={{ color: "var(--text-muted)" }}>
          Quản lý các tour du lịch bạn đã tạo và thiết kế
        </p>
      </div>

      {tours.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: "20px", border: "1px dashed var(--border)" }}>
          <EmptyState emoji="🗺️" title="Chưa có hành trình nào" desc="Bạn chưa thiết kế hành trình nào cho riêng mình." />
          <Link to="/create-tour" className="btn btn-primary" style={{ marginTop: 24 }}>Thiết kế ngay →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "80px 1fr 100px 150px 120px", 
            gap: 20,
            padding: "0 24px",
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-light)",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }} className="hide-mobile">
            <span style={{ paddingLeft: 0 }}>Ảnh</span>
            <span>Thông tin Tour</span>
            <span style={{ textAlign: "center" }}>Thời gian</span>
            <span style={{ textAlign: "center" }}>Tổng chi phí</span>
            <span style={{ textAlign: "right" }}>Thao tác</span>
          </div>

          {/* Danh sách hành trình */}
          {tours.map((tour) => (
            <div key={tour.tourId} style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              border: "1px solid var(--border)",
              padding: "16px 24px",
              display: "grid",
              gridTemplateColumns: "80px 1fr 100px 150px 120px",
              alignItems: "center",
              gap: 20,
              transition: "all 0.2s ease",
              cursor: "pointer"
            }} className="booking-item-row"
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
            }}>
              {/* Thumbnail */}
              <div style={{ width: 80, height: 60, borderRadius: 10, overflow: "hidden", background: "#f1f5f9" }}>
                <img 
                  src={tour.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&q=80"} 
                  alt={tour.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Name & ID */}
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{tour.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Ic.Bookmark style={{ width: 12 }} /> {tour.tourId}
                </div>
              </div>

              {/* Duration */}
              <div style={{ fontWeight: 700, fontSize: 15, textAlign: "center", color: "var(--text)" }}>
                {tour.days || 3} ngày
              </div>

              {/* Price */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 900, color: "var(--primary)", fontSize: 17 }}>
                  {formatPrice(tour.price || 0)}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-light)", fontWeight: 600 }}>Dự kiến</div>
              </div>

              {/* Actions */}
              <div style={{ textAlign: "right" }}>
                <Link 
                  to={`/tours/${tour.tourId}`} 
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 12, padding: "8px 16px", boxShadow: "0 4px 12px rgba(var(--primary-rgb), 0.2)" }}
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
