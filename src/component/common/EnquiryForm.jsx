import React, { useEffect, useState } from 'react';
import { registerEnquiry } from '../../services/enquiryService';

const EnquiryForm = ({ defaultType = "tractor", defaultMessage = "", hideHeader = false, transparent = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enquiryType: defaultType,
    message: defaultType,
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
      setFormData({ name: "", phone: "", enquiryType: "tractor", message: "", pincode: "", address: "" });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Failed to submit. Please try again." });
    }
  };

  return (
    <section className={transparent ? "" : "bg-white rounded-[2rem] shadow-xl shadow-black/5 p-8 md:p-10 border border-gray-100 max-w-4xl mx-auto"}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Register Enquiry</h2>
          <p className="text-gray-500 mt-1.5 text-sm">Our experts are here to help you find or fix your tractor.</p>
        </div>
      )}

      {/* Success Message */}
      {status.success && (
        <div className="scale-in flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl mb-6 border border-green-100 font-medium text-sm">
          <span className="text-xl">✅</span>
          Enquiry submitted! We'll contact you soon.
        </div>
      )}

      {/* Error Message */}
      {status.error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl mb-6 border border-red-100 font-medium text-sm">
          <span className="text-xl">⚠️</span>
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text" name="name" placeholder="Your full name" required
            value={formData.name} onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
          <input
            type="text" name="phone" placeholder="10-digit mobile number" required
            value={formData.phone} onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Enquiry Type</label>
          <select
            name="enquiryType" value={formData.enquiryType} onChange={handleChange}
            className="input-field"
          >
            <option value="tractor">Tractor Enquiry</option>
            <option value="tractor_problem">Tractor Problem 🛠️</option>
            <option value="article">Article Query</option>
            <option value="product">Product / Machinery</option>
            <option value="Need Suggestion">Need Suggestion</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Pincode</label>
          <input
            type="text" name="pincode" placeholder="Your area pincode" required
            value={formData.pincode} onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">City / Address</label>
          <input
            type="text" name="address" placeholder="City, District" required
            value={formData.address} onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Message</label>
          <textarea
            name="message" placeholder="How can we help you?" rows="4" required
            value={formData.message} onChange={handleChange}
            className="input-field resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={status.loading}
            className="w-full btn-primary py-4 text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Enquiry →'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EnquiryForm;