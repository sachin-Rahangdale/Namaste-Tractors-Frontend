import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { 
  getProductById, 
  getFilteredProducts, 
  getProductsByCity, 
  getProducts 
} from "../services/productService";

const CATEGORY_META = {
  MACHINERY: {
    label: "Machinery",
    icon: "⚙️",
    accent: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    badgeBg: "#DBEAFE",
    badgeText: "#1D4ED8",
  },
  CROP: {
    label: "Crops",
    icon: "🌾",
    accent: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    badgeBg: "#FEF3C7",
    badgeText: "#B45309",
  },
  VEGETABLE: {
    label: "Vegetables",
    icon: "🥦",
    accent: "#0F3D2E",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    badgeBg: "#DCFCE7",
    badgeText: "#15803D",
  },
  ALL: {
    label: "All Products",
    icon: "🏪",
    accent: "#0F3D2E",
    bg: "#F8FAF9",
    border: "#E5E7EB",
    badgeBg: "#E5E7EB",
    badgeText: "#374151",
  }
};

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const allImages = images?.length > 0 ? images : [];

  const prev = () => setCurrent(c => (c - 1 + allImages.length) % allImages.length);
  const next = () => setCurrent(c => (c + 1) % allImages.length);

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-100">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-sm font-medium">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden group border border-gray-200">
        <img
          key={current}
          src={allImages[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-contain p-2"
        />
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
            {current + 1} / {allImages.length}
          </div>
        )}
        {allImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-gray-200 text-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-gray-200 text-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-20 h-20 rounded-xl flex-shrink-0 border-2 transition-all bg-white ${
                i === current ? "border-green-600 shadow-sm p-1" : "border-gray-200 p-2 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} className="w-full h-full object-contain" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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
      const data = await getProductById(id);
      setProduct(data);

      const [categoryRes, cityRes, otherRes] = await Promise.all([
        getFilteredProducts({ category: data.category, size: 5 }),
        getProductsByCity(data.city, 0, 5),
        getProducts(0, 5)
      ]);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold text-xl text-gray-500">Product not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-600 transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-gray-900">{product.category}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row p-6 lg:p-8 gap-10">
            
            {/* LEFT: IMAGE GALLERY */}
            <div className="lg:w-[45%] flex-shrink-0">
              <ImageSlider images={product.imageUrls} />
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="lg:w-[55%] flex flex-col">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight capitalize">
                      {product.productName}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {product.city}, {product.pincode}
                    </div>
                  </div>
                  {/* Share button or tag */}
                  <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shrink-0">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Asking Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">₹{product.price?.toLocaleString("en-IN")}</span>
                    {product.unit && <span className="text-gray-500 font-bold">/{product.unit}</span>}
                  </div>
                </div>

              </div>

              {/* Details Block */}
              <div className="mb-8">
                <h3 className="text-lg font-black text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
              
              {/* CONTACT ACTIONS - JUSTDIAL STYLE */}
              <div className="mt-auto">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Contact Seller</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href={`tel:+91${product.phone}`}
                    className="flex flex-col items-center justify-center gap-1 bg-[#0F3D2E] text-white py-3 px-4 rounded-xl shadow-md hover:bg-[#1a5c40] transition-colors group"
                  >
                    <div className="flex items-center gap-2 font-black uppercase text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Call Now
                    </div>
                    <span className="text-green-300 text-xs font-bold tracking-widest">+91 {product.phone}</span>
                  </a>
                  <a 
                    href={`https://wa.me/91${product.phone}?text=Hello, I am interested in your ${product.productName} listed on Namaste Tractors.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white py-3 px-4 rounded-xl shadow-md hover:bg-[#20bd5a] transition-colors"
                  >
                    <div className="flex items-center gap-2 font-black uppercase text-sm">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                      WhatsApp
                    </div>
                    <span className="text-green-100 text-xs font-bold tracking-widest">+91 {product.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION ROWS */}
        <section className="mt-12 space-y-12">
          <RecommendationRow title={`Similar in ${product.category}`} products={sameCategory} />
          <RecommendationRow title={`Available in ${product.city}`} products={sameCity} />
          <RecommendationRow title="Other Fresh Listings" products={others} />
        </section>

        {/* ENQUIRY SECTION */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-5/12 bg-[#0F3D2E] p-10 flex flex-col justify-center text-white relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-green-500 rounded-full mix-blend-overlay blur-2xl opacity-40 pointer-events-none" />
              <span className="text-green-300 font-bold uppercase tracking-widest text-[10px] mb-2">Direct Assistance</span>
              <h2 className="text-3xl font-black mb-4">Still Looking for Something?</h2>
              <p className="text-green-100 text-sm leading-relaxed">Let our experts help you find exactly what you need. Fill out the form and we'll get back to you shortly.</p>
            </div>
            <div className="md:w-7/12 p-10 bg-gray-50 flex items-center">
                <EnquiryForm 
                    defaultType="product" 
                    defaultMessage={`I'm interested in ${product.productName} but have a few questions regarding the machinery.`} 
                    hideHeader
                    transparent
                />
            </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for clean rows
const RecommendationRow = ({ title, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <div>
      <div className="flex justify-between items-end mb-6 pb-3 border-b border-gray-200">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
        <Link to="/products" className="text-green-600 font-bold text-sm hover:text-green-800 transition-colors">View All →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.slice(0, 5).map((p) => {
          const meta = CATEGORY_META[p.category] || CATEGORY_META.ALL;
          return <ProductCard key={p.id} data={p} categoryMeta={meta} />;
        })}
      </div>
    </div>
  );
};

export default ProductDetail;