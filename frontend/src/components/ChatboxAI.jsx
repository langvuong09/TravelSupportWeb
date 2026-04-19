import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../services/api";
import {
  parseProvinceNamesToIds,
  extractProvinceIdsFromText,
} from "../services/locationHelpers";
import { Ic } from "./UI";
import "./ChatboxAI.css";

const DEFAULT_WELCOME = {
  id: "m0",
  role: "ai",
  text: "Xin chào bạn. Mình là Travel AI Assistant, sẵn sàng gợi ý địa điểm du lịch thông minh.",
};

const QUICK_QUESTIONS = [
  "Gợi ý địa điểm nổi tiếng",
  "Địa điểm nổi bật ở Hồ Chí Minh",
  "Gợi ý du lịch cho cặp đôi",
  "Địa điểm khám phá cho gia đình",
];

function fmtScore(value) {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return value.toFixed(2);
}

export default function ChatboxAI() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([DEFAULT_WELCOME]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

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
        userId: user?.user_id,
        query: queryText,
        provinceIds,
        topK: 1,
      });

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

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI Chatbox"
      >
        <Ic.Chat />
        <span>AI tư vấn địa điểm</span>
      </button>

      {open && (
        <section className="ai-chatbox" aria-label="AI Chatbox">
          <header className="ai-header">
            <div>
              <h3>AI Assistant</h3>
            </div>
            <button
              className="ai-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <Ic.Close />
            </button>
          </header>

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
                    {m.recommendations.map((r) => {
                      const locationId = r.locationId;
                      const title =
                        r.locationName || r.tourName || "Địa điểm gợi ý";
                      return (
                        <div key={locationId || title} className="ai-rec-item">
                          {r.image ? (
                            <img
                              className="ai-rec-image"
                              src={r.image}
                              alt={title}
                            />
                          ) : (
                            <div className="ai-rec-image ai-rec-placeholder">
                              Địa điểm
                            </div>
                          )}
                          <div className="ai-rec-content">
                            <strong>{title}</strong>
                            <span>
                              {r.province
                                ? `${r.province}`
                                : "Không xác định tỉnh"}
                            </span>
                            {r.price ? (
                              <span>
                                Giá tham khảo:{" "}
                                {new Intl.NumberFormat("vi-VN").format(r.price)}{" "}
                                đ
                              </span>
                            ) : null}
                            <div className="ai-rec-actions">
                              <button
                                onClick={() => nav(`/locations/${locationId}`)}
                                disabled={!locationId}
                              >
                                Xem địa điểm
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
            <div ref={messagesEndRef} />
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
        </section>
      )}
    </>
  );
}
