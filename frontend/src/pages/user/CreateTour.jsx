import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import {
  mockProvinces,
  mockLocations,
  mockFoods,
  mockTransportTypes,
  formatPrice,
} from "../../data/mockData";
import "../../styles/global.css";

// ── Khoảng cách ước lượng giữa các tỉnh (km) ─────────────────
const PROVINCE_DISTANCES = {
  "1-2": 1150, "1-3": 1650, "1-4": 320, "1-5": 1950, "1-6": 1600,
  "1-7": 130,  "1-8": 670,  "1-9": 760, "1-10": 170,
  "2-3": 850,  "2-4": 1200, "2-5": 1000,"2-6": 700,  "2-7": 1100,
  "2-8": 120,  "2-9": 30,   "2-10": 900,
  "3-4": 1450, "3-5": 280,  "3-6": 200, "3-7": 1100, "3-8": 1000,
  "3-9": 980,  "3-10": 1500,
  "4-5": 2200, "4-6": 1900, "4-7": 380, "4-8": 860,  "4-9": 950,
  "4-10": 320,
  "5-6": 250,  "5-7": 1800, "5-8": 1700,"5-9": 1600, "5-10": 2100,
  "6-7": 1450, "6-8": 1300, "6-9": 1200,"6-10": 1700,
  "7-8": 620,  "7-9": 720,  "7-10": 95,
  "8-9": 100,  "8-10": 660,
  "9-10": 760,
};

function getDist(a, b) {
  const key = [Math.min(a, b), Math.max(a, b)].join("-");
  return PROVINCE_DISTANCES[key] || 500;
}

// ── Step indicator ─────────────────────────────────────────────
function StepBadge({ n, active }) {
  return (
    <span className={`step-badge ${active ? "active" : ""}`}>{n}</span>
  );
}

