import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockLocations, mockLocationDetails } from "../../data/mockData";
import LocationCard from "../../components/LocationCard";
import { Ic, EmptyState } from "../../components/UI";

const REGIONS = ["Tất cả", "Bắc", "Trung", "Nam"];

export default function Locations() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState("Tất cả");

  const filtered = mockLocations.filter(loc => {
    const matchRegion = region === "Tất cả" || loc.region === region;
    const matchSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.province.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Tên địa điểm, tỉnh thành..."
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
            )}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className="btn btn-sm"
                style={{
                  background: region === r ? "var(--primary)" : "#fff",
                  color: region === r ? "#fff" : "var(--text-muted)",
                  border: "1.5px solid " + (region === r ? "var(--primary)" : "var(--border)"),
                }}
              >
                {r === "Tất cả" ? r : `Miền ${r}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
        Tìm thấy <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> địa điểm
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🗺️" title="Không tìm thấy địa điểm" desc="Thử thay đổi từ khoá hoặc bộ lọc" />
      ) : (
        <div className="grid-3 stagger">
          {filtered.map(loc => {
            const detail = mockLocationDetails.find(d => d.locationId === loc.locationId);
            return detail ? (
              <div key={loc.locationId} className="anim-fadeUp">
                <LocationCard location={loc} detail={detail} />
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
