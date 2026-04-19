import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import {
  getProvinces,
  getLocations,
  getFoods,
  getTransports,
  formatPrice,
  createTour,
} from "../../services/api";
import {
  parseRecommendationProvinces,
  findLocationByName,
} from "../../services/locationHelpers";
import "../../styles/global.css";

// ── Khoảng cách ước lượng giữa các tỉnh (km) ─────────────────
const PROVINCE_DISTANCES = {
  "1-2": 350,
  "1-3": 1200,
  "1-4": 1400,
  "1-5": 800,
  "1-6": 450,
  "1-7": 600,
  "1-8": 1100,
  "1-9": 900,
  "1-10": 950,
  "1-11": 300,
  "1-12": 1300,
  "1-13": 1500,
  "1-14": 1100,
  "1-15": 1200,
  "1-16": 1150,
  "1-17": 450,
  "1-18": 250,
  "1-19": 850,
  "1-20": 1250,
  "1-21": 700,
  "1-22": 1050,
  "1-23": 950,
  "1-24": 1100,
  "1-25": 1200,
  "1-26": 950,
  "1-27": 900,
  "1-28": 1350,
  "1-29": 350,
  "1-30": 1100,
  "1-31": 1200,
  "1-32": 1000,
  "2-3": 1100,
  "2-4": 1300,
  "2-5": 700,
  "2-6": 400,
  "2-7": 550,
  "2-8": 1000,
  "2-9": 800,
  "2-10": 900,
  "2-11": 300,
  "2-12": 1200,
  "2-13": 1400,
  "2-14": 1000,
  "2-15": 1100,
  "2-16": 1050,
  "2-17": 350,
  "2-18": 200,
  "2-19": 750,
  "2-20": 1150,
  "2-21": 600,
  "2-22": 950,
  "2-23": 850,
  "2-24": 1000,
  "2-25": 1100,
  "2-26": 900,
  "2-27": 850,
  "2-28": 1250,
  "2-29": 400,
  "2-30": 1000,
  "2-31": 1100,
  "2-32": 900,
  "3-4": 1000,
  "3-5": 600,
  "3-6": 800,
  "3-7": 1200,
  "3-8": 500,
  "3-9": 700,
  "3-10": 900,
  "3-11": 800,
  "3-12": 1100,
  "3-13": 1200,
  "3-14": 900,
  "3-15": 1000,
  "3-16": 950,
  "3-17": 600,
  "3-18": 850,
  "3-19": 950,
  "3-20": 1350,
  "3-21": 800,
  "3-22": 1100,
  "3-23": 1000,
  "3-24": 700,
  "3-25": 850,
  "3-26": 1050,
  "3-27": 750,
  "3-28": 1100,
  "3-29": 900,
  "3-30": 1300,
  "3-31": 1200,
  "3-32": 800,
  "4-5": 500,
  "4-6": 1000,
  "4-7": 1400,
  "4-8": 800,
  "4-9": 900,
  "4-10": 1100,
  "4-11": 900,
  "4-12": 900,
  "4-13": 1300,
  "4-14": 1200,
  "4-15": 1100,
  "4-16": 300,
  "4-17": 1000,
  "4-18": 1200,
  "4-19": 1100,
  "4-20": 200,
  "4-21": 1000,
  "4-22": 1400,
  "4-23": 1300,
  "4-24": 1100,
  "4-25": 1000,
  "4-26": 1200,
  "4-27": 1100,
  "4-28": 1500,
  "4-29": 1200,
  "4-30": 1400,
  "4-31": 200,
  "4-32": 1000,
  "5-6": 700,
  "5-7": 1100,
  "5-8": 400,
  "5-9": 600,
  "5-10": 800,
  "5-11": 700,
  "5-12": 1000,
  "5-13": 1100,
  "5-14": 800,
  "5-15": 900,
  "5-16": 900,
  "5-17": 300,
  "5-18": 500,
  "5-19": 700,
  "5-20": 1200,
  "5-21": 500,
  "5-22": 900,
  "5-23": 800,
  "5-24": 600,
  "5-25": 750,
  "5-26": 800,
  "5-27": 500,
  "5-28": 1000,
  "5-29": 800,
  "5-30": 1200,
  "5-31": 1100,
  "5-32": 700,
};

