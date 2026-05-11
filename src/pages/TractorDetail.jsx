import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractorById, getTractorsByBrand, getTractors } from "../services/tractorservice";

/* ─── Image Slider ──────────────────────────────────────────────────────────── */
const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const allImages = images?.length > 0
    ? images.map(i => i.imageUrl)
    : [];

  const prev = useCallback(() => setCurrent(c => (c - 1 + allImages.length) % allImages.length), [allImages.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % allImages.length), [allImages.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-3">🚜</div>
          <p className="text-sm font-medium">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main slider */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden group">
        <img
          key={current}
          src={allImages[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {current + 1} / {allImages.length}
          </div>
        )}

        {/* Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === current
                  ? "border-green-600 shadow-md shadow-green-200"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
                }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const TractorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tractor, setTractor] = useState(null);
  const [brandRelated, setBrandRelated] = useState([]);
  const [generalRelated, setGeneralRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("engine");

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const tractorRes = await getTractorById(id);
      setTractor(tractorRes);

      const bId = tractorRes.brandId || tractorRes.brand?.id;
      if (bId) {
        const brandRes = await getTractorsByBrand(bId, 0, 4);
        setBrandRelated((brandRes.content || []).filter((t) => t.id !== parseInt(id)));
      }

      const generalRes = await getTractors(0, 4);
      setGeneralRelated((generalRes.content || []).filter((t) => t.id !== parseInt(id)));
    } catch (err) {
      console.error("Failed to load tractor details:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading tractor details…</p>
      </div>
    );
  }

  /* Not found */
  if (!tractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-7xl">🚜</div>
            <h2 className="text-2xl font-bold text-gray-900">Tractor Not Found</h2>
            <p className="text-gray-500 text-sm">This listing doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/tractors")}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              Browse All Tractors
            </button>
          </div>
        </div>
      </div>
    );
  }

  const spec = tractor.specification || {};
  const galleryImages = tractor.images || [];

  const SPEC_TABS = [
    {
      id: "engine",
      label: "Engine",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
      ),
      rows: [
        { label: "Horsepower", value: tractor.hp ? `${tractor.hp} HP` : null },
        { label: "No. of Cylinders", value: spec.cylinder },
        { label: "Engine Displacement", value: spec.engineCapacity ? `${spec.engineCapacity} cc` : null },
        { label: "Max Torque", value: spec.torque ? `${spec.torque} Nm` : null },
        { label: "Backup Torque", value: spec.backupTorque ? `${spec.backupTorque}%` : null },
        { label: "Service Interval", value: spec.serviceInterval ? `Every ${spec.serviceInterval} hrs` : null },
      ],
    },
    {
      id: "transmission",
      label: "Transmission",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      rows: [
        { label: "Clutch Type", value: spec.clutch },
        { label: "Gearbox", value: spec.gearbox },
        { label: "PTO Horsepower", value: spec.ptoHp ? `${spec.ptoHp} HP` : null },
        { label: "PTO Options", value: spec.ptoOptions },
        { label: "Final Reduction", value: spec.reduction },
      ],
    },
    {
      id: "chassis",
      label: "Chassis",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      rows: [
        { label: "Steering System", value: spec.steering },
        { label: "Braking System", value: spec.brakes },
        { label: "Front Axle", value: spec.frontAxle },
        { label: "Rear Axle", value: spec.rearAxle },
        { label: "Lifting Capacity", value: spec.liftingCapacity ? `${spec.liftingCapacity} kg` : null },
      ],
    },
    {
      id: "tyres",
      label: "Tyres & Dims",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={2} stroke="currentColor" fill="none" />
          <circle cx="12" cy="12" r="3" strokeWidth={2} stroke="currentColor" fill="none" />
        </svg>
      ),
      rows: [
        { label: "Front Tyre", value: spec.frontTyre },
        { label: "Rear Tyre", value: spec.rearTyre },
        { label: "Drive Type", value: spec.wheelDrive },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-green-700 font-medium transition-colors">Home</button>
          <span className="text-gray-300">/</span>
          <button onClick={() => navigate("/tractors")} className="hover:text-green-700 font-medium transition-colors">Tractors</button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">{tractor.brand} {tractor.model}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-10 pb-20 space-y-10">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* LEFT — Image Slider */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
              <ImageSlider images={galleryImages} />
            </div>

            {/* RIGHT — Info Panel */}
            <div className="p-6 lg:p-10 flex flex-col justify-between gap-6">
              <div>
                {/* Brand tag */}
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {tractor.brand} · {tractor.hp} HP
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-2 tracking-tighter uppercase italic">
                  {tractor.model}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-4xl font-black text-green-700 italic tracking-tight">
                    ₹{tractor.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Ex-Showroom Price</span>
                </div>

                {/* Quick spec grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <QuickSpec label="Horsepower" value={`${tractor.hp} HP`} icon="⚡" />
                  <QuickSpec label="Cylinders" value={spec.cylinder ?? "—"} icon="🔩" />
                  <QuickSpec label="Displacement" value={spec.engineCapacity ? `${spec.engineCapacity} cc` : "—"} icon="⚙️" />
                  <QuickSpec label="PTO Power" value={spec.ptoHp ? `${spec.ptoHp} HP` : "—"} icon="🔌" />
                </div>

              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => document.getElementById("enquiry").scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-base transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2"
                >
                  Get Best Price
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById("specs").scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-xl font-black uppercase tracking-widest text-base transition-all"
                >
                  Full Specifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SPECIFICATIONS ════════════════════════════════════════════════════ */}
        <section id="specs">
          <SectionHeading title="Technical Specifications" subtitle="Detailed breakdown of all technical parameters" />

          <div className="space-y-6">
            {SPEC_TABS.map((tab) => {
              const visibleRows = tab.rows.filter(r => r.value != null && r.value !== "");
              if (visibleRows.length === 0) return null;

              return (
                <div key={tab.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 bg-gray-50/80 border-b border-gray-100">
                    <div className="text-green-700 bg-white shadow-sm border border-gray-100 p-2.5 rounded-xl">
                      {tab.icon}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic">{tab.label}</h3>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                      {visibleRows.map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                          <span className="text-sm font-bold text-gray-800 flex-shrink-0 pr-4">{row.label}</span>
                          <span className="text-sm font-bold text-gray-900 text-right">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold text-gray-500">
              * Specifications may vary by variant and region. Contact your nearest dealer for exact details.
            </p>
          </div>
        </section>

        {/* ══ MORE FROM BRAND ═══════════════════════════════════════════════════ */}
        {brandRelated.length > 0 && (
          <section>
            <SectionHeading
              title={`More from ${tractor.brand}`}
              action="View All →"
              onAction={() => navigate("/tractors")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {brandRelated.map(item => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ══ POPULAR ALTERNATIVES ══════════════════════════════════════════════ */}
        {generalRelated.length > 0 && (
          <section>
            <SectionHeading
              title="Popular Alternatives"
              action="Browse All →"
              onAction={() => navigate("/tractors")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {generalRelated.map(item => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ══ ENQUIRY ═══════════════════════════════════════════════════════════ */}
        <section id="enquiry">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
            {/* Left promo panel */}
            <div className="lg:w-5/12 bg-gradient-to-br from-[#0F3D2E] to-[#1a5c40] p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-400/10 rounded-full pointer-events-none" />
              <div className="absolute right-8 top-8 w-32 h-32 bg-green-400/5 rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 bg-green-400/15 border border-green-400/20 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Namaste Tractor — Direct Connect
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-snug">
                  Get the Best Price for{" "}
                  <span className="text-green-400">{tractor.model}</span>
                </h2>
                <p className="text-green-100/70 text-sm leading-relaxed">
                  Talk directly to our team — no middlemen. Get the lowest on-road price, easy financing, and government subsidy support.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    { icon: "✓", text: "Guaranteed Best Quote" },
                    { icon: "✓", text: "Expert Consultation" },
                    { icon: "✓", text: "Easy Finance & Subsidy Support" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-green-400/20 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-sm font-medium text-white/90">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:w-7/12 p-8 lg:p-12 bg-gray-50/50 flex items-center">
              <div className="w-full">
                <EnquiryForm
                  defaultType="tractor"
                  defaultMessage={`I'm interested in the ${tractor.brand} ${tractor.model} (${tractor.hp} HP). Please share the best on-road price and booking details.`}
                  hideHeader
                  transparent
                />
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

/* ─── Helper Components ─────────────────────────────────────────────────────── */

const QuickSpec = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5 hover:bg-green-50/40 hover:border-green-100 transition-all group">
    <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-base shadow-sm flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider truncate">{label}</p>
      <p className="text-sm font-black text-gray-900 truncate italic">{value}</p>
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, action, onAction }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h2>
      {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && (
      <button
        onClick={onAction}
        className="text-sm font-bold text-green-700 hover:text-green-800 transition-colors flex-shrink-0 ml-4 uppercase tracking-widest"
      >
        {action}
      </button>
    )}
  </div>
);

export default TractorDetail;