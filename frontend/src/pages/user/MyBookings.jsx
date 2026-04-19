import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { EmptyState } from "../../components/UI";
import { formatPrice } from "../../services/api";
import BookingDetail from "./BookingDetail";

export default function MyBookings() {
  const { user } = useAuth();
  const { bookings, loading, fetchBookings, updateStatus } = useBooking();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      fetchBookings(user.user_id);
    }
  }, [user]);

  const handleCancelBooking = async () => {
    if (selectedBooking) {
      await updateStatus(selectedBooking.bookingId, "CANCELLED");
      setShowCancelConfirm(false);
      setSelectedBooking(null);
    }
  };

  const getStatusColor = (status) => {
    return { bg: "#dcfce7", color: "#166534" }; // Always green/success
  };

  const statusMap = {
    "SUCCESSFUL": "Thành công",
  };

  if (loading && bookings.length === 0) return <div className="page-wrap">Đang tải...</div>;

  return (
    <div className="page-wrap">
      <h1 className="page-title">Lịch sử đặt tour</h1>
      <p className="page-subtitle">Xem lại các hành trình bạn đã đặt thành công</p>

      {bookings.length === 0 ? (
        <EmptyState emoji="📋" title="Chưa có tour nào" desc="Khám phá và đặt các tour du lịch hấp dẫn ngay!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bookings.map((b) => {
            const statusStyle = getStatusColor(b.status);
            return (
              <div key={b.bookingId} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)", padding: "22px 26px",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                      {b.tour?.name || "Tour du lịch"}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Mã đặt tour: #{b.bookingId}</p>
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: statusStyle.bg, color: statusStyle.color
                  }}>
                    Thành công
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16, padding: "12px 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
                  {[
                    ["Ngày đặt", new Date(b.bookingDate).toLocaleDateString("vi-VN")],
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
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedBooking(b)}
                  >
                    Xem chi tiết thanh toán
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedBooking && (
        <BookingDetail 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