function getDist(a, b) {
  const key = [Math.min(a, b), Math.max(a, b)].join("-");
  return PROVINCE_DISTANCES[key] || 500;
}

// ── Step indicator ─────────────────────────────────────────────
function StepBadge({ n, active }) {
  return <span className={`step-badge ${active ? "active" : ""}`}>{n}</span>;
}

// ── Province chip ──────────────────────────────────────────────
function ProvChip({ province, selected, onClick }) {
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

// ── Transport mode selector ────────────────────────────────
function TransportSelector({ options, value, onChange }) {
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
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font)",
          transition: "var(--transition)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--primary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
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
              zIndex: 999,
            }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
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
              overflowY: "auto",
            }}
          >
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
                  background:
                    value === opt.transportId
                      ? "var(--primary-light)"
                      : "transparent",
                  color:
                    value === opt.transportId
                      ? "var(--primary)"
                      : "var(--text)",
                  fontSize: 13,
                  fontWeight: value === opt.transportId ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font)",
                  transition: "var(--transition)",
                  borderBottom: "1px solid var(--border-light)",
                }}
                onMouseEnter={(e) =>
                  !value === opt.transportId &&
                  (e.currentTarget.style.background = "var(--border-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    value === opt.transportId
                      ? "var(--primary-light)"
                      : "transparent")
                }
              >
                <div style={{ fontWeight: 700 }}>{opt.name}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {opt.costPerKm > 0
                    ? `${formatPrice(opt.costPerKm)}/km`
                    : "Giá cố định"}
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

  // API data states
  const [allProvinces, setAllProvinces] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [allTransports, setAllTransports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Selection states
  const [selProvinces, setSelProvinces] = useState([]); // [provinceId, ...]
  const [searchTerm, setSearchTerm] = useState(""); // ← Search for provinces
  const [people, setPeople] = useState(1);
  const [days, setDays] = useState(3);
  const [selLocs, setSelLocs] = useState({}); // {pid: [locId,...]}
  const [selFoods, setSelFoods] = useState({}); // {pid: [foodId,...]}
  const [selTransport, setSelTransport] = useState({}); // {"a-b": transportId}
  const [tourName, setTourName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [prefilledFromRecommendation, setPrefilledFromRecommendation] =
    useState(false);
  const location = useLocation();
  const initialRecommendation = location.state?.recommendation;

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [provinces, locationsRes, foods, transports] = await Promise.all([
          getProvinces(),
          getLocations(),
          getFoods(),
          getTransports(),
        ]);
        setAllProvinces(provinces);
        setAllLocations(locationsRes.content || []);
        setAllFoods(foods);
        setAllTransports(transports);
      } catch (err) {
        console.error("Error loading tour creation data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loadingData && initialRecommendation && !prefilledFromRecommendation) {
      if (initialRecommendation.tourName) {
        setTourName(initialRecommendation.tourName);
      }

      if (
        initialRecommendation.duration_days != null &&
        !Number.isNaN(initialRecommendation.duration_days)
      ) {
        setDays(initialRecommendation.duration_days);
      }

      let provinceIds = Array.isArray(initialRecommendation.provinceId)
        ? initialRecommendation.provinceId.filter((id) => Number.isInteger(id))
        : [];

      let location = null;
      if (initialRecommendation.locationId != null) {
        location = allLocations.find(
          (item) => item.locationId === initialRecommendation.locationId,
        );
      }

      if (!location && initialRecommendation.locationName) {
        location = findLocationByName(
          initialRecommendation.locationName,
          allLocations,
        );
      }

      if (location) {
        provinceIds = Array.from(
          new Set([...(provinceIds || []), location.provinceId]),
        );
        setSelLocs({ [location.provinceId]: [location.locationId] });
      }

      if (!provinceIds.length && initialRecommendation.province) {
        provinceIds = parseRecommendationProvinces(
          initialRecommendation.province,
          allProvinces,
        );
      }

      if (provinceIds.length > 0) {
        setSelProvinces(provinceIds);
      }

      setPrefilledFromRecommendation(true);
    }
  }, [
    loadingData,
    initialRecommendation,
    allLocations,
    allProvinces,
    prefilledFromRecommendation,
  ]);

  // ── Dữ liệu theo tỉnh đã chọn ───────────────────────────────
  const filteredProvinces = useMemo(() => {
    if (!searchTerm.trim()) return allProvinces;
    const term = searchTerm.toLowerCase();
    return allProvinces.filter((p) => p.name.toLowerCase().includes(term));
  }, [searchTerm, allProvinces]);

  const locsByProv = useMemo(() => {
    const map = {};
    selProvinces.forEach((pid) => {
      map[pid] = allLocations.filter((l) => l.provinceId === pid);
    });
    return map;
  }, [selProvinces, allLocations]);

  const foodsByProv = useMemo(() => {
    const map = {};
    selProvinces.forEach((pid) => {
      map[pid] = allFoods.filter((f) => f.provinceId === pid);
    });
    return map;
  }, [selProvinces, allFoods]);

  const transportPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < selProvinces.length - 1; i++) {
      pairs.push([selProvinces[i], selProvinces[i + 1]]);
    }
    return pairs;
  }, [selProvinces]);

  // ── Summary counts ───────────────────────────────────────────
  const totalLocs = Object.values(selLocs).reduce((s, a) => s + a.length, 0);
  const totalFoods = Object.values(selFoods).reduce((s, a) => s + a.length, 0);

  // ── Ước tính chi phí (realtime) ──────────────────────────────
  const estimate = useMemo(() => {
    let locCost = 0,
      foodCost = 0,
      transportCost = 0;

    selProvinces.forEach((pid) => {
      (selLocs[pid] || []).forEach((lid) => {
        const l = allLocations.find((x) => x.locationId === lid);
        if (l) locCost += l.estimatedCost || 0;
      });
      (selFoods[pid] || []).forEach((fid) => {
        const f = allFoods.find((x) => x.foodId === fid);
        if (f) transportCost += 0; // food cost tracked separately
        if (f) foodCost += f.estimatedPrice || 0;
      });
    });

    transportPairs.forEach(([a, b]) => {
      const key = `${a}-${b}`;
      const tId = selTransport[key] || 1;
      const t = allTransports.find((x) => x.transportId === tId);
      if (t && t.costPerKm > 0) {
        transportCost += t.costPerKm * getDist(a, b);
      }
    });

    const perPerson = locCost + foodCost + transportCost;
    return {
      locCost,
      foodCost,
      transportCost,
      perPerson,
      total: perPerson * people,
    };
  }, [
    selProvinces,
    selLocs,
    selFoods,
    selTransport,
    people,
    transportPairs,
    allLocations,
    allFoods,
    allTransports,
  ]);

  // ── Handlers ─────────────────────────────────────────────────
  const toggleProvince = (pid) => {
    setSelProvinces((prev) => {
      if (prev.includes(pid)) {
        const next = prev.filter((x) => x !== pid);
        setSelLocs((l) => {
          const c = { ...l };
          delete c[pid];
          return c;
        });
        setSelFoods((f) => {
          const c = { ...f };
          delete c[pid];
          return c;
        });
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
      if (i >= 0) arr.splice(i, 1);
      else arr.push(lid);
      return { ...prev, [pid]: arr };
    });
  };

  const toggleFood = (pid, fid) => {
    setSelFoods((prev) => {
      const arr = prev[pid] ? [...prev[pid]] : [];
      const i = arr.indexOf(fid);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(fid);
      return { ...prev, [pid]: arr };
    });
  };

  const handleCreate = async () => {
    if (selProvinces.length === 0) return;

    const provinces = selProvinces
      .map((pid) => allProvinces.find((p) => p.provinceId === pid))
      .filter(Boolean);
    const name =
      tourName.trim() || `Tour ${provinces.map((p) => p.name).join(" – ")}`;

    // First create the tour in the backend
    const newTour = await createTour({
      tourId: `TOUR-${Date.now()}`,
      name: name,
      userId: user.user_id,
      price: Math.round(estimate.perPerson),
      days: days,
      rating: 4.5,
      popularity: 0.1,
      createdAt: new Date().toISOString()
    });

    if (!newTour) {
      alert("Lỗi: Không thể khởi tạo tour trên hệ thống.");
      return;
    }

    // Then create the booking
    const bookingResult = await addBooking({
      userId: user.user_id,
      tourId: newTour.tourId,
      numberOfPeople: people,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
      email: user.email || "",
      phone: user.phone || ""
    });

    if (bookingResult) {
      // Show success message rồi reset form
      setShowSuccess(true);
      setTimeout(() => {
        handleReset();
        setShowSuccess(false);
      }, 1500);
    } else {
      alert("Tour đã được tạo nhưng gặp lỗi khi đặt. Vui lòng thử lại trong Lịch sử.");
    }
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
        <div
          style={{
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "48px 64px",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-lg)",
              textAlign: "center",
              animation: "fadeUp 0.3s ease both",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✓</div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "900",
                color: "var(--primary)",
                marginBottom: "12px",
              }}
            >
              Tour tạo thành công!
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              Tour của bạn đã được thêm vào danh sách đặt tour
            </p>
          </div>
        </div>
      )}

      <div className="ct-header">
        <h1 className="ct-title">Tạo tour tùy chỉnh</h1>
        <p className="ct-sub">
          Chọn tỉnh, địa điểm, ẩm thực và phương tiện — hệ thống ước lượng chi
          phí cho bạn
        </p>
      </div>

      <div className="ct-layout">
        {/* ── CỘT TRÁI ── */}
        <div className="ct-main">
          {/* Step 1: Tỉnh */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="1" active={selProvinces.length > 0} />
              <span className="ct-card-title">Chọn tỉnh</span>
            </div>

            {/* Search bar */}
            <input
              type="text"
              placeholder="🔍 Tìm kiếm tỉnh thành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: "16px",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                fontFamily: "var(--font)",
                backgroundColor: "var(--bg-white)",
                color: "var(--text)",
                transition: "var(--transition)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--primary)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />

            <div className="province-grid">
              {filteredProvinces.map((p) => {
                return (
                  <ProvChip
                    key={p.provinceId}
                    province={p}
                    selected={selProvinces.includes(p.provinceId)}
                    onClick={() => toggleProvince(p.provinceId)}
                  />
                );
              })}
            </div>

            {filteredProvinces.length === 0 && (
              <p className="ct-empty">
                Không tìm thấy tỉnh thành nào khớp với từ khóa "{searchTerm}"
              </p>
            )}
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
              >
                −
              </button>
              <span className="people-num">{people}</span>
              <button
                className="people-btn"
                onClick={() => setPeople((p) => Math.min(50, p + 1))}
                type="button"
              >
                +
              </button>
              <span className="people-label">người</span>
            </div>
          </div>

          {/* Step 2.1: Số ngày đi */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="2.1" active />
              <span className="ct-card-title">Số ngày đi</span>
            </div>

            <div className="people-row">
              <button
                className="people-btn"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                type="button"
              >
                −
              </button>

              <span className="people-num">{days}</span>

              <button
                className="people-btn"
                onClick={() => setDays((d) => Math.min(30, d + 1))}
                type="button"
              >
                +
              </button>

              <span className="people-label">ngày</span>
            </div>
          </div>

          {/* Step 3: Địa điểm & Ẩm thực */}
          <div className="ct-card">
            <div className="ct-card-header">
              <StepBadge n="3" active={totalLocs > 0 || totalFoods > 0} />
              <span className="ct-card-title">
                Địa điểm & Ẩm thực trong từng tỉnh
              </span>
            </div>

            {selProvinces.length === 0 ? (
              <p className="ct-empty">
                Chọn ít nhất 1 tỉnh ở bước 1 để hiện danh sách.
              </p>
            ) : (
              selProvinces.map((pid, idx) => {
                const prov = allProvinces.find((p) => p.provinceId === pid);
                const locs = locsByProv[pid] || [];
                const foods = foodsByProv[pid] || [];
                const sLocs = selLocs[pid] || [];
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
                        <div
                          className="locations-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(150px, 1fr))",
                            gap: "12px",
                            marginBottom: "16px",
                          }}
                        >
                          {locs.map((l) => (
                            <button
                              key={l.locationId}
                              onClick={() => toggleLoc(pid, l.locationId)}
                              style={{
                                border: sLocs.includes(l.locationId)
                                  ? "2px solid var(--primary)"
                                  : "1.5px solid var(--border)",
                                borderRadius: "var(--radius-sm)",
                                overflow: "hidden",
                                cursor: "pointer",
                                background: "var(--bg-white)",
                                transition: "var(--transition)",
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "left",
                                fontFamily: "var(--font)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-4px)";
                                e.currentTarget.style.boxShadow =
                                  "var(--shadow-sm)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {l.image && (
                                <img
                                  src={l.image}
                                  alt={l.name}
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "cover",
                                    backgroundColor: "var(--border-light)",
                                  }}
                                />
                              )}
                              <div
                                style={{
                                  padding: "10px",
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--text)",
                                    marginBottom: "4px",
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {l.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--primary)",
                                    fontWeight: 700,
                                    marginTop: "auto",
                                  }}
                                >
                                  {formatPrice(l.estimatedCost)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {foods.length > 0 && (
                      <>
                        <p className="sub-label" style={{ marginTop: 10 }}>
                          🍜 Ẩm thực đặc sản
                        </p>
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
                      <p className="ct-empty">
                        Chưa có dữ liệu địa điểm / ẩm thực cho tỉnh này.
                      </p>
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
              <span className="ct-card-title">
                Phương tiện di chuyển giữa các tỉnh
              </span>
            </div>

            {transportPairs.length === 0 ? (
              <p className="ct-empty">
                Chọn ít nhất 2 tỉnh để chọn phương tiện.
              </p>
            ) : (
              <div className="transport-list">
                {transportPairs.map(([a, b]) => {
                  const pA = allProvinces.find((p) => p.provinceId === a);
                  const pB = allProvinces.find((p) => p.provinceId === b);
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
                        options={allTransports}
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
              <span className="ct-card-title">
                Đặt tên tour <span className="ct-hint">(tuỳ chọn)</span>
              </span>
            </div>
            <input
              className="tour-name-input"
              type="text"
              placeholder={
                selProvinces.length > 0
                  ? `Tour ${selProvinces
                      .map(
                        (pid) =>
                          allProvinces.find((p) => p.provinceId === pid)?.name,
                      )
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
                <span className="stat-val">{days}</span>
                <span className="stat-label">Số ngày</span>
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
                  const p = allProvinces.find((x) => x.provinceId === pid);
                  return (
                    <span key={pid} className="sidebar-route-item">
                      <span className="sidebar-order">{i + 1}</span>
                      {p?.name}
                      {i < selProvinces.length - 1 && (
                        <span className="sidebar-arrow">→</span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Chi phí realtime */}
            {estimate.perPerson > 0 && (
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
