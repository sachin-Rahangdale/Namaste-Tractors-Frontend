import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { 
  getProductById, 
  getFilteredProducts, 
  getProductsByCity, 
  getProducts 
} from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Recommendation States
  const [sameCategory, setSameCategory] = useState([]);
  const [sameCity, setSameCity] = useState([]);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Main Product
      const data = await getProductById(id);
      setProduct(data);
      setActiveImage(data.imageUrls?.[0] || "");

      // 2. Parallel Fetch Recommendations
      const [categoryRes, cityRes, otherRes] = await Promise.all([
        getFilteredProducts({ category: data.category, size: 5 }),
        getProductsByCity(data.city, 0, 5),
        getProducts(0, 5)
      ]);

      // Filter out current product from all lists
      const filterSelf = (list) => list.content.filter(p => p.id !== parseInt(id));
      
      setSameCategory(filterSelf(categoryRes));
      setSameCity(filterSelf(cityRes));
      setOthers(filterSelf(otherRes));
    } catch (err) {
      console.error("Failed to load product ecosystem", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* LEFT: IMAGE GALLERY */}
            <div className="lg:w-1/2 p-8 bg-slate-50/50">
              <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 mb-6 group cursor-zoom-in">
                <img 
                  src={activeImage} 
                  alt={product.productName} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls?.map((url, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(url)}
                    className={`w-24 h-24 rounded-2xl flex-shrink-0 border-2 transition-all ${
                      activeImage === url ? "border-green-500 scale-95 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover rounded-xl" alt="thumb" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
              <div className="mb-6">
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {product.category}
                </span>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4 capitalize tracking-tighter">
                  {product.productName}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {product.city}, {product.pincode}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100">
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">Asking Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                  <span className="text-lg font-bold text-slate-400 italic">/{product.unit}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
                
                {/* CONTACT ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <a 
                    href={`https://wa.me/91${product.phone}?text=Hello, I am interested in your ${product.productName} listed on Namaste Tractors.`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase text-sm shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 brightness-0 invert" alt="wa" />
                    WhatsApp Seller
                  </a>
                  <a 
                    href={`tel:+91${product.phone}`}
                    className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-sm shadow-xl shadow-slate-100 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION ROWS */}
        <section className="mt-24 space-y-24">
          
          <RecommendationRow title={`More in ${product.category}`} products={sameCategory} />
          
          <RecommendationRow title={`Available in ${product.city}`} products={sameCity} />
          
          <RecommendationRow title="Other Fresh Listings" products={others} />

        </section>

        {/* ENQUIRY SECTION */}
        <div className="mt-32">
            <div className="text-center mb-12">
                <span className="text-green-600 font-black uppercase tracking-[0.3em] text-[10px]">Direct Assistance</span>
                <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tighter">Still Looking for Something?</h2>
            </div>
            <div className="bg-slate-900 rounded-[4rem] p-1 shadow-2xl">
                <div className="bg-white rounded-[3.8rem] p-12 md:p-20">
                    <EnquiryForm 
                        defaultType="product" 
                        defaultMessage={`I'm interested in ${product.productName} but have a few questions regarding the machinery.`} 
                    />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for clean rows
const RecommendationRow = ({ title, products }) => {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{title}</h3>
        <Link to="/products" className="text-green-600 font-bold text-sm hover:underline">View Marketplace →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <Card key={p.id} data={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;