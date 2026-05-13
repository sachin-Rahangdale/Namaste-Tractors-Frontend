import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import TractorDetail from "./pages/TractorDetail";
import Tractors from "./pages/Tractors";
import Auth from "./pages/Auth";
import Articles from "./pages/Articles";
import Products from "./pages/Products";
import MyProducts from "./pages/MyProducts"; 
import AddProduct from "./pages/AddProduct";
import ArticleDetail from "./pages/ArticleDetail";
import Footer from "./component/layout/Footer";

// Admin Imports
import AdminLayout from "./routes/AdminLayout";
import AdminHome from "./pages/Admin/AdminHome";
import ProductDetail from "./pages/ProductDetail";
import ManageEnquiries from "./pages/Admin/ManageEnquiries";
import ManageBrands from "./pages/Admin/ManageBrands";
import ManageTractors from "./pages/Admin/ManageTractors";
import TractorForm from "./component/admin/TractorForm";
import ManageArticles from "./pages/Admin/ManageArticles";
import ManageProducts from "./pages/Admin/ManageProduct";


function App() {
  const { user } = useContext(AuthContext);

  // Helper to check for Admin role - crucial for backend security
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* PUBLIC & USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/tractors" element={<Tractors />} />
          <Route path="/tractor/:id" element={<TractorDetail />} />
          <Route path="/articles" element={<Articles/>} />
          <Route path="/article/:slug" element={<ArticleDetail/>} />
          <Route path="/products" element={<Products/>} />
          
          <Route 
            path="/products/my" 
            element={user ? <MyProducts /> : <Navigate to="/login" />} 
          />
          <Route path="/product/:id" element={<ProductDetail/>} />
          <Route 
            path="/products/new" 
            element={user ? <AddProduct /> : <Navigate to="/login" />} 
          />

          {/* ADMIN ROUTES (Nested) */}
          {/* We hide the footer for Admin pages to give it a professional dashboard feel */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<AdminHome />} />
            <Route path="tractors" element={<ManageTractors/>} />
            <Route path="tractors/new" element={<TractorForm />} />
    <Route path="tractors/edit/:id" element={<TractorForm />} />
            <Route path="articles" element={<ManageArticles/>} />
            <Route path="products" element={<ManageProducts/>} />
            <Route path="enquiries" element={<ManageEnquiries/>} />
            <Route path="brands" element={<ManageBrands/>} />
          </Route>
          
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Global Footer - Only visible on non-admin routes */}
      {/* Logic: If the URL doesn't start with /admin, show footer */}
      {!window.location.pathname.startsWith("/admin") && <Footer />}
    </div>
  );
}

export default App;