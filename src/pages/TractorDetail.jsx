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
      // 1. Fetch Main Tractor Details
      const tractorRes = await getTractorById(id);
      setTractor(tractorRes);

      // Set initial main image
      const mainImg = tractorRes.images?.find(img => img.imageType === "MAIN")?.imageUrl;
      setActiveImage(mainImg || tractorRes.imageUrl || (tractorRes.images && tractorRes.images[0]?.imageUrl));

      // 2. Fetch Brand Related - Fixed brandId detection
      // Check if brandId is nested or direct in your tractorRes
      const bId = tractorRes.brandId || tractorRes.brand?.id;
      
      if (bId) {
        const brandRes = await getTractorsByBrand(bId, 0, 5);
        setBrandRelated(brandRes.content.filter(t => t.id !== parseInt(id)));
      }

      // 3. Fetch General Related
      const generalRes = await getTractors(0, 5);
      setGeneralRelated(generalRes.content.filter(t => t.id !== parseInt(id)));

    } catch (err) {
      console.error("Failed to load tractor details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    </div>
  );

  if (!tractor) return <div className="text-center py-20">Product not found.</div>;

  const spec = tractor.specification || {};

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* IMAGE & QUICK SPECS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 aspect-video group">
              <img 
                src={activeImage} 
                alt={tractor.model} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {tractor.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.imageUrl ? 'border-green-600 scale-95' : 'border-transparent opacity-70'}`}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green-200">
                {tractor.brand} Mechanical Muscle
              </span>
              <h1 className="text-5xl font-black text-slate-900 mt-4 leading-tight uppercase tracking-tighter italic">
                {tractor.model}
              </h1>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 mb-8">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-green-600">₹{tractor.price?.toLocaleString()}*</span>
                <span className="text-gray-400 font-bold text-sm mb-1 uppercase tracking-tighter">Ex-Showroom Price</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon="⚡" label="Power" value={`${tractor.hp} HP`} />
                <StatCard icon="🌀" label="Torque" value={`${spec.torque || 'N/A'} Nm`} />
                <StatCard icon="⚙️" label="PTO" value={`${spec.ptoHp || 'N/A'} HP`} />
                <StatCard icon="🔧" label="Cylinder" value={spec.cylinder || 'N/A'} />
              </div>

              <button 
                onClick={() => document.getElementById('enquiry').scrollIntoView({ behavior: 'smooth' })}
                className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl"
              >
                Check On-Road Price
              </button>
            </div>
          </div>
        </div>

        {/* DETAILED SPECIFICATIONS */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Technical Specs</h2>
            <div className="flex-grow h-[1px] bg-gray-200"></div>
          </div>

          <div className="space-y-8">
            <SpecSection title="Engine & Performance" icon="🛠️">
              <SpecBox label="Cylinder" value={spec.cylinder} />
              <SpecBox label="Engine Capacity" value={spec.engineCapacity ? `${spec.engineCapacity} cc` : null} />
              <SpecBox label="Torque" value={spec.torque ? `${spec.torque} Nm` : null} />
              <SpecBox label="Backup Torque" value={spec.backupTorque ? `${spec.backupTorque} Nm` : null} />
            </SpecSection>

            <SpecSection title="Transmission & PTO" icon="🕹️">
              <SpecBox label="Clutch" value={spec.clutch} />
              <SpecBox label="Gearbox" value={spec.gearbox} />
              <SpecBox label="PTO HP" value={spec.ptoHp} />
              <SpecBox label="PTO Options" value={spec.ptoOptions} />
            </SpecSection>

            <SpecSection title="Tyres & Axles" icon="⭕">
              <SpecBox label="Front Tyre" value={spec.frontTyre} />
              <SpecBox label="Rear Tyre" value={spec.rearTyre} />
              <SpecBox label="Front Axle" value={spec.frontAxle} />
              <SpecBox label="Rear Axle" value={spec.rearAxle} />
            </SpecSection>
          </div>
        </section>

        {/* BRAND ROW */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">More from {tractor.brand}</h2>
            <button onClick={() => navigate('/tractors')} className="text-green-600 font-bold uppercase text-xs tracking-widest hover:underline">
              Explore All Brand Models →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandRelated.length > 0 ? (
              brandRelated.map(item => <Card key={item.id} data={item} />)
            ) : (
              <div className="col-span-full py-10 bg-white border border-dashed rounded-3xl text-center text-gray-400">
                No other models found for this brand.
              </div>
            )}
          </div>
        </section>

        {/* POPULAR ALTERNATIVES ROW */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Popular Alternatives</h2>
            <button onClick={() => navigate('/tractors')} className="text-green-600 font-bold uppercase text-xs tracking-widest hover:underline">
              Explore All Tractors →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalRelated.map(item => <Card key={item.id} data={item} />)}
          </div>
        </section>

        {/* FIXED ENQUIRY SECTION */}
       {/* ENQUIRY SECTION */}
<section id="enquiry" className="bg-slate-900 py-24 relative overflow-hidden">
  {/* Decorative background elements for premium feel */}
  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
  </div>

  <div className="max-w-4xl mx-auto px-4 relative z-10">
    <div className="text-center mb-12">
      <span className="text-green-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
        Direct Assistance
      </span>
      <h2 className="text-4xl font-black text-white mb-4 italic tracking-tight">
        Ready for the Field?
      </h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto italic font-medium">
        Our experts will provide regional subsidy information and local dealer pricing for the 
        <span className="text-green-400 font-bold ml-1">{tractor.model}</span>.
      </p>
    </div>

    {/* The Form Container - Replicated exactly from Products Page */}
    <div className="bg-white rounded-[3rem] p-4 shadow-2xl">
      <div className="bg-slate-50 rounded-[2rem] p-6 md:p-10 border border-gray-100">
        <EnquiryForm 
          defaultType="tractor" 
          defaultMessage={`I am interested in the ${tractor.brand} ${tractor.model}. Please share on-road price and local dealer contacts.`} 
        />
      </div>
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

/* ================= HELPERS ================= */

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
    <span className="text-3xl">{icon}</span>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const SpecSection = ({ title, icon, children }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-8">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
      {children}
    </div>
  </div>
);

const SpecBox = ({ label, value }) => (
  <div className="border-l-2 border-gray-50 pl-4">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-bold text-slate-700">{value || "Standard"}</p>
  </div>
);

export default TractorDetail;