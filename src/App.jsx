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

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
          The 'flex-grow' div ensures the main content expands 
          to push the footer to the bottom of the screen.
      */}
      <div className="flex-grow">
        <Routes>
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
          
          <Route path="/product/:id" element={<div>Product Detail Page</div>} />
          
          <Route 
               path="/products/new" 
               element={user ? <AddProduct /> : <Navigate to="/login" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;