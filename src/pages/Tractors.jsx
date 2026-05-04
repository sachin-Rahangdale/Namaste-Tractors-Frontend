import React, { useState, useEffect } from "react";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractors, getFilteredTractors } from "../services/tractorservice";

const Tractors = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    minHp: "",
    maxHp: "",
    minPrice: "",
    maxPrice: "",
    page: 0,
    size: 12
  });

  // Initial Fetch
  useEffect(() => {
    loadTractors();
  }, []);

  const loadTractors = async () => {
    setLoading(true);
    try {
      const data = await getTractors(0, 12);
      setTractors(data.content);
    } catch (err) {
      console.error("Failed to load tractors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Cleaning empty strings to avoid API issues
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const data = await getFilteredTractors(activeFilters);
      setTractors(data.content);
      setShowFilters(false); // Close mobile filter menu after apply
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
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR FILTER SECTION */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-green-600 hover:underline font-medium"
                >
                  Reset
                </button>
              </div>

              <form onSubmit={handleApplyFilters} className="space-y-6">
                {/* HP Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Horsepower (HP)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Min" 
                      className="w-1/2 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={filters.minHp}
                      onChange={(e) => setFilters({...filters, minHp: e.target.value})}
                    />
                    <input 
                      type="number" placeholder="Max" 
                      className="w-1/2 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={filters.maxHp}
                      onChange={(e) => setFilters({...filters, maxHp: e.target.value})}
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Budget (₹)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Min" 
                      className="w-1/2 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <input 
                      type="number" placeholder="Max" 
                      className="w-1/2 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* MAIN CONTENT SECTION */}
          <main className="w-full md:w-3/4">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-extrabold text-gray-900">All Tractors</h1>
              <p className="text-gray-500 font-medium">{tractors.length} Models Found</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tractors.map((tractor) => (
                  <Card key={tractor.id} data={tractor} />
                ))}
              </div>
            )}

            {tractors.length === 0 && !loading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <p className="text-gray-400">No tractors match your filters. Try adjusting them!</p>
              </div>
            )}
          </main>
        </div>

        {/* PRE-FILLED ENQUIRY SECTION */}
        <div className="mt-24 border-t pt-16">
          <div className="text-center mb-10">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inquiry</span>
            <h2 className="text-3xl font-bold mt-4">Want to Purchase a New Tractor?</h2>
          </div>
          <EnquiryForm 
            defaultType="tractor" 
            defaultMessage="I want to purchase a new tractor." 
          />
        </div>
      </div>
    </div>
  );
};

export default Tractors;