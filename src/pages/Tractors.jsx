import React, { useState, useEffect } from "react";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractors, getFilteredTractors } from "../services/tractorservice";

const Tractors = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    minHp: "",
    maxHp: "",
    minPrice: "",
    maxPrice: "",
    page: 0,
    size: 12
  });

  useEffect(() => {
    loadTractors();
  }, []);

  const loadTractors = async () => {
    setLoading(true);
    try {
      const data = await getTractors(0, filters.size);
      setTractors(data.content);
    } catch (err) {
      console.error("Failed to load tractors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const data = await getFilteredTractors(activeFilters);
      setTractors(data.content);
    } catch (err) {
      console.error("Filter failed", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ minHp: "", maxHp: "", minPrice: "", maxPrice: "", page: 0, size: 12 });
    loadTractors();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />

      {/* HERO HEADER - Utilizes top space */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tractor Marketplace</h1>
            <p className="text-gray-500 mt-2 font-medium">Explore {tractors.length} heavy-duty models for your field</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Price Range</p>
                <p className="text-lg font-bold text-gray-800">₹3L - ₹50L+</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">HP Range</p>
                <p className="text-lg font-bold text-gray-800">15 HP - 120 HP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        
        {/* HORIZONTAL FILTER BAR - Replaces Sidebar to use full width */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-10 flex flex-wrap items-center gap-6 sticky top-20 z-30">
          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">HP (Min-Max)</label>
              <div className="flex gap-1">
                <input 
                  type="number" placeholder="Min" 
                  className="w-full bg-gray-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={filters.minHp}
                  onChange={(e) => setFilters({...filters, minHp: e.target.value})}
                />
                <input 
                  type="number" placeholder="Max" 
                  className="w-full bg-gray-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={filters.maxHp}
                  onChange={(e) => setFilters({...filters, maxHp: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Budget (Min-Max)</label>
              <div className="flex gap-1">
                <input 
                  type="number" placeholder="₹ Min" 
                  className="w-full bg-gray-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
                <input 
                  type="number" placeholder="₹ Max" 
                  className="w-full bg-gray-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleApplyFilters}
              className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-100"
            >
              Update Search
            </button>
            <button 
              onClick={resetFilters}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition"
              title="Reset All"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* MAIN PRODUCT GRID - Expanded to 4 Columns on XL */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white h-[350px] rounded-3xl animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tractors.map((tractor) => (
                  <Card key={tractor.id} data={tractor} />
                ))}
              </div>

              {tractors.length === 0 && (
                <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <div className="max-w-xs mx-auto">
                    <p className="text-gray-300 text-6xl mb-4">🚜</p>
                    <h3 className="text-xl font-bold text-gray-800">No Tractors Found</h3>
                    <p className="text-gray-400 mt-2">Adjust your filters or reset the search to discover more models.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* ENQUIRY SECTION - Re-styled for better space utilization */}
        <section className="mt-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-[100px] opacity-20 -z-10"></div>
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
                <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Mechanical Muscle</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mt-4 leading-tight tracking-tighter">
                    Finding the Perfect <span className="italic text-green-400">Powerhouse</span> For Your Farm?
                </h2>
                <p className="text-slate-400 mt-6 text-lg max-w-lg">
                    Our experts provide on-road prices, loan assistance, and regional subsidy details.
                </p>
            </div>
            <div className="lg:w-1/2 w-full bg-white p-2 rounded-[2.5rem]">
                <div className="bg-slate-50 p-8 rounded-[2rem]">
                    <EnquiryForm defaultType="tractor" defaultMessage="I am interested in a new tractor purchase." />
                </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tractors;