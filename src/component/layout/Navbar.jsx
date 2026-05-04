import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logoutState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Link Styling
  const activeStyle = "text-green-600 font-bold border-b-2 border-green-600 pb-1";
  const normalStyle = "text-gray-600 hover:text-green-600 transition-colors font-medium";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚜</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              NAMASTE<span className="text-green-600">TRACTOR</span>
            </span>
          </Link>

          {/* MAIN NAV - Links always visible */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : normalStyle}>Home</NavLink>
            <NavLink to="/tractors" className={({ isActive }) => isActive ? activeStyle : normalStyle}>Tractors</NavLink>
            <NavLink to="/articles" className={({ isActive }) => isActive ? activeStyle : normalStyle}>Articles</NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? activeStyle : normalStyle}>Products</NavLink>
            
            {/* ADMIN ACCESS */}
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-bold border border-red-100">
                ADMIN PANEL
              </Link>
            )}
          </div>

          {/* AUTH ACTIONS */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-tighter">{user.role}</p>
                </div>
                <button 
                  onClick={() => { logoutState(); navigate('/'); }}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-md shadow-gray-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-green-600 text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;