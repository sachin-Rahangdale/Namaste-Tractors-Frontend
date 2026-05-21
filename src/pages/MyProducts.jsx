import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../component/layout/Navbar";
import { getMyProducts, deleteProduct, updateProduct } from "../services/productService";

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Editing
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", description: "", city: "" });

  const fetchData = useCallback(async () => {
    try {
      const data = await getMyProducts();
      setMyProducts(data.content || data || []);
    } catch (err) {
      console.error("Error fetching user inventory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({ 
      price: product.price, 
      description: product.description || "", 
      city: product.city || "" 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, editForm);
      setEditingProduct(null);
      fetchData(); // Refresh list structure
      alert("Product listing updated successfully!");
    } catch (err) {
      alert("Update failed. Please check your input parameters.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Verre, are you sure you want to delete this listing permanently?")) {
      try {
        await deleteProduct(id);
        fetchData();
        alert("Product deleted successfully!");
      } catch (err) {
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#ebe8e3] min-h-screen pb-12">
      <Navbar />
      
      <main className="max-w-[1140px] mx-auto px-4 py-8 space-y-6">
        
        {/* ── HEADER TITLE PANEL ── */}
        <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase italic">
            Manage My <span className="text-green-700 NOT-italic">Listings</span>
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Track, update, or clear your posted crops and machinery marketplace logs
          </p>
        </div>
        
        {/* ── CONTENT INTERACTION GRID WRAPPER ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm p-1 sm:p-2">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white">
              <div className="w-8 h-8 border-2 border-green-700 border-t-transparent animate-spin rounded-full" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Loading your inventory...</p>
            </div>
          ) : myProducts.length === 0 ? (
            <div className="text-center py-20 bg-white">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-base font-bold text-gray-800">You haven't posted any marketplace listings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-[50%]">Product Overview</th>
                    <th className="px-6 py-4 w-[25%]">Price Point</th>
                    <th className="px-6 py-4 w-[25%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {myProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product details cell with alignment handling */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {p.imageUrl ? (
                            <img 
                              loading="lazy" 
                              src={p.imageUrl} 
                              className="w-16 h-12 rounded-xl object-cover border border-gray-200 shrink-0" 
                              alt="" 
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                              📦
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-sm text-gray-900 truncate block">
                              {p.productName}
                            </span>
                            <span className="text-gray-400 text-[10px] font-bold block mt-0.5 uppercase">
                              ID: #{p.id} {p.city ? `• ${p.city}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-black text-green-700">
                          ₹{Number(p.price || 0).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(p)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── EDIT MODAL DISPLAY PIPELINE ── */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight truncate max-w-[280px]">
                    Edit <span className="text-green-500 NOT-italic">{editingProduct.productName}</span>
                  </h2>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-white font-bold text-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form inputs */}
              <form onSubmit={handleUpdate} className="p-6 space-y-4 bg-slate-50/50">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">City Location</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-all uppercase"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Description details</label>
                  <textarea 
                    className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium h-24 resize-none transition-all"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>

                {/* Buttons Control Row */}
                <div className="flex gap-3 pt-3 border-t border-gray-200/80 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct(null)}
                    className="w-1/2 py-2.5 font-bold text-xs text-gray-500 hover:bg-gray-100 border border-gray-200 rounded-xl uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 py-2.5 bg-green-600 text-white font-black text-xs rounded-xl shadow-md hover:bg-green-700 uppercase tracking-wider transition-all active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProducts;