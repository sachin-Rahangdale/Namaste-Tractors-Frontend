import React, { useEffect, useState } from "react";

import Navbar from "../component/layout/Navbar";
import ExploreSection from "../component/common/ExploreSection";
import HorizontalTractorSection from "../component/home/HorizontalTractorSection";
import SkeletonCard from "../component/home/SkeletonCard";
import ArticleCard from "../component/cards/ArticleCard";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";

import { getTractors } from "../services/tractorService";
import { getArticles } from "../services/articleService";
import { getProducts } from "../services/productService";

import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";

const Home = () => {
  const [tractors, setTractors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadHomeData = async () => {
      try {
        const [tractorRes, articleRes, productRes] = await Promise.all([
          getTractors(0, 8),
          getArticles(0, 4),
          getProducts(0, 4),
        ]);

        setTractors(tractorRes.content || []);
        setArticles(articleRes.content || []);
        setProducts(productRes.content || []);
      } catch (err) {
        console.error("Home page loading failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (

<>
<Helmet>
  <title>
    Namaste Tractor - Tractor Prices, Specs & Farming Articles
  </title>

  <meta
    name="description"
    content="Explore tractor prices, specifications, farming products and latest agriculture articles on Namaste Tractor."
  />
</Helmet>

    
    <div className="min-h-screen bg-[#F4F7F4] overflow-x-hidden">

      <Navbar />

      {/* HERO */}
      <ExploreSection />

      <br />

      {/* TRACTORS */}
      <section className="bg-gradient-to-b from-[#EEF4EF] to-[#F4F7F4] py-5">

        <div className="px-4 mb-4">

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#5C7A6D] font-black mb-1">
            Explore
          </p>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Popular Tractors
          </h2>

        </div>

        <HorizontalTractorSection
          tractors={tractors}
          loading={loading}
        />

        <div className="px-4 mt-5">
          <Link
            to="/tractors"
            className="w-full flex items-center justify-center bg-[#0F3D2E] text-white py-3 rounded-lg font-black text-sm tracking-wide"
          >
            View All Tractors
          </Link>
        </div>

      </section>

      <br />

      {/* ARTICLES */}
      <section className="bg-gradient-to-b from-[#FFF6F7] to-[#F4F7F4] py-5">

        <div className="px-4 mb-4">

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C26D7C] font-black mb-1">
            Farming News
          </p>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Latest Articles
          </h2>

        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 px-4 no-scrollbar snap-x snap-mandatory">

          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[255px] max-w-[255px] shrink-0 snap-start"
                >
                  <SkeletonCard />
                </div>
              ))
            : articles.map((article) => (
                <div
                  key={article.id}
                  className="min-w-[255px] max-w-[255px] shrink-0 snap-start"
                >
                  <ArticleCard data={article} />
                </div>
              ))}

        </div>

        <div className="px-4 mt-5">
          <Link
            to="/articles"
            className="w-full flex items-center justify-center bg-[#C26D7C] text-white py-3 rounded-lg font-black text-sm tracking-wide"
          >
            View All Articles
          </Link>
        </div>

      </section>

      <br />

      {/* PRODUCTS */}
      <section className="bg-gradient-to-b from-[#F2F6EA] to-[#F4F7F4] py-5">

        <div className="px-4 mb-4">

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A8D3B] font-black mb-1">
            Marketplace
          </p>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Farm Products
          </h2>

        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 px-4 no-scrollbar snap-x snap-mandatory">

          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[240px] max-w-[240px] shrink-0 snap-start"
                >
                  <SkeletonCard />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[240px] max-w-[240px] shrink-0 snap-start"
                >
                  <ProductCard data={product} />
                </div>
              ))}

        </div>

        <div className="px-4 mt-5">
          <Link
            to="/products"
            className="w-full flex items-center justify-center bg-[#6B7C2F] text-white py-3 rounded-lg font-black text-sm tracking-wide"
          >
            View All Products
          </Link>
        </div>

      </section>

      <br />

      {/* ENQUIRY */}
      
      <div className="px-4 pt-2 pb-12">
        <EnquiryForm />
      </div>

    </div>
    </>
  );
};

export default Home;