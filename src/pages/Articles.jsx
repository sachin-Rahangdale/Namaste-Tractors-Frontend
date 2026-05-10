import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../component/layout/Navbar";
import ArticleCard from "../component/cards/ArticleCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { getArticles } from "../services/articleService";

// ── Category chips ────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All",
  "Tractor Reviews",
  "Maintenance Tips",
  "New Launches",
  "Government Schemes",
  "Farming Advice",
  "Comparisons",
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonArticleCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse shadow-sm">
    <div className="bg-gray-100 h-48 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 rounded-full w-1/4" />
      <div className="h-5 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-100 rounded-full" />
          <div className="h-3 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-3 bg-gray-100 rounded-full w-16" />
      </div>
    </div>
  </div>
);

// ── Featured skeleton ─────────────────────────────────────────────────────────
const SkeletonFeatured = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse lg:col-span-2 shadow-sm">
    <div className="bg-gray-100 h-72 w-full" />
    <div className="p-7 space-y-4">
      <div className="h-3 bg-gray-100 rounded-full w-1/5" />
      <div className="h-7 bg-gray-100 rounded-full w-3/4" />
      <div className="h-4 bg-gray-100 rounded-full w-full" />
      <div className="h-4 bg-gray-100 rounded-full w-2/3" />
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
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

  // Client-side filter by search + category
  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-12" style={{ background: "linear-gradient(180deg, #F8FAF9 0%, #F1F5F2 100%)" }}>
      <Navbar />

      {/* ── PAGE HEADER & SEARCH ────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}>
        <div className="grain-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse" />
        
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Farming Insights</h1>
              <p className="text-green-200 mt-1.5 text-sm font-medium max-w-md">
                Tractor reviews, maintenance tips, government schemes & agricultural news.
              </p>
            </div>
            
            {/* Compact Search Bar */}
            <div className="w-full md:w-96 relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0F3D2E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/95 text-gray-900 text-sm font-semibold outline-none focus:ring-2 shadow-sm transition-all placeholder:font-medium placeholder:text-gray-400"
                style={{ "--tw-ring-color": "#FBBF24" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar mask-edges">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border"
                style={
                  activeCategory === cat
                    ? { background: "#0F3D2E", color: "#fff", borderColor: "#0F3D2E" }
                    : { background: "#F9FAFB", color: "#4B5563", borderColor: "#F3F4F6" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">

        {/* Result count + clear filters */}
        {!loading && (
          <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
            <p className="text-gray-600 font-semibold text-sm">
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

        {/* ── ERROR ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 mb-8 shadow-sm">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900">Something went wrong</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">{error}</p>
            <button
              onClick={() => fetchArticles(page)}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md bg-[#0F3D2E] hover:bg-green-900 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── LOADING ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonFeatured />
            {Array.from({ length: 5 }).map((_, i) => <SkeletonArticleCard key={i} />)}
          </div>
        )}

        {/* ── GRID ───────────────────────────────────────────── */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article, i) => (
              <div key={article.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ArticleCard data={article} />
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY ─────────────────────────────────────────────────────── */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900">No Articles Found</h3>
            <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different keyword.`
                : "No articles in this category yet. Check back soon!"}
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md bg-[#0F3D2E] hover:bg-green-900 transition-colors"
            >
              View All Articles
            </button>
          </div>
        )}

        {/* ── PAGINATION ────────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && !searchQuery && activeCategory === "All" && (
          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 bg-white border-gray-200 text-gray-600"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map(p => {
              const visible    = p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1;
              const isEllipsis = !visible && (p === 1 || p === totalPages - 2) && Math.abs(p - page) === 2;
              if (!visible && !isEllipsis) return null;
              if (isEllipsis) return <span key={p} className="px-1 text-gray-400">…</span>;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all border"
                  style={
                    p === page
                      ? { background: "#0F3D2E", color: "#fff", borderColor: "#0F3D2E" }
                      : { background: "#fff", color: "#4B5563", borderColor: "#E5E7EB" }
                  }
                >
                  {p + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 bg-white border-gray-200 text-gray-600"
            >
              ›
            </button>
          </div>
        )}

        {/* ── ENQUIRY SECTION ───────────────────────────────────────────── */}
        <section className="mt-16 relative">
          <div
            className="rounded-[3rem] overflow-hidden relative shadow-md"
            style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 opacity-10"
              style={{ background: "radial-gradient(circle, #FBBF24, transparent)", transform: "translate(30%, -30%)" }} />

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-5/12 text-center lg:text-left">
                <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-yellow-500/30"
                  style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
                  Expert Guidance
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  Still Confused<br />
                  <span style={{ color: "#FBBF24" }}>Which to Buy?</span>
                </h2>
                <p className="text-green-200 mt-4 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-medium">
                  Our agricultural experts help you choose the right tractor
                  based on your soil type, acreage, and budget.
                </p>
              </div>

              <div className="lg:w-7/12 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-2 border border-white/20 shadow-xl">
                  <div className="bg-white rounded-[1.5rem] p-6 lg:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Ask Our Experts</h3>
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
