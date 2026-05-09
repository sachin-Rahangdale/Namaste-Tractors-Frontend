import React, { useState, useEffect } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "../../services/enquiryService";

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("HIGH_PRIORITY");
  const [updatingId, setUpdatingId] = useState(null);
  const [progressMsg, setProgressMsg] = useState("");

  // Re-fetch when page or tab changes
  useEffect(() => {
    loadData(pagination.currentPage);
  }, [pagination.currentPage, activeTab]);

  const loadData = async (page) => {
    setLoading(true);
    try {
      // Assuming your service now accepts (page, size)
      const res = await getEnquiries(page, 10); 
      
      // Since it's paginated, we access .content
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
    const highPriority = ["TRACTOR_PROBLEM", "tractor", "MACHINERY"];
    if (activeTab === "HIGH_PRIORITY") return highPriority.includes(enq.enquiryType);
    if (activeTab === "FARMING_ADVICE") return enq.enquiryType === "FARMING_ADVICE";
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER & TABS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Field Enquiries</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
             Total Leads: {pagination.totalElements}
          </p>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
          {["HIGH_PRIORITY", "FARMING_ADVICE", "ALL"].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPagination(p => ({...p, currentPage: 0})); }}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-500"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="p-20 text-center font-black animate-pulse text-slate-400 uppercase tracking-widest">
          Syncing Control Panel...
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEnquiries.map((enq) => (
            <div key={enq.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden hover:border-green-500 transition-all">
              <div className="flex flex-col lg:flex-row">
                {/* INFO BLOCK */}
                <div className="flex-1 p-8 border-r border-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase italic">
                      {enq.enquiryType}
                    </span>
                    <span className="text-slate-300 font-bold text-[10px] uppercase">
                      ID: #{enq.id} • {formatDate(enq.createdAt)}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-800 capitalize leading-tight">{enq.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                      <p className="text-green-600 font-black text-sm flex items-center gap-1">📍 {enq.address}</p>
                      <p className="text-slate-900 font-black text-sm tracking-tighter bg-slate-100 px-3 py-1 rounded-lg">📞 +91 {enq.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
                      "{enq.message}"
                    </div>

                    <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100/50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Progress Log</p>
                        {enq.updatedAt && (
                          <p className="text-[9px] font-bold text-green-600 uppercase italic">Last Activity: {formatDate(enq.updatedAt)}</p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-700">{enq.progress || "NEW LEAD"}</p>
                    </div>
                  </div>
                </div>

                {/* ACTION BLOCK */}
                <div className="lg:w-80 bg-slate-50/50 p-8 flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${enq.phone}`} className="flex items-center justify-center bg-white border-2 border-slate-200 text-slate-900 py-4 rounded-2xl font-black text-xs hover:border-slate-900 transition shadow-sm uppercase">Call</a>
                    <a href={`https://wa.me/91${enq.phone}?text=Namaste ${enq.name}, Sachin here from Namaste Tractors.`} target="_blank" className="flex items-center justify-center bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs hover:shadow-lg transition uppercase">WhatsApp</a>
                  </div>

                  {updatingId === enq.id ? (
                    <div className="space-y-2">
                      <textarea 
                        className="w-full bg-white border border-green-300 p-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                        placeholder="Log progress details..."
                        value={progressMsg}
                        onChange={(e) => setProgressMsg(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(enq.id)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">Save</button>
                        <button onClick={() => setUpdatingId(null)} className="flex-1 bg-slate-300 text-slate-700 py-3 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setUpdatingId(enq.id)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition">Update Progress</button>
                  )}

                  <button 
                    onClick={() => { if(confirm("Complete Enquiry?")) deleteEnquiry(enq.id).then(() => loadData(pagination.currentPage)) }}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition"
                  >
                    Close Lead
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            disabled={pagination.currentPage === 0}
            onClick={() => setPagination(p => ({...p, currentPage: p.currentPage - 1}))}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-xs disabled:opacity-30"
          >
            PREV
          </button>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.currentPage + 1 === pagination.totalPages}
            onClick={() => setPagination(p => ({...p, currentPage: p.currentPage + 1}))}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-xs disabled:opacity-30"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;