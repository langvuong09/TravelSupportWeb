import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { EmptyState } from "../../components/UI";
import BookingDetail from "./BookingDetail";

export default function MyBookings() {
  const { user } = useAuth();
  const { getBookingsByUser, deleteBooking } = useBooking();
  const bookings = getBookingsByUser(user.userId);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatPrice = (num) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);

  const handleDeleteBooking = () => {
    deleteBooking(selectedBooking.id);
    setShowDeleteConfirm(false);
    setSelectedBooking(null);
  };

  return (
    <div className="page-wrap">
      <h1 className="page-title">Đặt tour của tôi</h1>
      <p className="page-subtitle">Quản lý tất cả các tour</p>

      {bookings.length === 0 ? (
        <EmptyState emoji="📋" title="Chưa có tour nào" desc="Tạo tour tùy chỉnh và khám phá ngay!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bookings.map((b) => (
            <div key={b.id} style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)", padding: "22px 26px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                    {b.tourName || "Tour tùy chỉnh"}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>ID: {b.tourId}</p>
                </div>
                <div style={{ background: "#dbeafe", color: "#0284c7", padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 700 }}>
                  ✓ Đã xác nhận
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16, padding: "12px 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
                {[
                  ["Ngày đặt", b.bookingDate],
                  ["Số người", `${b.numberOfPeople} người`],
                  ["Tổng tiền", formatPrice(b.totalPrice)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {b.status === "completed" && (
                  <button className="btn btn-sm" style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }}>
                    Viết đánh giá
                  </button>
                )}
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedBooking(b);
                    setShowDeleteConfirm(true);
                  }}
                >
                  Hủy tour
                </button>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedBooking(b)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xem chi tiết - sử dụng BookingDetail component */}
      {selectedBooking && !showDeleteConfirm && (
        <BookingDetail 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
          onCancel={() => setShowDeleteConfirm(true)}
        />
      )}

      {/* Modal xác nhận hủy */}
      {showDeleteConfirm && selectedBooking && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setShowDeleteConfirm(false)}
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
              maxWidth: 400,
              width: "100%",
              boxShadow: "var(--shadow-lg)",
              zIndex: 1002,
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Xác nhận hủy đặt?</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
              Bạn có chắc muốn hủy đặt tour này? Không thể hoàn tác hành động này.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline btn-sm"
              >
                Không hủy
              </button>
              <button
                onClick={handleDeleteBooking}
                className="btn btn-danger btn-sm"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatPrice(num) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}
