
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { AuthContext } from "../context/AuthContext";
import { getProducts, getProductsByCity } from "../services/productService";

const Products = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [activeCity, setActiveCity] = useState("");

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  const fetchInitialProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(0, 12);
      setProducts(data.content);
      setActiveCity("");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return fetchInitialProducts();
    
    setLoading(true);
    try {
      const data = await getProductsByCity(searchCity);
      setProducts(data.content);
      setActiveCity(searchCity);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // SMART ACTION: Check login before navigating
  const handleProtectedAction = (path) => {
    if (!user) {
      // Redirect to login with a message (could be handled via state)
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* PRODUCT HERO / TOOLBAR */}
      <div className="bg-white border-b border-gray-100 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Machinery & Produce</h1>
            <p className="text-gray-500">Buy and sell agricultural equipment and crops locally.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleProtectedAction("/products/my")}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              My Listings
            </button>
            <button 
              onClick={() => handleProtectedAction("/products/new")}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
            >
              + Sell Product
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* CITY FILTER BAR */}
        <div className="mb-10 max-w-xl">
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-3 text-gray-400">📍</span>
              <input 
                type="text" 
                placeholder="Search by city (e.g. Nagpur, Gondia)..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition">
              Search
            </button>
          </form>
          {activeCity && (
            <p className="mt-3 text-sm text-gray-500">
              Showing results for <span className="font-bold text-green-600">"{activeCity}"</span>
              <button onClick={fetchInitialProducts} className="ml-2 underline">Clear</button>
            </p>
          )}
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No products found in this area. Be the first to list one!</p>
          </div>
        )}
      </main>

      {/* ENQUIRY SECTION */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Need Expert Advice?</h2>
            <p className="text-gray-600 mt-2">Get suggestions on machinery, crops, or local market prices.</p>
          </div>
          <EnquiryForm defaultType="Need Suggestion" />
        </div>
      </section>
    </div>
  );
};

export default Products;