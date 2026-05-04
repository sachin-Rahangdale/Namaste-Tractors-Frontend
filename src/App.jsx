import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import TractorDetail from "./pages/TractorDetail";
import Tractors from "./pages/Tractors";
import Auth from "./pages/Auth";
import Articles from "./pages/Articles";
import Products from "./pages/Products";
import MyProducts from "./pages/MyProducts"; // Ensure this is created
import AddProduct from "./pages/AddProduct";

function App() {
  const { user } = useContext(AuthContext); //

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/tractors" element={<Tractors />} />
      <Route path="/tractor/:id" element={<TractorDetail />} />
      <Route path="/articles" element={<Articles/>} />
      <Route path="/article/:slug" element={<div>Article Detail Page</div>} />
      
      {/* Product Routes */}
      <Route path="/products" element={<Products/>} />
      
      {/* Protected Routes: Redirect to login if user object is null */}
      <Route 
        path="/products/my" 
        element={user ? <MyProducts /> : <Navigate to="/login" />} 
      />
      

      <Route path="/product/:id" element={<div>Product Detail Page</div>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route 
           path="/products/new" 
           element={user ? <AddProduct /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;