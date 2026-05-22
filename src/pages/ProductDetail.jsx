import React, { useState, useEffect, useCallback } from "react";
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
  MACHINERY: { accent: "#2563EB", label: "Machinery" },
  CROP: { accent: "#D97706", label: "Crops" },
  VEGETABLE: { accent: "#0F3D2E", label: "Vegetables" },
  ALL: { accent: "#0F3D2E", label: "All Products" }
};

// ── OPTIMIZED LIGHTWEIGHT IMAGE SLIDER ──────────────────────────────────────
const ImageSlider = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const allImages = images?.length > 0 ? images : [];

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl border border-gray-200">
        <div className="text-center text-gray-400">
          <div className="text-3xl mb-1">📦</div>
          <p className="text-[11px] font-bold uppercase tracking-wider">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden group border border-gray-200/70 shadow-sm">
        <img
          loading="eager"
          src={allImages[current]}
          alt={`${title} view ${current + 1}`}
          className="w-full h-full object-contain p-2"
        />
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest">
            {current + 1} / {allImages.length}
          </div>
        )}
      </div>
      
      {/* Horizontal Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-11 h-11 rounded-xl flex-shrink-0 border-2 bg-white transition-all overflow-hidden ${
                i === current ? "border-[#0F3D2E]" : "border-gray-200 opacity-60"
              }`}
            >
              <img loading="lazy" src={src} className="w-full h-full object-contain p-0.5" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── MAIN SCREEN LIFECYCLE ───────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [sameCategory, setSameCategory] = useState([]);
  const [sameCity, setSameCity] = useState([]);
  const [others, setOthers] = useState([]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setProduct(data);

      const [categoryRes, cityRes, otherRes] = await Promise.all([
        getFilteredProducts({ category: data.category, size: 5 }),
        getProductsByCity(data.city, 0, 5),
        getProducts(0, 5)
      ]);

      const filterSelf = (list) => (list?.content || []).filter(p => p.id !== parseInt(id));
      
      setSameCategory(filterSelf(categoryRes));
      setSameCity(filterSelf(cityRes));
      setOthers(filterSelf(otherRes));
    } catch (err) {
      console.error("Failed to load product ecosystem", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [loadAllData]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
      <div className="w-8 h-8 border-2 border-[#0F3D2E] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold text-sm text-gray-400">Product not found.</div>;

  return (
    <div className="bg-[#ebe8e3] min-h-screen pb-12">
      <Navbar />

      <main className="max-w-[1140px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
        
        {/* Breadcrumb - Clean background wrap for premium mobile reading */}
        <nav className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-500 mb-3 sm:mb-4 uppercase tracking-widest overflow-x-auto whitespace-nowrap no-scrollbar bg-white px-3 py-2 border border-gray-200/60 shadow-sm rounded-xl">
          <Link to="/" className="hover:text-[#0F3D2E]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/products" className="hover:text-[#0F3D2E]">Marketplace</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800">{product.category}</span>
        </nav>

        {/* Core Product Information Card Segment */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 md:gap-10">
            
            {/* Gallery Wrapper */}
            <div className="w-full md:w-[45%] shrink-0">
              <ImageSlider images={product.imageUrls} title={product.productName} />
            </div>

            {/* Readout Fields Details Column - SPACE WASTAGE FIXED HERE */}
            <div className="w-full md:w-[55%] flex flex-col justify-between gap-4 sm:gap-5">
              <div className="space-y-3">
                
                {/* Category Tag Line & Location Wrapper */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#0F3D2E]/5 text-[#0F3D2E] text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-[#0F3D2E]/10">
                    {product.category}
                  </span>
                  <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-300 px-2 py-1 rounded-lg text-[10px] font-extrabold text-gray-600 uppercase tracking-wide">
                    <span>📍</span> {product.city} {product.pincode ? `(${product.pincode})` : ""}
                  </div>
                </div>

                {/* Product Name Title Header - Font scaled dynamically for smartphone viewport */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight capitalize">
                  {product.productName}
                </h1>

                {/* Price Display Block - Compacted for space conservation */}
                <div className="p-3 sm:p-4 bg-[#F0FDF4] border-l-4 border-[#0F3D2E] border-t border-b border-r border-gray-200 flex items-baseline gap-1.5 rounded-xl shadow-sm">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0F3D2E]">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                  {product.unit && (
                    <span className="text-gray-500 text-xs sm:text-sm font-extrabold lowercase">
                      / {product.unit}
                    </span>
                  )}
                </div>

                {/* Description Box - Tightened structure padding */}
                <div className="bg-gray-50/80 border border-gray-200 p-3.5 rounded-xl shadow-sm">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 border-b border-gray-200 pb-1">
                    Description & Details
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-medium">
                    {product.description || "No description provided by the seller."}
                  </p>
                </div>
              </div>
              
              {/* CONTACT CALL ACTIONS ROW */}
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-0.5">
                  Direct Contact Verified Seller
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <a 
                    href={`tel:+91${product.phone}`}
                    className="flex items-center justify-center gap-1.5 text-white py-3 px-3 rounded-xl shadow-sm transition-all text-xs font-black uppercase tracking-wider active:scale-[0.97] hover:bg-[#14543f]"
                    style={{ backgroundColor: "#0F3D2E" }}
                  >
                    📞 Call Now
                  </a>
                  <a 
                    href={`https://wa.me/91${product.phone}?text=Hello, I am interested in your ${product.productName} listed on Namaste Tractors.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-3 px-3 rounded-xl shadow-sm transition-all text-xs font-black uppercase tracking-wider active:scale-[0.97] hover:bg-[#1ebd57]"
                  >
                    <span className="text-sm leading-none">💬</span> WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── HIGH SPEED 2-COLUMN MATRIX RECOMMENDATIONS ROWS ────────────────── */}
        <section className="mt-6 space-y-6">
          <RecommendationRow title={`Similar in ${product.category}`} products={sameCategory} />
          <RecommendationRow title={`Available in ${product.city}`} products={sameCity} />
          <RecommendationRow title="Other Fresh Listings" products={others} />
        </section>

        {/* CLEAN INTERACTIVE ASSISTANCE ENQUIRY BOX */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row w-full">
          <div className="md:w-5/12 bg-[#0F3D2E] p-6 sm:p-8 flex flex-col justify-center text-white relative shrink-0">
            <span className="text-green-300 font-bold uppercase tracking-widest text-[9px] mb-1">Direct Support</span>
            <h2 className="text-xl sm:text-2xl font-black mb-1.5 tracking-tight">Still Looking for Something?</h2>
            <p className="text-green-100/80 text-xs leading-relaxed font-medium">
              Let our agro-experts help you scan the perfect match. Drop your requirements now.
            </p>
          </div>
          
          <div className="md:w-7/12 p-4 sm:p-6 bg-gray-50 flex items-center justify-stretch">
            <div className="w-full flex flex-col justify-stretch items-stretch">
              <EnquiryForm 
                defaultType="product" 
                defaultMessage={`I'm confused about how to purchase product or machinery.`} 
                hideHeader
                transparent
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ── TWO-COLUMN GRID MOBILE HORIZONTAL OPTIMIZATION ─────────────────────────
const RecommendationRow = ({ title, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <div className="border-t border-gray-200/50 pt-5">
      <div className="flex justify-between items-baseline mb-3">
        <h3 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">{title}</h3>
        <Link to="/products" className="text-[#0F3D2E] font-bold text-xs hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {products.slice(0, 4).map((p) => {
          const meta = CATEGORY_META[p.category] || CATEGORY_META.ALL;
          return <ProductCard key={p.id} data={p} categoryMeta={meta} />;
        })}
      </div>
    </div>
  );
};

export default ProductDetail;