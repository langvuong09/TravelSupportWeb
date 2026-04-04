import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getLocations, getProvinces } from "../../services/api";
import LocationCard from "../../components/LocationCard";
import { Ic, EmptyState } from "../../components/UI";

const TYPES = ["Tất cả", "Thiên nhiên", "Văn hóa", "Biển đảo", "Nghỉ dưỡng", "Giải trí"];

export default function Locations() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [type, setType] = useState("Tất cả");
  const [province, setProvince] = useState("Tất cả");
  const [locations, setLocations] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [locs, provs] = await Promise.all([getLocations(), getProvinces()]);
      setLocations(locs);
      setProvinces(provs);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filtered = locations.filter((loc) => {
    const prov = provinces.find((p) => p.provinceId === loc.provinceId);
    const matchType = type === "Tất cả" || loc.type === type;
    const matchProvince = province === "Tất cả" || prov?.name === province;
    const matchSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      prov?.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchProvince && matchSearch;
  });

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Khám phá địa điểm</h1>
        <p className="page-subtitle">Tìm điểm đến hoàn hảo cho chuyến du lịch của bạn</p>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "10px 14px", flex: 1, minWidth: 240,
          }}>
            <Ic.Search />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tên địa điểm, tỉnh thành..."
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
            )}
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className="btn btn-sm" style={{
                background: type === t ? "var(--primary)" : "#fff",
                color:      type === t ? "#fff" : "var(--text-muted)",
                border: "1.5px solid " + (type === t ? "var(--primary)" : "var(--border)"),
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Province select */}
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="input-field"
            style={{ width: "auto", padding: "9px 14px" }}
          >
            <option value="Tất cả">Tất cả tỉnh thành</option>
            {provinces.map((p) => (
              <option key={p.provinceId} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
        {isLoading ? "Đang tải..." : `Tìm thấy ${filtered.length} địa điểm`}
      </div>

      {isLoading ? (
        <EmptyState emoji="⏳" title="Đang tải dữ liệu..." />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🗺️" title="Không tìm thấy địa điểm" desc="Thử thay đổi từ khoá hoặc bộ lọc" />
      ) : (
        <div className="grid-3 stagger">
          {filtered.map((loc) => (
            <div key={loc.locationId} className="anim-fadeUp">
              <LocationCard location={loc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
