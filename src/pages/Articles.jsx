import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../component/layout/Navbar";
import ArticleCard from "../component/cards/ArticleCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { getArticles } from "../services/articleService";

// ── Category chips ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Tractor Reviews", value: "TRACTOR_REVIEWS" },
  { label: "Maintenance Tips", value: "MAINTENANCE_TIPS" },
  { label: "New Launches", value: "NEW_LAUNCHES" },
  { label: "Government Schemes", value: "GOVERNMENT_SCHEMES" },
  { label: "Farming Advice", value: "FARMING_ADVICE" },
  { label: "Comparisons", value: "COMPARISONS" },
];

// ── Skeleton card optimized for 2-column smartphone grid matrix ───────────────
const SkeletonArticleCard = () => (
  <div className="bg-white rounded-none overflow-hidden border border-gray-200 animate-pulse shadow-sm">
    <div className="bg-gray-100 h-32 sm:h-48 w-full rounded-none" />
    <div className="p-3 sm:p-5 space-y-2.5">
      <div className="h-3 bg-gray-100 w-1/4" />
      <div className="h-4 bg-gray-100 w-3/4" />
      <div className="h-3 bg-gray-100 w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-gray-100" />
          <div className="h-2.5 bg-gray-100 w-12" />
        </div>
      </div>
    </div>
  </div>
);

// ── Featured skeleton ─────────────────────────────────────────────────────────
const SkeletonFeatured = () => (
  <div className="bg-white rounded-none overflow-hidden border border-gray-200 animate-pulse col-span-2 lg:col-span-2 shadow-sm">
    <div className="bg-gray-100 h-44 sm:h-72 w-full rounded-none" />
    <div className="p-4 sm:p-7 space-y-3">
      <div className="h-3 bg-gray-100 w-1/5" />
      <div className="h-5 bg-gray-100 w-3/4" />
      <div className="h-3 bg-gray-100 w-full" />
    </div>
  </div>
);

