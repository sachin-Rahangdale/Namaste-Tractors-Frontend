import React, { useEffect, useState } from "react";
import { getTractors } from "../services/tractorservice";
import { getArticles } from "../services/articleService";
import { getProducts } from "../services/productService";
import Card from "../component/cards/Card";
import ArticleCard from "../component/cards/ArticleCard";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";
import Navbar from "../component/layout/Navbar";
import Footer from "../component/layout/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const [tractors, setTractors] = useState([]);
  const [tractorPage, setTractorPage] = useState(0);
  const [isTractorLast, setIsTractorLast] = useState(false);

  const [articles, setArticles] = useState([]);
  const [articlePage, setArticlePage] = useState(0);
  const [isArticleLast, setIsArticleLast] = useState(false);

  const [products, setProducts] = useState([]);
  const [productPage, setProductPage] = useState(0);
  const [isProductLast, setIsProductLast] = useState(false);

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

  useEffect(() => {
    const fetchArticlesData = async () => {
      try {
        const res = await getArticles(articlePage, 4);
        setArticles((prev) => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewData = res.content.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
        setIsArticleLast(res.last);
      } catch (err) { console.error(err); }
    };
    fetchArticlesData();
  }, [articlePage]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const res = await getProducts(productPage, 4);
        setProducts((prev) => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewData = res.content.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
        setIsProductLast(res.last);
      } catch (err) { console.error(err); }
    };
    fetchProductsData();
  }, [productPage]);

  return (
    <div style={{ background: 'var(--color-surface)' }} className="min-h-screen">
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0F3D2E 0%, #1a5c40 100%)' }}>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                Find Your Perfect Tractor
              </h1>
              <p className="text-green-300 text-sm mt-1">
                Reviews, pricing &amp; dealer support for India's farmers.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/tractors"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#FBBF24', color: '#0F3D2E' }}
              >
                Browse Tractors
              </Link>
              <Link
                to="/articles"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                Articles
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10 space-y-20">

        {/* Tractors Section */}
        <section className="fade-up">
          <SectionHeader title="Featured Tractors" to="/tractors" linkText="View All" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tractors.map(t => <Card key={t.id} data={t} />)}
          </div>
          {!isTractorLast && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setTractorPage(p => p + 1)}
                className="px-8 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                Load More Tractors ↓
              </button>
            </div>
          )}
        </section>

        {/* Articles Section */}
        <section>
          <SectionHeader title="Expert Articles" to="/articles" linkText="Read All" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map(a => <ArticleCard key={a.id} data={a} />)}
          </div>
          {!isArticleLast && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setArticlePage(p => p + 1)}
                className="px-8 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                Load More Articles ↓
              </button>
            </div>
          )}
        </section>

        {/* Products Section */}
        <section>
          <SectionHeader title="Machinery &amp; Products" to="/products" linkText="See All" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} data={p} />)}
          </div>
          {!isProductLast && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setProductPage(p => p + 1)}
                className="px-8 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                Load More Products ↓
              </button>
            </div>
          )}
        </section>

        {/* Trust Bar (Shifted below Products) */}
        <section className="rounded-3xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #0F3D2E, #1a5c40)' }}>
          <p className="text-green-300 text-xs font-black uppercase tracking-widest mb-4">Trusted by Farmers Across Vidarbha</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: '✅', label: 'Verified Dealers' },
              { icon: '📞', label: 'Expert Support' },
              { icon: '💳', label: 'Finance Guidance' },
              { icon: '🏛️', label: 'Subsidy Info' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-white">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Enquiry Form */}
        <EnquiryForm />
      </main>
    </div>
  );
};

/* ── Section Header Helper ─────────────────────────────────────── */
const SectionHeader = ({ title, to, linkText }) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="section-divider" />
    </div>
    <Link
      to={to}
      className="text-[#0F3D2E] font-bold text-sm hover:underline underline-offset-4 shrink-0 ml-4"
    >
      {linkText} →
    </Link>
  </div>
);

export default Home;