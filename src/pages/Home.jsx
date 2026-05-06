import React, { useEffect, useState } from "react";
import { getTractors } from "../services/tractorservice";
import { getArticles } from "../services/articleService";
import { getProducts } from "../services/productService";
import Card from "../component/cards/Card";
import ArticleCard from "../component/cards/ArticleCard";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import Navbar from "../component/layout/Navbar";
import { Link } from "react-router-dom";
import Footer from "../component/layout/Footer";

const Home = () => {
  const [tractors, setTractors] = useState([]);
  const [tractorPage, setTractorPage] = useState(0);
  const [isTractorLast, setIsTractorLast] = useState(false);
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch Tractors with duplicate prevention
  useEffect(() => {
    const fetchTractors = async () => {
      try {
        const res = await getTractors(tractorPage, 4);
        setTractors((prev) => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewData = res.content.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
        setIsTractorLast(res.last);
      } catch (err) { console.error(err); }
    };
    fetchTractors();
  }, [tractorPage]);

  // Fetch Articles & Products
  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [articleRes, productRes] = await Promise.all([
          getArticles(0, 4),
          getProducts(0, 4)
        ]);
        setArticles(articleRes.content);
        setProducts(productRes.content);
      } catch (err) { console.error(err); }
    };
    fetchExtras();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="bg-green-700 py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your Perfect Farming Partner</h1>
          <p className="text-green-100 text-lg">Detailed reviews, expert articles, and machinery prices at your fingertips.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        
        {/* Tractors Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Tractors</h2>
            <Link to="/tractors" className="text-green-600 font-semibold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tractors.map(t => <Card key={t.id} data={t} />)}
          </div>
          {!isTractorLast && (
            <button onClick={() => setTractorPage(p => p+1)} className="mt-12 block mx-auto bg-white border border-gray-200 px-8 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition">
              Show More Tractors
            </button>
          )}
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Expert Articles</h2>
            <Link to="/articles" className="text-green-600 font-semibold hover:underline">Read All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {articles.map(a => <ArticleCard key={a.id} data={a} />)}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Machinery & Products</h2>
            <Link to="/products" className="text-green-600 font-semibold hover:underline">See All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(p => <ProductCard key={p.id} data={p} />)}
          </div>
        </section>

        {/* Enquiry Form */}
        <EnquiryForm />
        
      </main>
    </div>
  );
};

export default Home;