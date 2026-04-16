import { useMemo, useState } from "react";
// Simple FormField component for label + children layout
function FormField({ label, children }) {
  return (
    <label className="ai-form-field">
      <span className="ai-form-label">{label}</span>
      {children}
    </label>
  );
}
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../services/api";
import { parseProvinceNamesToIds } from "../services/locationHelpers";
import { Ic } from "./UI";
import "./ChatboxAI.css";

const DEFAULT_WELCOME = {
  id: "m0",
  role: "ai",
  text: "Xin chào bạn. Mình là Travel AI Assistant, sẵn sàng gợi ý tour phù hợp theo ngân sách, số ngày và sở thích của bạn.",
};

const QUICK_QUESTIONS = [
  "Gợi ý tour biển dưới 2 triệu",
  "Đi 3 ngày ở Hồ Chí Minh nên đi đâu?",
  "Lịch trình nghỉ dưỡng cho cặp đôi",
  "Tour khám phá cho nhóm bạn 4 người",
];

function fmtScore(value) {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return value.toFixed(2);
}

export default function ChatboxAI() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([DEFAULT_WELCOME]);
  const [loading, setLoading] = useState(false);
  const [modelTag, setModelTag] = useState("");
  const [pref, setPref] = useState({
    provinceInput: "",
    budget: "any",
    days: 3,
    style: "any",
    participants: 1,
    topK: 1,
  });

  function pushAIMessage(msg) {
    setMessages((prev) => [
      ...prev,
      {
        id: `ai_${Date.now()}`,
        role: "ai",
        ...msg,
      },
    ]);
  }

  // Cho phép người dùng nhập "tỉnh: Hà Nội, Đà Nẵng" hoặc "tỉnh thành: ..."
  const askAI = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `u_${Date.now()}`,
        role: "user",
        text,
      },
    ]);

    // Tìm xem người dùng có nhập tỉnh/thành không
    let provinceIds = [];
    let queryText = text;
    // Nhận dạng: "tỉnh: Hà Nội, Đà Nẵng" hoặc "tỉnh thành: ..."
    const provinceMatch = text.match(/tỉnh(?:\s*thành)?\s*:?\s*([\w\s,]+)/i);
    if (provinceMatch) {
      provinceIds = parseProvinceNamesToIds(provinceMatch[1]);
      // Loại bỏ phần tỉnh khỏi query gửi xuống
      queryText = text.replace(provinceMatch[0], "").trim();
    }

    try {
      setLoading(true);
      const data = await getRecommendations({
        userId: user?.user_id || null,
        query: queryText,
        provinceIds,
        topK: pref.topK,
      });

      setModelTag(data.model || "Hybrid MF + CBF");
      pushAIMessage({
        text: data.message || "Mình đã có kết quả gợi ý từ hệ thống.",
        recommendations: data.recommendations || [],
      });
    } catch (error) {
      pushAIMessage({
        text: "Hiện chưa gọi được backend để lấy gợi ý. Bạn kiểm tra backend đang chạy ở cổng 8080 nhé.",
        recommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChat = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    askAI(text);
  };

  const runStructuredSuggestion = async () => {
    try {
      setLoading(true);
      const data = await getRecommendations({
        userId: user?.user_id || null,
        budget: pref.budget,
        days: pref.days,
        style: pref.style,
        participants: pref.participants,
        provinceIds: parseProvinceNamesToIds(pref.provinceInput),
        topK: pref.topK,
      });

      setModelTag(data.model || "Hybrid MF + CBF");
      pushAIMessage({
        text:
          data.message ||
          "Mình đã tổng hợp danh sách tour phù hợp nhất theo nhu cầu bạn vừa nhập.",
        recommendations: data.recommendations || [],
      });
      setTab("chat");
      setOpen(true);
    } catch (error) {
      pushAIMessage({
        text: "Hiện chưa thể tạo đề xuất từ backend. Bạn thử lại sau khi backend hoạt động ổn định nhé.",
        recommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI Chatbox"
      >
        <Ic.Chat />
        <span>Tư vấn tour AI</span>
      </button>

      {open && (
        <section className="ai-chatbox" aria-label="AI Chatbox">
          <header className="ai-header">
            <div>
              <h3>Travel AI Assistant</h3>
            </div>
            <button
              className="ai-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <Ic.Close />
            </button>
          </header>

          <div className="ai-tabs">
            <button
              className={tab === "chat" ? "active" : ""}
              onClick={() => setTab("chat")}
            >
              Hỏi đáp
            </button>
            <button
              className={tab === "form" ? "active" : ""}
              onClick={() => setTab("form")}
            >
              Nhập nhu cầu
            </button>
          </div>

          {tab === "chat" && (
            <>
              <div className="ai-quick-row">
                {QUICK_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => askAI(q)} disabled={loading}>
                    {q}
                  </button>
                ))}
              </div>

              <div className="ai-messages">
                {messages.map((m) => (
                  <article
                    key={m.id}
                    className={`ai-bubble ${m.role === "user" ? "user" : "ai"}`}
                  >
                    <p className="ai-role-label">
                      {m.role === "user" ? "Bạn" : "Trợ lý AI"}
                    </p>
                    <p>{m.text}</p>

                    {m.recommendations?.length > 0 && (
                      <div className="ai-recommendations">
                        {m.recommendations.map((r) => (
                          <div key={r.tourId} className="ai-rec-item">
                            {r.image ? (
                              <img
                                className="ai-rec-image"
                                src={r.image}
                                alt={r.tourName}
                              />
                            ) : null}
                            <div className="ai-rec-content">
                              <strong>{r.tourName}</strong>
                              <span>
                                {r.locationName}
                                {r.province ? `, ${r.province}` : ""}
                              </span>
                              {r.price ? (
                                <span>
                                  Giá tham khảo:{" "}
                                  {new Intl.NumberFormat("vi-VN").format(
                                    r.price,
                                  )}
                                  đ
                                </span>
                              ) : null}
                              {r.startDate || r.endDate ? (
                                <span>
                                  {r.startDate || ""}
                                  {r.startDate && r.endDate ? " - " : ""}
                                  {r.endDate || ""}
                                </span>
                              ) : null}

                              <div className="ai-rec-actions">
                                <button
                                  onClick={() =>
                                    nav(`/create-tour`, {
                                      state: {
                                        recommendation: r,
                                      },
                                    })
                                  }
                                  disabled={!r.tourId}
                                >
                                  Đặt tour
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <form className="ai-input" onSubmit={handleSubmitChat}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={loading}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Đang xử lý" : "Gửi"}
                </button>
              </form>
            </>
          )}

          {tab === "form" && (
            <div className="ai-form-wrap">
              <p className="ai-form-note">
                Điền nhanh thông tin, hệ thống sẽ tự gợi ý tour phù hợp với nhu
                cầu của bạn.
              </p>

              <FormField label="Nhập tên tỉnh muốn đến">
                <input
                  value={pref.provinceInput}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, provinceInput: e.target.value }))
                  }
                  placeholder="Để trống nếu không lọc theo tỉnh"
                />
              </FormField>

              <FormField label="Ngân sách">
                <select
                  value={pref.budget}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, budget: e.target.value }))
                  }
                >
                  <option value="any">Linh hoạt</option>
                  <option value="low">Dưới 2 triệu</option>
                  <option value="mid">2 đến 5 triệu</option>
                  <option value="high">Trên 5 triệu</option>
                </select>
              </FormField>

              <FormField label="Phong cách">
                <select
                  value={pref.style}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, style: e.target.value }))
                  }
                >
                  <option value="any">Bất kỳ</option>
                  <option value="beach">Nghỉ dưỡng biển</option>
                  <option value="adventure">Khám phá - trải nghiệm</option>
                  <option value="culture">Văn hóa - lịch sử</option>
                  <option value="family">Gia đình</option>
                </select>
              </FormField>

              <FormField label="Số người tham gia">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={pref.participants}
                  onChange={(e) =>
                    setPref((p) => ({
                      ...p,
                      participants: Number(e.target.value) || 1,
                    }))
                  }
                />
              </FormField>

              <FormField label="Số lượng đề xuất">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pref.topK}
                  onChange={(e) =>
                    setPref((p) => ({
                      ...p,
                      topK: Number(e.target.value) || 3,
                    }))
                  }
                />
              </FormField>

              <button
                className="ai-submit-pref"
                onClick={runStructuredSuggestion}
                disabled={loading}
              >
                {loading ? "Đang tạo đề xuất" : "Tạo đề xuất ngay"}
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
