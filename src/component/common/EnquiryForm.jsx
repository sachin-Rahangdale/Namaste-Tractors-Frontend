import React, { useEffect, useState } from 'react';
import { registerEnquiry } from '../../services/enquiryService';

const EnquiryForm = ({ defaultType = "tractor", defaultMessage = "", hideHeader = false, transparent = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enquiryType: defaultType,
    message: defaultMessage,
    pincode: "",
    address: ""
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      enquiryType: defaultType,
      message: defaultMessage
    }));
  }, [defaultType, defaultMessage]);

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      await registerEnquiry(formData);
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", phone: "", enquiryType: defaultType, message: "", pincode: "", address: "" });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Failed to submit. Please try again." });
    }
  };

  // Thin [0.5px] but Dark slate border system with high contrast focus definitions
  const thinDarkInputStyle = "w-full bg-slate-50/30 border-[0.5px] border-slate-400 text-gray-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-gray-400";

  return (
    <section className={`w-full ${transparent ? "" : "bg-white rounded-2xl shadow-sm border-[0.5px] border-slate-400 p-6 sm:p-8 max-w-4xl mx-auto"}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Register <span className="text-green-700 NOT-italic">Enquiry</span></h2>
          <p className="text-gray-500 mt-1 text-xs font-semibold uppercase tracking-wider">Our experts are here to help you find or fix your machinery.</p>
        </div>
      )}

      {/* Success Message */}
      {status.success && (
        <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl mb-6 border-[0.5px] border-green-300 font-bold text-xs uppercase tracking-wide">
          <span className="text-base">✅</span>
          Enquiry submitted! We'll contact you soon.
        </div>
      )}

      {/* Error Message */}
      {status.error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl mb-6 border-[0.5px] border-red-300 font-bold text-xs uppercase tracking-wide">
          <span className="text-base">⚠️</span>
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">Full Name</label>
          <input
            type="text" name="name" placeholder="Your full name" required
            value={formData.name} onChange={handleChange}
            className={thinDarkInputStyle}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">Phone Number</label>
          <input
            type="tel" name="phone" placeholder="10-digit mobile number" required
            value={formData.phone} onChange={handleChange}
            className={thinDarkInputStyle}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">Enquiry Type</label>
          <select
            name="enquiryType" value={formData.enquiryType} onChange={handleChange}
            className={`${thinDarkInputStyle} cursor-pointer font-bold text-gray-700`}
          >
            <option value="tractor">Tractor Enquiry</option>
            <option value="tractor_problem">Tractor Problem 🛠️</option>
            <option value="article">Article Query</option>
            <option value="product">Product / Machinery</option>
            <option value="Need Suggestion">Need Suggestion</option>
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">Pincode</label>
          <input
            type="text" name="pincode" placeholder="Your area pincode" required
            value={formData.pincode} onChange={handleChange}
            className={thinDarkInputStyle}
          />
        </div>
        
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">City / Address</label>
          <input
            type="text" name="address" placeholder="City, District" required
            value={formData.address} onChange={handleChange}
            className={thinDarkInputStyle}
          />
        </div>
        
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-0.5">Message</label>
          <textarea
            name="message" placeholder="How can we help you?" rows="4" required
            value={formData.message} onChange={handleChange}
            className={`${thinDarkInputStyle} resize-none font-medium leading-relaxed`}
          />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md active:scale-[0.99] transition-all"
          >
            {status.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Submitting parameters...
              </span>
            ) : 'Submit Enquiry →'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EnquiryForm;