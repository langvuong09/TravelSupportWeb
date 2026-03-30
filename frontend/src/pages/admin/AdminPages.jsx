// ============================================================
// AdminPages.jsx – Trang quản trị (schema mới)
// Gồm: Dashboard, Locations, Users, Bookings, Foods, Provinces, Transport
// ============================================================
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  mockUsers, mockTours, mockLocations, mockProvinces,
  mockBookings, mockReviews, mockFoods, mockTransportTypes,
  mockTourLocations, mockTourProvinces, mockTourFoods,
  getFullName, getProvince, getLocationsByTour, getProvincesByTour,
  getFoodsByTour, getTransportByTour, getTourThumbnail,
  getTourEstimatedCost, avgRating, formatPrice,
} from "../../data/mockData";
import { Ic, StarRating } from "../../components/UI";
import ConfirmDialog from "../../components/ConfirmDialog";
import LocationModal from "../../components/LocationModal";
import UserModal from "../../components/UserModal";
import FoodModal from "../../components/FoodModal";
import ProvinceModal from "../../components/ProvinceModal";
import TransportModal from "../../components/TransportModal";
import Toast from "../../components/Toast";

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

// ── 1. DASHBOARD ─────────────────────────────────────────────
function AdminDashboard() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Tổng quan hệ thống</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard emoji="📍" label="Địa điểm"        value={mockLocations.length}     sub={`${mockProvinces.length} tỉnh thành`}  color="green"  />
        <StatCard emoji="👥" label="Người dùng"      value={mockUsers.length}         sub="Đã đăng ký"               color="purple" />
        <StatCard emoji="🍜" label="Ẩm thực"         value={mockFoods.length}         sub="Trong hệ thống"           color="blue"   />
        <StatCard emoji="🗺️" label="Tỉnh / Thành phố" value={mockProvinces.length}  sub="Phủ sóng toàn quốc"      color="cyan"   />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Chào mừng đến Admin Panel</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>Quản lý địa điểm, ẩm thực, tỉnh thành và người dùng từ đây</p>
      </div>
    </div>
  );
}

