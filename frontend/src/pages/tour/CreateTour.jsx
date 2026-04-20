import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getProvinces,
  getLocations,
  getFoods,
  getTransports,
  getRecommendations,
  formatPrice,
  createTour,
} from "../../services/api";
import {
  parseRecommendationProvinces,
  findLocationByName,
  getDist,
} from "../../services/locationHelpers";
import {
  StepBadge,
  ProvChip,
  LocationItem,
  FoodPill,
  TransportSelector,
} from "./CreateTourComponents";
import "../../styles/global.css";

export default function CreateTour() {
  const { user } = useAuth();
  const nav = useNavigate();

  // ── Dữ liệu từ API ──────────────────────────────────────────
  const [allProvinces, setAllProvinces] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [allTransports, setAllTransports] = useState([]);
  const [recLocs, setRecLocs] = useState({}); 
  const [loadingData, setLoadingData] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);

  // ── Trạng thái lựa chọn ───────────────────────────────────────
  const [selProvinces, setSelProvinces] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [people, setPeople] = useState(1);
  const [days, setDays] = useState(3);
  const [selLocs, setSelLocs] = useState({}); 
  const [selFoods, setSelFoods] = useState({}); 
  const [selTransport, setSelTransport] = useState(null); 
  const [tourName, setTourName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [prefilledFromRecommendation, setPrefilledFromRecommendation] = useState(false);
  
  const location = useLocation();
  const initialRecommendation = location.state?.recommendation;

  useEffect(() => {
    const loadInitialData = async () => {
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
        console.error("Lỗi khi tải dữ liệu khởi tạo:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadInitialData();
  }, []);

  // Xử lý dữ liệu chuyển trang từ đề xuất nếu có
  useEffect(() => {
    if (!loadingData && initialRecommendation && !prefilledFromRecommendation) {
        if (initialRecommendation.tourName) setTourName(initialRecommendation.tourName);
        if (initialRecommendation.duration_days) setDays(Number(initialRecommendation.duration_days));

        let provinceIds = Array.isArray(initialRecommendation.provinceId)
          ? initialRecommendation.provinceId.filter(id => Number.isInteger(id))
          : [];

        if (initialRecommendation.province && provinceIds.length === 0) {
          provinceIds = parseRecommendationProvinces(initialRecommendation.province, allProvinces);
        }

        if (provinceIds.length > 0) setSelProvinces(provinceIds);
        setPrefilledFromRecommendation(true);
    }
  }, [loadingData, initialRecommendation, allProvinces, prefilledFromRecommendation]);

  // Lấy gợi ý địa điểm từ AI Service
  useEffect(() => {
    if (selProvinces.length === 0) {
      setRecLocs({});
      return;
    }

    const fetchRecommendations = async () => {
      setLoadingRec(true);
      try {
        const currentUserId = user?.user_id || 0; 
        const data = await getRecommendations({
          user_id: currentUserId,
          province_ids: selProvinces,
          topK: 5
        });
        
        const grouped = {};
        (data.recommendations || []).forEach(r => {
          const targetId = r.locationId;
          const loc = allLocations.find(l => String(l.locationId) === String(targetId));
          
          const finalData = {
            locationId: targetId,
            name: r.locationName || (loc ? loc.name : ""),
            image: r.image || (loc ? loc.image : ""),
            province: r.province || (loc ? loc.provinceName : ""),
            estimatedPrice: r.estimatedPrice || (loc ? (loc.estimatedPrice || loc.estimated_cost) : 0),
            score: r.hybridScore || r.score || 0,
            provinceId: loc ? loc.provinceId : (allProvinces.find(p => p.name === r.province || p.name.includes(r.province))?.provinceId)
          };

          if (finalData.provinceId) {
            const pid = String(finalData.provinceId);
            if (!grouped[pid]) grouped[pid] = [];
            grouped[pid].push(finalData);
          }
        });
        setRecLocs(grouped);
      } catch (err) {
        console.error("Lỗi khi lấy gợi ý AI:", err);
      } finally {
        setLoadingRec(false);
      }
    };

    fetchRecommendations();
  }, [selProvinces, user?.user_id, allLocations, allProvinces]);

  const filteredProvinces = useMemo(() => {
    if (!searchTerm.trim()) return allProvinces;
    const term = searchTerm.toLowerCase();
    return allProvinces.filter((p) => p.name.toLowerCase().includes(term));
  }, [searchTerm, allProvinces]);

  const foodsByProv = useMemo(() => {
    const map = {};
    selProvinces.forEach((pid) => {
      map[pid] = allFoods.filter((f) => String(f.provinceId) === String(pid));
    });
    return map;
  }, [selProvinces, allFoods]);

  const orderedSelectedLocations = useMemo(() => {
    const list = [];
    selProvinces.forEach((pid) => {
      const pLocs = selLocs[pid] || [];
      pLocs.forEach((lid) => {
        // Tìm trong recLocs trước vì nó chứa data cập nhật nhất từ AI
        let found = null;
        Object.values(recLocs).forEach(group => {
            const match = group.find(x => String(x.locationId) === String(lid));
            if (match) found = match;
        });
        // Nếu không có trong rec thì tìm trong allLocations
        if (!found) found = allLocations.find(lx => String(lx.locationId) === String(lid));
        if (found) list.push(found);
      });
    });
    return list;
  }, [selProvinces, selLocs, allLocations, recLocs]);

  const transportPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < orderedSelectedLocations.length - 1; i++) {
      pairs.push([
        orderedSelectedLocations[i],
        orderedSelectedLocations[i + 1],
      ]);
    }
    return pairs;
  }, [orderedSelectedLocations]);

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

    // Lấy ID phương tiện: ưu tiên cái đã chọn, nếu chưa chọn lấy cái đầu tiên từ DB
    const globalTId = selTransport || (allTransports.length > 0 ? allTransports[0].transportId : null);
    const globalTransport = allTransports.find((x) => x.transportId === globalTId);

    transportPairs.forEach(([locA, locB]) => {
      if (globalTransport && globalTransport.costPerKm > 0) {
        transportCost += globalTransport.costPerKm * getDist(locA.locationId, locB.locationId, locA.provinceId, locB.provinceId);
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
      .map((pid) => allProvinces.find((p) => String(p.provinceId) === String(pid)))
      .filter(Boolean);
    const name =
      tourName.trim() || `Tour ${provinces.map((p) => p.name).join(" – ")}`;

    // Thu thập danh sách ID
    const locationIds = Object.values(selLocs).flat();
    const foodIds = Object.values(selFoods).flat();
    const transportId = selTransport ? selTransport.transportId : null;

    setLoadingRec(true);
    try {
      const newTour = await createTour({
        tourId: `TOUR-${Date.now()}`,
        name: name,
        userId: user.user_id,
        price: Math.round(estimate.perPerson * people), // Tổng giá cho cả đoàn
        days: days,
        rating: 4.5,
        popularity: 0.1,
        createdAt: new Date().toISOString(),
        // Các ID liên kết
        provinceIds: selProvinces,
        locationIds,
        foodIds,
        transportId
      });

      if (newTour && newTour.tourId) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          nav("/my-bookings"); // Chuyển sang danh sách tour đã đặt
        }, 2000);
      } else {
        alert("Lỗi: Không thể lưu tour vào hệ thống.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo tour:", err);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoadingRec(false);
    }
  };

  const handleReset = () => {
    setSelProvinces([]);
    setPeople(1);
    setSelLocs({});
    setSelFoods({});
    setSelTransport(null);
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
              Tour lưu thành công!
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              Tour của bạn đã được thêm vào danh sách cá nhân
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
              <span className="ct-card-title">Chọn tỉnh thành</span>
            </div>

            {/* Chỉ hiện search bar nếu có nhiều tỉnh thành */}
            {allProvinces.length > 1 && (
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
            )}

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
                Địa điểm & Ẩm thực trong khu vực
              </span>
            </div>

            {selProvinces.length === 0 ? (
              <p className="ct-empty">
                Chọn ít nhất 1 tỉnh ở bước 1 để hiện danh sách.
              </p>
            ) : (
              selProvinces.map((pid, idx) => {
                const prov = allProvinces.find((p) => String(p.provinceId) === String(pid));
                const foods = foodsByProv[pid] || [];
                const sLocs = selLocs[pid] || [];
                const sFoods = selFoods[pid] || [];

                return (
                  <div key={pid} className="prov-section">
                    <div className="prov-section-title">
                      <span className="prov-section-badge">{idx + 1}</span>
                      {prov?.name}
                    </div>

                    <div className="prov-content-area">
                      {/* --- PHẦN ĐỊA ĐIỂM --- */}
                      <p className="sub-label">⭐ Đề xuất dành cho bạn (Top 5)</p>
                      <div className="locations-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "12px",
                        marginBottom: "20px"
                      }}>
                        {/* Chỉ hiển thị đề xuất từ AI */}
                        {recLocs[pid]?.map((l) => (
                          <LocationItem
                             key={`rec-${l.locationId}`}
                             l={l}
                             isSuggested={true}
                             selected={sLocs.includes(l.locationId)}
                             onClick={() => toggleLoc(pid, l.locationId)}
                          />
                        ))}
                      </div>

                      {/* --- PHẦN ẨM THỰC --- */}
                      {foods.length > 0 && (
                        <>
                          <p className="sub-label" style={{ marginTop: "24px", marginBottom: "12px" }}>🍱 Ẩm thực khu vực {prov?.name}</p>
                          <div className="food-pills" style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "12px",
                            padding: "4px"
                          }}>
                            {foods.map((f, fidx) => (
                              <FoodPill
                                key={f.foodId}
                                f={f}
                                // Mock gợi ý: 2 món đầu tiên thường là signature
                                isSuggested={fidx < 2}
                                selected={sFoods.includes(f.foodId)}
                                onClick={() => toggleFood(pid, f.foodId)}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {(!recLocs[pid] || recLocs[pid].length === 0) && foods.length === 0 && (
                        <p className="ct-empty">
                          Chưa có dữ liệu địa điểm gợi ý / ẩm thực cho tỉnh này.
                        </p>
                      )}
                    </div>
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
                Phương tiện di chuyển giữa các địa điểm
              </span>
            </div>

            {transportPairs.length === 0 ? (
              <p className="ct-empty">
                Chọn ít nhất 2 địa điểm ở bước 3 để tính toán phương tiện.
              </p>
            ) : (
              <div className="transport-list">
                <div style={{ marginBottom: 20, padding: 15, background: "var(--primary-light)", borderRadius: "var(--radius-sm)" }}>
                  <label style={{ display: "block", marginBottom: 10, fontWeight: 700, fontSize: 14 }}>
                    Chọn phương tiện di chuyển:
                  </label>
                  <TransportSelector
                    options={allTransports}
                    value={selTransport || (allTransports.length > 0 ? allTransports[0].transportId : null)}
                    onChange={(tId) => setSelTransport(tId)}
                  />
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10 }}>
                  Lộ trình di chuyển:
                </p>
                <div style={{ 
                  padding: "15px", 
                  border: "1px solid var(--border-light)", 
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-white)"
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    {orderedSelectedLocations.map((loc, i) => {
                      const prov = allProvinces.find(p => p.provinceId === loc.provinceId);
                      return (
                        <div key={loc.locationId} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{loc.name}</span>
                            <span style={{ fontSize: 10, color: "var(--primary)" }}>{prov?.name || "N/A"}</span>
                          </div>
                          {i < orderedSelectedLocations.length - 1 && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 5px" }}>
                              <span style={{ color: "var(--primary)", fontWeight: 900 }}>→</span>
                              <span style={{ fontSize: 10, color: "var(--primary)" }}>
                                ~{getDist(loc.locationId, orderedSelectedLocations[i+1].locationId, loc.provinceId, orderedSelectedLocations[i+1].provinceId)}km
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 15, paddingTop: 10, borderTop: "1px solid var(--border-light)", fontSize: 13, color: "var(--text-muted)" }}>
                    Tổng quãng đường dự kiến: <strong style={{ color: "var(--text)" }}>
                      {transportPairs.reduce((acc, [a, b]) => acc + getDist(a.locationId, b.locationId, a.provinceId, b.provinceId), 0)} km
                    </strong>
                  </div>
                </div>
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

            {/* Route chi tiết địa điểm */}
            {orderedSelectedLocations.length > 0 && (
              <div className="sidebar-route">
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>Hành trình dự kiến:</p>
                {orderedSelectedLocations.map((loc, i) => {
                  const prov = allProvinces.find(p => p.provinceId === loc.provinceId);
                  return (
                    <span key={loc.locationId} className="sidebar-route-item" style={{ fontSize: 12 }}>
                      <span className="sidebar-order">{i + 1}</span>
                      <div style={{ display: "inline-block" }}>
                        <div>{loc.name}</div>
                        <div style={{ fontSize: 10, color: "var(--primary)" }}>{prov?.name}</div>
                      </div>
                      {i < orderedSelectedLocations.length - 1 && (
                        <span className="sidebar-arrow">↓</span>
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
