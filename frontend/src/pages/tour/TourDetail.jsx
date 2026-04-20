import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTourFullDetails, formatPrice } from "../../services/api";
import { Ic, EmptyState } from "../../components/UI";

export default function TourDetail() {
  const { tourId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getTourFullDetails(tourId);
      setData(res);
      setLoading(false);
    };
    loadData();
  }, [tourId]);

  if (loading) return <div className="page-wrap">Đang tải chi tiết hành trình...</div>;
  if (!data || data.error) return (
    <div className="page-wrap">
       <EmptyState emoji="🚫" title="Không tìm thấy" desc="Hành trình này không tồn tại hoặc đã bị xóa." />
       <Link to="/my-bookings" className="btn btn-primary" style={{ marginTop: 20 }}>Quay lại danh sách</Link>
    </div>
  );

  const { tour, provinces, locations, foods, transports } = data;
  const thumbnail = locations?.[0]?.image || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80";

  return (
    <div className="page-wrap">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "var(--text-muted)" }}>
        <Link to="/my-bookings" style={{ color: "var(--primary)" }}>Hành trình của tôi</Link>
        <span>›</span>
        <span>Chi tiết</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>{tour.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        {/* CỘT TRÁI - CHI TIẾT */}
        <div>
           {/* Header & Image */}
           <div style={{ background: "#fff", borderRadius: 24, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 32 }}>
              <div style={{ height: 350, position: "relative" }}>
                 <img src={thumbnail} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                 <div style={{ position: "absolute", bottom: 24, left: 32 }}>
                    <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{tour.name}</h1>
                    <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                       <span>⏱️ {tour.days} ngày</span>
                       <span>📍 {provinces?.length || 0} tỉnh thành</span>
                    </div>
                 </div>
              </div>

              <div style={{ padding: 32 }}>
                 <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    🗺️ Hành trình khám phá
                 </h2>
                 
                 <div style={{ display: "flex", flexDirection: "column", gap: 32, position: "relative" }}>
                    {/* Dòng line nối các bước */}
                    <div style={{ position: "absolute", top: 10, bottom: 10, left: 15, width: 2, background: "var(--border-light)", zIndex: 0 }} />

                    {provinces.map((p, idx) => (
                       <div key={idx} style={{ display: "flex", gap: 24, position: "relative", zIndex: 1 }}>
                          <div style={{ 
                             width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", 
                             color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                             fontSize: 14, fontWeight: 800, flexShrink: 0
                          }}>
                             {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                             <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12, color: "var(--primary)" }}>{p.province?.name}</h3>
                             
                             {/* Địa điểm tại tỉnh này */}
                             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                                {locations.filter(l => String(l.provinceId) === String(p.province?.provinceId)).map(loc => (
                                   <div key={loc.locationId} style={{ background: "#f8fafc", padding: 12, borderRadius: 12, display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-light)" }}>
                                      <img src={loc.image} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                                      <span style={{ fontSize: 13, fontWeight: 600 }}>{loc.name}</span>
                                   </div>
                                ))}
                             </div>

                             {/* Ẩm thực tại tỉnh này */}
                             {foods.filter(f => String(f.provinceId) === String(p.province?.provinceId)).length > 0 && (
                                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                   {foods.filter(f => String(f.provinceId) === String(p.province?.provinceId)).map(f => (
                                      <span key={f.foodId} style={{ fontSize: 12, background: "#fff", border: "1.5px solid var(--primary-light)", color: "var(--primary)", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                                         🍱 {f.name}
                                      </span>
                                   ))}
                                </div>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* CỘT PHẢI - TỔNG QUAN */}
        <aside>
           <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 24, padding: 24, position: "sticky", top: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Tổng quan chi phí</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-muted)" }}>Số ngày đi</span>
                    <span style={{ fontWeight: 700 }}>{tour.days} ngày</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-muted)" }}>Tổng địa điểm</span>
                    <span style={{ fontWeight: 700 }}>{locations?.length || 0}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-muted)" }}>Phương tiện</span>
                    <span style={{ fontWeight: 700 }}>{transports?.[0]?.transportName || "Tự túc"}</span>
                 </div>
              </div>

              <div style={{ borderTop: "2px solid var(--border-light)", paddingTop: 16 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Tổng chi phí dự kiến</span>
                    <span style={{ fontSize: 24, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(tour.price)}</span>
                 </div>
              </div>

              <div style={{ marginTop: 24, padding: 16, background: "var(--bg-light)", borderRadius: 16, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                 💡 Đây là mức giá ước tính dựa trên các địa điểm và dịch vụ bạn đã chọn. Chi phí thực tế có thể thay đổi tùy thời điểm.
              </div>
              
              <Link to="/my-bookings" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
                 Quay lại danh sách
              </Link>
           </div>
        </aside>
      </div>
    </div>
  );
}
