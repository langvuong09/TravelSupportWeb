import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mockReviews, mockTours, getTour, formatPrice } from "../../data/mockData";
import { StarRating, EmptyState } from "../../components/UI";

export default function MyReviews() {
  const { user } = useAuth();
  const myReviews = mockReviews.filter(r => r.userId === user.userId);

  const [form, setForm]      = useState({ tourId: "", rating: 5, comment: "" });
  const [reviews, setReviews] = useState(myReviews);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.comment.trim() || !form.tourId) return;
    const newR = {
      id: "r_" + Date.now(), userId: user.userId,
      rating: form.rating, comment: form.comment,
      createdAt: new Date().toISOString().split("T")[0],
      tourId: parseInt(form.tourId),
    };
    setReviews([newR, ...reviews]);
    setForm({ tourId: "", rating: 5, comment: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page-wrap">
      <h1 className="page-title">Đánh giá của tôi</h1>
      <p className="page-subtitle">Chia sẻ trải nghiệm du lịch của bạn</p>

      {/* Write review */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, marginBottom: 28, boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>✏️ Viết đánh giá mới</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="field-label">Chọn tour</label>
            <select
              className="input-field"
              value={form.tourId}
              onChange={e => setForm({ ...form, tourId: e.target.value })}
              required
            >
              <option value="">-- Chọn tour đã tham gia --</option>
              {mockTours.map(t => (
                <option key={t.tourId} value={t.tourId}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Đánh giá sao</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s} type="button"
                  onClick={() => setForm({ ...form, rating: s })}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 32, color: s <= form.rating ? "#f59e0b" : "#e2e8f0",
                    transition: "color 0.15s, transform 0.1s",
                    transform: s <= form.rating ? "scale(1.1)" : "scale(1)",
                  }}
                >★</button>
              ))}
              <span style={{ fontSize: 14, color: "var(--text-muted)", alignSelf: "center", marginLeft: 8 }}>
                {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"][form.rating]}
              </span>
            </div>
          </div>

          <div>
            <label className="field-label">Nhận xét của bạn</label>
            <textarea
              className="input-field"
              rows={4}
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
              style={{ resize: "vertical" }}
              required
            />
          </div>

          {submitted && (
            <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#16a34a" }}>
              ✓ Đánh giá của bạn đã được gửi thành công!
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary">Gửi đánh giá</button>
          </div>
        </form>
      </div>

      {/* Review list */}
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Lịch sử đánh giá ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <EmptyState emoji="⭐" title="Chưa có đánh giá nào" desc="Hãy chia sẻ trải nghiệm sau chuyến du lịch của bạn!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map(r => {
            const tour = getTour(r.tourId);
            return (
              <div key={r.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700, marginBottom: 6 }}>
                      🏕️ {tour?.name || "Tour không xác định"}
                    </div>
                    <StarRating rating={r.rating} size={15} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-light)" }}>{r.createdAt}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{r.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
