import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  // 1. Context and Navigation
  const { loginState } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. Local State
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    isError: false,
  });

  // 3. Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", isError: false });

    try {
      if (isLogin) {
        // Handle Login
        const data = await login({
          username: formData.username,
          password: formData.password,
        });
        
        // Update global context state
        loginState({ token: data.token, role: data.role });
        
        // Redirect to Home
        navigate("/");
      } else {
        // Handle Registration
        await register(formData);
        setStatus({
          loading: false,
          isError: false,
          message: "Registration successful! Please check your email to verify your account before logging in.",
        });
        // Switch to login view so they can sign in after verifying
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
    <div className="min-h-[calc(100-64px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">🚜</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin 
              ? "Sign in to access your Namaste Tractor account" 
              : "Join our community to explore machinery and insights"}
          </p>
        </div>

        {/* Feedback Message */}
        {status.message && (
          <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in duration-300 ${
            status.isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
          }`}>
            {status.isError ? "⚠️ " : "✅ "} {status.message}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Sachin Rahangdale"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="username"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status.loading 
              ? <span className="flex items-center gap-2">Processing...</span> 
              : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {isLogin ? "New to Namaste Tractor?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStatus({ loading: false, message: "", isError: false });
              }}
              className="ml-2 text-green-600 hover:text-green-700 font-bold underline-offset-4 hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;