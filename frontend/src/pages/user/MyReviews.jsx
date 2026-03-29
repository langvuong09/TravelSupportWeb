import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  mockReviews, mockBookings, mockTours,
  getTourThumbnail, getLocationsByTour, getProvincesByTour,
} from "../../data/mockData";
import { Ic, StarRating, EmptyState } from "../../components/UI";

/* ───────── Star picker ───────── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 26, padding: 0, lineHeight: 1,
            color: s <= (hover || value) ? "#f59e0b" : "#d1d5db",
            transition: "color .15s",
          }}
        >★</button>
      ))}
    </div>
  );
}

/* ───────── Write-review modal ───────── */
function ReviewModal({ booking, onClose, onSubmit }) {
  const tour      = mockTours.find((t) => t.tourId === booking.tourId);
  const thumbnail = getTourThumbnail(booking.tourId);
  const provinces = getProvincesByTour(booking.tourId);

  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState("");

  const submit = () => {
    if (!comment.trim()) return;
    onSubmit({ tourId: booking.tourId, rating, comment });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}>
      <div style={{
        background: "#fff", borderRadius: "var(--radius-xl)",
        padding: 32, width: "100%", maxWidth: 480,
        boxShadow: "var(--shadow-xl)",
      }}>
        {/* Tour mini-card */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          <img src={thumbnail} alt={tour?.name} style={{ width: 72, height: 56, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{tour?.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{provinces.map((p) => p.name).join(" → ")}</div>
          </div>
        </div>

        <label className="field-label" style={{ marginBottom: 10, display: "block" }}>Đánh giá của bạn</label>
        <StarPicker value={rating} onChange={setRating} />

        <label className="field-label" style={{ marginTop: 18, marginBottom: 6, display: "block" }}>Nhận xét</label>
        <textarea
          className="input-field"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chuyến đi như thế nào? Chia sẻ trải nghiệm của bạn..."
          style={{ resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>Huỷ</button>
          <button onClick={submit} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={!comment.trim()}>
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Main page ───────── */
export default function MyReviews() {
  const { user } = useAuth();

  // Reviews của user này (tourId là string)
  const myReviews   = mockReviews.filter((r) => r.userId === user?.userId);
  const reviewedIds = new Set(myReviews.map((r) => r.tourId));

  // Bookings đã hoàn thành, chưa đánh giá
  const reviewable  = mockBookings.filter(
    (b) => b.userId === user?.userId &&
           b.status === "confirmed" &&
           !reviewedIds.has(b.tourId),
  );

  const [modal,    setModal]    = useState(null); // booking object
  const [reviews,  setReviews]  = useState(myReviews);
  const [editing,  setEditing]  = useState(null);
  const [editData, setEditData] = useState({});

  const handleSubmit = (data) => {
    setReviews((prev) => [...prev, {
      id: `R${Date.now()}`, userId: user.userId, createdAt: "Vừa xong", ...data,
    }]);
  };

  return (
    <div className="page-wrap">
      <h1 className="page-title">Đánh giá của tôi</h1>
      <p className="page-subtitle">Chia sẻ trải nghiệm để giúp cộng đồng</p>

      {/* Tours có thể đánh giá */}
      {reviewable.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, var(--primary-light), #eff6ff)",
          border: "1.5px solid var(--primary-border)",
          borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 28,
        }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: "var(--primary)" }}>
            ✍️ Bạn chưa đánh giá {reviewable.length} tour
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reviewable.map((b) => {
              const tour      = mockTours.find((t) => t.tourId === b.tourId);
              const thumbnail = getTourThumbnail(b.tourId);
              const provinces = getProvincesByTour(b.tourId);
              if (!tour) return null;
              return (
                <div key={b.bookingId} style={{
                  background: "#fff", borderRadius: "var(--radius-md)",
                  padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <img src={thumbnail} alt={tour.name} style={{ width: 56, height: 44, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{tour.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{provinces.map((p) => p.name).join(" → ")}</div>
                  </div>
                  <button onClick={() => setModal(b)} className="btn btn-primary btn-sm">
                    Viết đánh giá
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danh sách đánh giá đã viết */}
      {reviews.length === 0 ? (
        <EmptyState emoji="✍️" title="Chưa có đánh giá nào" desc="Hãy chia sẻ trải nghiệm sau chuyến đi!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((r) => {
            const tour      = mockTours.find((t) => t.tourId === r.tourId);
            const thumbnail = getTourThumbnail(r.tourId);
            const provinces = getProvincesByTour(r.tourId);
            const locations = getLocationsByTour(r.tourId);
            const isEdit    = editing === r.id;

            return (
              <div key={r.id} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: 22,
                boxShadow: "var(--shadow-sm)",
              }}>
                {/* Header */}
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <img src={thumbnail} alt={tour?.name} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--primary)" }}>
                      {tour?.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 6px" }}>
                      {provinces.map((p) => p.name).join(" → ")}
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-light)" }}>{r.createdAt}</div>
                </div>

                {/* Location chips */}
                {locations.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {locations.slice(0, 4).map((loc) => (
                      <span key={loc.locationId} style={{
                        background: "var(--surface)", border: "1px solid var(--border-light)",
                        borderRadius: 20, fontSize: 11, padding: "2px 10px", color: "var(--text-muted)",
                      }}>📍 {loc.name}</span>
                    ))}
                  </div>
                )}

                {/* Comment – view / edit */}
                {isEdit ? (
                  <div>
                    <StarPicker value={editData.rating} onChange={(v) => setEditData({ ...editData, rating: v })} />
                    <textarea
                      className="input-field"
                      rows={3}
                      style={{ marginTop: 10, resize: "vertical" }}
                      value={editData.comment}
                      onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button onClick={() => setEditing(null)} className="btn btn-outline btn-sm">Huỷ</button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, ...editData } : x));
                          setEditing(null);
                        }}
                      >Lưu</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
                    <button
                      onClick={() => { setEditing(r.id); setEditData({ rating: r.rating, comment: r.comment }); }}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: 12 }}
                    >
                      <Ic.Edit /> Chỉnh sửa
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <ReviewModal
          booking={modal}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
