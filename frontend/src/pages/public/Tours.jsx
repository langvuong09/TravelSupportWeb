import { useState } from "react";
import { mockTours, mockProvinces, getProvincesByTour, getTourEstimatedCost } from "../../data/mockData";
import TourCard from "../../components/TourCard";
import { Ic, EmptyState } from "../../components/UI";

const PRICE_RANGES = [
  { label: "Tất cả",       min: 0,         max: Infinity },
  { label: "< 2 triệu",    min: 0,         max: 2000000  },
  { label: "2 – 5 triệu",  min: 2000000,   max: 5000000  },
  { label: "> 5 triệu",    min: 5000000,   max: Infinity },
];

export default function Tours() {
  const [search,   setSearch]   = useState("");
  const [province, setProvince] = useState("Tất cả");
  const [priceIdx, setPriceIdx] = useState(0);

  const filtered = mockTours.filter((t) => {
    const provinces = getProvincesByTour(t.tourId);
    const cost      = getTourEstimatedCost(t.tourId);
    const { min, max } = PRICE_RANGES[priceIdx];

    const matchSearch   = t.name.toLowerCase().includes(search.toLowerCase()) ||
      provinces.some((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    const matchProvince = province === "Tất cả" ||
      provinces.some((p) => p.name === province);
    const matchPrice    = cost >= min && cost < max;

    return matchSearch && matchProvince && matchPrice;
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
          borderRadius: "var(--radius-sm)", padding: "10px 14px",
          flex: 1, minWidth: 240,
        }}>
          <Ic.Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tên tour, tỉnh thành..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
          )}
        </div>

        {/* Province filter */}
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="input-field"
          style={{ width: "auto", padding: "9px 14px" }}
        >
          <option value="Tất cả">Tất cả tỉnh thành</option>
          {mockProvinces.map((p) => (
            <option key={p.provinceId} value={p.name}>{p.name}</option>
          ))}
        </select>

        {/* Price range */}
        <select
          value={priceIdx}
          onChange={(e) => setPriceIdx(Number(e.target.value))}
          className="input-field"
          style={{ width: "auto", padding: "9px 14px" }}
        >
          {PRICE_RANGES.map((p, i) => (
            <option key={i} value={i}>{p.label}</option>
          ))}
        </select>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
        Tìm thấy <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> tour
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🏕️" title="Không tìm thấy tour" desc="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm" />
      ) : (
        <div className="grid-3 stagger">
          {filtered.map((t) => (
            <div key={t.tourId} className="anim-fadeUp">
              <TourCard tour={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
