import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractors, getFilteredTractors } from "../services/tractorService";

// ── Google Fonts (Syne + Outfit) ──────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    * { font-family: 'Outfit', sans-serif; }
    .font-display { font-family: 'Syne', sans-serif; }
  `}</style>
);

// ── Brand chips ──────────────────────────────────────────────────────────────
const BRANDS = [
  { id: null, label: "All Brands" },
  { id: 1, label: "Mahindra" },
  { id: 2, label: "Swaraj" },
  { id: 3, label: "Sonalika" },
  { id: 4, label: "Massey Ferguson" },
  { id: 5, label: "John Deere" },
  { id: 6, label: "Eicher" },
  { id: 7, label: "Farmtrac" },
  { id: 8, label: "Powertrac" },
  { id: 14, label: "New Holland" },
];

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "hp_asc", label: "HP: Low → High" },
  { value: "hp_desc", label: "HP: High → Low" },
];

// ── Skeleton card optimized for mobile view grids ──────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 animate-pulse">
    <div className="bg-gray-100 h-36 sm:h-52 w-full" />
    <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
      <div className="h-4 bg-gray-100 rounded-full w-1/2" />
      <div className="flex gap-2 pt-2">
        <div className="h-5 bg-gray-100 rounded-full w-1/2" />
        <div className="h-5 bg-gray-100 rounded-full w-1/2" />
      </div>
    </div>
  </div>
);

// ── Sort helper ───────────────────────────────────────────────────────────────
const sortTractors = (list, sortKey) => {
  if (!sortKey || !list?.length) return list;
  const sorted = [...list];
  switch (sortKey) {
    case "price_asc": return sorted.sort((a, b) => a.price - b.price);
    case "price_desc": return sorted.sort((a, b) => b.price - a.price);
    case "hp_asc": return sorted.sort((a, b) => a.hp - b.hp);
    case "hp_desc": return sorted.sort((a, b) => b.hp - a.hp);
    default: return sorted;
  }
};

const Tractors = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeBrand, setActiveBrand] = useState(null);
  const [sortKey, setSortKey] = useState("");

  const [filters, setFilters] = useState({
    minHp: "", maxHp: "",
    minPrice: "", maxPrice: "",
    page: 0, size: 12,
  });

  const [pendingFilters, setPendingFilters] = useState({ ...filters });
  const gridRef = useRef(null);

  const fetchData = useCallback(async (overrideFilters = filters, brandId = activeBrand) => {
    setLoading(true);
    setError(null);
    try {
      const active = Object.fromEntries(
        Object.entries(overrideFilters).filter(([, v]) => v !== "")
      );
      if (brandId) active.brandId = brandId;

      const hasFilters =
        active.minHp || active.maxHp || active.minPrice ||
        active.maxPrice || active.brandId;

      const data = hasFilters
        ? await getFilteredTractors(active)
        : await getTractors(overrideFilters.page, overrideFilters.size);

      setTractors(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("Failed to load tractors", err);
      setError("Unable to load tractors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, activeBrand]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  const handleApplyFilters = () => {
    const next = { ...pendingFilters, page: 0 };
    setFilters(next);
    setFiltersOpen(false);
    fetchData(next, activeBrand);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => {
    const base = { minHp: "", maxHp: "", minPrice: "", maxPrice: "", page: 0, size: 12 };
    setFilters(base);
    setPendingFilters(base);
    setActiveBrand(null);
    setSortKey("");
    fetchData(base, null);
  };

  const handleBrandClick = (brandId) => {
    setActiveBrand(brandId);
    const next = { ...filters, page: 0 };
    setFilters(next);
    fetchData(next, brandId);
  };

  const handlePageChange = (newPage) => {
    const next = { ...filters, page: newPage };
    setFilters(next);
    fetchData(next, activeBrand);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = filters.minHp || filters.maxHp || filters.minPrice || filters.maxPrice || activeBrand;

  const searchedTractors = tractors.filter((tractor) => {
    const search = searchTerm.toLowerCase();
    return (
      tractor.model?.toLowerCase().includes(search) ||
      tractor.brand?.toLowerCase().includes(search) ||
      tractor.hp?.toString().includes(search)
    );
  });

  const displayedTractors = sortTractors(searchedTractors, sortKey);

  return (
    <>
      <FontLink />
      <div className="min-h-screen" style={{ background: "#ebe8e3" }}>
        <Navbar />

        {/* ── HERO SECTION (RESPONSIVE) ─────────────────────────────────────── */}
        <div className="bg-green-50 border-b border-green-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Text */}
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-green-700 uppercase tracking-widest">
                   Bars 🚜 Namaste Tractor
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-0.5 leading-snug">
                  Find Your <span className="text-green-700">Perfect Tractor</span>
                </h1>
                <p className="text-gray-500 mt-1.5 text-xs sm:text-sm max-w-md">
                  India's trusted marketplace — on-road pricing, subsidy guidance & expert support.
                </p>
              </div>

              {/* Stats Container with horizontal native scrolling on small displays */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                  { label: "Models", value: totalElements || "500+" },
                  { label: "HP Range", value: "15–120 HP" },
                  { label: "Price Range", value: "₹3L – ₹50L+" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-green-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center shadow-sm flex-shrink-0 min-w-[100px]">
                    <p className="text-sm sm:text-base font-bold text-gray-900">{s.value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BRAND CHIPS ───────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 sticky top-[108px] md:top-[72px] z-40 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar mask-edges">
              {BRANDS.map(b => (
                <button
                  key={b.id ?? "all"}
                  onClick={() => handleBrandClick(b.id)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={
                    activeBrand === b.id
                      ? { background: "#0F3D2E", color: "#fff" }
                      : { background: "#F3F4F6", color: "#374151" }
                  }
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search tractor, brand or HP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-gray-200 rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-800 shadow-sm outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": "#0F3D2E" }}
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── CONTENT CONTAINER ─────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 sm:py-8" ref={gridRef}>

          {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              {!loading && (
                <p className="text-gray-700 font-semibold text-xs sm:text-sm">
                  {hasActiveFilters ? (
                    <><span style={{ color: "#0F3D2E" }} className="font-bold">{totalElements}</span> results found</>
                  ) : (
                    <>Showing <span style={{ color: "#0F3D2E" }} className="font-bold">{tractors.length}</span> of {totalElements} models</>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white border border-gray-200 text-gray-700 outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                style={filtersOpen || hasActiveFilters ? { background: "#0F3D2E", color: "#fff" } : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }}
              >
                Filters
              </button>

              {hasActiveFilters && (
                <button onClick={handleReset} className="flex items-center text-xs font-semibold text-red-500 px-2 py-2 hover:bg-red-50 rounded-xl transition-all">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── FILTER PANEL ────────────────────────────────────────────────── */}
          {filtersOpen && (
            <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg" style={{ animation: "slideDown 0.2s ease" }}>
              <h3 className="font-display text-base font-bold text-gray-800 mb-4">Refine Results</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Min HP</label>
                  <input type="number" className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs outline-none" value={pendingFilters.minHp} onChange={e => setPendingFilters(p => ({ ...p, minHp: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Max HP</label>
                  <input type="number" className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs outline-none" value={pendingFilters.maxHp} onChange={e => setPendingFilters(p => ({ ...p, maxHp: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Min Price</label>
                  <input type="number" className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs outline-none" value={pendingFilters.minPrice} onChange={e => setPendingFilters(p => ({ ...p, minPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Max Price</label>
                  <input type="number" className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs outline-none" value={pendingFilters.maxPrice} onChange={e => setPendingFilters(p => ({ ...p, maxPrice: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={handleApplyFilters} className="px-5 py-2 rounded-xl text-white font-bold text-xs" style={{ background: "#0F3D2E" }}>Apply Filters</button>
                <button onClick={() => { setPendingFilters({ minHp: "", maxHp: "", minPrice: "", maxPrice: "", page: 0, size: 12 }); setFiltersOpen(false); handleReset(); }} className="px-4 py-2 rounded-xl text-gray-500 bg-gray-50 text-xs">Clear</button>
              </div>
            </div>
          )}

          {/* ── TWIN CARD GRID MATRIX (2 COLUMNS FOR SMARTPHONES) ────────────── */}
          {!error && (
            <main>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : displayedTractors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {displayedTractors.map(tractor => (
                    <Card key={tractor.id} data={tractor} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 px-4">
                  <div className="text-5xl mb-3">🚜</div>
                  <h3 className="font-display text-xl font-bold text-gray-800">No Tractors Found</h3>
                  <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">Try resetting filters to explore more models.</p>
                  <button onClick={handleReset} className="mt-4 px-5 py-2.5 rounded-xl text-white text-xs font-bold" style={{ background: "#0F3D2E" }}>Reset Filters</button>
                </div>
              )}

              {/* ── PAGINATION ──────────────────────────────────────────────── */}
              {!loading && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
                  <button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 0} className="w-8 h-8 flex items-center justify-center rounded-xl border text-xs disabled:opacity-30 bg-white">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i).map(p => {
                    const visible = p === 0 || p === totalPages - 1 || Math.abs(p - filters.page) <= 1;
                    if (!visible) return null;
                    return (
                      <button key={p} onClick={() => handlePageChange(p)} className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold" style={p === filters.page ? { background: "#0F3D2E", color: "#fff" } : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }}>
                        {p + 1}
                      </button>
                    );
                  })}
                  <button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= totalPages - 1} className="w-8 h-8 flex items-center justify-center rounded-xl border text-xs disabled:opacity-30 bg-white">›</button>
                </div>
              )}
            </main>
          )}

          <div className="mt-12">
            <EnquiryForm defaultType="tractor" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tractors;