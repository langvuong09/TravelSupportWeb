import React, { useState } from "react";

// ── Step indicator ─────────────────────────────────────────────
export function StepBadge({ n, active }) {
  return <span className={`step-badge ${active ? "active" : ""}`}>{n}</span>;
}

// ── Province chip ──────────────────────────────────────────────
export function ProvChip({ province, selected, onClick }) {
  return (
    <button
      className={`prov-chip ${selected ? "selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      {province.name}
    </button>
  );
}

// ── Location Item Component ─────────────────────────────────────
export function LocationItem({ l, selected, onClick, isSuggested }) {
  return (
    <div style={{ position: "relative" }}>
      {isSuggested && (
        <div style={{ position: "absolute", top: -8, left: 10, background: "var(--primary)", color: "#fff", fontSize: "9px", padding: "2px 6px", borderRadius: "10px", zIndex: 10, fontWeight: 700, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          ⭐ GỢI Ý
        </div>
      )}
      <button
        onClick={onClick}
        style={{
          width: "100%",
          border: selected ? "2.5px solid var(--primary)" : "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          cursor: "pointer",
          background: "var(--bg-white)",
          transition: "var(--transition)",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          position: "relative"
        }}
      >
        {selected && (
          <div style={{ position: "absolute", top: 4, right: 4, background: "var(--primary)", color: "#fff", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11, fontSize: 11 }}>✓</div>
        )}
        {l.image && <img src={l.image} alt={l.name} style={{ width: "100%", height: "90px", objectFit: "cover" }} />}
        <div style={{ padding: "8px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{l.name}</div>
          <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>📍 {l.province || l.provinceName}</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)" }}>
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(l.estimatedPrice || l.estimated_cost)}
          </div>
        </div>
      </button>
    </div>
  );
}

// ── Food Pill Component ─────────────────────────────────────────
export function FoodPill({ f, selected, onClick, isSuggested }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 12px",
        borderRadius: "12px",
        border: selected ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
        background: selected ? "rgba(238, 52, 36, 0.05)" : "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "left",
        width: "fit-content",
        boxShadow: selected ? "var(--shadow-sm)" : "none"
      }}
    >
      {f.image && (
        <img 
          src={f.image} 
          alt={f.name} 
          style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }} 
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "13px", color: "var(--text)" }}>
          {isSuggested && <span title="Gợi ý nên thử">✨</span>}
          {f.name}
        </div>
        <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600 }}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(f.estimatedPrice)}
        </div>
      </div>
    </button>
  );
}

// ── Transport mode selector ────────────────────────────────
export function TransportSelector({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.transportId === value);

  return (
    <div style={{ position: "relative", minWidth: 240 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-white)",
          color: "var(--text)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "14.5px"
        }}
        type="button"
      >
        {selectedOption ? selectedOption.name : "Chọn phương tiện..."}
        <span style={{ fontSize: "10px", opacity: 0.5 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "white",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          marginTop: "4px",
          zIndex: 100,
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden"
        }}>
          {options.map((opt) => (
            <div
              key={opt.transportId}
              onClick={() => {
                onChange(opt.transportId);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: value === opt.transportId ? "var(--primary-light)" : "transparent",
                color: value === opt.transportId ? "var(--primary)" : "var(--text)",
                fontWeight: value === opt.transportId ? 700 : 400,
                fontSize: "13.5px",
                borderBottom: "1px solid var(--border-light)"
              }}
              onMouseEnter={(e) => (e.target.style.background = "var(--bg-light)")}
              onMouseLeave={(e) => (e.target.style.background = value === opt.transportId ? "var(--primary-light)" : "transparent")}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
