import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logoutState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const activeStyle =
  "text-[#0F3D2E] font-bold text-[15px] border-b-2 border-[#0F3D2E] pb-1";
  const normalStyle =
  "text-gray-800 hover:text-[#0F3D2E] transition-colors font-semibold text-[15px]";
  const mobileActive  = "block px-4 py-3 text-[#0F3D2E] font-bold bg-green-50 rounded-xl";
  const mobileNormal  = "block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors";

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-md shadow-black/5 border-b border-gray-100/80'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-[72px] items-center">

            {/* ── LOGO ────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="text-[2rem] group-hover:scale-110 transition-transform duration-300 float">🚜</span>
              <span className="text-xl font-black text-gray-900 tracking-tight leading-none">
                NAMASTE<span className="text-[#0F3D2E]">TRACTOR</span>
              </span>
            </Link>

            {/* ── DESKTOP NAV ──────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-10">
              <NavLink to="/"        end className={({ isActive }) => isActive ? activeStyle : normalStyle}>Home</NavLink>
              <NavLink to="/tractors"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Tractors</NavLink>
              <NavLink to="/articles"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Articles</NavLink>
              <NavLink to="/products"    className={({ isActive }) => isActive ? activeStyle : normalStyle}>Products</NavLink>

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="bg-red-50 text-red-600 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* ── AUTH + HAMBURGER ─────────────────────────────── */}
            <div className="flex items-center gap-3">
              {/* Desktop auth */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{user.role}</p>
                    </div>
                    <button
                      onClick={() => { logoutState(); navigate('/'); }}
                      className=" bg-[#0F3D2E] hover:bg-[#14543f] text-white px-6  py-3  rounded-xl  text-sm font-semibold  transition-all shadow-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="
                      bg-[#0F3D2E]
                         hover:bg-[#14543f]
                         text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } bg-white border-t border-gray-100`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <NavLink to="/"        end className={({ isActive }) => isActive ? mobileActive : mobileNormal}>🏠 Home</NavLink>
            <NavLink to="/tractors"    className={({ isActive }) => isActive ? mobileActive : mobileNormal}>🚜 Tractors</NavLink>
            <NavLink to="/articles"    className={({ isActive }) => isActive ? mobileActive : mobileNormal}>📰 Articles</NavLink>
            <NavLink to="/products"    className={({ isActive }) => isActive ? mobileActive : mobileNormal}>📦 Products</NavLink>

            {user?.role === "ADMIN" && (
              <Link to="/admin" className="block px-4 py-3 bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest rounded-xl">
                ⚙️ Admin Panel
              </Link>
            )}

            <div className="pt-3 border-t border-gray-100 mt-2">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Logged in as</p>
                    <p className="text-sm font-black text-gray-800">{user.role}</p>
                  </div>
                  <button
                    onClick={() => { logoutState(); navigate('/'); }}
                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-primary text-sm py-3"
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