import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import { createProduct, uploadProductImages } from "../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null);
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    unit: "",
    city: "",
    category: "MACHINERY",
    description: ""
  });

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create Product Entry
      const product = await createProduct(formData);
      setProductId(product.id);

      // Step 2: If images exist, upload them
      if (files.length > 0) {
        const imageFormData = new FormData();
        files.forEach((file) => imageFormData.append("images", file));
        await uploadProductImages(product.id, imageFormData);
      }

      alert("Product listed successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to list product. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-green-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">List Your Product</h1>
            <p className="text-green-100 mt-2">Fill in the details to reach thousands of farmers</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="e.g. Massey Ferguson 7250"
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                <input 
                  type="number" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="210000"
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="per unit / per acre"
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="MACHINERY">MACHINERY</option>
                  <option value="CROP">CROP</option>
                  <option value="VEGETABLE">VEGETABLE</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Gondia"
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition h-32"
                placeholder="Describe the condition, usage, and any other details..."
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-gray-50">
              <input 
                type="file" multiple accept="image/*"
                id="file-upload" className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-4xl mb-2 block">📸</span>
                <span className="text-green-600 font-bold">Click to upload images</span>
                <p className="text-xs text-gray-400 mt-1">First image will be the main cover</p>
              </label>
              {files.length > 0 && (
                <div className="mt-4 text-sm font-medium text-gray-600">
                  {files.length} images selected
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl hover:bg-green-700 transition shadow-xl shadow-green-100 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;