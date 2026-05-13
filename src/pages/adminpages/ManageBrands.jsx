import React, { useState, useEffect } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../../services/brandService";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      console.error("Failed to load brands", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      // Calling corrected service with just the string
      await createBrand(newBrandName.trim());
      setNewBrandName("");
      loadBrands();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Error 400: Check if brand already exists or name is too long.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateBrand(id, editName);
      setEditingId(null);
      loadBrands();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="space-y-10 p-2">
      <div>
        <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Manage Brands</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Manufacturer Database Control</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* NEW BRAND FORM (Matches your screenshot) */}
        <div className="lg:w-1/3 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-fit">
          <h3 className="text-xl font-black text-slate-800 uppercase italic mb-8">New Brand</h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
              <input 
                type="text"
                placeholder="Enter Brand Name"
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all mt-2"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
            </div>
            <button className="w-full bg-[#0f172a] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl">
              Save Brand
            </button>
          </form>
        </div>

        {/* BRANDS GRID */}
        <div className="lg:w-2/3">
          {loading ? (
            <div className="animate-pulse font-black text-slate-300">SYNCING ENGINE...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brands.map((brand) => (
                <div key={brand.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-green-500 transition-all">
                  {editingId === brand.id ? (
                    <div className="flex gap-2 w-full">
                      <input 
                        className="flex-1 bg-slate-50 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(brand.id)} className="bg-green-600 text-white px-4 rounded-xl text-[10px] font-black">SAVE</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">ID: #{brand.id}</p>
                        <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{brand.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingId(brand.id); setEditName(brand.name); }}
                          className="p-2 text-slate-400 hover:text-blue-600 transition"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => { if(confirm("Delete brand?")) deleteBrand(brand.id).then(loadBrands) }}
                          className="p-2 text-slate-400 hover:text-red-600 transition"
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