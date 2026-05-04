import React, { useEffect, useState } from 'react';
import { registerEnquiry } from '../../services/enquiryService';

const EnquiryForm = ({ defaultType = "tractor", defaultMessage = "" }) => {
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
      // Reset form after success
      setFormData({ name: "", phone: "", enquiryType: "tractor", message: "", pincode: "", address: "" });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Failed to submit. Please try again." });
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Register Enquiry</h2>
        <p className="text-gray-500 mt-2">Have questions? Our experts are here to help you fix or buy your tractor.</p>
      </div>

      {status.success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-center font-medium">
          ✅ Enquiry submitted successfully! We will contact you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" name="name" placeholder="Your Name" required
          value={formData.name} onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <input 
          type="text" name="phone" placeholder="Phone Number" required
          value={formData.phone} onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <select 
          name="enquiryType" value={formData.enquiryType} onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="tractor">Tractor Enquiry</option>
          <option value="article">Article Query</option>
          <option value="product">Product/Machinery</option>
        </select>
        <input 
          type="text" name="pincode" placeholder="Pincode" required
          value={formData.pincode} onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <input 
          type="text" name="address" placeholder="City/Address" required
          value={formData.address} onChange={handleChange}
          className="p-3 border rounded-lg md:col-span-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        <textarea 
          name="message" placeholder="How can we help you?" rows="4" required
          value={formData.message} onChange={handleChange}
          className="p-3 border rounded-lg md:col-span-2 focus:ring-2 focus:ring-green-500 outline-none"
        ></textarea>
        
        <button 
          type="submit" 
          disabled={status.loading}
          className="md:col-span-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {status.loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </section>
  );
};

export default EnquiryForm;