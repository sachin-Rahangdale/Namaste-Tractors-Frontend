import React, { useState, useEffect } from "react";
import Navbar from "../component/layout/Navbar";
import { getMyProducts, deleteProduct, updateProduct } from "../services/productService";

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Editing
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", description: "", city: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await getMyProducts();
      setMyProducts(data.content);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({ 
      price: product.price, 
      description: product.description || "", 
      city: product.city 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, editForm);
      setEditingProduct(null);
      fetchData(); // Refresh list
      alert("Product updated successfully!");
    } catch (err) {
      alert("Update failed. Please check your inputs.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage My Listings</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 font-bold text-gray-600">Product</th>
                <th className="p-5 font-bold text-gray-600">Price</th>
                <th className="p-5 font-bold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-5 flex items-center gap-4">
                    <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover border" alt={p.productName} />
                    <span className="font-semibold text-gray-800">{p.productName}</span>
                  </td>
                  <td className="p-5 text-green-600 font-bold text-lg">₹{p.price.toLocaleString()}</td>
                  <td className="p-5">
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {/* existing delete logic */}}
                        className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition"
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

        {/* EDIT MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6">Edit {editingProduct.productName}</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 h-24"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct(null)}
                    className="w-1/2 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;