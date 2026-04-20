import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getLocationById,
  getProvinceById,
  getRecommendations,
  formatPrice,
  logInteraction,
} from "../../services/api";
import { Ic, StarRating, EmptyState } from "../../components/UI";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80";

export default function LocationDetail() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [province, setProvince] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadLocationData = async () => {
      setIsLoading(true);
      const loc = await getLocationById(id);
      if (loc) {
        setLocation(loc);
        const prov = await getProvinceById(loc.provinceId);
        setProvince(prov);
      }
      setIsLoading(false);
    };
    loadLocationData();

    // Chỉ tính là "view" nếu người dùng ở lại trang quá 5 giây
    let timer;
    if (user && id) {
      timer = setTimeout(() => {
        logInteraction(user.user_id, id, "view");
        console.log("Recorded view after 5 seconds");
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer); // Hủy nếu người dùng thoát trước 5s
    };
  }, [id, user]);

  useEffect(() => {
    if (!location) return;

    const loadRecommendations = async () => {
      setRecommendationsLoading(true);
      const data = await getRecommendations({
        userId: user?.user_id,
        locationId: location.locationId,
        topK: 5,
      });
      setRecommendations(data.recommendations || []);
      setRecommendationsLoading(false);
    };

    loadRecommendations();
  }, [location]);

  if (isLoading) {
    return <EmptyState emoji="⏳" title="Đang tải..." />;
  }

  if (!location) {
    return <div className="page-wrap">Không tìm thấy địa điểm.</div>;
  }

  const loc = location;

  return (
    <div>
      {/* Hero image */}
      <div
        style={{
          position: "relative",
          height: 420,
          overflow: "hidden",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <img
          src={loc.image || DEFAULT_IMAGE}
          alt={loc.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 40px 36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.75)",
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            <Link
              to="/locations"
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "underline",
              }}
            >
              Địa điểm
            </Link>
            <span>›</span>
            <span>{province?.name}</span>
            <span>›</span>
            <span>{loc.name}</span>
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: 40,
              fontWeight: 900,
              margin: "0 0 10px",
              fontFamily: "var(--font-display)",
              lineHeight: 1.1,
            }}
          >
            {loc.name}
          </h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
              }}
            >
              <Ic.Pin /> {province?.name}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                padding: "2px 12px",
                borderRadius: 20,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {loc.type}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="page-wrap"
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}
      >
        {/* Left */}
        <div>
          {/* Info cards */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              ["📍", "Tỉnh/thành", province?.name || "—"],
              [
                "🕐",
                "Thời điểm lý tưởng",
                loc.bestTimeToVisit || loc.niceTime || "—",
              ],
              [
                "💰",
                "Chi phí ước tính",
                formatPrice(loc.estimatedCost) + "/người",
              ],
            ].map(([e, l, v]) => (
              <div
                key={l}
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 18px",
                  flex: 1,
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{e}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-light)",
                    marginBottom: 4,
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: 28,
              border: "1px solid var(--border)",
              marginBottom: 32,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              Giới thiệu
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              {loc.description}
            </p>
          </div>

          {/* Suggested locations */}
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: 28,
              border: "1px solid var(--border)",
              marginBottom: 32,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              Gợi ý địa điểm khác
            </h2>
            {recommendationsLoading ? (
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                Đang tải gợi ý địa điểm...
              </p>
            ) : recommendations.length === 0 ? (
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                Chưa có đề xuất địa điểm phù hợp.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {recommendations.map((rec) => (
                  <Link
                    key={rec.locationId || rec.tourId}
                    to={`/locations/${rec.locationId || rec.tourId}`}
                    onClick={() => {
                      if (user && (rec.locationId || rec.tourId)) {
                        logInteraction(
                          user.user_id,
                          rec.locationId || rec.tourId,
                          "click",
                        );
                      }
                    }}
                    style={{
                      display: "block",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: 16,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            marginBottom: 6,
                          }}
                        >
                          {rec.tourName || rec.locationName}
                        </div>
                        <div
                          style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                          {rec.province || "Địa điểm mới"}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        {rec.estimatedPrice
                          ? new Intl.NumberFormat("vi-VN").format(
                              rec.estimatedPrice
                            ) + " đ"
                          : "Miễn phí"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div
          style={{
            position: "sticky",
            top: "calc(var(--nav-h) + 20px)",
            height: "fit-content",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg,var(--primary),var(--secondary))",
              borderRadius: "var(--radius-xl)",
              padding: 28,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Tạo tour khám phá</h3>
            <p
              style={{
                opacity: 0.85,
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Tạo tour của riêng bạn và thêm địa điểm này vào hành trình du
              lịch.
            </p>
            <Link
              to={user ? `/create-tour` : "/login"}
              className="btn"
              style={{
                width: "100%",
                background: "#fff",
                color: "var(--primary)",
                fontWeight: 700,
                justifyContent: "center",
              }}
            >
              {user ? "Tạo tour mới" : "Đăng nhập"}
            </Link>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 22,
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
              Thông tin nhanh
            </h4>
            {[
              ["🏙️ Tỉnh/thành:", province?.name || "—"],
              ["🏷️ Loại hình:", loc.type],
              ["💰 Chi phí từ:", formatPrice(loc.estimatedCost)],
              ["🌤️ Lý tưởng:", loc.bestTimeToVisit || loc.niceTime || "—"],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-light)",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
