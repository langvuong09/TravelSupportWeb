import { useState } from "react";

export default function BookingDetail({ booking, onClose, onCancel }) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  
  const formatPrice = (num) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          maxWidth: 600,
          width: "100%",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: 0, marginBottom: 8 }}>
              {booking.tourName || "Chi tiết đặt tour"}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Mã: {booking.id}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Thông tin cơ bản */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>
              Ngày tạo
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{booking.bookingDate}</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>
              Số người
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              {booking.numberOfPeople} người
            </div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>
              Tổng tiền
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>
              {formatPrice(booking.totalPrice)}
            </div>
          </div>
        </div>

        {/* Chi tiết tour */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
            Chi tiết tour
          </h3>

          {/* Tỉnh/thành phố */}
          {booking.provinces && booking.provinces.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                TỈNH/THÀNH PHỐ
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {booking.provinces.map((prov) => (
                  <div
                    key={prov.id}
                    style={{
                      padding: "6px 12px",
                      background: "var(--primary)",
                      color: "#fff",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {prov.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Địa điểm theo tỉnh */}
          {booking.locations && Object.keys(booking.locations).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                ĐỊA ĐIỂM THAM QUAN
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(booking.locations).map(([provId, locations]) => (
                  <div key={provId}>
                    {locations.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {locations.map((loc) => (
                          <div
                            key={loc.id}
                            style={{
                              padding: "4px 10px",
                              background: "#e0f2fe",
                              color: "#0369a1",
                              borderRadius: "var(--radius-sm)",
                              fontSize: 12,
                            }}
                          >
                            📍 {loc.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thực ăn theo tỉnh */}
          {booking.foods && Object.keys(booking.foods).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                NHÀ HÀNG ĐẶC BIỆT
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(booking.foods).map(([provId, foods]) => (
                  <div key={provId}>
                    {foods.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {foods.map((food) => (
                          <div
                            key={food.id}
                            style={{
                              padding: "4px 10px",
                              background: "#fef3c7",
                              color: "#92400e",
                              borderRadius: "var(--radius-sm)",
                              fontSize: 12,
                            }}
                          >
                            🍽️ {food.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loại vận chuyển */}
          {booking.transports && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                LOẠI VẬN CHUYỂN
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.isArray(booking.transports) ? (
                  // Format mới: array của các route
                  booking.transports.length > 0 ? (
                    booking.transports.map((route, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 14px",
                          background: "#f3f4f6",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          fontSize: 13,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>
                          {route.from?.name} → {route.to?.name}
                        </div>
                        <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6, color: "var(--primary)" }}>
                          <span style={{ fontSize: 16 }}>{route.transport?.icon}</span>
                          <span>{route.transport?.name}</span>
                        </div>
                      </div>
                    ))
                  ) : null
                ) : (
                  // Format cũ: object của các đường
                  Object.entries(booking.transports).map(([key, transport]) => (
                    transport && (
                      <div
                        key={key}
                        style={{
                          padding: "8px 12px",
                          background: "#f3f4f6",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {transport.icon} {transport.name}
                      </div>
                    )
                  ))
                )}
              </div>
            </div>
          )}

          {/* Ước tính chi phí */}
          {booking.estimate && (
            <div
              style={{
                background: "var(--bg)",
                borderRadius: "var(--radius-sm)",
                padding: 12,
                marginTop: 20,
              }}
            >
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                ƯỚC TÍNH CHI PHÍ
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {booking.estimate.accommodation > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span>Lưu trú:</span>
                    <span style={{ fontWeight: 700 }}>{formatPrice(booking.estimate.accommodation)}</span>
                  </div>
                )}
                {booking.estimate.food > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span>Ăn uống:</span>
                    <span style={{ fontWeight: 700 }}>{formatPrice(booking.estimate.food)}</span>
                  </div>
                )}
                {booking.estimate.transport > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span>Vận chuyển:</span>
                    <span style={{ fontWeight: 700 }}>{formatPrice(booking.estimate.transport)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    fontWeight: 800,
                    paddingTop: 8,
                    borderTop: "1px solid var(--border)",
                    color: "var(--primary)",
                  }}
                >
                  <span>Tổng:</span>
                  <span>{formatPrice(booking.estimate.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
