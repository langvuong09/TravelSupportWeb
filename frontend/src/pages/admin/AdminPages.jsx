// ============================================================
// AdminPages.jsx – Trang quản trị đầy đủ (schema mới)
// Gồm: Dashboard, Tours, Locations, Users, Bookings, Foods, Provinces
// ============================================================
import { useState } from "react";
import {
  mockUsers, mockTours, mockLocations, mockProvinces,
  mockBookings, mockReviews, mockFoods, mockTransportTypes,
  mockTourLocations, mockTourProvinces, mockTourFoods,
  getFullName, getProvince, getLocationsByTour, getProvincesByTour,
  getFoodsByTour, getTransportByTour, getTourThumbnail,
  getTourEstimatedCost, avgRating, formatPrice,
} from "../../data/mockData";
import { Ic, StarRating } from "../../components/UI";

// ── Shared helpers ────────────────────────────────────────────
const Badge = ({ children, color = "blue" }) => {
  const C = {
    blue:   { bg: "var(--primary-light)",  text: "var(--primary)"  },
    green:  { bg: "#dcfce7",               text: "#16a34a"          },
    yellow: { bg: "#fef9c3",               text: "#b45309"          },
    red:    { bg: "#fee2e2",               text: "#dc2626"          },
    gray:   { bg: "var(--surface)",        text: "var(--text-muted)"},
    purple: { bg: "#f3e8ff",               text: "#7c3aed"          },
  }[color] || { bg: "var(--surface)", text: "var(--text-muted)" };
  return (
    <span style={{
      background: C.bg, color: C.text,
      fontSize: 11, fontWeight: 700, padding: "2px 10px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

const StatCard = ({ emoji, label, value, sub, color = "blue" }) => {
  const bg = { blue: "var(--primary-light)", green: "#dcfce7", yellow: "#fef9c3", purple: "#f3e8ff" }[color];
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "22px 24px",
      boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 18,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{emoji}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
};

const SearchBar = ({ value, onChange, placeholder, children }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#fff", border: "1.5px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "9px 14px", flex: 1, minWidth: 200,
    }}>
      <Ic.Search />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }} />
      {value && <button onClick={() => onChange("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>}
    </div>
    {children}
  </div>
);

const Tbl = ({ headers, children, empty }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
          {headers.map((h) => (
            <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: 12 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    {empty && (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
        <div>Không tìm thấy kết quả</div>
      </div>
    )}
  </div>
);

const Tr = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ borderBottom: "1px solid var(--border-light)", cursor: onClick ? "pointer" : "default", transition: "background .15s" }}
    onMouseEnter={(e) => onClick && (e.currentTarget.style.background = "var(--surface)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
    {children}
  </tr>
);
const Td = ({ children, style = {} }) => <td style={{ padding: "11px 14px", verticalAlign: "middle", ...style }}>{children}</td>;

const ConfirmDlg = ({ title, desc, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
    <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: 32, width: "100%", maxWidth: 420, textAlign: "center", boxShadow: "var(--shadow-xl)" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>{desc}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onCancel} className="btn btn-outline">Huỷ</button>
        <button onClick={onConfirm} className="btn" style={{ background: "#ef4444", color: "#fff" }}>Xoá</button>
      </div>
    </div>
  </div>
);

// ── 1. DASHBOARD ─────────────────────────────────────────────
function AdminDashboard() {
  const confirmed     = mockBookings.filter((b) => b.status === "confirmed");
  const totalRevenue  = confirmed.reduce((s, b) => s + getTourEstimatedCost(b.tourId), 0);
  const recentBook    = [...mockBookings].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)).slice(0, 5);
  const recentReviews = [...mockReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const topTours      = mockTours
    .map((t) => ({ ...t, cnt: mockBookings.filter((b) => b.tourId === t.tourId).length, rating: avgRating(t.tourId) }))
    .sort((a, b) => b.cnt - a.cnt).slice(0, 5);

  const stColors = { confirmed: "green", pending: "yellow", cancelled: "red" };
  const stLabels = { confirmed: "Xác nhận", pending: "Chờ", cancelled: "Huỷ" };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Tổng quan hệ thống</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard emoji="🏕️" label="Tours"           value={mockTours.length}        sub="Đang hoạt động"           color="blue"   />
        <StatCard emoji="📍" label="Địa điểm"        value={mockLocations.length}     sub={`${mockProvinces.length} tỉnh thành`}  color="green"  />
        <StatCard emoji="📋" label="Đặt tour"        value={mockBookings.length}      sub={`${confirmed.length} xác nhận`}       color="yellow" />
        <StatCard emoji="👥" label="Người dùng"      value={mockUsers.length}         sub="Đã đăng ký"               color="purple" />
        <StatCard emoji="🍜" label="Ẩm thực"         value={mockFoods.length}         sub="Trong hệ thống"           color="blue"   />
        <StatCard emoji="💰" label="Doanh thu ước tính" value={formatPrice(totalRevenue)} sub="Booking xác nhận"     color="green"  />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📋 Đặt tour gần đây</h3>
          {recentBook.map((b) => {
            const tour = mockTours.find((t) => t.tourId === b.tourId);
            const user = mockUsers.find((u) => u.userId === b.userId);
            return (
              <div key={b.bookingId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <img src={getTourThumbnail(b.tourId)} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{getFullName(user)} · {b.bookedAt}</div>
                </div>
                <Badge color={stColors[b.status]}>{stLabels[b.status]}</Badge>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🏆 Tour nhiều booking nhất</h3>
          {topTours.map((t, i) => (
            <div key={t.tourId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#fef9c3" : "var(--surface)", borderRadius: "50%", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <img src={getTourThumbnail(t.tourId)} alt="" style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.cnt} bookings · ⭐ {Number(t.rating) > 0 ? Number(t.rating).toFixed(1) : "—"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>⭐ Đánh giá gần đây</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {recentReviews.map((r) => {
            const user = mockUsers.find((u) => u.userId === r.userId);
            const tour = mockTours.find((t) => t.tourId === r.tourId);
            return (
              <div key={r.id} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "14px 16px", background: "var(--surface)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{getFullName(user)}</span>
                  <StarRating rating={r.rating} size={12} />
                </div>
                <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600, marginBottom: 6 }}>{tour?.name}</div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{r.comment.slice(0, 90)}{r.comment.length > 90 ? "…" : ""}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 2. TOURS ─────────────────────────────────────────────────
function AdminTours() {
  const [search,  setSearch]  = useState("");
  const [panel,   setPanel]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [tours,   setTours]   = useState(mockTours);

  const filtered = tours.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.tourId.includes(search)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Tour</h2>
        <button className="btn btn-primary btn-sm">+ Thêm tour</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: panel ? "1.2fr 1fr" : "1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm tour theo tên hoặc ID..." />
          <Tbl headers={["Tour", "ID", "Tỉnh thành", "Địa điểm", "Chi phí", "Đánh giá", "Bookings", ""]} empty={filtered.length === 0}>
            {filtered.map((t) => {
              const provinces = getProvincesByTour(t.tourId);
              const locations = getLocationsByTour(t.tourId);
              const cost      = getTourEstimatedCost(t.tourId);
              const rating    = avgRating(t.tourId);
              const bookings  = mockBookings.filter((b) => b.tourId === t.tourId).length;
              return (
                <Tr key={t.tourId} onClick={() => setPanel(t)}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={getTourThumbnail(t.tourId)} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{t.name}</div>
                    </div>
                  </Td>
                  <Td><Badge color="gray">{t.tourId}</Badge></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 160 }}>
                      {provinces.slice(0, 2).map((p) => <Badge key={p.provinceId} color="blue">{p.name}</Badge>)}
                      {provinces.length > 2 && <Badge color="gray">+{provinces.length - 2}</Badge>}
                    </div>
                  </Td>
                  <Td style={{ color: "var(--text-muted)" }}>{locations.length} điểm</Td>
                  <Td style={{ fontWeight: 700, color: "var(--primary)" }}>{cost > 0 ? formatPrice(cost) : "—"}</Td>
                  <Td>{Number(rating) > 0 ? <span>⭐ <strong>{Number(rating).toFixed(1)}</strong></span> : <span style={{ color: "var(--text-light)" }}>—</span>}</Td>
                  <Td><Badge color={bookings > 0 ? "green" : "gray"}>{bookings}</Badge></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={(e) => { e.stopPropagation(); setPanel(t); }} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirm(t); }} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Tbl>
        </div>

        {panel && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22, overflowY: "auto", maxHeight: "80vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{panel.name}</h3>
              <button onClick={() => setPanel(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>✕</button>
            </div>
            <img src={getTourThumbnail(panel.tourId)} alt="" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: 16 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                ["Tour ID",        <Badge color="gray">{panel.tourId}</Badge>],
                ["Chi phí ước tính", <span style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPrice(getTourEstimatedCost(panel.tourId))}</span>],
                ["Địa điểm",      `${getLocationsByTour(panel.tourId).length} điểm`],
                ["Đánh giá",      Number(avgRating(panel.tourId)) > 0 ? `⭐ ${Number(avgRating(panel.tourId)).toFixed(1)}` : "Chưa có"],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Provinces route */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>🗺️ HÀNH TRÌNH</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {getProvincesByTour(panel.tourId).map((p, i, arr) => (
                  <span key={p.provinceId} style={{ display: "flex", alignItems: "center" }}>
                    <Badge color="blue">{p.name}</Badge>
                    {i < arr.length - 1 && <span style={{ margin: "0 2px", color: "var(--text-muted)" }}>→</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>📍 ĐỊA ĐIỂM</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {getLocationsByTour(panel.tourId).map((l) => (
                  <span key={l.locationId} style={{ background: "#f1f5f9", fontSize: 11, padding: "3px 10px", borderRadius: 20, color: "var(--text-muted)" }}>📍 {l.name}</span>
                ))}
              </div>
            </div>

            {/* Transport */}
            {getTransportByTour(panel.tourId).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>🚗 PHƯƠNG TIỆN</div>
                {getTransportByTour(panel.tourId).map((tr, i) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                    {tr.fromProvince?.name} → {tr.toProvince?.name}: <strong>{tr.transport?.name}</strong> ({tr.transport?.costPerKm}đ/km)
                  </div>
                ))}
              </div>
            )}

            {/* Foods */}
            {getFoodsByTour(panel.tourId).length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>🍜 ẨM THỰC</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {getFoodsByTour(panel.tourId).map((f) => <Badge key={f.foodId} color="yellow">{f.name}</Badge>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDlg
          title="Xoá tour này?"
          desc={`Bạn chắc chắn muốn xoá "${confirm.name}"?`}
          onConfirm={() => { setTours((p) => p.filter((t) => t.tourId !== confirm.tourId)); setConfirm(null); if (panel?.tourId === confirm.tourId) setPanel(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── 3. LOCATIONS ─────────────────────────────────────────────
function AdminLocations() {
  const [search,     setSearch]     = useState("");
  const [province,   setProvince]   = useState("Tất cả");
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [locations,  setLocations]  = useState(mockLocations);
  const [confirm,    setConfirm]    = useState(null);

  const types = ["Tất cả", ...new Set(mockLocations.map((l) => l.type))];
  const typeColors = { "Thiên nhiên": "green", "Văn hóa": "purple", "Biển đảo": "blue", "Nghỉ dưỡng": "yellow", "Giải trí": "red" };

  const filtered = locations.filter((l) => {
    const prov = getProvince(l.provinceId);
    return (
      (l.name.toLowerCase().includes(search.toLowerCase()) || prov?.name.toLowerCase().includes(search.toLowerCase())) &&
      (province   === "Tất cả" || prov?.name === province) &&
      (typeFilter === "Tất cả" || l.type === typeFilter)
    );
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Địa điểm</h2>
        <button className="btn btn-primary btn-sm">+ Thêm địa điểm</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm địa điểm, tỉnh thành...">
          <select value={province} onChange={(e) => setProvince(e.target.value)} className="input-field" style={{ width: "auto", padding: "9px 14px" }}>
            <option value="Tất cả">Tất cả tỉnh</option>
            {mockProvinces.map((p) => <option key={p.provinceId} value={p.name}>{p.name}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field" style={{ width: "auto", padding: "9px 14px" }}>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </SearchBar>
        <Tbl headers={["Địa điểm", "Tỉnh", "Loại", "Chi phí", "Tọa độ", "Thời điểm đẹp", "Tours", ""]} empty={filtered.length === 0}>
          {filtered.map((loc) => {
            const prov  = getProvince(loc.provinceId);
            const tours = mockTourLocations.filter((tl) => tl.locationId === loc.locationId).length;
            return (
              <Tr key={loc.locationId}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={loc.image} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{loc.description.slice(0, 48)}…</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge color="blue">{prov?.name}</Badge></Td>
                <Td><Badge color={typeColors[loc.type] || "gray"}>{loc.type}</Badge></Td>
                <Td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPrice(loc.estimatedCost)}</Td>
                <Td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</Td>
                <Td style={{ fontSize: 12 }}>{loc.bestTimeToVisit}</Td>
                <Td><Badge color={tours > 0 ? "green" : "gray"}>{tours}</Badge></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setConfirm(loc)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>
      {confirm && (
        <ConfirmDlg
          title="Xoá địa điểm này?"
          desc={`Xoá "${confirm.name}" sẽ ảnh hưởng các tour liên quan.`}
          onConfirm={() => { setLocations((p) => p.filter((l) => l.locationId !== confirm.locationId)); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── 4. USERS ─────────────────────────────────────────────────
function AdminUsers() {
  const [search,  setSearch]  = useState("");
  const [users,   setUsers]   = useState(mockUsers);
  const [confirm, setConfirm] = useState(null);

  const filtered = users.filter((u) =>
    getFullName(u).toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Người dùng</h2>
        <button className="btn btn-primary btn-sm">+ Thêm user</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, email, username..." />
        <Tbl headers={["Người dùng", "Username", "Email", "Role", "Bookings", "Đánh giá", ""]} empty={filtered.length === 0}>
          {filtered.map((u) => {
            const fullName = getFullName(u);
            const bookings = mockBookings.filter((b) => b.userId === u.userId).length;
            const reviews  = mockReviews.filter((r) => r.userId === u.userId).length;
            return (
              <Tr key={u.userId}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: u.role === "ADMIN" ? "var(--primary)" : "var(--primary-light)",
                      color: u.role === "ADMIN" ? "#fff" : "var(--primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 16, flexShrink: 0,
                    }}>{fullName[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{fullName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.firstName} · {u.lastName}</div>
                    </div>
                  </div>
                </Td>
                <Td style={{ fontFamily: "monospace", fontSize: 12 }}>{u.username}</Td>
                <Td style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email}</Td>
                <Td><Badge color={u.role === "ADMIN" ? "red" : "blue"}>{u.role}</Badge></Td>
                <Td><Badge color={bookings > 0 ? "green" : "gray"}>{bookings}</Badge></Td>
                <Td><Badge color={reviews > 0 ? "yellow" : "gray"}>{reviews}</Badge></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => u.role !== "ADMIN" && setConfirm(u)} disabled={u.role === "ADMIN"}
                      style={{ background: u.role === "ADMIN" ? "#f1f5f9" : "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: u.role === "ADMIN" ? "not-allowed" : "pointer", color: u.role === "ADMIN" ? "#94a3b8" : "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>
      {confirm && (
        <ConfirmDlg
          title="Xoá người dùng này?"
          desc={`Xoá tài khoản "${getFullName(confirm)}" (${confirm.email})?`}
          onConfirm={() => { setUsers((p) => p.filter((u) => u.userId !== confirm.userId)); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── 5. BOOKINGS ───────────────────────────────────────────────
function AdminBookings() {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("Tất cả");
  const [bookings, setBookings] = useState(mockBookings);

  const stColors = { confirmed: "green", pending: "yellow", cancelled: "red" };
  const stLabels = { confirmed: "Xác nhận", pending: "Chờ xử lý", cancelled: "Đã huỷ" };

  const filtered = bookings.filter((b) => {
    const tour = mockTours.find((t) => t.tourId === b.tourId);
    const user = mockUsers.find((u) => u.userId === b.userId);
    return (
      (tour?.name.toLowerCase().includes(search.toLowerCase()) || getFullName(user).toLowerCase().includes(search.toLowerCase()) || String(b.bookingId).includes(search)) &&
      (status === "Tất cả" || b.status === status)
    );
  });

  const revenue = filtered.filter((b) => b.status === "confirmed").reduce((s, b) => s + getTourEstimatedCost(b.tourId), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Đặt Tour</h2>
        <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary-border)", borderRadius: "var(--radius-md)", padding: "10px 18px", fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>
          💰 Doanh thu hiển thị: {formatPrice(revenue)}
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tour, người dùng, booking ID...">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field" style={{ width: "auto", padding: "9px 14px" }}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="confirmed">Xác nhận</option>
            <option value="pending">Chờ xử lý</option>
            <option value="cancelled">Đã huỷ</option>
          </select>
        </SearchBar>
        <Tbl headers={["Booking ID", "Tour", "Khách hàng", "Ngày đặt", "Chi phí ước tính", "Trạng thái", "Cập nhật"]} empty={filtered.length === 0}>
          {filtered.map((b) => {
            const tour = mockTours.find((t) => t.tourId === b.tourId);
            const user = mockUsers.find((u) => u.userId === b.userId);
            const cost = getTourEstimatedCost(b.tourId);
            return (
              <Tr key={b.bookingId}>
                <Td><Badge color="gray">#{b.bookingId}</Badge></Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={getTourThumbnail(b.tourId)} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour?.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.tourId}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{getFullName(user)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{user?.email}</div>
                </Td>
                <Td style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.bookedAt}</Td>
                <Td style={{ fontWeight: 700, color: "var(--primary)" }}>{cost > 0 ? formatPrice(cost) : "Liên hệ"}</Td>
                <Td><Badge color={stColors[b.status] || "gray"}>{stLabels[b.status] || b.status}</Badge></Td>
                <Td>
                  <select value={b.status} onChange={(e) => setBookings((p) => p.map((x) => x.bookingId === b.bookingId ? { ...x, status: e.target.value } : x))}
                    style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Xác nhận</option>
                    <option value="cancelled">Huỷ</option>
                  </select>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>
    </div>
  );
}

// ── 6. FOODS ─────────────────────────────────────────────────
function AdminFoods() {
  const [search,   setSearch]   = useState("");
  const [province, setProvince] = useState("Tất cả");
  const [foods,    setFoods]    = useState(mockFoods);
  const [confirm,  setConfirm]  = useState(null);

  const typeColors = { "Đặc sản": "yellow", "Hải sản": "blue", "Chay": "green", "Street food": "red", "Tráng miệng": "purple" };
  const filtered = foods.filter((f) => {
    const prov = getProvince(f.provinceId);
    return f.name.toLowerCase().includes(search.toLowerCase()) && (province === "Tất cả" || prov?.name === province);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Ẩm thực</h2>
        <button className="btn btn-primary btn-sm">+ Thêm món ăn</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm tên món ăn...">
          <select value={province} onChange={(e) => setProvince(e.target.value)} className="input-field" style={{ width: "auto", padding: "9px 14px" }}>
            <option value="Tất cả">Tất cả tỉnh</option>
            {mockProvinces.map((p) => <option key={p.provinceId} value={p.name}>{p.name}</option>)}
          </select>
        </SearchBar>
        <Tbl headers={["Tên món", "Tỉnh", "Loại", "Giá ước tính", "Tọa độ", "Tour có mặt", ""]} empty={filtered.length === 0}>
          {filtered.map((f) => {
            const prov  = getProvince(f.provinceId);
            const tours = mockTourFoods.filter((tf) => tf.foodId === f.foodId).length;
            return (
              <Tr key={f.foodId}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={f.image} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{(f.description || "").slice(0, 40)}…</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge color="blue">{prov?.name}</Badge></Td>
                <Td><Badge color={typeColors[f.type] || "gray"}>{f.type}</Badge></Td>
                <Td style={{ fontWeight: 700 }}>{formatPrice(f.estimatedPrice)}</Td>
                <Td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{f.latitude?.toFixed(4)}, {f.longitude?.toFixed(4)}</Td>
                <Td><Badge color={tours > 0 ? "green" : "gray"}>{tours} tour</Badge></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setConfirm(f)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>
      {confirm && (
        <ConfirmDlg
          title="Xoá món ăn này?"
          desc={`Xoá "${confirm.name}" khỏi hệ thống?`}
          onConfirm={() => { setFoods((p) => p.filter((f) => f.foodId !== confirm.foodId)); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── 7. PROVINCES ─────────────────────────────────────────────
function AdminProvinces() {
  const [search, setSearch] = useState("");
  const filtered = mockProvinces.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Tỉnh / Thành phố</h2>
        <button className="btn btn-primary btn-sm">+ Thêm tỉnh</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm tỉnh thành..." />
        <Tbl headers={["Province ID", "Tên tỉnh", "Số địa điểm", "Số món ăn", "Số tour", ""]} empty={filtered.length === 0}>
          {filtered.map((p) => {
            const locCnt  = mockLocations.filter((l) => l.provinceId === p.provinceId).length;
            const foodCnt = mockFoods.filter((f) => f.provinceId === p.provinceId).length;
            const tourCnt = mockTourProvinces.filter((tp) => tp.provinceId === p.provinceId).length;
            return (
              <Tr key={p.provinceId}>
                <Td><Badge color="gray">#{p.provinceId}</Badge></Td>
                <Td><span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span></Td>
                <Td><Badge color={locCnt  > 0 ? "blue"   : "gray"}>{locCnt}  địa điểm</Badge></Td>
                <Td><Badge color={foodCnt > 0 ? "yellow" : "gray"}>{foodCnt} món</Badge></Td>
                <Td><Badge color={tourCnt > 0 ? "green"  : "gray"}>{tourCnt} tour</Badge></Td>
                <Td>
                  <button style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>
    </div>
  );
}

// ── MAIN LAYOUT ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Tổng quan",  emoji: "📊" },
  { id: "tours",     label: "Tours",      emoji: "🏕️" },
  { id: "locations", label: "Địa điểm",  emoji: "📍" },
  { id: "foods",     label: "Ẩm thực",   emoji: "🍜" },
  { id: "provinces", label: "Tỉnh thành",emoji: "🗺️" },
  { id: "bookings",  label: "Đặt tour",  emoji: "📋" },
  { id: "users",     label: "Người dùng",emoji: "👥" },
];

export default function AdminPages() {
  const [tab, setTab] = useState("dashboard");

  const pages = {
    dashboard: <AdminDashboard />,
    tours:     <AdminTours />,
    locations: <AdminLocations />,
    foods:     <AdminFoods />,
    provinces: <AdminProvinces />,
    bookings:  <AdminBookings />,
    users:     <AdminUsers />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "#fff", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--primary)" }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Travel VN</div>
          </div>
        </div>

        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {NAV_ITEMS.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              border: "none", cursor: "pointer", textAlign: "left",
              background: tab === n.id ? "var(--primary-light)" : "transparent",
              color: tab === n.id ? "var(--primary)" : "var(--text-muted)",
              fontWeight: tab === n.id ? 800 : 500,
              fontSize: 13, marginBottom: 2, transition: "all .15s",
            }}>
              <span style={{ fontSize: 16 }}>{n.emoji}</span>
              {n.label}
              {tab === n.id && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-light)" }}>
          {[["🏕️", mockTours.length, "tours"], ["📍", mockLocations.length, "địa điểm"], ["📋", mockBookings.length, "bookings"]].map(([e, v, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{e}</span>
              <span style={{ fontWeight: 800, fontSize: 13 }}>{v}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</span>
            </div>
          ))}
        </div>
      </aside>

      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {pages[tab]}
      </main>
    </div>
  );
}

// ── Named exports cho App.jsx và AdminDashboard.jsx ──────────
export {
  AdminTours,
  AdminLocations,
  AdminUsers,
  AdminBookings,
  AdminFoods,
  AdminProvinces,
};

// AdminReviews chưa có trong file gốc – tạo nhanh ở đây
export function AdminReviews() {
  const [search, setSearch] = useState("");
  const filtered = mockReviews.filter((r) => {
    const u    = mockUsers.find((u) => u.userId === r.userId);
    const tour = mockTours.find((t) => t.tourId === r.tourId);
    const q    = search.toLowerCase();
    return (
      getFullName(u).toLowerCase().includes(q) ||
      (tour?.name || "").toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Đánh giá</h2>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{filtered.length} đánh giá</span>
      </div>

      <input
        className="input-field"
        style={{ maxWidth: 360, marginBottom: 16 }}
        placeholder="Tìm theo tên, tour, nội dung..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((r) => {
          const u         = mockUsers.find((u) => u.userId === r.userId);
          const tour      = mockTours.find((t) => t.tourId === r.tourId);
          const thumbnail = getTourThumbnail(r.tourId);
          return (
            <div key={r.id} style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "14px 18px",
              display: "flex", gap: 14, alignItems: "flex-start",
              boxShadow: "var(--shadow-sm)",
            }}>
              <img src={thumbnail} alt="" style={{ width: 60, height: 46, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{getFullName(u)}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12, margin: "0 8px" }}>→</span>
                    <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13 }}>{tour?.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-light)" }}>{r.createdAt}</div>
                </div>
                <StarRating rating={r.rating} size={13} />
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{r.comment}</p>
              </div>
              <button className="btn btn-danger btn-xs" style={{ flexShrink: 0 }}>Xoá</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminTransport() {
  // dùng mockTransportTypes từ import ở đầu file

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Loại phương tiện</h2>
        <button className="btn btn-primary btn-sm">+ Thêm</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
              {["ID", "Tên phương tiện", "Chi phí/km", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTransportTypes.map((t) => (
              <tr key={t.transportId} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace" }}>{t.transportId}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700 }}>{t.name}</td>
                <td style={{ padding: "10px 14px", color: "var(--primary)", fontWeight: 700 }}>
                  {t.costPerKm.toLocaleString("vi-VN")}đ/km
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline btn-xs">Sửa</button>
                    <button className="btn btn-danger btn-xs">Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
