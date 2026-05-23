import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, register } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  const { loginState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [status, setStatus] = useState({ loading: false, message: "", isError: false });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", isError: false });
    try {
      if (isLogin) {
        const data = await login({ username: formData.username, password: formData.password });
        loginState({ token: data.token, role: data.role });
        navigate("/");
      } else {
        await register(formData);
        setStatus({
          loading: false,
          isError: false,
          message: "Registration successful! Now you are ready to log in.",
        });
        setIsLogin(true);
      }
    } catch (err) {
      setStatus({
        loading: false,
        isError: true,
        message: err.response?.data?.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>

      {/* ── LEFT PANEL (decorative, hidden on mobile) ─────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F3D2E 0%, #1a5c40 60%, #22734f 100%)' }}
      >
        <div className="grain-overlay" />
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FBBF24, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22734f, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-4xl float">🚜</span>
            <span className="font-black text-2xl text-white tracking-tight">
              NAMASTE<span style={{ color: '#FBBF24' }}>TRACTOR</span>
            </span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)' }}>
            India's Farming Marketplace
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight mb-6">
            Your Trusted<br />
            <span style={{ color: '#FBBF24' }}>Tractor Partner</span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: '🚜', text: 'Browse 500+ tractor models with specs & pricing' },
              { icon: '📰', text: 'Expert articles, reviews & farming insights' },
              { icon: '🤝', text: 'Tractor purchase & subsidy guidance' },
              { icon: '⚙️', text: 'Machinery, crops & agricultural marketplace' },
            ].map(f => (
              <div key={f.text} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{f.icon}</span>
                <p className="text-green-200 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm">N</div>
          <div>
            <p className="text-white font-bold text-sm">Namaste Tractor Team</p>
            <p className="text-green-300 text-xs">A Platform to Help Indian Farmers</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md scale-in">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-3xl">🚜</span>
            <span className="font-black text-xl text-gray-900 tracking-tight">
              NAMASTE<span className="text-[#0F3D2E]">TRACTOR</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin
                ? 'Sign in to your Namaste Tractor account'
                : 'Join our community of farmers & experts'}
            </p>
          </div>

          {/* Feedback */}
          {status.message && (
            <div className={`scale-in flex items-start gap-3 p-4 rounded-2xl mb-6 text-sm font-medium border ${
              status.isError
                ? 'bg-red-50 text-red-700 border-red-100'
                : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              <span className="text-base mt-0.5">{status.isError ? '⚠️' : '✅'}</span>
              {status.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input
                  name="name" type="text" required
                  className="input-field"
                  placeholder="Sachin Rahangdale"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                name="username" type="email" required
                className="input-field"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full btn-primary py-4 text-base rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {status.loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Processing...
                </span>
              ) : (isLogin ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "New to Namaste Tractor?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStatus({ loading: false, message: "", isError: false });
              }}
              className="ml-1.5 text-[#0F3D2E] font-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Create account' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;