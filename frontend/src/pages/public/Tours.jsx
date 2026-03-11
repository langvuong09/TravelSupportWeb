import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockTours, mockLocations } from "../../data/mockData";
import TourCard from "../../components/TourCard";
import { Ic, EmptyState } from "../../components/UI";

const REGIONS = ["Tất cả", "Bắc", "Trung", "Nam"];
const PRICES  = [
  { label: "Tất cả",       min: 0,         max: Infinity },
  { label: "< 2 triệu",    min: 0,         max: 2000000  },
  { label: "2 – 5 triệu",  min: 2000000,   max: 5000000  },
  { label: "> 5 triệu",    min: 5000000,   max: Infinity },
];

export default function Tours() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]   = useState("");
  const [region, setRegion]   = useState("Tất cả");
  const [priceIdx, setPriceIdx] = useState(0);
  const locFilter = searchParams.get("location");

  const filtered = mockTours.filter(t => {
    const loc = mockLocations.find(l => l.locationId === t.locationId);
    const matchRegion = region === "Tất cả" || loc?.region === region;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      loc?.name.toLowerCase().includes(search.toLowerCase());
    const { min, max } = PRICES[priceIdx];
    const matchPrice  = t.price >= min && t.price < max;
    const matchLoc    = !locFilter || t.locationId === parseInt(locFilter);
    return matchRegion && matchSearch && matchPrice && matchLoc;
  });

  return (
    <div className="page-wrap">
      <h1 className="page-title">Danh sách Tour</h1>
      <p className="page-subtitle">Chọn hành trình hoàn hảo cho chuyến đi của bạn</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)", padding: "10px 14px", flex: 1, minWidth: 240,
        }}>
          <Ic.Search />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tên tour, địa điểm..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
          />
        </div>

        {/* Region */}
        <div style={{ display: "flex", gap: 6 }}>
          {REGIONS.map(r => (
            <button key={r}
              onClick={() => setRegion(r)}
              className="btn btn-sm"
              style={{
                background: region === r ? "var(--primary)" : "#fff",
                color:      region === r ? "#fff" : "var(--text-muted)",
                border: "1.5px solid " + (region === r ? "var(--primary)" : "var(--border)"),
              }}
            >
              {r === "Tất cả" ? r : `Miền ${r}`}
            </button>
          ))}
        </div>

        {/* Price */}
        <select
          value={priceIdx}
          onChange={e => setPriceIdx(Number(e.target.value))}
          className="input-field"
          style={{ width: "auto", padding: "9px 14px" }}
        >
          {PRICES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
        </select>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
        Tìm thấy <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> tour
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🏕️" title="Không tìm thấy tour" desc="Thử thay đổi bộ lọc" />
      ) : (
        <div className="grid-3 stagger">
          {filtered.map(t => (
            <div key={t.tourId} className="anim-fadeUp">
              <TourCard tour={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
