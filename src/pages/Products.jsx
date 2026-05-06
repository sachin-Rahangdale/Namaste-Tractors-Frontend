import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { AuthContext } from "../context/AuthContext";
import { getFilteredProducts } from "../services/productService";

const Products = () => {
  const { user } = useContext(AuthContext); //
  const navigate = useNavigate(); //

  // Category Lists
  const [machinery, setMachinery] = useState([]);
  const [crops, setCrops] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  
  // Filter States (City, Min, Max)
  const [tempFilters, setTempFilters] = useState({ city: "", minPrice: "", maxPrice: "" }); //
  const [activeFilters, setActiveFilters] = useState({ city: "", minPrice: "", maxPrice: "" }); //
  
  // Page trackers
  const [pages, setPages] = useState({ MACHINERY: 0, CROP: 0, VEGETABLE: 0 }); //

  useEffect(() => {
    const initializeMarketplace = async () => {
      setLoading(true);
      setPages({ MACHINERY: 0, CROP: 0, VEGETABLE: 0 }); //
      
      await Promise.all([
        loadCategoryData("MACHINERY", 0, false),
        loadCategoryData("CROP", 0, false),
        loadCategoryData("VEGETABLE", 0, false)
      ]);
      setLoading(false);
    };
    initializeMarketplace();
  }, [activeFilters]);

  const loadCategoryData = async (category, pageNum, isAppending = false) => {
    try {
      const params = {
        category: category, //
        page: pageNum,
        size: 4,
        ...(activeFilters.city && { city: activeFilters.city }), //
        ...(activeFilters.minPrice && { minPrice: activeFilters.minPrice }), //
        ...(activeFilters.maxPrice && { maxPrice: activeFilters.maxPrice }), //
      };

      const data = await getFilteredProducts(params); //
      
      const setter = category === "MACHINERY" ? setMachinery : 
                     category === "CROP" ? setCrops : setVegetables;

      setter(prev => isAppending ? [...prev, ...data.content] : data.content); //
    } catch (err) {
      console.error(`Failed to fetch ${category}:`, err);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setActiveFilters({ ...tempFilters }); //
  };

  const clearFilters = () => {
    const reset = { city: "", minPrice: "", maxPrice: "" };
    setTempFilters(reset);
    setActiveFilters(reset); //
  };

  const handleLoadMore = (category) => {
    const nextPage = pages[category] + 1;
    setPages(prev => ({ ...prev, [category]: nextPage })); //
    loadCategoryData(category, nextPage, true); //
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* ENHANCED FILTER & NAVIGATION TOOLBAR */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
            
            {/* Filter Form */}
            <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow w-full">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">📍 Location</label>
                <input 
                  type="text" placeholder="Search City..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempFilters.city}
                  onChange={(e) => setTempFilters({...tempFilters, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">💰 Min Price</label>
                <input 
                  type="number" placeholder="₹ Min"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempFilters.minPrice}
                  onChange={(e) => setTempFilters({...tempFilters, minPrice: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">💰 Max Price</label>
                <input 
                  type="number" placeholder="₹ Max"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempFilters.maxPrice}
                  onChange={(e) => setTempFilters({...tempFilters, maxPrice: e.target.value})}
                />
              </div>
            </form>

            {/* Action Buttons: Apply, My Listings, and Sell */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button 
                onClick={handleApplyFilters}
                className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex-grow md:flex-grow-0"
              >
                Apply Filters
              </button>
              
              {/* RESTORED: My Listings Button */}
              <button 
                onClick={() => user ? navigate("/products/my") : navigate("/login")}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                My Listings
              </button>

              {/* RESTORED: Sell Product Button */}
              <button 
                onClick={() => user ? navigate("/products/new") : navigate("/login")}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition"
              >
                + Sell Now
              </button>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {(activeFilters.city || activeFilters.minPrice || activeFilters.maxPrice) && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase">Active:</span>
              <div className="flex gap-2">
                {activeFilters.city && (
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                    📍 {activeFilters.city}
                  </span>
                )}
                {(activeFilters.minPrice || activeFilters.maxPrice) && (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                    ₹ {activeFilters.minPrice || 0} - {activeFilters.maxPrice || '∞'}
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs font-black text-red-600 underline ml-2">CLEAR ALL ✕</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        <CategorySection title="Machinery" emoji="⚙️" data={machinery} onLoadMore={() => handleLoadMore("MACHINERY")} loading={loading} />
        <CategorySection title="Crops" emoji="🌾" data={crops} onLoadMore={() => handleLoadMore("CROP")} loading={loading} />
        <CategorySection title="Vegetables" emoji="🥦" data={vegetables} onLoadMore={() => handleLoadMore("VEGETABLE")} loading={loading} />
      </main>

      {/* FOOTER ENQUIRY SECTION (Fixed styling as promised) */}
      <section className="bg-slate-900 py-24 relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white italic">Need Expert Suggestions?</h2>
            <p className="text-slate-400 mt-2 italic font-medium">Ask our experts about crop prices, machinery health, or market trends.</p>
          </div>
          <div className="bg-white rounded-[3rem] p-4 shadow-2xl">
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-gray-100">
              <EnquiryForm defaultType="Need Suggestion" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Category Component
const CategorySection = ({ title, emoji, data, onLoadMore, loading }) => (
  <section>
    <div className="flex items-center gap-3 mb-10">
      <span className="text-4xl">{emoji}</span>
      <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
      <div className="flex-grow h-[2px] bg-gray-100 ml-4"></div>
    </div>

    {loading && data.length === 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-3xl"></div>)}
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map(product => <ProductCard key={product.id} data={product} />)}
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed rounded-3xl text-gray-400 font-medium">
            No {title.toLowerCase()} available matching your filters.
          </div>
        ) : (
          <div className="mt-12 text-center">
            <button 
              onClick={onLoadMore}
              className="px-12 py-4 bg-white border-2 border-gray-200 text-gray-600 font-black rounded-2xl hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all uppercase text-sm"
            >
              Load More {title}
            </button>
          </div>
        )}
      </>
    )}
  </section>
);

export default Products;