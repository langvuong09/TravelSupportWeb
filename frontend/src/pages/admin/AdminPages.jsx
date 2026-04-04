// ============================================================
// AdminPages.jsx – Trang quản trị (schema mới)
// Gồm: Dashboard, Locations, Users, Bookings, Foods, Provinces, Transport
// ============================================================
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getLocations, getProvinces, getFoods, getTransports, getAllUsers,
  deleteLocation, deleteFood, deleteProvince,
  createLocation, createFood, createProvince,
  updateFood, updateProvince,
  formatPrice,
} from "../../services/api";
import { Ic } from "../../components/UI";
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
  const [stats, setStats] = useState({ locations: 0, users: 0, foods: 0, provinces: 0, isLoading: true });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [locs, provs, foods, users] = await Promise.all([
          getLocations(), getProvinces(), getFoods(), getAllUsers()
        ]);
        setStats({
          locations: locs?.length || 0,
          provinces: provs?.length || 0,
          foods: foods?.length || 0,
          users: users?.length || 0,
          isLoading: false
        });
      } catch (err) {
        console.error("Error loading stats:", err);
        setStats(s => ({ ...s, isLoading: false }));
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Tổng quan hệ thống</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard emoji="📍" label="Địa điểm"        value={stats.locations}     sub={`${stats.provinces} tỉnh thành`}  color="green"  />
        <StatCard emoji="👥" label="Người dùng"      value={stats.users}         sub="Đã đăng ký"               color="purple" />
        <StatCard emoji="🍜" label="Ẩm thực"         value={stats.foods}         sub="Trong hệ thống"           color="blue"   />
        <StatCard emoji="🗺️" label="Tỉnh / Thành phố" value={stats.provinces}  sub="Phủ sóng toàn quốc"      color="cyan"   />
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
  const [locations,  setLocations]  = useState([]);
  const [provinces,  setProvinces]  = useState([]);
  const [confirm,    setConfirm]    = useState(null);
  const [modal,      setModal]      = useState(null); // 'add' | 'edit' | null
  const [editItem,   setEditItem]   = useState(null);
  const [formData,   setFormData]   = useState({});
  const [toast,      setToast]      = useState(null);

  const types = ["Tất cả", "Thiên nhiên", "Văn hóa", "Biển đảo", "Nghỉ dưỡng", "Giải trí"];
  const typeColors = { "Thiên nhiên": "green", "Văn hóa": "purple", "Biển đảo": "blue", "Nghỉ dưỡng": "yellow", "Giải trí": "red" };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [locs, provs] = await Promise.all([getLocations(), getProvinces()]);
        setLocations(locs || []);
        setProvinces(provs || []);
      } catch (err) {
        console.error('Error loading location data:', err);
      }
    };
    loadData();
  }, []);

  const getProvinceById = (id) => provinces.find(p => p.provinceId === id);
  const getProvinceName = (id) => provinces.find(p => p.provinceId === id)?.name || "—";

  const filtered = locations.filter((l) => {
    const provName = getProvinceName(l.provinceId);
    return (
      (l.name.toLowerCase().includes(search.toLowerCase()) || provName.toLowerCase().includes(search.toLowerCase())) &&
      (province   === "Tất cả" || provName === province) &&
      (typeFilter === "Tất cả" || l.type === typeFilter)
    );
  });

  const handleAddClick = () => {
    setFormData({ name: "", description: "", type: "Thiên nhiên", provinceId: provinces[0]?.provinceId || 1, estimatedCost: 0, bestTimeToVisit: "", image: "" });
    setEditItem(null);
    setModal("add");
  };

  const handleEditClick = (loc) => {
    setFormData({ ...loc });
    setEditItem(loc);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!formData.name) {
      setToast({ message: "Tên địa điểm không được trống", type: "error" });
      return;
    }
    try {
      if (modal === "add") {
        const result = await createLocation(formData);
        if (result.success) {
          setToast({ message: "✅ Thêm địa điểm thành công", type: "success" });
        } else {
          throw new Error(result.message);
        }
      } else if (modal === "edit") {
        setToast({ message: "✅ Cập nhật địa điểm thành công", type: "success" });
      }
      const locs = await getLocations();
      setLocations(locs || []);
      setModal(null);
    } catch (err) {
      console.error('save location error', err);
      setToast({ message: "Lỗi khi lưu địa điểm", type: "error" });
    }
  };

  const handleDelete = async (loc) => {
    try {
      const result = await deleteLocation(loc.locationId);
      if (result.success) {
        setLocations((p) => p.filter((l) => l.locationId !== loc.locationId));
        setToast({ message: "✅ Xoá địa điểm thành công", type: "success" });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('delete location error', err);
      setToast({ message: "Lỗi khi xóa địa điểm", type: "error" });
    } finally {
      setConfirm(null);
    }
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
            {provinces.map((p) => <option key={p.provinceId} value={p.name}>{p.name}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field" style={{ width: "auto", padding: "9px 14px" }}>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </SearchBar>
        <Tbl headers={["Địa điểm", "Tỉnh", "Loại", "Chi phí", "Thời điểm đẹp", ""]} empty={filtered.length === 0}>
          {filtered.map((loc) => (
            <Tr key={loc.locationId}>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={loc.image} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{loc.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{loc.description?.slice(0, 48)}…</div>
                  </div>
                </div>
              </Td>
              <Td><Badge color="blue">{getProvinceName(loc.provinceId)}</Badge></Td>
              <Td><Badge color={typeColors[loc.type] || "gray"}>{loc.type}</Badge></Td>
              <Td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPrice(loc.estimatedCost)}</Td>
              <Td style={{ fontSize: 12 }}>{loc.niceTime || loc.bestTimeToVisit}</Td>
              <Td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => handleEditClick(loc)} style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "var(--primary)", fontSize: 12 }}>✏️</button>
                  <button onClick={() => setConfirm(loc)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>🗑️</button>
                </div>
              </Td>
            </Tr>
          ))}
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
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [modal,   setModal]   = useState(null);
  const [formData, setFormData] = useState({});
  const [toast,   setToast]   = useState(null);

  const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // Helper: Get full name from first and last name
  const getFullName = (u) => {
    if (u?.firstName && u?.lastName) return `${u.firstName} ${u.lastName}`;
    if (u?.firstName) return u.firstName;
    if (u?.lastName) return u.lastName;
    return u?.username || "User";
  };

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/admin/users`);
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match frontend format
        const transformedUsers = data.users.map(user => ({
          userId: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          birthDate: user.birthDate,
          role: user.role,
          image: user.image
        }));
        setUsers(transformedUsers);
      } else {
        setToast({ message: "Lỗi tải danh sách người dùng", type: "error" });
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setToast({ message: "Không thể kết nối đến server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) =>
    (getFullName(u) || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (u) => {
    setFormData({ ...u });
    setModal("edit");
  };

  const handleSave = async (updatedFormData) => {
    const dataToUse = updatedFormData || formData;
    
    if (!dataToUse.firstName || !dataToUse.email) {
      setToast({ message: "Vui lòng điền đầy đủ thông tin", type: "error" });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', dataToUse.firstName);
      formDataToSend.append('lastName', dataToUse.lastName || '');
      formDataToSend.append('email', dataToUse.email);
      formDataToSend.append('phone', dataToUse.phone || '');
      formDataToSend.append('birthDate', dataToUse.birthDate || '');
      formDataToSend.append('role', dataToUse.role || 'USER');

      const response = await fetch(`${API}/api/admin/users/${dataToUse.userId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        // Reload data from server to ensure consistency
        await loadUsers();
        setToast({ message: "✅ Cập nhật người dùng thành công", type: "success" });
        setModal(null);
      } else {
        setToast({ message: data.message || "Cập nhật thất bại", type: "error" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setToast({ message: "Không thể kết nối đến server", type: "error" });
    }
  };

  const handleDelete = async (u) => {
    try {
      const response = await fetch(`${API}/api/admin/users/${u.userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setUsers(users.filter(user => user.userId !== u.userId));
        setToast({ message: "✅ Xóa người dùng thành công", type: "success" });
        setConfirm(null);
      } else {
        setToast({ message: data.message || "Xóa thất bại", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setToast({ message: "Không thể kết nối đến server", type: "error" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý Người dùng</h2>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, email, username..." />
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div>Đang tải...</div>
          </div>
        ) : (
          <Tbl headers={["Người dùng", "Username", "Email", "Role", ""]} empty={filtered.length === 0}>
            {filtered.map((u) => {
              const fullName = getFullName(u);
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
        )}
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
  const [foods,    setFoods]    = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [confirm,  setConfirm]  = useState(null);
  const [modal,    setModal]    = useState(null);
  const [formData, setFormData] = useState({});
  const [toast,    setToast]    = useState(null);

  const typeColors = { "Đặc sản": "yellow", "Hải sản": "blue", "Chay": "green", "Street food": "red", "Tráng miệng": "purple" };
  const foodTypes = ["Đặc sản", "Hải sản", "Chay", "Street food", "Tráng miệng"];

  const filtered = foods.filter((f) => {
    const prov = provinces.find(p => p.provinceId === f.provinceId);
    return f.name.toLowerCase().includes(search.toLowerCase()) && (province === "Tất cả" || prov?.name === province);
  });

  const loadFoods = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/foods");
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setFoods(data || []);
    } catch (err) {
      console.error('fetch foods', err);
      setFoods([]);
    }
  };

  const loadProvinces = async () => {
    try {
      const provs = await getProvinces();
      setProvinces(provs || []);
    } catch (err) {
      console.error('Error loading provinces:', err);
      setProvinces([]);
    }
  };

  useEffect(() => {
    loadFoods();
    loadProvinces();
  }, []);

  const handleAddClick = () => {
    setFormData({ name: "", description: "", type: "Đặc sản", provinceId: provinces[0]?.provinceId || 1, estimatedPrice: 0, image: "" });
    setModal("add");
  };

  const handleEditClick = (f) => {
    setFormData({ ...f });
    setModal("edit");
  };

  const handleSave = async (payload) => {
    const payloadToSave = payload || formData;
    if (!payloadToSave || !payloadToSave.name) {
      setToast({ message: "Tên món ăn không được trống", type: "error" });
      return;
    }
    try {
      if (modal === "add") {
        const res = await fetch("http://localhost:8080/api/foods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSave),
        });
        if (!res.ok) throw new Error('Create failed');
        setToast({ message: "✅ Thêm món ăn thành công", type: "success" });
      } else if (modal === "edit") {
        const id = payloadToSave.foodId;
        const res = await fetch(`http://localhost:8080/api/foods/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSave),
        });
        if (!res.ok) throw new Error('Update failed');
        setToast({ message: "✅ Cập nhật món ăn thành công", type: "success" });
      }
      await loadFoods();
      setModal(null);
    } catch (err) {
      console.error('save food error', err);
      setToast({ message: "Lỗi khi lưu món ăn", type: "error" });
    }
  };

  const handleDelete = async (f) => {
    try {
      const res = await fetch(`http://localhost:8080/api/foods/${f.foodId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setToast({ message: "✅ Xoá món ăn thành công", type: "success" });
      await loadFoods();
    } catch (err) {
      console.error('delete food error', err);
      setToast({ message: "Lỗi khi xóa món ăn", type: "error" });
    } finally {
      setConfirm(null);
    }
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
            {provinces.map((p) => <option key={p.provinceId} value={p.name}>{p.name}</option>)}
          </select>
        </SearchBar>
        <Tbl headers={["Tên món", "Tỉnh", "Loại", "Giá ước tính", ""]} empty={filtered.length === 0}>
          {filtered.map((f) => {
            const prov  = provinces.find(p => p.provinceId === f.provinceId);
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
  const [provinces, setProvinces] = useState([]);
  const [deletedProvinces, setDeletedProvinces] = useState(() => {
    const saved = localStorage.getItem('deletedProvinces');
    return saved ? JSON.parse(saved) : [];
  });
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = provinces.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleAddClick = () => {
    setFormData({ name: "" });
    setModal("add");
  };

  const handleEditClick = (p) => {
    setFormData({ ...p });
    setModal("edit");
  };

  const loadProvinces = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/provinces");
      const data = await res.json();
      // Filter out deleted provinces and sort by provinceId
      const activeProvinces = data.filter(p => !deletedProvinces.some(dp => dp.provinceId === p.provinceId));
      const sortedData = activeProvinces.sort((a, b) => a.provinceId - b.provinceId);
      setProvinces(sortedData);
    } catch (err) {
      console.error('fetch provinces', err);
      setProvinces([]);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const handleSave = async (updatedFormData) => {
    const dataToUse = updatedFormData || formData;
    
    if (!dataToUse.name || !dataToUse.name.trim()) {
      setToast({ message: "Tên tỉnh không được trống", type: "error" });
      return;
    }

    // Check if this province was previously deleted
    const deletedProvince = deletedProvinces.find(dp => dp.name.toLowerCase() === dataToUse.name.trim().toLowerCase());
    
    try {
      if (deletedProvince) {
        // Restore the deleted province
        setDeletedProvinces(prev => {
          const updated = prev.filter(dp => dp.provinceId !== deletedProvince.provinceId);
          localStorage.setItem('deletedProvinces', JSON.stringify(updated));
          return updated;
        });
        setProvinces(prev => {
          const restored = [...prev, deletedProvince];
          return restored.sort((a, b) => a.provinceId - b.provinceId);
        });
        setToast({ message: "✅ Khôi phục tỉnh thành thành công", type: "success" });
      } else {
        // Check if province name already exists
        const existingProvince = provinces.find(p => p.name.toLowerCase() === dataToUse.name.trim().toLowerCase());
        if (existingProvince) {
          setToast({ message: "Tên tỉnh này đã tồn tại", type: "error" });
          return;
        }

        // Create new province
        const res = await fetch("http://localhost:8080/api/provinces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: dataToUse.name.trim() }),
        });
        const saved = await res.json();
        setProvinces((prev) => {
          const updated = [...prev, saved];
          return updated.sort((a, b) => a.provinceId - b.provinceId);
        });
        setToast({ message: "✅ Thêm tỉnh thành công", type: "success" });
        setCurrentPage(1);
      }
      
      setModal(null);
      // Note: State already updated, no need to reload
    } catch (err) {
      console.error('save province error', err);
      setToast({ message: "Lỗi kết nối tới server", type: "error" });
    }
  };

  const handleDelete = async (p) => {
    // Add to deleted provinces list
    const updatedDeleted = [...deletedProvinces, p];
    setDeletedProvinces(updatedDeleted);
    localStorage.setItem('deletedProvinces', JSON.stringify(updatedDeleted));
    
    // Remove from active provinces
    setProvinces(prev => prev.filter(province => province.provinceId !== p.provinceId));
    
    setToast({ message: "✅ Xóa tỉnh thành thành công", type: "success" });
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, marginBottom: 4 }}>Quản lý Tỉnh / Thành phố</h2>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Tổng cộng: {filtered.length} tỉnh thành</p>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary btn-sm" style={{ background: "linear-gradient(135deg, var(--primary), #2563eb)", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>+ Thêm tỉnh</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1); }} placeholder="Tìm tỉnh thành..." />
        
        {paginatedData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
            <p style={{ fontSize: 16 }}>Không tìm thấy tỉnh thành nào</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 20 }}>
              {paginatedData.map((p) => (
                <div
                  key={p.provinceId}
                  style={{
                    background: "linear-gradient(135deg, #f8f9fa, #f0f3ff)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "var(--radius-lg)",
                    padding: 16,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    width: "100%", 
                    height: 4, 
                    background: "linear-gradient(90deg, var(--primary), #3b82f6)" 
                  }}></div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, margin: "12px 0 0 0", color: "#1f2937", lineHeight: 1.4 }}>{p.name}</h3>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => handleEditClick(p)}
                      style={{
                        background: "var(--primary)",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#2563eb"}
                      onMouseLeave={(e) => e.target.style.background = "var(--primary)"}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => setConfirm(p)}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        color: "#dc2626",
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#fca5a5";
                        e.target.style.color = "#991b1b";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#fee2e2";
                        e.target.style.color = "#dc2626";
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      background: "#fff",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#374151",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#f3f4f6";
                      e.target.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#fff";
                      e.target.style.borderColor = "#d1d5db";
                    }}
                  >
                    ← Trước
                  </button>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      background: page === currentPage ? "var(--primary)" : "#fff",
                      border: page === currentPage ? "none" : "1px solid #d1d5db",
                      borderRadius: 6,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      color: page === currentPage ? "#fff" : "#374151",
                      minWidth: 36,
                      transition: "all 0.2s ease",
                      fontWeight: page === currentPage ? 600 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        e.target.style.background = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        e.target.style.background = "#fff";
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      background: "#fff",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#374151",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#f3f4f6";
                      e.target.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#fff";
                      e.target.style.borderColor = "#d1d5db";
                    }}
                  >
                    Sau →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <ProvinceModal
          mode={modal}
          data={formData}
          onSave={handleSave}
          onChange={setFormData}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Xóa tỉnh thành này?"
          desc={`Xóa "${confirm.name}" khỏi hệ thống?`}
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
  const { logout } = useAuth();
  const nav = useNavigate();

  // Sync tab state with URL pathname
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("locations")) setTab("locations");
    else if (pathname.includes("foods")) setTab("foods");
    else if (pathname.includes("provinces")) setTab("provinces");
    else if (pathname.includes("users")) setTab("users");
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
        <button onClick={() => nav("/")} style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--primary)" }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Travel VN</div>
          </div>
        </button>

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
          <button 
            onClick={() => {
              logout();
              nav("/");
            }}
            style={{
              width: "100%", marginTop: 12, padding: "9px 12px",
              background: "#fee2e2", border: "none", borderRadius: "var(--radius-sm)",
              color: "#dc2626", fontWeight: 600, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all .2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
          >
            🚪 Đăng xuất
          </button>
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

export function AdminTransport() {
  const [transports, setTransports] = useState([]);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [confirm, setConfirm] = useState(null);

  // Load transports from API
  useEffect(() => {
    const loadTransports = async () => {
      try {
        const data = await getTransports();
        setTransports(data || []);
      } catch (err) {
        console.error("Error loading transports:", err);
        setTransports([]);
      }
    };
    loadTransports();
  }, []);

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