// ── 2. LOCATIONS ─────────────────────────────────────────────
function AdminLocations() {
  const [search,     setSearch]     = useState("");
  const [province,   setProvince]   = useState("Tất cả");
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [locations,  setLocations]  = useState(mockLocations);
  const [confirm,    setConfirm]    = useState(null);
  const [modal,      setModal]      = useState(null); // 'add' | 'edit' | null
  const [editItem,   setEditItem]   = useState(null);
  const [formData,   setFormData]   = useState({});
  const [toast,      setToast]      = useState(null);

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

  const handleAddClick = () => {
    setFormData({ name: "", description: "", type: "Thiên nhiên", provinceId: mockProvinces[0]?.provinceId, estimatedCost: 0, latitude: 0, longitude: 0, bestTimeToVisit: "", image: "" });
    setEditItem(null);
    setModal("add");
  };

  const handleEditClick = (loc) => {
    setFormData({ ...loc });
    setEditItem(loc);
    setModal("edit");
  };

  const handleSave = () => {
    if (!formData.name) {
      setToast({ message: "Tên địa điểm không được trống", type: "error" });
      return;
    }
    if (modal === "add") {
      const newId = Math.max(...locations.map(l => l.locationId || 0), 0) + 1;
      setLocations([...locations, { ...formData, locationId: newId }]);
      setToast({ message: "✅ Thêm địa điểm thành công", type: "success" });
    } else if (modal === "edit") {
      setLocations(locations.map(l => l.locationId === editItem.locationId ? { ...formData, locationId: editItem.locationId } : l));
      setToast({ message: "✅ Cập nhật địa điểm thành công", type: "success" });
    }
    setModal(null);
  };

  const handleDelete = (loc) => {
    setLocations((p) => p.filter((l) => l.locationId !== loc.locationId));
    setToast({ message: "✅ Xoá địa điểm thành công", type: "success" });
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Địa điểm</h2>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm">+ Thêm địa điểm</button>
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
                    <button onClick={() => handleEditClick(loc)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setConfirm(loc)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>

      {modal && (
        <LocationModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Xoá địa điểm này?"
          desc={`Xoá "${confirm.name}" sẽ ảnh hưởng các tour liên quan.`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
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
  const [modal,   setModal]   = useState(null);
  const [formData, setFormData] = useState({});
  const [toast,   setToast]   = useState(null);

  const filtered = users.filter((u) =>
    getFullName(u).toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({ firstName: "", lastName: "", username: "", email: "", role: "USER" });
    setModal("add");
  };

  const handleEditClick = (u) => {
    setFormData({ ...u });
    setModal("edit");
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.email) {
      setToast({ message: "Vui lòng điền đầy đủ thông tin", type: "error" });
      return;
    }
    if (modal === "add") {
      const newId = Math.max(...users.map(u => u.userId || 0), 0) + 1;
      setUsers([...users, { ...formData, userId: newId }]);
      setToast({ message: "✅ Thêm người dùng thành công", type: "success" });
    } else {
      setUsers(users.map(u => u.userId === formData.userId ? formData : u));
      setToast({ message: "✅ Cập nhật người dùng thành công", type: "success" });
    }
    setModal(null);
  };

  const handleDelete = (u) => {
    setUsers((p) => p.filter((user) => user.userId !== u.userId));
    setToast({ message: "✅ Xoá người dùng thành công", type: "success" });
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Người dùng</h2>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm">+ Thêm user</button>
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
                    <button onClick={() => handleEditClick(u)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => u.role !== "ADMIN" && setConfirm(u)} disabled={u.role === "ADMIN"}
                      style={{ background: u.role === "ADMIN" ? "#f1f5f9" : "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: u.role === "ADMIN" ? "not-allowed" : "pointer", color: u.role === "ADMIN" ? "#94a3b8" : "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>

      {modal && (
        <UserModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Xoá người dùng này?"
          desc={`Xoá tài khoản "${getFullName(confirm)}" (${confirm.email})?`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ── 5. FOODS ─────────────────────────────────────────────────
function AdminFoods() {
  const [search,   setSearch]   = useState("");
  const [province, setProvince] = useState("Tất cả");
  const [foods,    setFoods]    = useState(mockFoods);
  const [confirm,  setConfirm]  = useState(null);
  const [modal,    setModal]    = useState(null);
  const [formData, setFormData] = useState({});
  const [toast,    setToast]    = useState(null);

  const typeColors = { "Đặc sản": "yellow", "Hải sản": "blue", "Chay": "green", "Street food": "red", "Tráng miệng": "purple" };
  const foodTypes = ["Đặc sản", "Hải sản", "Chay", "Street food", "Tráng miệng"];
  
  const filtered = foods.filter((f) => {
    const prov = getProvince(f.provinceId);
    return f.name.toLowerCase().includes(search.toLowerCase()) && (province === "Tất cả" || prov?.name === province);
  });

  const handleAddClick = () => {
    setFormData({ name: "", description: "", type: "Đặc sản", provinceId: mockProvinces[0]?.provinceId, estimatedPrice: 0, latitude: 0, longitude: 0, image: "" });
    setModal("add");
  };

  const handleEditClick = (f) => {
    setFormData({ ...f });
    setModal("edit");
  };

  const handleSave = () => {
    if (!formData.name) {
      setToast({ message: "Tên món ăn không được trống", type: "error" });
      return;
    }
    if (modal === "add") {
      const newId = Math.max(...foods.map(f => f.foodId || 0), 0) + 1;
      setFoods([...foods, { ...formData, foodId: newId }]);
      setToast({ message: "✅ Thêm món ăn thành công", type: "success" });
    } else {
      setFoods(foods.map(f => f.foodId === formData.foodId ? formData : f));
      setToast({ message: "✅ Cập nhật món ăn thành công", type: "success" });
    }
    setModal(null);
  };

  const handleDelete = (f) => {
    setFoods((p) => p.filter((food) => food.foodId !== f.foodId));
    setToast({ message: "✅ Xoá món ăn thành công", type: "success" });
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Ẩm thực</h2>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm">+ Thêm món ăn</button>
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
                    <button onClick={() => handleEditClick(f)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setConfirm(f)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>

      {modal && (
        <FoodModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Xoá món ăn này?"
          desc={`Xoá "${confirm.name}" khỏi hệ thống?`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ── 7. PROVINCES ─────────────────────────────────────────────
function AdminProvinces() {
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState(mockProvinces);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);

  const filtered = provinces.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddClick = () => {
    setFormData({ name: "", description: "" });
    setModal("add");
  };

  const handleEditClick = (p) => {
    setFormData({ ...p });
    setModal("edit");
  };

  const handleSave = () => {
    if (!formData.name) {
      setToast({ message: "Tên tỉnh không được trống", type: "error" });
      return;
    }
    if (modal === "add") {
      const newId = Math.max(...provinces.map(p => p.provinceId || 0), 0) + 1;
      setProvinces([...provinces, { ...formData, provinceId: newId }]);
      setToast({ message: "✅ Thêm tỉnh thành công", type: "success" });
    } else {
      setProvinces(provinces.map(p => p.provinceId === formData.provinceId ? formData : p));
      setToast({ message: "✅ Cập nhật tỉnh thành công", type: "success" });
    }
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Tỉnh / Thành phố</h2>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm">+ Thêm tỉnh</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm tỉnh thành..." />
        <Tbl headers={["Province ID", "Tên tỉnh", "Số địa điểm", "Số món ăn", ""]} empty={filtered.length === 0}>
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

                <Td>
                  <button onClick={() => handleEditClick(p)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                </Td>
              </Tr>
            );
          })}
        </Tbl>
      </div>

      {modal && (
        <ProvinceModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ── MAIN LAYOUT ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Tổng quan",  emoji: "📊" },
  { id: "locations", label: "Địa điểm",  emoji: "📍" },
  { id: "foods",     label: "Ẩm thực",   emoji: "🍜" },
  { id: "provinces", label: "Tỉnh thành",emoji: "🗺️" },
  { id: "users",     label: "Người dùng",emoji: "👥" },
];

export default function AdminPages() {
  const [tab, setTab] = useState("dashboard");
  const location = useLocation();

  // Sync tab state with URL pathname
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("locations")) setTab("locations");
    else if (pathname.includes("foods")) setTab("foods");
    else if (pathname.includes("provinces")) setTab("provinces");
    else if (pathname.includes("users")) setTab("users");
    else if (pathname.includes("reviews")) setTab("reviews");
    else setTab("dashboard");
  }, [location.pathname]);

  const pages = {
    dashboard: <AdminDashboard />,
    locations: <AdminLocations />,
    foods:     <AdminFoods />,
    provinces: <AdminProvinces />,
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
          {[["📍", mockLocations.length, "địa điểm"], ["📋", mockBookings.length, "bookings"]].map(([e, v, l]) => (
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
  AdminLocations,
  AdminUsers,
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
  const [transports, setTransports] = useState(mockTransportTypes);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [confirm, setConfirm] = useState(null);

  const handleAddClick = () => {
    setFormData({ name: "", costPerKm: 0 });
    setModal("add");
  };

  const handleEditClick = (t) => {
    setFormData({ ...t });
    setModal("edit");
  };

  const handleSave = () => {
    if (!formData.name || formData.costPerKm < 0) return alert("Vui lòng điền đầy đủ thông tin");
    if (modal === "add") {
      const newId = Math.max(...transports.map(t => t.transportId || 0), 0) + 1;
      setTransports([...transports, { ...formData, transportId: newId }]);
    } else {
      setTransports(transports.map(t => t.transportId === formData.transportId ? formData : t));
    }
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Loại phương tiện</h2>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm">+ Thêm phương tiện</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
              {["ID", "Tên phương tiện", "Chi phí/km", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transports.map((t) => (
              <tr key={t.transportId} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace" }}>{t.transportId}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700 }}>{t.name}</td>
                <td style={{ padding: "10px 14px", color: "var(--primary)", fontWeight: 700 }}>
                  {t.costPerKm.toLocaleString("vi-VN")}đ/km
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleEditClick(t)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️ Sửa</button>
                    <button onClick={() => setConfirm(t)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️ Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <TransportModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Xoá phương tiện này?"
          desc={`Xoá "${confirm.name}" khỏi hệ thống?`}
          onConfirm={() => { setTransports((p) => p.filter((t) => t.transportId !== confirm.transportId)); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
