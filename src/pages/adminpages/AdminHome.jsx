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
      title: "Manage Enquiries",
      desc: "View and respond to enquiries of Farmers.",
      icon: "📩",
      path: "/admin/enquiries",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Tractor Brands",
      desc: "Update the list of tractor manufacturers.",
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
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      
      {/* ── HEADER SECTION (HIGH CONTRAST & RESPONSIVE) ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
            Control <span className="text-green-600 NOT-italic font-black">Panel</span>
          </h2>
          {/* Readability Fixed: Darker text contrast for subtitle */}
          <p className="text-slate-500 font-bold uppercase text-[10px] sm:text-xs tracking-[0.25em] mt-2 sm:mt-3">
            Namaste Tractors • Management Systems
          </p>
        </div>

        {/* Status Box - Changed to sharp edges */}
        <div className="bg-white px-5 py-2.5 rounded-none border border-slate-200 shadow-sm self-start md:self-auto min-w-[140px]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Status</p>
          <p className="text-xs sm:text-sm font-bold text-green-600 flex items-center gap-1.5 leading-none">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Operational
          </p>
        </div>
      </div>

      {/* ── BLOCK GRID SYSTEM (RESPONSIVE TWIN/SINGLE COLS BREAKPOINTS) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {adminModules.map((module, idx) => (
          <button
            key={idx}
            onClick={() => navigate(module.path)}
            className="group relative text-left bg-white rounded-none p-5 sm:p-8 shadow-md border border-slate-200 hover:border-green-600 transition-all duration-300 md:hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Decorative Icon - Position fixed for geometric alignment */}
            <span className="absolute -right-6 -bottom-6 text-8xl sm:text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-500 select-none">
              {module.icon}
            </span>

            {/* Icon Frame - Changed to perfectly sharp */}
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-none bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 shadow-md`}>
              {module.icon}
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter mb-1.5 sm:mb-2 italic">
              {module.title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6">
              {module.desc}
            </p>
            
            {/* Action text indicator layer always visible on touch screens */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-green-600 uppercase tracking-widest opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              Launch Module →
            </div>
          </button>
        ))}
      </div>

      {/* ── QUICK ACCESS FOOTER (FULLY RESPONSIVE SHARP MATRIX) ────────────────── */}
      <div className="bg-slate-900 rounded-none p-6 sm:p-10 mt-6 sm:mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-green-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">Namaste Tractor</p>
          <h4 className="text-white text-base sm:text-xl font-bold mt-1 max-w-xl">
            A platform to meet all the needs of Indian Farmers.
          </h4>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="w-full md:w-auto bg-white text-slate-900 px-6 py-3.5 sm:px-8 sm:py-4 rounded-none font-black uppercase text-xs hover:bg-green-600 hover:text-white transition-all shadow-md tracking-wider whitespace-nowrap active:scale-[0.98]"
        >
          Switch to Public Site
        </button>
      </div>

    </div>
  );
};

export default AdminHome;