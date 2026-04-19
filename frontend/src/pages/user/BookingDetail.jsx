import { useState } from "react";

export default function BookingDetail({ booking, onClose }) {
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
              Hóa đơn đặt tour
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Giao dịch: #{booking.bookingId}</p>
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
              Ngày thanh toán
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>
              Số hành khách
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              {booking.numberOfPeople} người
            </div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 4, fontWeight: 600 }}>
              Trạng thái
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>
              Thành công
            </div>
          </div>
        </div>

        {/* Nội dung tour */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
            {booking.tour?.name || "Chi tiết hành trình"}
          </h3>
          
          <div style={{ background: "var(--bg)", padding: 18, borderRadius: "var(--radius-md)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Họ tên khách hàng:</span>
                  <span style={{ fontWeight: 700 }}>{booking.fullName}</span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Số điện thoại:</span>
                  <span style={{ fontWeight: 700 }}>{booking.phone}</span>
              </div>
              <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Email:</span>
                  <span style={{ fontWeight: 700 }}>{booking.email}</span>
              </div>
          </div>
          
          <div style={{ 
              background: "var(--primary-light)", 
              padding: 20, 
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
           }}>
              <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Tổng cộng thanh toán</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "var(--primary)" }}>{formatPrice(booking.totalPrice)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 600 }}>Phương thức</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Chuyển khoản / Tiền mặt</div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, marginTop: 32, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-primary" style={{ minWidth: 120 }}>
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
