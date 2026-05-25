import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractorById, getTractorsByBrand, getTractors } from "../services/tractorService";
import ImageSlider from "./tractordetail/ImageSlider";
import SpecTable from "./tractordetail/SpecTable";

import { Helmet } from "react-helmet-async";

/* ─── QuickSpec pill (SHARP EDGES OPTIMIZED) ─────────────────────────────────── */
const QuickSpec = ({ label, value, icon }) => (
  <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-none p-2.5 transition-colors">
    <span className="text-lg flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] font-black text-stone-500 uppercase tracking-wider">{label}</p>
      <p className="text-xs sm:text-sm font-black text-stone-900 truncate">{value}</p>
    </div>
  </div>
);

/* ─── Section heading ────────────────────────────────────────────────────────── */
const SectionHeading = ({ title, action, onAction }) => (
  <div className="flex items-baseline justify-between mb-4 border-b border-stone-200 pb-2">
    <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">{title}</h2>
    {action && (
      <button
        onClick={onAction}
        className="text-xs font-bold text-emerald-800 uppercase tracking-wider hover:underline"
      >
        {action}
      </button>
    )}
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────────── */
const TractorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tractor, setTractor] = useState(null);
  const [brandRelated, setBrandRelated] = useState([]);
  const [generalRelated, setGeneralRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized data loading pipeline to prevent flash re-renders on fast reload
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const tractorRes = await getTractorById(id);
      setTractor(tractorRes);
      const bId = tractorRes.brandId || tractorRes.brand?.id;

      const [brandRes, generalRes] = await Promise.all([
        bId ? getTractorsByBrand(bId, 0, 5) : Promise.resolve({ content: [] }),
        getTractors(0, 5),
      ]);

      const filterSelf = (list) => (list || []).filter(t => t.id !== parseInt(id)).slice(0, 4);

      setBrandRelated(filterSelf(brandRes.content));
      setGeneralRelated(filterSelf(generalRes.content));
    } catch (err) {
      console.error("Failed to load tractor ecosystem data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [loadAllData]);

  /* ── Loading Spinner ── */
  if (loading) {
    return (
      <div className="h-screen bg-stone-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent animate-spin rounded-none" />
        <p className="text-stone-500 font-bold text-[11px] uppercase tracking-widest">Loading Details…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!tractor) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center space-y-3 bg-white p-8 border border-stone-200">
            <div className="text-5xl">🚜</div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 uppercase">Model Not Found</h2>
            <p className="text-stone-500 text-sm font-medium">This variant has been removed or doesn't exist.</p>
            <button
              onClick={() => navigate("/tractors")}
              className="mt-2 bg-slate-900 hover:bg-emerald-800 text-white px-6 py-3 rounded-none font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Browse All Tractors
            </button>
          </div>
        </div>
      </div>
    );
  }

  const spec = tractor.specification || {};

  return (
<>
<Helmet>
  <title>
    {tractor.brand} {tractor.model} Price, Specs & HP
  </title>

  <meta
    name="description"
    content={`${tractor.model} tractor with ${tractor.hp} HP. Check price, specifications, features and images.`}
  />

  <meta
    property="og:image"
    content={tractor.imageUrl}
  />
</Helmet>
    <div className="bg-[#ebe8e3] min-h-screen pb-12">
      <Navbar />

      {/* ── Breadcrumb Wrap ── */}
      <div className="max-w-[1140px] mx-auto px-3 sm:px-6 py-3">
        <nav className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap no-scrollbar bg-white px-3 py-2 border border-stone-200 shadow-sm rounded-none">
          <button onClick={() => navigate("/")} className="hover:text-emerald-700 transition-colors">
            Home
          </button>
          <span className="text-stone-300">/</span>
          <button onClick={() => navigate("/tractors")} className="hover:text-emerald-700 transition-colors">
            Tractors
          </button>
          <span className="text-stone-300">/</span>
          <span className="text-stone-800">{tractor.brand} {tractor.model}</span>
        </nav>
      </div>

      <main className="max-w-[1140px] mx-auto px-3 sm:px-6 space-y-6">

        {/* ════ HERO OVERVIEW PANEL ═════════════════════════════════════════════ */}
        <div className="bg-white rounded-none border border-stone-200 shadow-sm overflow-hidden">
          
          {/* Image Slider Wrapper with high speed eager tag constraint */}
          <div className="p-3 sm:p-6 bg-stone-50 border-b border-stone-200/80">
            <ImageSlider images={tractor.images || []} />
          </div>

          {/* Info Details Presentation Field */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4">

            {/* Badges Layout */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider">
                {tractor.brand}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider">
                ⚡ {tractor.hp} HP Class
              </span>
            </div>

            {/* Model Title Variant */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-none uppercase">
              {tractor.model}
            </h1>

            {/* Price block - Premium colored accent row box */}
            <div className="p-4 bg-[#F0FDF4] border-l-4 border-emerald-700 border-t border-b border-r border-gray-200/60 flex items-baseline rounded-none shadow-sm my-4">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Estimated Ex-Showroom Price
                </p>
                <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight leading-none">
                  ₹{tractor.price?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Quick specifications quad grid matrix */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <QuickSpec label="Horsepower" value={`${tractor.hp} HP`} icon="⚡" />
              <QuickSpec label="Cylinders" value={spec.cylinder ?? "—"} icon="🔩" />
              <QuickSpec label="Engine Capacity" value={spec.engineCapacity ? `${spec.engineCapacity} cc` : "—"} icon="⚙️" />
              <QuickSpec label="PTO Power" value={spec.ptoHp ? `${spec.ptoHp} HP` : "—"} icon="🔌" />
            </div>

            {/* Primary Action Buttons CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" })}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-none font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                Get Best Price
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" })}
                className="flex-1 border border-stone-300 hover:bg-stone-50 text-stone-700 py-3.5 rounded-none font-black uppercase tracking-widest text-xs transition-colors active:scale-[0.98]"
              >
                Full Specifications
              </button>
            </div>
          </div>
        </div>

        {/* ── TECHNICAL SPECIFICATIONS ACCORDION / TABLE SECTION ────────────── */}
        <div id="specs">
          <SpecTable tractor={tractor} />
        </div>

        {/* ── MORE FROM BRAND (TWIN GRID MATRIX FOR SMARTPHONES VIEW) ────────── */}
        {brandRelated.length > 0 && (
          <section className="pt-2">
            <SectionHeading
              title={`More from ${tractor.brand}`}
              action="View All →"
              onAction={() => { navigate("/tractors"); window.scrollTo(0, 0); }}
            />
            {/* grid-cols-2 locks twin card boxes on small mobile screen viewports */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {brandRelated.map(item => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ── POPULAR ALTERNATIVES (TWIN GRID MATRIX FOR SMARTPHONES VIEW) ───── */}
        {generalRelated.length > 0 && (
          <section className="pt-2">
            <SectionHeading
              title="Popular Alternatives"
              action="Browse All →"
              onAction={() => { navigate("/tractors"); window.scrollTo(0, 0); }}
            />
            {/* grid-cols-2 locks twin card boxes on small mobile screen viewports */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {generalRelated.map(item => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ════ ENQUIRY VERIFICATION BLOCK SECTION ═══════════════════════════════ */}
        <section id="enquiry" className="pt-2">
          <div className="bg-white rounded-none border border-stone-200 shadow-sm overflow-hidden">

            {/* Dark aesthetic brand header promo banner block */}
            <div className="bg-slate-900 px-5 py-6 sm:px-8 sm:py-8 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-none mb-3 uppercase tracking-widest">
                  Direct Connect — No Middlemen
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3 tracking-tight">
                  Best Quote Pipeline for <span className="text-emerald-400">{tractor.model}</span>
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {["Guaranteed Dealer Quote", "Easy Finance & Subsidy", "Expert Verification"].map(text => (
                    <div key={text} className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-black text-xs">✓</span>
                      <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide uppercase">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form wrapper */}
            <div className="p-4 sm:p-8 bg-stone-50/60">
              <EnquiryForm
                defaultType="tractor"
                defaultMessage={`I'm interested in the ${tractor.brand} ${tractor.model} (${tractor.hp} HP). Please share the best on-road price.`}
                hideHeader
                transparent
              />
            </div>
          </div>
        </section>

      </main>
    </div>
    </>
  );
};

export default TractorDetail;