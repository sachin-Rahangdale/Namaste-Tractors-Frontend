import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { AuthContext } from "../context/AuthContext";
import { getFilteredProducts } from "../services/productService";

// Per-category styling tokens
const CATEGORY_META = {
  MACHINERY: {
    label: "Machinery",
    icon: "⚙️",
    accent: "#2563EB",       // blue
    bg: "#EFF6FF",
    border: "#BFDBFE",
    badgeBg: "#DBEAFE",
    badgeText: "#1D4ED8",
  },
  CROP: {
    label: "Crops",
    icon: "🌾",
    accent: "#D97706",       // amber
    bg: "#FFFBEB",
    border: "#FDE68A",
    badgeBg: "#FEF3C7",
    badgeText: "#B45309",
  },
  VEGETABLE: {
    label: "Vegetables",
    icon: "🥦",
    accent: "#0F3D2E",       // brand green
    bg: "#F0FDF4",
    border: "#BBF7D0",
    badgeBg: "#DCFCE7",
    badgeText: "#15803D",
  },
  ALL: {
    label: "All Products",
    icon: "🏪",
    accent: "#0F3D2E",
    bg: "#F8FAF9",
    border: "#E5E7EB",
    badgeBg: "#E5E7EB",
    badgeText: "#374151",
  }
};

const CATEGORIES = ["ALL", "MACHINERY", "CROP", "VEGETABLE"];

const Products = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("");
  const [cityInput, setCityInput] = useState(""); // For the input below cards
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 12;

  const fetchProducts = useCallback(async (pageNum, category, city, isAppending = false) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        size: PAGE_SIZE,
        ...(category !== "ALL" && { category }),
        ...(city && { city }),
      };
      
      const data = await getFilteredProducts(params);
      
      setProducts(prev => isAppending ? [...prev, ...(data.content || [])] : (data.content || []));
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and filter changes
  useEffect(() => {
    setPage(0);
    fetchProducts(0, activeCategory, cityFilter, false);
  }, [activeCategory, cityFilter, fetchProducts]);

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      const next = page + 1;
      setPage(next);
      fetchProducts(next, activeCategory, cityFilter, true);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    setCityFilter(cityInput);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const clearCityFilter = () => {
    setCityFilter("");
    setCityInput("");
  };

  return (
    <div className="min-h-screen pb-12" style={{ background: "linear-gradient(180deg, #F8FAF9 0%, #F1F5F2 100%)" }}>
      <Navbar />

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)" }}>
        <div className="grain-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse" />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Marketplace</h1>
              <p className="text-green-200 text-sm mt-2 font-medium max-w-lg leading-relaxed">
                Buy &amp; sell machinery, crops, and vegetables directly from farmers across India. No middlemen.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {user && (
                <button
                  onClick={() => navigate("/products/my")}
                  className="px-5 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  My Listings
                </button>
              )}
              <button
                onClick={() => user ? navigate("/products/new") : navigate("/login")}
                className="px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:-translate-y-1"
                style={{ background: "#FBBF24", color: "#0F3D2E", boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.4)" }}
              >
                + List Your Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS & SEARCH ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
            {/* Chips */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mask-edges">
              {CATEGORIES.map(cat => {
                const meta = CATEGORY_META[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
                      isActive 
                        ? 'shadow-md border-transparent scale-[1.02]' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    style={isActive ? { background: meta.accent, color: "#fff" } : {}}
                  >
                    <span className="text-lg">{meta.icon}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* City Search */}
            <form onSubmit={handleCitySearch} className="relative shrink-0 sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <input
                type="text"
                placeholder="Search city..."
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#0F3D2E] outline-none transition-shadow placeholder:font-medium placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
              />
              {cityInput && (
                <button
                  type="button"
                  onClick={clearCityFilter}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 rounded-full text-[10px] font-bold transition-colors"
                >
                  ✕
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">
        
        {/* Active Filters Summary */}
        {(cityFilter || activeCategory !== "ALL") && (
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Showing:</span>
              
              {activeCategory !== "ALL" && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5"
                  style={{ 
                    background: CATEGORY_META[activeCategory].bg, 
                    color: CATEGORY_META[activeCategory].accent,
                    borderColor: CATEGORY_META[activeCategory].border
                  }}>
                  <span>{CATEGORY_META[activeCategory].icon}</span>
                  {CATEGORY_META[activeCategory].label}
                </span>
              )}

              {cityFilter && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
                  <span>📍</span>
                  City: {cityFilter}
                  <button onClick={clearCityFilter} className="ml-1 hover:text-red-500 rounded-full w-4 h-4 inline-flex items-center justify-center bg-blue-100 text-blue-800 transition-colors">✕</button>
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-gray-600">
              <span className="text-gray-900 font-extrabold">{totalElements}</span> results found
            </p>
          </div>
        )}

        {/* ── GRID ────────────────────────────────────────────── */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[340px] bg-white border border-gray-100 rounded-[2rem] shadow-sm animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
            <div className="text-6xl mb-4">🚜</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              {cityFilter 
                ? `We couldn't find any ${activeCategory !== "ALL" ? CATEGORY_META[activeCategory].label.toLowerCase() : "products"} in ${cityFilter}. Try a different city or clear the filter.`
                : `There are currently no ${CATEGORY_META[activeCategory].label.toLowerCase()} available. Check back later.`}
            </p>
            {cityFilter && (
              <button onClick={clearCityFilter} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition-colors">
                Clear City Filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => {
                // Pass correct category meta based on the product's actual category
                const meta = CATEGORY_META[product.category] || CATEGORY_META.ALL;
                return <ProductCard key={product.id} data={product} categoryMeta={meta} />;
              })}
            </div>

            {/* Load More */}
            {page < totalPages - 1 && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More Products ↓"}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── SEARCH IN CITY (BELOW CARDS) ──────────────────────────────── */}
        <section className="mt-20">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-5/12 bg-blue-50 p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-10 -top-10 text-9xl opacity-10">📍</div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 relative z-10">Looking for local deals?</h3>
              <p className="text-gray-600 text-sm font-medium relative z-10">
                Find tractors, machinery, and fresh crops available from sellers directly in your city or district.
              </p>
            </div>
            <div className="md:w-7/12 p-8 md:p-12 flex items-center">
              <form onSubmit={handleCitySearch} className="w-full flex gap-3">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
                  <input
                    type="text"
                    placeholder="Enter your city or district..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 text-gray-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md whitespace-nowrap"
                >
                  Search Area
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── ENQUIRY ─────────────────────────────────────────────── */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 opacity-80 rounded-[3rem]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 rounded-[3rem]" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-14">
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-amber-900/10 border border-white/60">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Need Expert Advice?</h2>
              <EnquiryForm defaultType="Need Suggestion" hideHeader transparent />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Products;