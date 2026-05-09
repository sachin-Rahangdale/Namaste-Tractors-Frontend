import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTractorById, createTractor, updateTractor, uploadTractorImage } from "../services/tractorService";
import { getBrands } from "../services/brandService";

const TractorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Image states for S24 high-res photos
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [formData, setFormData] = useState({
    model: "", hp: "", price: "", brandId: "",
    specification: {
      cylinder: "", engineCapacity: "", clutch: "", steering: "", gearbox: "",
      brakes: "", torque: "", backupTorque: "", ptoHp: "", ptoOptions: "",
      frontTyre: "", rearTyre: "", rearAxle: "", frontAxle: "", reduction: "",
      serviceInterval: ""
    }
  });

  useEffect(() => {
    const init = async () => {
      const b = await getBrands();
      setBrands(b);
      if (id) {
        setLoading(true);
        const data = await getTractorById(id);
        setFormData(data);
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleChange = (e, isSpec = false) => {
    const { name, value } = e.target;
    if (isSpec) {
      setFormData(p => ({ ...p, specification: { ...p.specification, [name]: value } }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Save Specs
      const saved = id ? await updateTractor(id, formData) : await createTractor(formData);
      const tractorId = saved.id;

      // Step 2: Parallel Image Upload
      const uploads = [];
      if (mainImage) uploads.push(uploadTractorImage(tractorId, mainImage, "MAIN"));
      if (galleryImages.length > 0) {
        Array.from(galleryImages).forEach(img => 
          uploads.push(uploadTractorImage(tractorId, img, "GALLERY"))
        );
      }
      
      await Promise.all(uploads);
      alert("Machine Registered Successfully!");
      navigate("/admin/tractors");
    } catch (err) {
      alert("Save failed. Check technical specs.");
    } finally { setLoading(false); }
  };

  if (loading) return <div className="p-20 font-black animate-pulse">SYNCING DATA...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">
          {id ? "Edit" : "New"} <span className="text-green-600">Machine</span>
        </h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Fleet Database Management</p>
      </header>

      <form onSubmit={handleSave} className="grid gap-8">
        {/* Core Identity */}
        <Section title="1. Core Identity">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input label="Model" name="model" value={formData.model} onChange={handleChange} />
            <Select label="Brand" name="brandId" value={formData.brandId} options={brands} onChange={handleChange} />
            <Input label="HP" name="hp" type="number" value={formData.hp} onChange={handleChange} />
            <Input label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} />
          </div>
        </Section>

        {/* Technical Muscle */}
        <Section title="2. Engine & Performance">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {["cylinder", "engineCapacity", "torque", "backupTorque", "serviceInterval"].map(key => (
              <Input key={key} label={key.replace(/([A-Z])/g, ' $1')} name={key} type="number" value={formData.specification[key]} onChange={(e) => handleChange(e, true)} />
            ))}
          </div>
        </Section>

        {/* Chassis & Transmission */}
        <Section title="3. Chassis & Transmission">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["gearbox", "clutch", "steering", "brakes", "ptoHp", "frontAxle", "rearAxle", "reduction"].map(key => (
              <Input key={key} label={key.replace(/([A-Z])/g, ' $1')} name={key} value={formData.specification[key]} onChange={(e) => handleChange(e, true)} />
            ))}
          </div>
        </Section>

        {/* Visual Config */}
        <Section title="4. Visual Configuration" dark>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Photo (MAIN)</label>
              <input type="file" onChange={e => setMainImage(e.target.files[0])} className="w-full bg-slate-800 p-4 rounded-2xl text-xs text-slate-400 border-2 border-dashed border-slate-700 hover:border-green-500 transition" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gallery Photos (Multiple)</label>
              <input type="file" multiple onChange={e => setGalleryImages(e.target.files)} className="w-full bg-slate-800 p-4 rounded-2xl text-xs text-slate-400 border-2 border-dashed border-slate-700 hover:border-green-500 transition" />
            </div>
          </div>
        </Section>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-2xl disabled:opacity-50">
          {loading ? "COMMITTING TO DATABASE..." : "Deploy Machine to Marketplace"}
        </button>
      </form>
    </div>
  );
};

// --- Sub-components to keep code clean ---
const Section = ({ title, children, dark }) => (
  <div className={`${dark ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white shadow-xl border border-slate-100'} rounded-[2.5rem] p-10`}>
    <h3 className={`text-lg font-black uppercase italic mb-8 border-b pb-4 ${dark ? 'border-slate-800 text-green-400' : 'border-slate-100 text-slate-800'}`}>{title}</h3>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input {...props} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select {...props} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800">
      <option value="">Choose brand</option>
      {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>
);

export default TractorForm;