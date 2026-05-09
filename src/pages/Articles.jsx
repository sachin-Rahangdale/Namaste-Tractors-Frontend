import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../component/layout/Navbar";
import ArticleCard from "../component/cards/ArticleCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { getArticles } from "../services/articleService";

// ── Google Fonts (matches Tractors page) ─────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    * { font-family: 'Outfit', sans-serif; }
    .font-display { font-family: 'Syne', sans-serif; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s ease both; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

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
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
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
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse lg:col-span-2">
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

  // Client-side filter by search + category (extend with API params when backend supports it)
  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured  = filteredArticles[0];
  const restCards = filteredArticles.slice(1);

  return (
    <>
      <FontLink />
      <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
        <Navbar />

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 60%, #22734f 100%)" }}
        >
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
          />
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #D97706, transparent)" }} />

          <div className="max-w-[1440px] mx-auto px-6 py-14 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
                  style={{ background: "rgba(217,119,6,0.2)", color: "#FBBF24" }}>
                  📰 Namaste Tractor
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                  Farming<br />
                  <span style={{ color: "#FBBF24" }}>Insights</span>
                </h1>
                <p className="text-green-200 mt-3 text-lg max-w-lg font-light">
                  Tractor reviews, maintenance tips, government schemes &
                  agricultural news — all in one place.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 fade-up" style={{ animationDelay: "0.1s" }}>
                {[
                  { label: "Articles",      value: totalElements || "50+", icon: "📄" },
                  { label: "Categories",    value: CATEGORIES.length - 1,  icon: "🗂️" },
                  { label: "Updated",       value: "Weekly",               icon: "🔄" },
                ].map(s => (
                  <div key={s.label}
                    className="px-5 py-4 rounded-2xl text-center"
                    style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <div className="text-2xl">{s.icon}</div>
                    <div className="text-white font-bold text-lg leading-tight">{s.value}</div>
                    <div className="text-green-300 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search bar inside hero */}
            <div className="mt-10 max-w-xl fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-sm font-medium outline-none focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.95)", "--tw-ring-color": "#FBBF24" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CATEGORY CHIPS ──────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={
                    activeCategory === cat
                      ? { background: "#0F3D2E", color: "#fff", transform: "scale(1.04)" }
                      : { background: "#F3F4F6", color: "#374151" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 py-10">

          {/* Result count + search indicator */}
          {!loading && (
            <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
              <p className="text-gray-700 font-semibold text-sm">
                {searchQuery || activeCategory !== "All" ? (
                  <><span style={{ color: "#0F3D2E" }} className="font-bold">{filteredArticles.length}</span> results{searchQuery ? ` for "${searchQuery}"` : ""}</>
                ) : (
                  <>Showing <span style={{ color: "#0F3D2E" }} className="font-bold">{articles.length}</span> of {totalElements} articles</>
                )}
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="text-sm text-red-500 font-medium hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* ── ERROR ─────────────────────────────────────────────────────── */}
          {error && (
            <div className="text-center py-20 bg-white rounded-3xl border border-red-100 mb-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800">Something went wrong</h3>
              <p className="text-gray-400 mt-2 mb-6">{error}</p>
              <button
                onClick={() => fetchArticles(page)}
                className="px-6 py-3 rounded-2xl text-white text-sm font-bold"
                style={{ background: "#0F3D2E" }}
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

          {/* ── FEATURED + GRID ───────────────────────────────────────────── */}
          {!loading && !error && filteredArticles.length > 0 && (
            <>
              {/* Featured article — larger card in first slot */}
              {featured && (
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{ background: "rgba(15,61,46,0.08)", color: "#0F3D2E" }}>
                    ★ Featured
                  </div>
                  {/* Render featured using ArticleCard but wrapped for prominence */}
                  <div className="[&>*]:!rounded-3xl [&>*]:shadow-lg">
                    <ArticleCard key={featured.id} data={featured} featured />
                  </div>
                </div>
              )}

              {/* Rest of the grid */}
              {restCards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restCards.map((article, i) => (
                    <div
                      key={article.id}
                      className="fade-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <ArticleCard data={article} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── EMPTY ─────────────────────────────────────────────────────── */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-40 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="font-display text-2xl font-bold text-gray-800">No Articles Found</h3>
              <p className="text-gray-400 mt-2 max-w-xs mx-auto">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different keyword.`
                  : "No articles in this category yet. Check back soon!"}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-6 px-6 py-3 rounded-2xl text-white text-sm font-bold"
                style={{ background: "#0F3D2E" }}
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
                className="w-10 h-10 flex items-center justify-center rounded-2xl border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                style={{ background: "#fff", borderColor: "#E5E7EB" }}
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
                    className="w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-semibold transition-all"
                    style={
                      p === page
                        ? { background: "#0F3D2E", color: "#fff" }
                        : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }
                    }
                  >
                    {p + 1}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                style={{ background: "#fff", borderColor: "#E5E7EB" }}
              >
                ›
              </button>
            </div>
          )}

          {/* ── NEWSLETTER NUDGE ──────────────────────────────────────────── */}
          {!loading && (
            <div
              className="mt-16 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)" }}
            >
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900">Never miss an update</h3>
                <p className="text-gray-600 text-sm mt-1">Get the latest tractor news & farming tips in your inbox.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 sm:w-64 px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 border border-amber-200"
                  style={{ "--tw-ring-color": "#0F3D2E" }}
                />
                <button
                  className="px-5 py-3 rounded-2xl text-white text-sm font-bold whitespace-nowrap transition hover:opacity-90"
                  style={{ background: "#0F3D2E" }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}

          {/* ── ENQUIRY SECTION ───────────────────────────────────────────── */}
          <section className="mt-16 relative">
            <div
              className="rounded-[3rem] overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}
            >
              <div className="absolute top-0 right-0 w-80 h-80 opacity-10"
                style={{ background: "radial-gradient(circle, #FBBF24, transparent)", transform: "translate(30%, -30%)" }} />

              <div className="relative z-10 p-12 md:p-16 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-center lg:text-left">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                    style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
                    Expert Guidance
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                    Still Confused<br />
                    <span style={{ color: "#FBBF24" }}>Which to Buy?</span>
                  </h2>
                  <p className="text-green-200 mt-5 text-base leading-relaxed max-w-md">
                    Our agricultural experts help you choose the right tractor
                    based on your soil type, acreage, and budget — with loan
                    and subsidy guidance included.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-green-300 font-medium">
                    {["✓ Free consultation", "✓ Subsidy guidance", "✓ Loan assistance"].map(f => (
                      <span key={f}>{f}</span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-1/2 w-full">
                  <div className="bg-white rounded-[2.5rem] p-2">
                    <div className="bg-gray-50 rounded-[2rem] p-8">
                      <EnquiryForm
                        defaultType="Need Suggestion"
                        defaultMessage="I am looking for expert suggestions for my next tractor purchase."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Articles;
