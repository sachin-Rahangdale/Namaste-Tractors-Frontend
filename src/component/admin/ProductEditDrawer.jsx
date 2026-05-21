import React, { useState } from "react";

export default function ProductEditDrawer({ product, onClose, onSubmit }) {
  const [price, setPrice] = useState(product.price);
  const [city, setCity] = useState(product.city);
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        price: Number(price),
        city,
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed container handles z-indexing seamlessly over layout tables
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      
      {/* ── DRAWER CONTENT BODY (PREMIUM WHITE WITH CURVED INPUT MATRIX) ─────── */}
      <div className="w-full max-w-2xl h-screen bg-white border-l border-gray-200 flex flex-col shadow-2xl animate-slide-in">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">
              Edit <span className="text-green-500 NOT-italic">Listing</span>
            </h2>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Update variables for marketplace validation
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* BODY AREA - FORM INPUT FIELDS (HIGH READABILITY CONTRAST) */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50">
          
          {/* PRODUCT NAME BLOCK (DISABLED FIELD STATUS) */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
              Product Name Label
            </label>
            <input
              disabled
              value={product.productName}
              className="w-full bg-gray-100 border border-gray-200 text-gray-400 px-4 py-3 rounded-2xl text-sm font-semibold select-none cursor-not-allowed"
            />
          </div>

          {/* PRICE INPUT VARIABLE */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Asking Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-bold transition-all placeholder:text-gray-400"
            />
          </div>

          {/* CITY LOCATION TEXT MAP */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              City Location / Region
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-bold transition-all uppercase placeholder:text-gray-400"
            />
          </div>

          {/* DESCRIPTION TEXTAREA COMPONENT */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Full Product Description
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed transition-all resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* FOOTER SECTION CONTROLS ROW */}
        <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex justify-end gap-3 shrink-0 shadow-inner">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-[0.98] transition-all"
          >
            {loading ? "Saving Configuration..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}