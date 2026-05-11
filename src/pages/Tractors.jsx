import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractors, getFilteredTractors } from "../services/tractorservice";

// ── Google Fonts (Syne + Outfit) ──────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    * { font-family: 'Outfit', sans-serif; }
    .font-display { font-family: 'Syne', sans-serif; }
  `}</style>
);

// ── Brand chips (add more as your backend grows) ──────────────────────────────
const BRANDS = [
  { id: null,  label: "All Brands" },
  { id: 1,     label: "John Deere" },
  { id: 2,     label: "Mahindra" },
  { id: 3,     label: "TAFE" },
  { id: 4,     label: "Sonalika" },
  { id: 5,     label: "New Holland" },
  { id: 6,     label: "Eicher" },
];

const SORT_OPTIONS = [
  { value: "",           label: "Relevance" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "hp_asc",     label: "HP: Low → High" },
  { value: "hp_desc",    label: "HP: High → Low" },
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="bg-gray-100 h-52 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      <div className="h-5 bg-gray-100 rounded-full w-2/3" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      <div className="flex justify-between pt-2">
        <div className="h-6 bg-gray-100 rounded-full w-1/3" />
        <div className="h-8 bg-gray-100 rounded-2xl w-1/3" />
      </div>
    </div>
  </div>
);

// ── Sort helper ───────────────────────────────────────────────────────────────
const sortTractors = (list, sortKey) => {
  if (!sortKey || !list?.length) return list;
  const sorted = [...list];
  switch (sortKey) {
    case "price_asc":  return sorted.sort((a, b) => a.price - b.price);
    case "price_desc": return sorted.sort((a, b) => b.price - a.price);
    case "hp_asc":     return sorted.sort((a, b) => a.hp - b.hp);
    case "hp_desc":    return sorted.sort((a, b) => b.hp - a.hp);
    default:           return sorted;
  }
};

// ── Main Component ────────────────────────────────────────────────────────────
const Tractors = () => {
  const [tractors,     setTractors]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages,   setTotalPages]   = useState(0);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const [activeBrand,  setActiveBrand]  = useState(null);  // brandId or null
  const [sortKey,      setSortKey]      = useState("");

  const [filters, setFilters] = useState({
    minHp: "", maxHp: "",
    minPrice: "", maxPrice: "",
    page: 0, size: 12,
  });

  const [pendingFilters, setPendingFilters] = useState({ ...filters });
  const gridRef = useRef(null);

  // ── Data loading ────────────────────────────────────────────────────────────
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

  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  const hasActiveFilters =
    filters.minHp || filters.maxHp || filters.minPrice ||
    filters.maxPrice || activeBrand;

  const displayedTractors = sortTractors(tractors, sortKey);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <FontLink />
      <div className="min-h-screen" style={{ background: "#ebe8e3" }}>
        <Navbar />

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
<div className="bg-green-50 border-b border-green-100">
  <div className="max-w-[1440px] mx-auto px-6 py-10">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

      {/* Text */}
      <div>
        <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
          🚜 Namaste Tractor
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1 leading-snug">
          Find Your <span className="text-green-700">Perfect Tractor</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-md">
          India's trusted marketplace — on-road pricing, subsidy guidance & expert support.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-shrink-0">
        {[
          { label: "Models",      value: totalElements || "500+" },
          { label: "HP Range",    value: "15–120 HP" },
          { label: "Price Range", value: "₹3L – ₹50L+" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-green-100 rounded-2xl px-4 py-3 text-center shadow-sm">
            <p className="text-base font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  </div>
</div>

        {/* ── BRAND CHIPS ───────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
              {BRANDS.map(b => (
                <button
                  key={b.id ?? "all"}
                  onClick={() => handleBrandClick(b.id)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={
                    activeBrand === b.id
                      ? { background: "#0F3D2E", color: "#fff", transform: "scale(1.04)" }
                      : { background: "#F3F4F6", color: "#374151" }
                  }
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ───────────────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 py-8" ref={gridRef}>

          {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Result count */}
            <div>
              {!loading && (
                <p className="text-gray-700 font-semibold text-sm">
                  {hasActiveFilters ? (
                    <><span style={{ color: "#0F3D2E" }} className="font-bold">{totalElements}</span> results found</>
                  ) : (
                    <>Showing <span style={{ color: "#0F3D2E" }} className="font-bold">{tractors.length}</span> of {totalElements} tractors</>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl text-sm font-medium bg-white border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 cursor-pointer"
                  style={{ "--tw-ring-color": "#0F3D2E" }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                style={
                  filtersOpen || hasActiveFilters
                    ? { background: "#0F3D2E", color: "#fff" }
                    : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }
                }
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "#FBBF24", color: "#000" }}>
                    !
                  </span>
                )}
              </button>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all border border-red-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* ── FILTER PANEL ────────────────────────────────────────────────── */}
          {filtersOpen && (
            <div className="mb-8 bg-white border border-gray-100 rounded-3xl p-6 shadow-lg"
              style={{ animation: "slideDown 0.2s ease" }}>
              <style>{`
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              <h3 className="font-display text-lg font-bold text-gray-800 mb-5">Refine Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Min HP */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Min HP</label>
                  <input
                    type="number" min="0" placeholder="e.g. 20"
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#0F3D2E" }}
                    value={pendingFilters.minHp}
                    onChange={e => setPendingFilters(p => ({ ...p, minHp: e.target.value }))}
                  />
                </div>
                {/* Max HP */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max HP</label>
                  <input
                    type="number" min="0" placeholder="e.g. 80"
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#0F3D2E" }}
                    value={pendingFilters.maxHp}
                    onChange={e => setPendingFilters(p => ({ ...p, maxHp: e.target.value }))}
                  />
                </div>
                {/* Min Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Min Budget (₹)</label>
                  <input
                    type="number" min="0" placeholder="e.g. 300000"
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#0F3D2E" }}
                    value={pendingFilters.minPrice}
                    onChange={e => setPendingFilters(p => ({ ...p, minPrice: e.target.value }))}
                  />
                </div>
                {/* Max Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Budget (₹)</label>
                  <input
                    type="number" min="0" placeholder="e.g. 2000000"
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#0F3D2E" }}
                    value={pendingFilters.maxPrice}
                    onChange={e => setPendingFilters(p => ({ ...p, maxPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="px-8 py-3 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#0F3D2E" }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setPendingFilters({ minHp: "", maxHp: "", minPrice: "", maxPrice: "", page: 0, size: 12 });
                    setFiltersOpen(false);
                    handleReset();
                  }}
                  className="px-6 py-3 rounded-2xl text-gray-500 font-medium text-sm bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR STATE ──────────────────────────────────────────────────── */}
          {error && (
            <div className="text-center py-20 bg-white rounded-3xl border border-red-100 mb-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800">Something went wrong</h3>
              <p className="text-gray-400 mt-2 mb-6">{error}</p>
              <button
                onClick={() => fetchData()}
                className="px-6 py-3 rounded-2xl text-white text-sm font-bold"
                style={{ background: "#0F3D2E" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── GRID ────────────────────────────────────────────────────────── */}
          {!error && (
            <main>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : displayedTractors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedTractors.map(tractor => (
                    <Card key={tractor.id} data={tractor} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="text-6xl mb-4">🚜</div>
                  <h3 className="font-display text-2xl font-bold text-gray-800">No Tractors Found</h3>
                  <p className="text-gray-400 mt-2 max-w-xs mx-auto">
                    Try adjusting your filters or clearing them to discover more models.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-6 px-6 py-3 rounded-2xl text-white text-sm font-bold"
                    style={{ background: "#0F3D2E" }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* ── PAGINATION ──────────────────────────────────────────────── */}
              {!loading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                  {/* Prev */}
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                    style={{ background: "#fff", borderColor: "#E5E7EB" }}
                  >
                    ‹
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i).map(p => {
                    const visible =
                      p === 0 || p === totalPages - 1 ||
                      Math.abs(p - filters.page) <= 1;
                    const isEllipsis =
                      !visible &&
                      (p === 1 || p === totalPages - 2) &&
                      Math.abs(p - filters.page) === 2;
                    if (!visible && !isEllipsis) return null;
                    if (isEllipsis) return <span key={p} className="px-1 text-gray-400">…</span>;

                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-semibold transition-all"
                        style={
                          p === filters.page
                            ? { background: "#0F3D2E", color: "#fff" }
                            : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }
                        }
                      >
                        {p + 1}
                      </button>
                    );
                  })}

                  {/* Next */}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= totalPages - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                    style={{ background: "#fff", borderColor: "#E5E7EB" }}
                  >
                    ›
                  </button>
                </div>
              )}
            </main>
          )}
          
          <div className="mt-16 pb-8">
            <EnquiryForm defaultType="tractor" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tractors;
