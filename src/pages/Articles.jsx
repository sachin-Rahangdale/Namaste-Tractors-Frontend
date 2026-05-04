import React, { useState, useEffect } from "react";
import Navbar from "../component/layout/Navbar";
import ArticleCard from "../component/cards/ArticleCard";
import EnquiryForm from "../component/common/EnquiryForm";
import { getArticles } from "../services/articleService";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      setLoading(true);
      try {
        const data = await getArticles(0, 12);
        setArticles(data.content);
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllArticles();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HEADER SECTION */}
      <header className="bg-slate-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
            Farming <span className="text-green-600">Insights</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Stay updated with the latest tractor launches, maintenance tips, and agricultural news from Namaste Tractor.
          </p>
        </div>
      </header>

      {/* ARTICLES GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} data={article} />
            ))}
          </div>
        )}

        {articles.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg italic">No articles published yet. Check back soon!</p>
          </div>
        )}
      </main>

      {/* SUGGESTION / ENQUIRY SECTION */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Confused About Which Tractor to Buy?</h2>
            <p className="text-slate-400 text-lg">
              Our experts can provide personalized suggestions based on your soil type and budget. 
              Fill out the form below and we'll get in touch!
            </p>
          </div>
          
          {/* Form with pre-filled Suggestion intent */}
          <div className="bg-white rounded-3xl p-2 shadow-2xl">
            <EnquiryForm 
              defaultType="Need Suggestion" 
              defaultMessage="I am looking for expert suggestions for my next tractor purchase."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Articles;