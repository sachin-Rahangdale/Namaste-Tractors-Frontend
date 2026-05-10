import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card";
import EnquiryForm from "../component/common/EnquiryForm";
import { getTractorById, getTractorsByBrand, getTractors } from "../services/tractorservice";

const TractorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tractor, setTractor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [brandRelated, setBrandRelated] = useState([]);
  const [generalRelated, setGeneralRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const tractorRes = await getTractorById(id);
      setTractor(tractorRes);

      const mainImg = tractorRes.images?.find((img) => img.imageType === "MAIN")?.imageUrl;
      setActiveImage(mainImg || tractorRes.imageUrl || tractorRes.images?.[0]?.imageUrl);

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

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * -0.15}s` }}
            />
          ))}
        </div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Loading Tractor Details...
        </p>
      </div>
    );
  }

  if (!tractor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Tractor Not Found
            </h2>
            <p className="text-slate-400 font-medium text-sm">
              This listing doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/tractors")}
              className="mt-4 bg-slate-900 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Browse All Tractors →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const spec = tractor.specification || {};
  const galleryImages = tractor.images || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <button onClick={() => navigate("/")} className="hover:text-green-600 transition-colors">Home</button>
          <span className="opacity-30">/</span>
          <button onClick={() => navigate("/tractors")} className="hover:text-green-600 transition-colors">Tractors</button>
          <span className="opacity-30">/</span>
          <span className="text-slate-700">{tractor.brand} {tractor.model}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-10 space-y-12">

        {/* ══════════════ HERO ══════════════ */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

            {/* LEFT — IMAGE GALLERY */}
            <div className="bg-slate-50 p-8 flex flex-col gap-5 border-r border-slate-100">
              {/* Main Image */}
              <div className="relative flex-1 bg-white rounded-2xl overflow-hidden border border-slate-100 min-h-64">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={tractor.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-xs uppercase tracking-widest">
                    No Image
                  </div>
                )}
                {/* Brand chip */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl">
                  {tractor.brand}
                </div>
                {/* HP chip */}
                <div className="absolute top-4 right-4 bg-green-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl">
                  {tractor.hp} HP
                </div>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === img.imageUrl
                          ? "border-slate-900 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-90 hover:border-slate-300"
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — INFO */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              {/* Title block */}
              <div>
                <p className="text-[9px] font-black text-green-600 uppercase tracking-[0.3em] mb-3">
                  {tractor.brand} · {tractor.hp} HP Series
                </p>
                <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-6">
                  {tractor.model}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-slate-100">
                  <span className="text-4xl font-black text-green-600 italic">
                    ₹{tractor.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Ex-Showroom Price
                  </span>
                </div>

                {/* Key Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <StatChip label="Horsepower" value={`${tractor.hp} HP`} icon="⚡" />
                  <StatChip label="Cylinders" value={spec.cylinder ?? "—"} icon="🔧" />
                  <StatChip label="Displacement" value={spec.engineCapacity ? `${spec.engineCapacity} cc` : "—"} icon="⚙️" />
                  <StatChip label="PTO Power" value={spec.ptoHp ? `${spec.ptoHp} HP` : "—"} icon="🔌" />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => document.getElementById("enquiry").scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 bg-slate-900 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  Request Best Price →
                </button>
                <button
                  onClick={() => document.getElementById("specs").scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Full Specifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ SPECIFICATIONS ══════════════ */}
        <section id="specs">
          <SectionLabel title="Technical Specifications" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpecCard icon="🛠️" title="Engine & Performance">
              <SpecRow label="Total Horsepower"    value={`${tractor.hp} HP`} />
              <SpecRow label="No. of Cylinders"    value={spec.cylinder} />
              <SpecRow label="Engine Displacement"  value={spec.engineCapacity ? `${spec.engineCapacity} cc` : null} />
              <SpecRow label="Max Torque"           value={spec.torque ? `${spec.torque} Nm` : null} />
              <SpecRow label="Backup Torque"        value={spec.backupTorque ? `${spec.backupTorque} %` : null} />
              <SpecRow label="Service Interval"    value={spec.serviceInterval ? `Every ${spec.serviceInterval} hrs` : null} />
            </SpecCard>

            <SpecCard icon="⚙️" title="Transmission & PTO">
              <SpecRow label="Clutch Type"          value={spec.clutch} />
              <SpecRow label="Gearbox"              value={spec.gearbox} />
              <SpecRow label="PTO Horsepower"       value={spec.ptoHp ? `${spec.ptoHp} HP` : null} />
              <SpecRow label="PTO Options"          value={spec.ptoOptions} />
              <SpecRow label="Final Reduction"      value={spec.reduction} />
            </SpecCard>

            <SpecCard icon="⚖️" title="Chassis & Steering">
              <SpecRow label="Steering System"      value={spec.steering} />
              <SpecRow label="Braking System"       value={spec.brakes} />
              <SpecRow label="Front Axle"           value={spec.frontAxle} />
              <SpecRow label="Rear Axle"            value={spec.rearAxle} />
              <SpecRow label="Lifting Capacity"     value={spec.liftingCapacity ? `${spec.liftingCapacity} Kg` : null} />
            </SpecCard>

            <SpecCard icon="⭕" title="Tyres & Dimensions">
              <SpecRow label="Front Tyre"           value={spec.frontTyre} />
              <SpecRow label="Rear Tyre"            value={spec.rearTyre} />
              <SpecRow label="Drive Type"           value={spec.wheelDrive || "2WD / 4WD"} />
            </SpecCard>
          </div>
        </section>

        {/* ══════════════ MORE FROM BRAND ══════════════ */}
        {brandRelated.length > 0 && (
          <section>
            <SectionLabel
              title={`More from ${tractor.brand}`}
              action="All Brand Models →"
              onAction={() => navigate("/tractors")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandRelated.map((item) => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ══════════════ POPULAR ALTERNATIVES ══════════════ */}
        {generalRelated.length > 0 && (
          <section>
            <SectionLabel
              title="Popular Alternatives"
              action="Browse Marketplace →"
              onAction={() => navigate("/tractors")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {generalRelated.map((item) => <Card key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* ══════════════ ENQUIRY ══════════════ */}
        <section id="enquiry" className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col lg:flex-row">
          {/* Left panel */}
          <div className="lg:w-5/12 bg-slate-900 p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-green-500 rounded-full mix-blend-overlay blur-3xl opacity-15 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-green-400 border border-green-500/30 bg-green-500/10 px-4 py-2 rounded-xl">
                Namaste Tractor — Direct Connect
              </span>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
                Get the Best Price for{" "}
                <span className="text-green-400">{tractor.model}</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Talk directly to the Namaste Tractor team — no middlemen. Get the lowest on-road price, financing options, and subsidy support.
              </p>
              <div className="space-y-4 pt-2">
                {["Guaranteed Best Quote", "Expert Consultation", "Easy Finance Support"].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400 text-xs font-black">✓</div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — Form */}
          <div className="lg:w-7/12 p-8 lg:p-14 bg-slate-50 flex items-center">
            <div className="w-full">
              <EnquiryForm
                defaultType="tractor"
                defaultMessage={`I'm interested in the ${tractor.brand} ${tractor.model} (${tractor.hp} HP). Please share the best on-road price and booking details.`}
                hideHeader
                transparent
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

