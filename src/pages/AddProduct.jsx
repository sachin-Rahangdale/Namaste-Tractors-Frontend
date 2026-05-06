import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import { createProduct, uploadProductImages } from "../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    unit: "",
    phone: "", // Added
    city: "",
    pincode: "", // Added
    description: "",
    category: "MACHINERY"
  });

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection with Previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare Payload exactly as per your API Schema
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        category: formData.category.toUpperCase()
      };

      // 2. Step 1: Create Product Entry
      const product = await createProduct(payload);

      // 3. Step 2: Upload Images if selected
      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();
        selectedFiles.forEach((file) => imageFormData.append("images", file));
        await uploadProductImages(product.id, imageFormData);
      }

      alert("Product successfully listed on Namaste Tractor!");
      navigate("/products");
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      alert(`Error: ${err.response?.data?.message || "Please check all fields"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-gray-100">
          <div className="bg-green-600 p-10 text-white">
            <h1 className="text-3xl font-black">Sell Your Product</h1>
            <p className="text-green-100 mt-2 opacity-90">Enter accurate details to attract genuine buyers.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
                <input name="productName" type="text" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="e.g. Swaraj 744 FE 2022 Model" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹) *</label>
                <input name="price" type="number" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="550000" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Unit *</label>
                <input name="unit" type="text" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="e.g. Total, Per Hour, Per Acre" />
              </div>
            </div>

            {/* Section 2: Contact & Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input name="phone" type="tel" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="10 digit mobile number" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                <input name="city" type="text" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Gondia / Nagpur" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pincode *</label>
                <input name="pincode" type="text" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="441601" />
              </div>
            </div>

            {/* Section 3: Category & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select name="category" onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition">
                  <option value="MACHINERY">Machinery</option>
                  <option value="CROP">Crop</option>
                  <option value="VEGETABLE">Vegetable</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea name="description" required onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition h-20"
                  placeholder="Describe condition, usage hours, or crop quality..."></textarea>
              </div>
            </div>

            {/* Section 4: Production-Ready Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 text-center">Product Images (Main image first)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-green-100 shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      ✕
                    </button>
                    {index === 0 && <span className="absolute bottom-0 inset-x-0 bg-green-600/80 text-white text-[10px] py-1 text-center font-bold">MAIN</span>}
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  <span className="text-3xl group-hover:scale-125 transition-transform">📸</span>
                  <span className="text-[10px] font-bold text-gray-400 mt-2">ADD IMAGE</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white font-black py-5 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 text-lg uppercase tracking-wider">
              {loading ? "Publishing Listing..." : "Verify & Post Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;