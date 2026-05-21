import React, { useRef, useState } from "react";

const IMAGE_TYPES = ["MAIN", "GALLERY"];

const SPEC_FIELDS = [
  { key: "cylinder", label: "Cylinder", type: "number" },
  { key: "engineCapacity", label: "Engine Capacity (CC)", type: "number" },
  { key: "clutch", label: "Clutch Type", type: "text" },
  { key: "steering", label: "Steering", type: "text" },
  { key: "gearbox", label: "Gearbox Specs", type: "text" },
  { key: "brakes", label: "Brakes Type", type: "text" },
  { key: "torque", label: "Torque (Nm)", type: "number" },
  { key: "backupTorque", label: "Backup Torque (%)", type: "number" },
  { key: "ptoHp", label: "PTO HP", type: "text" },
  { key: "ptoOptions", label: "PTO Options", type: "text" },
  { key: "frontTyre", label: "Front Tyre Size", type: "text" },
  { key: "rearTyre", label: "Rear Tyre Size", type: "text" },
  { key: "rearAxle", label: "Rear Axle Type", type: "text" },
  { key: "frontAxle", label: "Front Axle Type", type: "text" },
  { key: "reduction", label: "Gear Reduction Type", type: "text" },
  { key: "liftCapacity", label: "Lift Capacity (kg)", type: "number" },
  { key: "serviceInterval", label: "Service Interval (Hrs)", type: "number" },
];

export default function TractorForm({ initial, brands, onSubmit, onCancel, isEdit }) {
  const [form, setForm] = useState(initial);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const set = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setSpec = (key, value) =>
    setForm((f) => ({
      ...f,
      specification: { ...f.specification, [key]: value },
    }));

  const handleFiles = (files) => {
    const hasMainAlready = images.some((img) => img.type === "MAIN");
    const newImgs = Array.from(files).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      type: !hasMainAlready && index === 0 ? "MAIN" : "GALLERY",
      id: Math.random().toString(36).slice(2),
    }));
    setImages([...images, ...newImgs]);
  };

  const removeImage = (id) => setImages(images.filter((img) => img.id !== id));

  const setType = (id, type) =>
    setImages(images.map((img) => (img.id === id ? { ...img, type } : img)));

  const submit = async () => {
    setLoading(true);
    try {
      await onSubmit(form, images);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      {/* ── MAIN CONTAINER BLOCK (LIGHT MODE DUAL GRID LAYOUT) ───────────────── */}
      <div className="w-full max-w-5xl h-screen bg-white border-l border-gray-200 flex flex-col shadow-2xl animate-slide-in">
        
        {/* HEADER BLOCK TINT */}
        <div className="sticky top-0 z-20 bg-slate-900 px-6 py-5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">
              {isEdit ? "Edit Tractor" : "Create"} <span className="text-green-500 NOT-italic">Variant</span>
            </h2>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Manage core machinery engine specifications and asset photos
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* DRAWER BODY AREA (SCROLLABLE MATRIX CONTAINER) */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto flex-1 bg-slate-50/60">
          
          {/* SECTION 1: BASIC BRANDING INFORMATION */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <span>📝</span> Basic Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Variant Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. 585 Yuvo Tech Plus"
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Manufacturer Brand</label>
                <select
                  value={form.brandId}
                  onChange={(e) => set("brandId", e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Select Brand Line</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Engine Horsepower Class (HP)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={form.hp}
                  onChange={(e) => set("hp", e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wide px-0.5">Estimated Ex-Showroom Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 750000"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: TECHNICAL SPECIFICATIONS GRID MATRIX */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <span>⚙️</span> Technical Data Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SPEC_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide px-0.5 truncate">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.label}
                    value={form.specification[field.key] ?? ""}
                    onChange={(e) => setSpec(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: CONSISTENT RE-DESIGNED IMAGE UPLOADER REGION */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> Variant Image Manager
              </h3>
              <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                + Choose Files
              </button>
            </div>

            <div
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-gray-300 hover:border-green-600 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 group"
            >
              <div className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">📂</div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                Click to explore layout pictures media content
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Uploaded Files Mapping Section - 100% Identical Uniform Cards Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] w-full border-b border-gray-100 bg-gray-50 overflow-hidden relative">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <span className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm text-white ${
                        img.type === "MAIN" ? "bg-amber-500" : "bg-blue-600"
                      }`}>
                        {img.type}
                      </span>
                    </div>

                    <div className="p-2.5 space-y-2">
                      <select
                        value={img.type}
                        onChange={(e) => setType(img.id, e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 cursor-pointer"
                      >
                        {IMAGE_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STICKY FOOTER ACTION BAR */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-end gap-3 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? "Syncing Parameters..." : isEdit ? "Update Variant Data" : "Create Tractor Product"}
          </button>
        </div>

      </div>
    </div>
  );
}