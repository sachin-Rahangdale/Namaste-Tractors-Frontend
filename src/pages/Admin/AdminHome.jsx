import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Manage Tractors",
      desc: "Add, edit, or remove tractor models and technical specs.",
      icon: "🚜",
      path: "/admin/tractors",
      color: "from-blue-600 to-blue-700",
    },
    {
      title: "Field Enquiries",
      desc: "View and respond to leads from farmers in Vidarbha.",
      icon: "📩",
      path: "/admin/enquiries",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Tractor Brands",
      desc: "Update the list of manufacturers and brand logos.",
      icon: "🏷️",
      path: "/admin/brands",
      color: "from-green-600 to-green-700",
    },
    {
      title: "Manage Articles",
      desc: "Draft and publish technical reviews and farm guides.",
      icon: "📰",
      path: "/admin/articles",
      color: "from-slate-700 to-slate-800",
    },
    {
      title: "Product Inventory",
      desc: "Manage used machinery, crops, and vegetable listings.",
      icon: "📦",
      path: "/admin/products",
      color: "from-purple-600 to-purple-700",
    },
    {
      title: "YouTube Sync",
      desc: "Track monetization progress and video performance.",
      icon: "🎥",
      path: "#", // Add your YT link or tracker here
      color: "from-red-600 to-red-700",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">
            Control <span className="text-green-600 NOT-italic font-black">Panel</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-2">
            Namaste Tractors • Management Systems
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
           <p className="text-sm font-bold text-green-600 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Operational
           </p>
        </div>
      </div>

      {/* Block Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminModules.map((module, idx) => (
          <button
            key={idx}
            onClick={() => navigate(module.path)}
            className="group relative text-left bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-green-500 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background Decorative Icon */}
            <span className="absolute -right-4 -bottom-4 text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-500">
              {module.icon}
            </span>

            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
              {module.icon}
            </div>
            
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2 italic">
              {module.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              {module.desc}
            </p>
            
            <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Module →
            </div>
          </button>
        ))}
      </div>

      {/* Quick Access Footer */}
      <div className="bg-slate-900 rounded-[3rem] p-10 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
             <p className="text-green-400 font-black text-xs uppercase tracking-widest">Mechanical Summary</p>
             <h4 className="text-white text-xl font-bold mt-1">Ready to update your 75-acre field log?</h4>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-green-500 hover:text-white transition-all shadow-xl"
          >
            Switch to Public Site
          </button>
      </div>
    </div>
  );
};

export default AdminHome;