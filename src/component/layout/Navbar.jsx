import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logoutState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeStyle =
    "text-[#0F3D2E] font-bold text-[14px] sm:text-[15px] border-b-2 border-[#0F3D2E] pb-1";
  const normalStyle =
    "text-gray-800 hover:text-[#0F3D2E] transition-colors font-semibold text-[14px] sm:text-[15px]";

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 bg-white ${
          scrolled
            ? 'shadow-md shadow-black/5 border-b border-gray-100/80 backdrop-blur-xl bg-white/90'
            : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile me flex-col (upar-neeche) aur desktop me flex-row (ek line me) */}
          <div className="flex flex-col md:flex-row md:justify-between min-h-[72px] md:h-[72px] items-center py-3 md:py-0 gap-3 md:gap-0">

            {/* ── LOGO AND AUTH ROW ──────────────────────────────── */}
            <div className="flex justify-between items-center w-full md:w-auto gap-4">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-[1.8rem] sm:text-[2rem] group-hover:scale-110 transition-transform duration-300 float">🚜</span>
                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-none">
                  NAMASTE<span className="text-[#0F3D2E]">TRACTOR</span>
                </span>
              </Link>

              {/* Mobile Auth Button (Sirf mobile par logo ke side me dikhega) */}
              <div className="md:hidden flex items-center gap-2">
                {user ? (
                  <button
                    onClick={() => { logoutState(); navigate('/'); }}
                    className="bg-[#0F3D2E] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#0F3D2E] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* ── NAVIGATION MENUS (ALWAYS VISIBLE NOW) ─────────── */}
            {/* Pehle yahan 'hidden md:flex' tha, ab ye mobile par bhi dikhega ek neat line me */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 w-full md:w-auto border-t border-gray-50 pt-2 md:pt-0 md:border-none">
              <NavLink to="/"        end className={({ isActive }) => isActive ? activeStyle : normalStyle}>Home</NavLink>
              <NavLink to="/tractors"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Tractors</NavLink>
              <NavLink to="/articles"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Articles</NavLink>
              <NavLink to="/products"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Products</NavLink>

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border border-red-100"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* ── DESKTOP AUTH ONLY ──────────────────────────────── */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{user.role}</p>
                  </div>
                  <button
                    onClick={() => { logoutState(); navigate('/'); }}
                    className="bg-[#0F3D2E] hover:bg-[#14543f] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#0F3D2E] hover:bg-[#14543f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;