// ── Province chip ──────────────────────────────────────────────
function ProvChip({ province, order, selected, onClick }) {
  return (
    <button
      className={`prov-chip ${selected ? "selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      {selected && <span className="prov-order">{order}</span>}
      {province.name}
    </button>
  );
}

// ── Transport mode selector ────────────────────────────────
function TransportSelector({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.transportId === value);
  
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
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font)",
          transition: "var(--transition)"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <span>{selectedOption?.name || "Chọn phương tiện"}</span>
        <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>▼</span>
      </button>

      {open && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999
            }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            zIndex: 1000,
            maxHeight: 200,
            overflowY: "auto"
          }}>
            {options.map((opt) => (
              <button
                key={opt.transportId}
                onClick={() => {
                  onChange(opt.transportId);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "none",
                  background: value === opt.transportId ? "var(--primary-light)" : "transparent",
                  color: value === opt.transportId ? "var(--primary)" : "var(--text)",
                  fontSize: 13,
                  fontWeight: value === opt.transportId ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font)",
                  transition: "var(--transition)",
                  borderBottom: "1px solid var(--border-light)"
                }}
                onMouseEnter={(e) => !value === opt.transportId && (e.currentTarget.style.background = "var(--border-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = value === opt.transportId ? "var(--primary-light)" : "transparent")}
              >
                <div style={{ fontWeight: 700 }}>{opt.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {opt.costPerKm > 0 ? `${formatPrice(opt.costPerKm)}/km` : "Giá cố định"}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Item toggle pill ───────────────────────────────────────────
function ItemPill({ label, sub, selected, onClick }) {
  return (
    <button
      className={`item-pill ${selected ? "selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {sub && <span className="pill-sub">{sub}</span>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function CreateTour() {
  const { user } = useAuth();
  const { addBooking } = useBooking();

  const [selProvinces, setSelProvinces] = useState([]); // [provinceId, ...]
  const [people, setPeople]             = useState(1);
  const [selLocs, setSelLocs]           = useState({}); // {pid: [locId,...]}
  const [selFoods, setSelFoods]         = useState({}); // {pid: [foodId,...]}
  const [selTransport, setSelTransport] = useState({}); // {"a-b": transportId}
  const [tourName, setTourName]         = useState("");
  const [showSuccess, setShowSuccess]   = useState(false);

  // ── Dữ liệu theo tỉnh đã chọn ───────────────────────────────
  const locsByProv  = useMemo(() => {
    const map = {};
    selProvinces.forEach((pid) => {
      map[pid] = mockLocations.filter((l) => l.provinceId === pid);
    });
    return map;
  }, [selProvinces]);

  const foodsByProv = useMemo(() => {
    const map = {};
    selProvinces.forEach((pid) => {
      map[pid] = mockFoods.filter((f) => f.provinceId === pid);
    });
    return map;
  }, [selProvinces]);

  const transportPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < selProvinces.length - 1; i++) {
      pairs.push([selProvinces[i], selProvinces[i + 1]]);
    }
    return pairs;
  }, [selProvinces]);

  // ── Summary counts ───────────────────────────────────────────
  const totalLocs  = Object.values(selLocs).reduce((s, a) => s + a.length, 0);
  const totalFoods = Object.values(selFoods).reduce((s, a) => s + a.length, 0);

  // ── Ước tính chi phí (realtime) ──────────────────────────────
  const estimate = useMemo(() => {
    let locCost = 0, foodCost = 0, transportCost = 0;

    selProvinces.forEach((pid) => {
      (selLocs[pid] || []).forEach((lid) => {
        const l = mockLocations.find((x) => x.locationId === lid);
        if (l) locCost += l.estimatedCost || 0;
      });
      (selFoods[pid] || []).forEach((fid) => {
        const f = mockFoods.find((x) => x.foodId === fid);
        if (f) transportCost += 0; // food cost tracked separately
        if (f) foodCost += f.estimatedPrice || 0;
      });
    });

    transportPairs.forEach(([a, b]) => {
      const key = `${a}-${b}`;
      const tId = selTransport[key] || 1;
      const t   = mockTransportTypes.find((x) => x.transportId === tId);
      if (t && t.costPerKm > 0) {
        transportCost += t.costPerKm * getDist(a, b);
      }
    });

    const perPerson = locCost + foodCost + transportCost;
    return { locCost, foodCost, transportCost, perPerson, total: perPerson * people };
  }, [selProvinces, selLocs, selFoods, selTransport, people, transportPairs]);

  // ── Handlers ─────────────────────────────────────────────────
  const toggleProvince = (pid) => {
    setSelProvinces((prev) => {
      if (prev.includes(pid)) {
        const next = prev.filter((x) => x !== pid);
        setSelLocs((l) => { const c = { ...l }; delete c[pid]; return c; });
        setSelFoods((f) => { const c = { ...f }; delete c[pid]; return c; });
        setSelTransport((t) => {
          const c = { ...t };
          Object.keys(c).forEach((k) => {
            if (k.startsWith(`${pid}-`) || k.endsWith(`-${pid}`)) delete c[k];
          });
          return c;
        });
        return next;
      }
      return [...prev, pid];
    });
  };

  const toggleLoc = (pid, lid) => {
    setSelLocs((prev) => {
      const arr = prev[pid] ? [...prev[pid]] : [];
      const i = arr.indexOf(lid);
      if (i >= 0) arr.splice(i, 1); else arr.push(lid);
      return { ...prev, [pid]: arr };
    });
  };

  const toggleFood = (pid, fid) => {
    setSelFoods((prev) => {
      const arr = prev[pid] ? [...prev[pid]] : [];
      const i = arr.indexOf(fid);
      if (i >= 0) arr.splice(i, 1); else arr.push(fid);
      return { ...prev, [pid]: arr };
    });
  };

  const handleCreate = () => {
    if (selProvinces.length === 0) return;

    const provinces  = selProvinces.map((pid) => mockProvinces.find((p) => p.provinceId === pid)).filter(Boolean);
    const name       = tourName.trim() || `Tour ${provinces.map((p) => p.name).join(" – ")}`;

    // Tạo tour ID
    const tourId = `TOUR-${Date.now()}`;

    // Lưu booking vào context với đầy đủ thông tin tour
    addBooking({
      userId: user.userId,
      tourId,
      tourName: name,
      numberOfPeople: people,
      totalPrice: estimate.total,
      // Chi tiết tour
      provinces: selProvinces.map((pid) => {
        const p = mockProvinces.find((pr) => pr.provinceId === pid);
        return { id: pid, name: p?.name, code: p?.code };
      }),
      locations: Object.entries(selLocs).reduce((acc, [pid, locIds]) => {
        return {
          ...acc,
          [pid]: locIds.map((lid) => {
            const loc = mockLocations.find((l) => l.locationId === lid);
            return { id: lid, name: loc?.name, category: loc?.category };
          }),
        };
      }, {}),
      foods: Object.entries(selFoods).reduce((acc, [pid, foodIds]) => {
        return {
          ...acc,
          [pid]: foodIds.map((fid) => {
            const food = mockFoods.find((f) => f.foodId === fid);
            return { id: fid, name: food?.name, type: food?.type };
          }),
        };
      }, {}),
      transports: transportPairs.map(([a, b]) => {
        const key = `${a}-${b}`;
        const tId = selTransport[key] || 1;
        const t = mockTransportTypes.find((tr) => tr.transportId === tId);
        const pA = mockProvinces.find((p) => p.provinceId === a);
        const pB = mockProvinces.find((p) => p.provinceId === b);
        
        // Tạo icon từ tên phương tiện
        const getTransportIcon = (name) => {
          if (!name) return "🚗";
          if (name.includes("khách")) return "🚗";
          if (name.includes("bay")) return "✈️";
          if (name.includes("hỏa")) return "🚂";
          if (name.includes("treo")) return "🚡";
          if (name.includes("thuyền")) return "⛵";
          return "🚗";
        };
        
        return {
          from: { id: a, name: pA?.name },
          to: { id: b, name: pB?.name },
          transport: { 
            id: tId, 
            name: t?.name, 
            icon: getTransportIcon(t?.name)
          }
        };
      }),
      estimate,
    });

    // Show success message rồi reset form
    setShowSuccess(true);
    setTimeout(() => {
      handleReset();
      setShowSuccess(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelProvinces([]);
    setPeople(1);
    setSelLocs({});
    setSelFoods({});
    setSelTransport({});
    setTourName("");
  };

  // ── Render form ───────────────────────────────────────────────
  return (
    <div className="ct-page">
      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            padding: "48px 64px",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
            animation: "fadeUp 0.3s ease both",
            maxWidth: 500,
            width: "100%"
          }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✓</div>
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "var(--primary)", marginBottom: "12px" }}>Tour tạo thành công!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Tour của bạn đã được thêm vào danh sách đặt tour</p>
          </div>
        </div>
      )}

      <div className="ct-header">
        <h1 className="ct-title">Tạo tour tùy chỉnh</h1>
        <p className="ct-sub">Chọn tỉnh, địa điểm, ẩm thực và phương tiện — hệ thống ước lượng chi phí cho bạn</p>
      </div>

      <div className="ct-layout">
        {/* ── CỘT TRÁI ── */}
        <div className="ct-main">

          {/* Step 1: Tỉnh */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="1" active={selProvinces.length > 0} />
              <span className="ct-card-title">Chọn tỉnh / thành phố <span className="ct-hint">(theo thứ tự chuyến đi)</span></span>
            </div>
            <div className="province-grid">
              {mockProvinces.map((p) => {
                const order = selProvinces.indexOf(p.provinceId);
                return (
                  <ProvChip
                    key={p.provinceId}
                    province={p}
                    order={order + 1}
                    selected={order >= 0}
                    onClick={() => toggleProvince(p.provinceId)}
                  />
                );
              })}
            </div>
          </div>

          {/* Step 2: Số người */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="2" active />
              <span className="ct-card-title">Số người tham gia</span>
            </div>
            <div className="people-row">
              <button
                className="people-btn"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                type="button"
              >−</button>
              <span className="people-num">{people}</span>
              <button
                className="people-btn"
                onClick={() => setPeople((p) => Math.min(50, p + 1))}
                type="button"
              >+</button>
              <span className="people-label">người</span>
            </div>
          </div>

          {/* Step 3: Địa điểm & Ẩm thực */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="3" active={totalLocs > 0 || totalFoods > 0} />
              <span className="ct-card-title">Địa điểm & Ẩm thực trong từng tỉnh</span>
            </div>

            {selProvinces.length === 0 ? (
              <p className="ct-empty">Chọn ít nhất 1 tỉnh ở bước 1 để hiện danh sách.</p>
            ) : (
              selProvinces.map((pid, idx) => {
                const prov  = mockProvinces.find((p) => p.provinceId === pid);
                const locs  = locsByProv[pid]  || [];
                const foods = foodsByProv[pid] || [];
                const sLocs  = selLocs[pid]  || [];
                const sFoods = selFoods[pid] || [];

                return (
                  <div key={pid} className="prov-section">
                    <div className="prov-section-title">
                      <span className="prov-section-badge">{idx + 1}</span>
                      {prov?.name}
                    </div>

                    {locs.length > 0 && (
                      <>
                        <p className="sub-label">📍 Địa điểm tham quan</p>
                        <div className="pill-wrap">
                          {locs.map((l) => (
                            <ItemPill
                              key={l.locationId}
                              label={l.name}
                              sub={formatPrice(l.estimatedCost)}
                              selected={sLocs.includes(l.locationId)}
                              onClick={() => toggleLoc(pid, l.locationId)}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {foods.length > 0 && (
                      <>
                        <p className="sub-label" style={{ marginTop: 10 }}>🍜 Ẩm thực đặc sản</p>
                        <div className="pill-wrap">
                          {foods.map((f) => (
                            <ItemPill
                              key={f.foodId}
                              label={f.name}
                              sub={formatPrice(f.estimatedPrice)}
                              selected={sFoods.includes(f.foodId)}
                              onClick={() => toggleFood(pid, f.foodId)}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {locs.length === 0 && foods.length === 0 && (
                      <p className="ct-empty">Chưa có dữ liệu địa điểm / ẩm thực cho tỉnh này.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Step 4: Phương tiện */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="4" active={transportPairs.length > 0} />
              <span className="ct-card-title">Phương tiện di chuyển giữa các tỉnh</span>
            </div>

            {transportPairs.length === 0 ? (
              <p className="ct-empty">Chọn ít nhất 2 tỉnh để chọn phương tiện.</p>
            ) : (
              <div className="transport-list">
                {transportPairs.map(([a, b]) => {
                  const pA  = mockProvinces.find((p) => p.provinceId === a);
                  const pB  = mockProvinces.find((p) => p.provinceId === b);
                  const key = `${a}-${b}`;
                  const cur = selTransport[key] || 1;
                  const dist = getDist(a, b);

                  return (
                    <div key={key} className="transport-row">
                      <div className="transport-route">
                        <span className="tr-from">{pA?.name}</span>
                        <span className="tr-arrow">→</span>
                        <span className="tr-to">{pB?.name}</span>
                        <span className="tr-dist">~{dist} km</span>
                      </div>
                      <TransportSelector
                        options={mockTransportTypes}
                        value={cur}
                        onChange={(tId) =>
                          setSelTransport((prev) => ({
                            ...prev,
                            [key]: tId,
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tên tour */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="5" active={!!tourName} />
              <span className="ct-card-title">Đặt tên tour <span className="ct-hint">(tuỳ chọn)</span></span>
            </div>
            <input
              className="tour-name-input"
              type="text"
              placeholder={
                selProvinces.length > 0
                  ? `Tour ${selProvinces
                      .map((pid) => mockProvinces.find((p) => p.provinceId === pid)?.name)
                      .join(" – ")}`
                  : "Nhập tên tour của bạn..."
              }
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              maxLength={80}
            />
          </div>
        </div>

        {/* ── CỘT PHẢI: Tổng quan ── */}
        <aside className="ct-sidebar">
          <div className="ct-card sidebar-card">
            <p className="sidebar-title">Tổng quan</p>

            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-val">{selProvinces.length}</span>
                <span className="stat-label">Tỉnh thành</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{people}</span>
                <span className="stat-label">Người đi</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{totalLocs}</span>
                <span className="stat-label">Địa điểm</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{totalFoods}</span>
                <span className="stat-label">Ẩm thực</span>
              </div>
            </div>

            {/* Route */}
            {selProvinces.length > 0 && (
              <div className="sidebar-route">
                {selProvinces.map((pid, i) => {
                  const p = mockProvinces.find((x) => x.provinceId === pid);
                  return (
                    <span key={pid} className="sidebar-route-item">
                      <span className="sidebar-order">{i + 1}</span>
                      {p?.name}
                      {i < selProvinces.length - 1 && <span className="sidebar-arrow">→</span>}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Chi phí realtime */}
            {(estimate.perPerson > 0) && (
              <div className="estimate-box">
                <p className="estimate-label">Ước lượng chi phí</p>
                {estimate.locCost > 0 && (
                  <div className="est-row">
                    <span>Địa điểm</span>
                    <span>{formatPrice(estimate.locCost)}</span>
                  </div>
                )}
                {estimate.foodCost > 0 && (
                  <div className="est-row">
                    <span>Ẩm thực</span>
                    <span>{formatPrice(estimate.foodCost)}</span>
                  </div>
                )}
                {estimate.transportCost > 0 && (
                  <div className="est-row">
                    <span>Phương tiện</span>
                    <span>{formatPrice(estimate.transportCost)}</span>
                  </div>
                )}
                <div className="est-row est-total">
                  <span>/ người</span>
                  <span>{formatPrice(estimate.perPerson)}</span>
                </div>
                <div className="est-grand">
                  <span>Tổng {people} người</span>
                  <span>{formatPrice(estimate.total)}</span>
                </div>
              </div>
            )}

            <button
              className="create-btn"
              onClick={handleCreate}
              disabled={selProvinces.length === 0}
              type="button"
            >
              {selProvinces.length === 0 ? "Chọn ít nhất 1 tỉnh" : "Tạo tour →"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}