/* ══════════════════════════════════════
   SHARED HELPER COMPONENTS
══════════════════════════════════════ */

/** Small key-stat chip in the hero panel */
const StatChip = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-green-200 hover:bg-green-50/30 transition-all group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{value}</p>
    </div>
  </div>
);

/** Section heading with an optional right-aligned action link */
const SectionLabel = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-5">
      <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
        {title}
      </h2>
      <div className="h-px w-20 bg-slate-200" />
    </div>
    {action && (
      <button
        onClick={onAction}
        className="text-[9px] font-black text-slate-400 hover:text-green-600 uppercase tracking-widest transition-colors"
      >
        {action}
      </button>
    )}
  </div>
);

/** White card wrapping a spec category */
const SpecCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
    <div className="flex items-center gap-3 px-7 py-5 bg-slate-900 border-b border-slate-800">
      <span className="text-lg">{icon}</span>
      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">{title}</h3>
    </div>
    <div className="divide-y divide-slate-50">
      {children}
    </div>
  </div>
);

/** Single row inside a SpecCard */
const SpecRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-center px-7 py-4 hover:bg-slate-50/70 transition-colors group">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
        {label}
      </span>
      <span className="text-xs font-black text-slate-800 uppercase tracking-tight italic text-right">
        {value}
      </span>
    </div>
  );
};

export default TractorDetail;