const Articles = () => {
  const [articles,       setArticles]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [totalElements,  setTotalElements]  = useState(0);
  const [totalPages,     setTotalPages]     = useState(0);
  const [page,           setPage]           = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");

  const PAGE_SIZE = 12;

  const fetchArticles = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(p, PAGE_SIZE);
      setArticles(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("Failed to load articles", err);
      setError("Unable to load articles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(0); }, [fetchArticles]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchArticles(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      a.articleType === activeCategory; 
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-12" style={{ background: "linear-gradient(180deg, #F8FAF9 0%, #F1F5F2 100%)" }}>
      <Navbar />

      {/* ── PAGE HEADER & SEARCH (RESPONSIVE FIXES) ────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}>
        <div className="grain-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse" />
        
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Farming Insights</h1>
              <p className="text-green-200 mt-1 text-xs sm:text-sm font-medium max-w-md">
                Tractor reviews, maintenance tips, government schemes & agricultural news.
              </p>
            </div>
            
            {/* Compact Search Bar Container Layout */}
            <div className="w-full md:w-96 relative group">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white text-gray-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 shadow-sm transition-all placeholder:text-gray-400"
                style={{ "--tw-ring-color": "#FBBF24" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full text-[10px] font-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS WITH FIXED TOP RESPONSIVENESS ─────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-[108px] md:top-[72px] z-40 shadow-sm">
  <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
    <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar mask-edges">
      {CATEGORIES.map(cat => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold transition-all duration-200 whitespace-nowrap border rounded-full ${
              isActive
                ? "bg-[#0F3D2E] text-white border-[#0F3D2E] scale-[1.02] shadow-sm"
                : "bg-[#F9FAFB] text-[#4B5563] border-[#F3F4F6] hover:bg-gray-100"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  </div>
</div>
      {/* ── CONTENT READOUT CONTAINER ───────────────────────────────────── */}
      <div className="max-w-[90rem] mx-auto px-3 sm:px-6 py-6 sm:py-10">

        {/* Result count + clear filters */}
        {!loading && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p className="text-gray-600 font-semibold text-xs sm:text-sm">
              {searchQuery || activeCategory !== "All" ? (
                <><span className="text-[#0F3D2E] font-bold">{filteredArticles.length}</span> results{searchQuery ? ` for "${searchQuery}"` : ""}</>
              ) : (
                <>Showing <span className="text-[#0F3D2E] font-bold">{articles.length}</span> of {totalElements} articles</>
              )}
            </p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors"
              >
                Clear Filters ✕
              </button>
            )}
          </div>
        )}

        {/* ── ERROR DISPLAY ROW ── */}
        {error && (
          <div className="text-center py-16 bg-white rounded-none border border-red-100 mb-6 shadow-sm">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-base font-bold text-gray-900">Something went wrong</h3>
            <p className="text-gray-400 mt-0.5 mb-4 text-xs">{error}</p>
            <button
              onClick={() => fetchArticles(page)}
              className="px-5 py-2 rounded-none text-white text-xs font-bold bg-[#0F3D2E]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── LOADING METRICS ROWS (2 COLUMNS FOR MOBILE) ─────────────────── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <SkeletonFeatured />
            {Array.from({ length: 4 }).map((_, i) => <SkeletonArticleCard key={i} />)}
          </div>
        )}

        {/* ── DUAL CARD COLUMN MATRIX GRID GRID ON SMARTPHONES BREAKPOINT ── */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredArticles.map((article, i) => (
              <div key={article.id} className="fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <ArticleCard data={article} />
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY DATA LAYOUT BLOCK ── */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-24 bg-white rounded-none border border-dashed border-gray-200 shadow-sm px-4">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-lg font-bold text-gray-900">No Articles Found</h3>
            <p className="text-gray-400 mt-1 text-xs max-w-sm mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different keyword.`
                : "No articles in this category yet. Check back soon!"}
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 px-5 py-2 rounded-none text-white text-xs font-bold bg-[#0F3D2E]"
            >
              View All Articles
            </button>
          </div>
        )}

        {/* ── PAGINATION SYSTEM ── */}
        {!loading && totalPages > 1 && !searchQuery && activeCategory === "All" && (
          <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-none border text-xs font-medium disabled:opacity-30 bg-white border-gray-200 text-gray-600"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i).map(p => {
              const visible = p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1;
              if (!visible) return null;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-none text-xs font-bold border"
                  style={p === page ? { background: "#0F3D2E", color: "#fff", borderColor: "#0F3D2E" } : { background: "#fff", color: "#4B5563", borderColor: "#E5E7EB" }}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-none border text-xs font-medium disabled:opacity-30 bg-white border-gray-200 text-gray-600"
            >
              ›
            </button>
          </div>
        )}

        {/* ── GEOMETRIC SHARP ENQUIRY BANNER BLOCK ─────────────────────────── */}
        <section className="mt-16 relative">
          <div className="rounded-[2rem] overflow-hidden relative border border-gray-200 shadow-sm" style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}>
            <div className="relative z-10 p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
              <div className="lg:w-5/12 text-center lg:text-left">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-none border border-yellow-500/20 bg-amber-400/10 text-amber-400">
                  Expert Guidance
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Still Confused<br />Which to Buy?
                </h2>
                <p className="text-green-200/80 mt-3 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-medium">
                  Our agricultural experts help you choose the right tractor based on soil type, acreage, and budget metrics.
                </p>
              </div>

              <div className="lg:w-7/12 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-sm p-1.5 border border-white/15 shadow-xl">
                  <div className="bg-white rounded-sm p-5 sm:p-8">
                    <h3 className="text-base font-black text-gray-900 mb-5 text-center uppercase tracking-wide">Ask Our Experts</h3>
                    <EnquiryForm
                      defaultType="Need Suggestion"
                      defaultMessage="I am looking for expert suggestions for my next tractor purchase."
                      hideHeader
                      transparent
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Articles;