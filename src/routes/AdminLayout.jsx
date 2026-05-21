import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Manage Tractors", path: "/admin/tractors", icon: "🚜" },
    { name: "Manage Articles", path: "/admin/articles", icon: "📰" },
    { name: "Manage Products", path: "/admin/products", icon: "📦" },
    { name: "Manage Enquiries", path: "/admin/enquiries", icon: "📩" },
    { name: "Manage Brands", path: "/admin/brands", icon: "🏷️" },
  ];

  // Route change hote hi mobile drawer automatically close ho jaye uske liye system
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      
      {/* ── TOP HEADER (RESPONSIVE EDGE TO EDGE) ────────────────────────────────── */}
      <header className="bg-white border-b px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm z-30">
        <div className="flex items-center gap-3">
          {/* Mobile View Toggle Hamburgermenu (Only visible on mobile md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] border border-gray-200 text-gray-800 transition-colors"
            aria-label="Toggle admin menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

          <h1 className="text-base sm:text-xl font-black text-slate-800 tracking-tighter uppercase italic">
            Namaste <span className="text-green-600 NOT-italic">Tractors</span> Admin
          </h1>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Exit <span className="hidden sm:inline">to Site</span> →
        </button>
      </header>

      {/* Main Container Layout Area */}
      <div className="flex flex-1 flex-row-reverse overflow-hidden relative">
        
        {/* ── SIDEBAR DRAWER (SLIDE-IN ON MOBILE, FIXED ON DESKTOP) ───────────────── */}
        {/* Responsive CSS matrix controls display bounds smoothly */}
        <aside className={`
          fixed md:static top-0 bottom-0 right-0 w-72 bg-slate-900 text-white shadow-2xl md:shadow-none z-40 
          flex flex-col justify-between transition-transform duration-300 overflow-y-auto rounded-none
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}>
          <nav className="p-4 sm:p-6 space-y-1.5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 md:mb-6 ml-4">
              Main Menu
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-none transition-all duration-200 group ${
                  location.pathname === item.path 
                    ? "bg-green-600 text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile Info - Fixed layout bug via flex system instead of absolute bottom position */}
          <div className="p-5 border-t border-slate-800 bg-slate-950 shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-none flex items-center justify-center font-black text-white text-sm shrink-0">
                  S
                </div>
                <div className="min-w-0">
                   <p className="text-xs font-black uppercase tracking-tight text-white truncate">Sachin Rangdale</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Super Admin</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Backdrop overlay layout (Closes drawer on mobile viewport shadow clicks) */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          />
        )}

        {/* ── MAIN CONTENT WORKSPACE AREA ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 w-full">
          <div className="max-w-6xl mx-auto">
            <Outlet /> 
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;