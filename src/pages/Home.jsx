import React, { useEffect, useState } from "react";

import Navbar from "../component/layout/Navbar";
import ExploreSection from "../component/common/ExploreSection";
import HorizontalTractorSection from "../component/home/HorizontalTractorSection";
import HomeSectionHeader from "../component/home/HomeSectionHeader";
import SkeletonCard from "../component/home/SkeletonCard";
import ArticleCard from "../component/cards/ArticleCard";
import ProductCard from "../component/cards/ProductCard";
import EnquiryForm from "../component/common/EnquiryForm";

import { getTractors } from "../services/tractorService";
import { getArticles } from "../services/articleService";
import { getProducts } from "../services/productService";

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
    <div className="min-h-screen bg-[#F4F7F4] overflow-x-hidden">

      <Navbar />

      {/* HERO + ACTIONS */}
      <ExploreSection />

      {/* TRACTORS */}
      <div className="mt-2">
        <HorizontalTractorSection
          tractors={tractors}
          loading={loading}
        />
      </div>

      {/* ARTICLES */}
      <section className="px-4 py-5">
        <HomeSectionHeader
          title="Latest Articles"
          to="/articles"
          linkText="View All"
        />

        <div className="flex gap-3 overflow-x-auto pb-2 mt-4 no-scrollbar snap-x snap-mandatory">
          {loading
           ? [...Array(4)].map((_, i) => (
        <div
          key={i}
            className="min-w-[270px] max-w-[270px] shrink-0 snap-start"
        >
           <SkeletonCard />
           </div>
         ))
          : articles.map((article) => (
       <div
          key={article.id}
          className="min-w-[270px] max-w-[270px] shrink-0 snap-start"
        >
           <ArticleCard data={article} />
           </div>
         ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-4 py-3">

  <HomeSectionHeader
    title="Farm Products"
    to="/products"
    linkText="View All"
  />

  <div className="flex gap-3 overflow-x-auto pb-2 mt-4 no-scrollbar snap-x snap-mandatory">

    {loading
  ? [...Array(4)].map((_, i) => (
      <div
        key={i}
        className="min-w-[250px] max-w-[250px] shrink-0 snap-start"
      >
        <SkeletonCard />
      </div>
    ))
  : products.map((product) => (
      <div
        key={product.id}
        className="min-w-[250px] max-w-[250px] shrink-0 snap-start"
      >
        <ProductCard
          data={product}
        />
      </div>
    ))}

  </div>

</section>

      {/* TRUST SECTION */}
      <section className="px-4 py-6">
        <div className="bg-gradient-to-br from-[#0F3D2E] to-[#1B5E42] rounded-[2rem] p-5 shadow-lg">

          <p className="text-center text-green-300 text-[11px] uppercase tracking-[0.25em] font-black mb-5">
            Trusted By Farmers
          </p>

          <div className="grid grid-cols-2 gap-3">

            {[
              {
                icon: "🚜",
                label: "New Tractors",
              },
              {
                icon: "📞",
                label: "Support",
              },
              {
                icon: "💰",
                label: "Sell Products",
              },
              {
                icon: "🌾",
                label: "Farming Tips",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-2">
                  {item.icon}
                </div>

                <p className="text-white text-sm font-bold">
                  {item.label}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <div className="px-4 pt-2 pb-12">
        <EnquiryForm />
      </div>

    </div>
  );
};

export default Home;