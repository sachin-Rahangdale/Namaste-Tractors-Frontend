import React, { useState, useEffect, useCallback } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../../services/brandService";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data || []);
    } catch (err) {
      console.error("Failed to load brands", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      await createBrand(newBrandName.trim());
      setNewBrandName("");
      loadBrands();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Error 400: Check if brand already exists or name is too long.");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateBrand(id, editName.trim());
      setEditingId(null);
      loadBrands();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 p-1 bg-slate-50 min-h-screen">
      
      {/* ── HEADER TITLE ── */}
      <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Manage Brands</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mt-1">Manufacturer Database Control</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ── SECTION A: NEW REGISTRATION FORM PANEL ── */}
        <div className="w-full lg:w-1/3 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-6">
          <h3 className="text-lg font-black text-slate-800 uppercase italic border-b border-gray-100 pb-2">New Manufacturer</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Brand Name String</label>
              <input 
                type="text"
                placeholder="e.g. Mahindra / Swaraj / Sonalika"
                className="w-full bg-slate-50 border-[0.5px] border-slate-400 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-gray-400"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
            </div>
            <button className="w-full bg-slate-900 hover:bg-green-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]">
              Save Manufacturer →
            </button>
          </form>
        </div>

        {/* ── SECTION B: EXISTING GRIDS ENGINE RECORD ── */}
        <div className="w-full lg:w-2/3">
          {loading ? (
            <div className="py-12 text-center bg-white border border-gray-200 rounded-2xl">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent mb-2"></div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Syncing Engine Records...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brands.map((brand) => (
                <div key={brand.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-gray-400 transition-all">
                  
                  {/* EDIT MODE ACTIVE INLINE GRID */}
                  {editingId === brand.id ? (
                    <div className="flex gap-2 w-full items-center">
                      <input 
                        className="flex-1 bg-slate-50 border-[0.5px] border-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold outline-none focus:border-slate-900"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(brand.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Save</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider">Index: #{brand.id}</p>
                        <h4 className="text-base font-black text-slate-800 uppercase italic tracking-tight truncate mt-0.5">{brand.name}</h4>
                      </div>
                      
                      {/* UTILITY BUTTON GROUPS MAP */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => { setEditingId(brand.id); setEditName(brand.name); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded-lg transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => { if(window.confirm(`Verre, delete entry for brand "${brand.name}"?`)) deleteBrand(brand.id).then(loadBrands) }}
                          className="p-1.5 text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded-lg transition"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                  
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageBrands;