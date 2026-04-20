import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getLocations, getLocationTypes } from "../../services/api";
import LocationCard from "../../components/LocationCard";
import { Ic, EmptyState } from "../../components/UI";

export default function Locations() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [type, setType] = useState("Tất cả");
  const [types, setTypes] = useState(["Tất cả"]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load types once
  useEffect(() => {
    getLocationTypes().then(t => setTypes(["Tất cả", ...t]));
  }, []);

  // Fetch locations whenever filters or page change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await getLocations({ 
          page, 
          q: search, 
          type
        });
        
        // Ensure we handle standard Spring Data Page structure
        setLocations(res.content || []);
        setTotalPages(res.totalPages || 0);
        setTotalElements(res.totalElements || 0);
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, search, type]);

  // Reset to first page when search/filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(0);
  };

  // Helper to generate pagination numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(0, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
        range.push(i);
    }
    
    const pages = [];
    if (range[0] > 0) {
        pages.push(0);
        if (range[0] > 1) pages.push('...');
    }
    range.forEach(i => pages.push(i));
    if (range[range.length - 1] < totalPages - 1) {
        if (range[range.length - 1] < totalPages - 2) pages.push('...');
        pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Khám phá địa điểm</h1>
        <p className="page-subtitle">Tìm điểm đến hoàn hảo cho chuyến du lịch của bạn</p>

        {/* Search + Filter Container */}
        <div style={{ 
          display: "flex", 
          gap: 16, 
          flexWrap: "wrap", 
          alignItems: "center",
          background: "var(--bg-white)",
          padding: 20,
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-light)"
        }}>
          {/* Search Input */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg)", border: "1.5px solid transparent",
            borderRadius: "var(--radius-sm)", padding: "10px 14px", flex: 1, minWidth: 260,
            transition: "all 0.2s ease"
          }} className="search-box-focus">
            <Ic.Search />
            <input
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              placeholder="Tên địa điểm, tỉnh thành..."
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }}
            />
            {search && (
              <button 
                onClick={() => handleFilterChange(setSearch, "")} 
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >✕</button>
            )}
          </div>

          {/* Type Filter Chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {types.map((t) => (
              <button 
                key={t} 
                onClick={() => handleFilterChange(setType, t)} 
                className={`btn btn-sm ${type === t ? "btn-primary" : "btn-outline"}`}
                style={{ 
                  border: type === t ? "none" : "1.5px solid var(--border)",
                  borderRadius: 20,
                  padding: "6px 16px"
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20,
        color: "var(--text-muted)",
        fontSize: 14
      }}>
        {isLoading ? (
          <span>Đang tải dữ liệu...</span>
        ) : (
          <>
            <span>Tìm thấy <b>{totalElements}</b> địa điểm</span>
            {totalElements > 0 && (
              <span>Trang <b>{page + 1}</b> / {totalPages}</span>
            )}
          </>
        )}
      </div>

      {/* Main Content Grid */}
      {isLoading ? (
        <div className="grid-3 stagger">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 380, borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <EmptyState 
          emoji="🗺️" 
          title="Không tìm thấy địa điểm" 
          desc="Thử thay đổi từ khoá hoặc bộ lọc để thấy kết quả mong muốn" 
        />
      ) : (
        <>
          <div className="grid-3 stagger">
            {locations.map((loc) => (
              <div key={loc.locationId} className="anim-fadeUp">
                <LocationCard location={loc} />
              </div>
            ))}
          </div>

          {/* Advanced Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              gap: 12, 
              marginTop: 60,
              paddingBottom: 40 
            }}>
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="btn btn-outline btn-sm"
                style={{ 
                  borderRadius: "var(--radius-sm)",
                  opacity: page === 0 ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                ‹ Trước
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                {getPageNumbers().map((p, i) => (
                  p === '...' ? (
                    <span key={`ell-${i}`} style={{ color: "var(--text-light)", padding: "0 4px" }}>...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="btn btn-sm"
                      style={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: page === p ? "var(--primary)" : "transparent",
                        color: page === p ? "#fff" : "var(--text)",
                        border: page === p ? "none" : "1.5px solid transparent",
                        fontWeight: page === p ? 700 : 500,
                        transition: "all 0.2s ease"
                      }}
                    >
                      {p + 1}
                    </button>
                  )
                ))}
              </div>

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="btn btn-outline btn-sm"
                style={{ 
                  borderRadius: "var(--radius-sm)",
                  opacity: page === totalPages - 1 ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                Sau ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
