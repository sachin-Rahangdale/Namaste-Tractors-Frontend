import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    loadData(pagination.currentPage);
  }, [pagination.currentPage, activeTab]);

  const loadData = async (page) => {
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
  };

  const handleUpdate = async (id) => {
    if (!progressMsg) return;
    try {
      await updateEnquiryStatus(id, progressMsg);
      setUpdatingId(null);
      setProgressMsg("");
      loadData(pagination.currentPage);
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.includes(searchTerm) ||
      enq.address.toLowerCase().includes(searchTerm.toLowerCase());

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
      case 'tractor_problem':
      case 'tractor_problem': return "bg-red-100 text-red-700 border-red-200";
      case 'tractor': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'product': return "bg-purple-100 text-purple-700 border-purple-200";
      case 'need suggestion': return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
            Field <span className="text-green-600 NOT-italic">Enquiries</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
            Lead Management & CRM System
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <input
              type="text"
              placeholder="Search Name / Phone / City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-3xl font-black text-slate-900">{pagination.totalElements}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 shadow-sm">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Active Now</p>
          <p className="text-3xl font-black text-green-700">{enquiries.length}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm">
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">This Page</p>
          <p className="text-3xl font-black text-orange-700">{pagination.currentPage + 1}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Priority Tasks</p>
          <p className="text-3xl font-black text-blue-700">
            {enquiries.filter(e => ["tractor_problem", "tractor"].includes(e.enquiryType)).length}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 p-2 bg-slate-100 rounded-[2rem] w-fit border border-slate-200/50">
        {["ALL", "HIGH_PRIORITY", "SUGGESTIONS"].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPagination(p => ({ ...p, currentPage: 0 })); }}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs">Syncing CRM Database...</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">No enquiries found for this criteria.</p>
            </div>
          ) : (
            filteredEnquiries.map((enq) => (
              <div key={enq.id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:border-green-500/50 transition-all duration-500">
                <div className="flex flex-col xl:flex-row">
                  {/* MAIN INFO SECTION */}
                  <div className="flex-1 p-8 md:p-12 xl:border-r border-slate-50">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${getTypeStyle(enq.enquiryType)}`}>
                        {enq.enquiryType?.replace('_', ' ')}
                      </span>
                      <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                        Case #{enq.id} • {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 capitalize tracking-tighter mb-4">{enq.name}</h3>
                        <div className="space-y-3">
                          <p className="flex items-center gap-3 text-slate-600 font-bold text-sm bg-slate-50 w-fit px-4 py-2 rounded-2xl border border-slate-100">
                            <span className="text-lg">📍</span> {enq.address}
                          </p>
                          <p className="flex items-center gap-3 text-slate-900 font-black text-sm bg-green-50 w-fit px-4 py-2 rounded-2xl border border-green-100 tracking-tighter">
                            <span className="text-lg">📞</span> +91 {enq.phone}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💬</div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3">Customer Message</p>
                        <p className="text-white font-medium text-sm leading-relaxed italic">
                          "{enq.message}"
                        </p>
                      </div>
                    </div>

                    {/* PROGRESS TRACKER */}
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                          <p className="text-xl font-black text-slate-800 uppercase tracking-tight">{enq.progress || "NEW LEAD GENERATED"}</p>
                        </div>
                        {enq.updatedAt && (
                          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Last Activity</p>
                            <p className="text-[10px] font-black text-slate-700">{formatDate(enq.updatedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION SIDEBAR */}
                  <div className="xl:w-96 bg-slate-50/80 p-8 md:p-12 flex flex-col justify-between gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Direct Engagement</p>
                      <div className="grid grid-cols-2 gap-4">
                        <a href={`tel:${enq.phone}`} className="flex flex-col items-center justify-center bg-white border border-slate-200 text-slate-900 py-6 rounded-3xl font-black text-[10px] hover:border-slate-900 hover:shadow-xl transition-all uppercase group/btn">
                          <span className="text-2xl mb-2 group-hover/btn:scale-110 transition">📞</span>
                          Call
                        </a>
                        <a href={`https://wa.me/91${enq.phone}?text=Namaste ${enq.name}, Sachin here from Namaste Tractors.`} target="_blank" className="flex flex-col items-center justify-center bg-[#25D366] text-white py-6 rounded-3xl font-black text-[10px] hover:shadow-xl hover:shadow-green-200 transition-all uppercase group/btn">
                          <span className="text-2xl mb-2 group-hover/btn:scale-110 transition">💬</span>
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {updatingId === enq.id ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                          <textarea
                            className="w-full bg-white border-2 border-green-200 p-6 rounded-[2rem] text-sm font-bold outline-none focus:border-green-500 shadow-inner min-h-[150px] resize-none"
                            placeholder="Type progress update here..."
                            value={progressMsg}
                            onChange={(e) => setProgressMsg(e.target.value)}
                          />
                          <div className="flex gap-3">
                            <button onClick={() => handleUpdate(enq.id)} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-green-100">Save Update</button>
                            <button onClick={() => setUpdatingId(null)} className="flex-1 bg-slate-200 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUpdatingId(enq.id)}
                          className="w-full py-5 bg-white border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all duration-300"
                        >
                          Update Progress Log
                        </button>
                      )}

                      <button
                        onClick={() => { if (confirm("Complete and Close this Lead?")) deleteEnquiry(enq.id).then(() => loadData(pagination.currentPage)) }}
                        className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 shadow-xl shadow-slate-200 transition-all"
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

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-10">
          <button
            disabled={pagination.currentPage === 0}
            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
            className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl font-black text-xs disabled:opacity-30 hover:border-slate-900 transition-all shadow-sm"
          >
            ←
          </button>
          <div className="px-8 py-4 bg-slate-900 rounded-2xl shadow-xl">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Sheet {pagination.currentPage + 1} / {pagination.totalPages}
            </span>
          </div>
          <button
            disabled={pagination.currentPage + 1 === pagination.totalPages}
            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
            className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl font-black text-xs disabled:opacity-30 hover:border-slate-900 transition-all shadow-sm"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;