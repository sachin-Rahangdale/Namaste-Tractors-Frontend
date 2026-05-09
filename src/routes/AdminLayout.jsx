import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Manage Tractors", path: "/admin/tractors", icon: "🚜" },
    { name: "Manage Articles", path: "/admin/articles", icon: "📰" },
    { name: "Manage Products", path: "/admin/products", icon: "📦" },
    { name: "Manage Enquiries", path: "/admin/enquiries", icon: "📩" },
    { name: "Manage Brands", path: "/admin/brands", icon: "🏷️" },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top Header for Admin */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">
          Namaste <span className="text-green-600 NOT-italic">Tractors</span> Admin
        </h1>
        <button 
          onClick={() => navigate("/")}
          className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Exit to Site →
        </button>
      </header>

      {/* Main Content Area - Flex Row Reverse puts Sidebar on the Right */}
      <div className="flex flex-1 flex-row-reverse overflow-hidden">
        
        {/* RIGHT VERTICAL NAVBAR */}
        <aside className="w-72 bg-slate-900 text-white shadow-2xl z-20 overflow-y-auto">
          <nav className="p-6 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 ml-4">Main Menu</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  location.pathname === item.path 
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/20" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile Info at Bottom of Sidebar */}
          <div className="absolute bottom-0 w-72 p-6 border-t border-slate-800 bg-slate-900">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center font-black text-white">S</div>
                <div>
                   <p className="text-xs font-black uppercase tracking-tighter">Sachin Rangdale</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Super Admin</p>
                </div>
             </div>
          </div>
        </aside>

        {/* LEFT DYNAMIC CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {/* This is where the specific CRUD pages will render */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;