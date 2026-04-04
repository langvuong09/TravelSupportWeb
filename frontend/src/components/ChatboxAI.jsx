import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../data/mockData";
import { Ic } from "./UI";
import "./ChatboxAI.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const DEFAULT_WELCOME = {
  id: "m0",
  role: "ai",
  text: "Xin chao. Minh la Travel AI Assistant. Minh dang dung mo hinh Hybrid CF + CBF tu backend de de xuat tour.",
};

const QUICK_QUESTIONS = [
  "Goi y tour bien gia duoi 2 trieu",
  "Di 3 ngay nen di dau o mien Bac?",
  "Lich trinh cho cap doi nghi duong",
  "Toi muon dia diem gan Ha Noi",
];

async function requestRecommendations(payload) {
  const response = await fetch(`${API_BASE}/api/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Khong the ket noi API goi y");
  }

  return response.json();
}

function FormField({ label, children }) {
  return (
    <label className="ai-form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function ChatboxAI() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([DEFAULT_WELCOME]);
  const [loading, setLoading] = useState(false);
  const [modelTag, setModelTag] = useState("Hybrid-CF-CBF-v1");

  const [pref, setPref] = useState({
    region: "Tat ca",
    budget: "any",
    days: 3,
    style: "any",
  });

  const suggestionCount = useMemo(
    () =>
      messages.reduce((sum, m) => sum + (m.recommendations?.length || 0), 0),
    [messages],
  );

  const pushAIMessage = (payload) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        role: "ai",
        text: payload.text,
        recommendations: payload.recommendations || [],
      },
    ]);
  };

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

    try {
      setLoading(true);
      const data = await requestRecommendations({
        userId: user?.userId || null,
        query: text,
        topK: 3,
      });

      setModelTag(data.model || "Hybrid-CF-CBF-v1");
      pushAIMessage({
        text: data.message || "Da nhan ket qua de xuat tu he thong.",
        recommendations: data.recommendations || [],
      });
    } catch (error) {
      pushAIMessage({
        text: "Khong the goi backend de lay de xuat luc nay. Ban kiem tra backend dang chay o cong 8080.",
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
      const data = await requestRecommendations({
        userId: user?.userId || null,
        region: pref.region,
        budget: pref.budget,
        days: pref.days,
        style: pref.style,
        topK: 3,
      });

      setModelTag(data.model || "Hybrid-CF-CBF-v1");
      pushAIMessage({
        text:
          data.message ||
          "Minh da tong hop danh sach tour phu hop nhat theo nhu cau vua nhap.",
        recommendations: data.recommendations || [],
      });
      setTab("chat");
      setOpen(true);
    } catch (error) {
      pushAIMessage({
        text: "Khong the tao de xuat tu backend. Ban thu lai sau khi backend hoat dong.",
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
        <span>Trợ lý AI</span>
      </button>

      {open && (
        <section className="ai-chatbox" aria-label="AI Chatbox">
          <header className="ai-header">
            <div>
              <h3>Travel AI Assistant</h3>
              <p>
                {suggestionCount} goi y da tao · {modelTag}
              </p>
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
              Hoi dap
            </button>
            <button
              className={tab === "form" ? "active" : ""}
              onClick={() => setTab("form")}
            >
              Nhap nhu cau
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
                    <p>{m.text}</p>

                    {m.recommendations?.length > 0 && (
                      <div className="ai-recommendations">
                        {m.recommendations.map((r) => (
                          <div key={r.tourId} className="ai-rec-item">
                            <img src={r.image} alt={r.tourName} />
                            <div>
                              <strong>{r.tourName}</strong>
                              <span>
                                {r.locationName} · {formatPrice(r.price)}
                              </span>
                              <span>{r.reason}</span>
                              <div className="ai-rec-actions">
                                <button
                                  onClick={() => nav(`/tours/${r.tourId}`)}
                                >
                                  Xem tour
                                </button>
                                <button
                                  onClick={() =>
                                    nav(`/locations/${r.locationId}`)
                                  }
                                >
                                  Xem dia diem
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
                  placeholder="Nhap cau hoi cua ban..."
                  disabled={loading}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Dang xu ly" : "Gui"}
                </button>
              </form>
            </>
          )}

          {tab === "form" && (
            <div className="ai-form-wrap">
              <p className="ai-form-note">
                Dien nhanh thong tin, he thong se tu de xuat tour va dia diem
                phu hop.
              </p>

              <FormField label="Khu vuc mong muon">
                <select
                  value={pref.region}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, region: e.target.value }))
                  }
                >
                  <option value="Tat ca">Tat ca</option>
                  <option value="Bac">Mien Bac</option>
                  <option value="Trung">Mien Trung</option>
                  <option value="Nam">Mien Nam</option>
                </select>
              </FormField>

              <FormField label="Ngan sach">
                <select
                  value={pref.budget}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, budget: e.target.value }))
                  }
                >
                  <option value="any">Linh hoat</option>
                  <option value="low">Duoi 2 trieu</option>
                  <option value="mid">2 den 5 trieu</option>
                  <option value="high">Tren 5 trieu</option>
                </select>
              </FormField>

              <FormField label="So ngay di du lich">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={pref.days}
                  onChange={(e) =>
                    setPref((p) => ({
                      ...p,
                      days: Number(e.target.value) || 1,
                    }))
                  }
                />
              </FormField>

              <FormField label="Phong cach">
                <select
                  value={pref.style}
                  onChange={(e) =>
                    setPref((p) => ({ ...p, style: e.target.value }))
                  }
                >
                  <option value="any">Bat ky</option>
                  <option value="beach">Nghi duong bien</option>
                  <option value="adventure">Kham pha - trai nghiem</option>
                  <option value="culture">Van hoa - lich su</option>
                  <option value="family">Gia dinh</option>
                </select>
              </FormField>

              <button
                className="ai-submit-pref"
                onClick={runStructuredSuggestion}
                disabled={loading}
              >
                {loading ? "Dang tao de xuat" : "Tao de xuat ngay"}
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
