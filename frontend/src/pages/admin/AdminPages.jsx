import { useState } from "react";
import { mockUsers, mockLocations, mockLocationDetails, mockTours, mockBookings, mockReviews, formatPrice, getLocation, getTour, getUserById } from "../../data/mockData";
import { StatusBadge, RoleBadge, StarRating, Ic, EmptyState } from "../../components/UI";

// ── Shared admin table wrapper ────────────────────────────
function AdminTable({ title, columns, data, renderRow, searchKeys, addLabel }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter(item =>
    !search || searchKeys.some(k => String(item[k] || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{data.length} bản ghi</p>
        </div>
        {addLabel && (
          <button className="btn btn-primary"><Ic.Plus />{addLabel}</button>
        )}
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Ic.Search />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
        />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {filtered.length === 0 ? (
          <EmptyState emoji="🔍" title="Không tìm thấy" desc="Thử thay đổi từ khoá tìm kiếm" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {columns.map(c => (
                    <th key={c} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border-light)" }}>
                    {renderRow(item)}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-outline btn-sm"><Ic.Edit /> Sửa</button>
                        <button className="btn btn-danger btn-sm"><Ic.Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const TD = ({ children, mono = false }) => (
  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text)", fontFamily: mono ? "monospace" : "inherit" }}>
    {children}
  </td>
);

// ── Admin Users ────────────────────────────────────────────
export function AdminUsers() {
  return (
    <AdminTable
      title="Quản lý người dùng"
      columns={["ID", "Tên đăng nhập", "Họ tên", "Email", "Điện thoại", "Ngày sinh", "Vai trò"]}
      data={mockUsers}
      searchKeys={["username", "fullName", "email"]}
      addLabel="Thêm người dùng"
      renderRow={u => (<>
        <TD><span style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{u.userId}</span></TD>
        <TD><code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{u.username}</code></TD>
        <TD><strong>{u.fullName}</strong></TD>
        <TD><a href={`mailto:${u.email}`} style={{ color: "var(--primary)" }}>{u.email}</a></TD>
        <TD>{u.phone}</TD>
        <TD>{u.birthDate}</TD>
        <TD><RoleBadge role={u.role} /></TD>
      </>)}
    />
  );
}

// ── Admin Locations ────────────────────────────────────────
export function AdminLocations() {
  const data = mockLocations.map(l => ({
    ...l,
    detail: mockLocationDetails.find(d => d.locationId === l.locationId),
  }));

  return (
    <AdminTable
      title="Quản lý địa điểm"
      columns={["ID", "Tên địa điểm", "Tỉnh/Thành", "Vùng", "Giá từ", "Thời điểm lý tưởng"]}
      data={data}
      searchKeys={["name", "province", "region"]}
      addLabel="Thêm địa điểm"
      renderRow={l => (<>
        <TD><span style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{l.locationId}</span></TD>
        <TD>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {l.detail?.image && <img src={l.detail.image} alt="" style={{ width: 40, height: 36, borderRadius: 6, objectFit: "cover" }} />}
            <strong>{l.name}</strong>
          </div>
        </TD>
        <TD>{l.province}</TD>
        <TD><span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>Miền {l.region}</span></TD>
        <TD><strong style={{ color: "var(--primary)" }}>{formatPrice(l.detail?.price || 0)}</strong></TD>
        <TD>{l.detail?.bestTimeToVisit}</TD>
      </>)}
    />
  );
}

// ── Admin Tours ────────────────────────────────────────────
export function AdminTours() {
  const data = mockTours.map(t => ({ ...t, location: getLocation(t.locationId) }));

  return (
    <AdminTable
      title="Quản lý Tours"
      columns={["ID", "Tên tour", "Địa điểm", "Giá", "Tối đa", "Khởi hành", "Kết thúc"]}
      data={data}
      searchKeys={["name"]}
      addLabel="Thêm tour"
      renderRow={t => (<>
        <TD><span style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{t.tourId}</span></TD>
        <TD><strong>{t.name}</strong></TD>
        <TD><span style={{ color: "var(--primary)" }}>{t.location?.name}, {t.location?.province}</span></TD>
        <TD><strong style={{ color: "var(--primary)" }}>{formatPrice(t.price)}</strong></TD>
        <TD>{t.maxParticipants} người</TD>
        <TD>{t.startDate}</TD>
        <TD>{t.endDate}</TD>
      </>)}
    />
  );
}

// ── Admin Bookings ─────────────────────────────────────────
export function AdminBookings() {
  const data = mockBookings.map(b => ({
    ...b, tour: getTour(b.tourId), user: getUserById(b.userId),
  }));

  return (
    <AdminTable
      title="Quản lý Đặt tour"
      columns={["Mã đơn", "Khách hàng", "Tour", "Ngày đặt", "Số người", "Tổng tiền", "Trạng thái"]}
      data={data}
      searchKeys={["id"]}
      addLabel={null}
      renderRow={b => (<>
        <TD><code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{b.id.toUpperCase()}</code></TD>
        <TD>{b.user?.fullName || "—"}</TD>
        <TD><span style={{ color: "var(--text-muted)", fontSize: 12 }}>{b.tour?.name}</span></TD>
        <TD>{b.bookingDate}</TD>
        <TD>{b.numberOfPeople}</TD>
        <TD><strong style={{ color: "var(--primary)" }}>{formatPrice(b.totalPrice)}</strong></TD>
        <TD><StatusBadge status={b.status} /></TD>
      </>)}
    />
  );
}

// ── Admin Reviews ──────────────────────────────────────────
export function AdminReviews() {
  const nameMap = { 2: "Nguyễn Thị Lan", 3: "Trần Văn Minh", 4: "Lê Thu Hương" };
  const data = mockReviews.map(r => ({ ...r, tour: getTour(r.tourId), userName: nameMap[r.userId] || "Khách hàng" }));

  return (
    <AdminTable
      title="Quản lý Đánh giá"
      columns={["ID", "Người dùng", "Tour", "Sao", "Nội dung", "Ngày"]}
      data={data}
      searchKeys={["comment", "userName"]}
      addLabel={null}
      renderRow={r => (<>
        <TD><span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{r.id}</span></TD>
        <TD><strong>{r.userName}</strong></TD>
        <TD><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.tour?.name}</span></TD>
        <TD><StarRating rating={r.rating} size={13} /></TD>
        <TD><span style={{ fontSize: 12, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 280 }}>{r.comment}</span></TD>
        <TD>{r.createdAt}</TD>
      </>)}
    />
  );
}
