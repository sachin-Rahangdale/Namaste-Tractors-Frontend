import React, { useEffect, useState, useCallback } from "react";

import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "../../services/enquiryService";

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);
  const [progressMsg, setProgressMsg] = useState("");

  const loadData = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getEnquiries(page, 10);
      setEnquiries(res.content || []);
      setPagination({
        currentPage: res.number,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      });
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(pagination.currentPage);
  }, [pagination.currentPage, activeTab, loadData]);

  const handleUpdate = async (id) => {
    if (!progressMsg.trim()) return;
    try {
      await updateEnquiryStatus(id, progressMsg.trim());
      setUpdatingId(null);
      setProgressMsg("");
      loadData(pagination.currentPage);
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch =
      enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone?.includes(searchTerm) ||
      enq.address?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const highPriorityTypes = ["tractor_problem", "tractor", "MACHINERY", "TRACTOR_PROBLEM"];
    if (activeTab === "HIGH_PRIORITY") return highPriorityTypes.includes(enq.enquiryType);
    if (activeTab === "SUGGESTIONS") return enq.enquiryType === "Need Suggestion" || enq.enquiryType === "FARMING_ADVICE";
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const getTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'tractor_problem': return "bg-red-50 text-red-700 border-red-200";
      case 'tractor': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'product': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'need suggestion': return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 bg-slate-50 min-h-screen">
      
      {/* ── HEADER PANEL ── */}
      <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
            Field <span className="text-green-600 NOT-italic">Enquiries</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mt-1.5">
            Lead Management & CRM System
          </p>
        </div>

        <div className="w-full lg:w-80 relative">
          <input
            type="text"
            placeholder="Search Name / Phone / City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-[0.5px] border-slate-400 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* ── STATS SUMMARY PANEL ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", count: pagination.totalElements, bg: "bg-white border-gray-200 text-slate-900" },
          { label: "Active Now", count: enquiries.length, bg: "bg-green-50 border-green-100 text-green-700" },
          { label: "Current Page", count: pagination.currentPage + 1, bg: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Priority Tasks", count: enquiries.filter(e => ["tractor_problem", "tractor"].includes(e.enquiryType)).length, bg: "bg-blue-50 border-blue-100 text-blue-700" }
        ].map((stat, i) => (
          <div key={i} className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${stat.bg}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-black leading-none">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* ── FILTER CHIP TABS ── */}
      <div className="flex gap-1.5 p-1.5 bg-gray-200/60 rounded-xl w-fit border border-gray-200">
        {["ALL", "HIGH_PRIORITY", "SUGGESTIONS"].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPagination(p => ({ ...p, currentPage: 0 })); }}
            className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
              activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* ── CARD LEAD COMPONENT LISTINGS ── */}
      {loading ? (
        <div className="py-20 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-green-600 border-t-transparent mb-2"></div>
          <p className="font-bold text-slate-400 uppercase tracking-widest text-[11px]">Syncing CRM Database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300 shadow-sm">
              <p className="text-gray-400 font-bold text-sm">No enquiries found matching this criterion loop.</p>
            </div>
          ) : (
            filteredEnquiries.map((enq) => (
              <div key={enq.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-all">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* CENTRAL MAIN INFO CONTAINER */}
                  <div className="flex-1 p-5 sm:p-8 lg:border-r border-gray-100 space-y-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getTypeStyle(enq.enquiryType)}`}>
                        {enq.enquiryType?.replace('_', ' ')}
                      </span>
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                        Case #{enq.id} • {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 capitalize tracking-tight">{enq.name}</h4>
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-bold text-slate-600 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-xl w-fit">
                            📍 {enq.address}
                          </p>
                          <a href={`tel:${enq.phone}`} className="text-xs font-black text-slate-900 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl w-fit tracking-wide">
                            📞 +91 {enq.phone}
                          </a>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-inner">
                        <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-2">Customer Message</p>
                        <p className="text-white font-medium text-xs sm:text-sm leading-relaxed italic">
                          "{enq.message}"
                        </p>
                      </div>
                    </div>

                    {/* CURRENT TRACKING LOG NOTE */}
                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Current Progress Status</p>
                        <p className="text-sm font-black text-gray-800 uppercase mt-0.5">{enq.progress || "NEW CASE ASSIGNED"}</p>
                      </div>
                      {enq.updatedAt && (
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2.5 py-1 border border-gray-200 rounded-lg self-start sm:self-auto">
                          Updated: {formatDate(enq.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION TRIGGER BUTTONS SIDEBAR */}
                  <div className="lg:w-80 bg-slate-50/50 p-5 sm:p-8 flex flex-col justify-center gap-4 border-t lg:border-t-0 border-gray-100 shrink-0">
                    <div className="grid grid-cols-2 gap-2">
                      <a href={`tel:${enq.phone}`} className="flex flex-col items-center justify-center bg-white border border-gray-200 text-slate-900 py-4 rounded-xl font-black text-[10px] tracking-wider uppercase hover:border-slate-800 transition-all">
                        <span className="text-xl mb-1">📞</span> Call
                      </a>
                      <a href={`https://wa.me/91${enq.phone}?text=Namaste ${enq.name}, Sachin here from Namaste Tractors.`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-[#25D366] text-white py-4 rounded-xl font-black text-[10px] tracking-wider uppercase shadow-sm transition-all">
                        <span className="text-xl mb-1">💬</span> WhatsApp
                      </a>
                    </div>

                    <div className="space-y-2">
                      {updatingId === enq.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full bg-white border-[0.5px] border-slate-400 p-3 rounded-xl text-xs font-bold outline-none focus:border-slate-900 min-h-[100px] resize-none"
                            placeholder="Type progress updates strings..."
                            value={progressMsg}
                            onChange={(e) => setProgressMsg(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdate(enq.id)} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-black text-[10px] uppercase">Save</button>
                            <button onClick={() => setUpdatingId(null)} className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUpdatingId(enq.id)}
                          className="w-full py-3 bg-white border-[0.5px] border-dashed border-slate-400 hover:border-slate-800 hover:text-slate-900 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all"
                        >
                          Update Progress Log
                        </button>
                      )}

                      <button
                        onClick={() => { if (window.confirm("Complete and Close this Case File?")) deleteEnquiry(enq.id).then(() => loadData(pagination.currentPage)) }}
                        className="w-full bg-slate-900 hover:bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm"
                      >
                        Close Case File
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PAGINATION SYSTEM CONTROLS ── */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={pagination.currentPage === 0}
            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl font-bold text-sm disabled:opacity-30 transition-all shadow-sm"
          >
            ←
          </button>
          <div className="px-4 py-2 bg-slate-900 rounded-xl shadow-sm">
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              Sheet {pagination.currentPage + 1} / {pagination.totalPages}
            </span>
          </div>
          <button
            disabled={pagination.currentPage + 1 === pagination.totalPages}
            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl font-bold text-sm disabled:opacity-30 transition-all shadow-sm"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;