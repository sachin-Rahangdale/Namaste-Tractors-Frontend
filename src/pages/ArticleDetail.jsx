import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import ArticleCard from "../component/cards/ArticleCard";
import EnquiryForm from "../component/common/EnquiryForm";
import {
  getArticleBySlug,
  getArticleComments,
  getArticles,
  postComment,
} from "../services/articleService";

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedArticles, setRelated] = useState([]);
  const [sameTypeArticles, setSameTypeArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ content: "" });
  const [submitting, setSubmitting] = useState(false);

  // Memoized resource pipeline for handling loads at hyper speed
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticleBySlug(slug);
      setArticle(data);

      const commentData = await getArticleComments(data.id, 0, 20);
      setComments(commentData.content || []);

      const related = await getArticles(0, 6);
      const contentList = related.content || [];

      const sameType = contentList
        .filter((a) => a.id !== data.id && a.articleType === data.articleType)
        .slice(0, 4);

      setSameTypeArticles(sameType);
      setRelated(contentList.filter((a) => a.id !== data.id).slice(0, 4));
    } catch (err) {
      console.error("Error loading article:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [loadData]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;
    
    setSubmitting(true);
    try {
      await postComment(article.id, { content: newComment.content });
      setNewComment({ content: "" });
      
      const commentData = await getArticleComments(article.id, 0, 20);
      setComments(commentData.content || []);
    } catch {
      alert("Failed to post comment. Please check if you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#ebe8e3] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-green-700 border-t-transparent animate-spin rounded-none" />
        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-widest">
          Loading Article...
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#ebe8e3] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center space-y-3 bg-white p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              Article Not Found
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              This article doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/articles")}
              className="mt-2 bg-slate-900 hover:bg-green-700 text-white px-6 py-3 rounded-none font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to Insights →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isValidDate = article.createdAt && new Date(article.createdAt).getFullYear() > 2000;

  // Render article paragraphs with completely 100% sharp responsive inline images
  const renderContent = () => {
    const paragraphs = article.content.split("\n").filter((p) => p.trim() !== "");
    const gallery = [...(article.images || [])];
    const elements = [];

    paragraphs.forEach((para, idx) => {
      elements.push(
        <p key={`p-${idx}`} className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed mb-5 font-medium">
          {para}
        </p>
      );
      if ((idx + 1) % 2 === 0 && gallery.length > 0) {
        const imgUrl = gallery.shift();
        elements.push(
          <div key={`img-${idx}`} className="my-6 rounded-none overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-50">
            <img loading="lazy" src={imgUrl} alt="" className="w-full h-full object-cover rounded-none" />
          </div>
        );
      }
    });

    while (gallery.length > 0) {
      const imgUrl = gallery.shift();
      elements.push(
        <div key={`rem-${gallery.length}`} className="my-6 rounded-none overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-50">
          <img loading="lazy" src={imgUrl} alt="" className="w-full h-full object-cover rounded-none" />
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="bg-[#ebe8e3] min-h-screen pb-16">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1140px] mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-2 border border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap no-scrollbar rounded-[2rem]">
          <button onClick={() => navigate("/")} className="hover:text-green-700">Home</button>
          <span className="text-gray-300">/</span>
          <button onClick={() => navigate("/articles")} className="hover:text-green-700">Articles</button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 line-clamp-1 lowercase">{article.title}</span>
        </div>
      </div>

      <main className="max-w-[1140px] mx-auto px-3 sm:px-6 space-y-6">

        {/* ══════════════ HERO LAYOUT ══════════════ */}
        <header className="bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-4 rounded-none shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <span className="text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-none">
                {article.category}
              </span>
            )}
            {isValidDate && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                • {new Date(article.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Author Meta Row */}
          {article.author && (
            <div className="flex items-center gap-2.5 pb-2">
              <div className="w-8 h-8 rounded-none bg-gray-900 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                {article.author[0]}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 tracking-wide uppercase">{article.author}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Verified Expert</p>
              </div>
            </div>
          )}

          {/* Featured Cover Banner */}
          {article.mainImageUrl && (
            <div className="rounded-none overflow-hidden border border-gray-200 shadow-sm aspect-[16/9] sm:aspect-[16/8] bg-gray-50">
              <img
                loading="eager" // Load first priority frame asset instantly
                src={article.mainImageUrl}
                alt={article.title}
                className="w-full h-full object-cover rounded-none"
              />
            </div>
          )}
        </header>

        {/* ══════════════ ARTICLE BODY READOUT ══════════════ */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm p-4 sm:p-8 md:p-12">
          {renderContent()}
        </div>

        {/* ══════════════ DISCUSSION BLOCK (YOUTUBE LAYOUT) ══════════════ */}
        <section className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-none shadow-sm">
          <div className="flex items-baseline gap-2 mb-6 border-b border-gray-100 pb-3">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
              Comments
            </h2>
            <span className="text-xs font-bold text-gray-400">
              ({comments.length})
            </span>
          </div>

          {/* YouTube Input Box Integration */}
          <div className="flex gap-3 mb-8 items-start">
            <div className="w-8 h-8 bg-green-700 text-white text-xs font-black flex items-center justify-center rounded-none shrink-0 uppercase">
              Y
            </div>
            <form onSubmit={handleCommentSubmit} className="flex-1">
              <textarea
                placeholder="Add a public comment..."
                required
                rows={2}
                value={newComment.content}
                onChange={(e) => setNewComment({ content: e.target.value })}
                className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none text-gray-900 text-sm py-1 font-medium transition-all resize-none placeholder:text-gray-400"
              />
              {newComment.content.trim() && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setNewComment({ content: "" })}
                    className="text-gray-500 font-bold text-xs px-3 py-1.5 hover:bg-gray-100 transition-all rounded-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-1.5 rounded-none font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    {submitting ? "Commenting..." : "Comment"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Comment Thread Matrix */}
          <div className="space-y-5">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="flex gap-3 items-start border-b border-gray-50 pb-4 last:border-none last:pb-0">
                  {/* YouTube Circular-vibe Sharp Profile Slot */}
                  <div className="w-8 h-8 shrink-0 rounded-none bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-extrabold text-xs uppercase">
                    {c.name?.[0] || "U"}
                  </div>

                  {/* Comment Details Row */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <p className="text-xs font-black text-gray-900">
                        @{c.name?.toLowerCase().replaceAll(" ", "") || "user"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold">
                        • {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-gray-800 text-xs sm:text-sm leading-relaxed font-medium">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50/50 border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  No comments yet. Be the first to share!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── MOBILE OPTIMIZED TWIN-GRID RECS ────────────────────────────────── */}
        {sameTypeArticles.length > 0 && (
          <section className="border-t border-gray-200/40 pt-6">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">
              More In <span className="text-green-700">{article.articleType?.replaceAll("_", " ")}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {sameTypeArticles.map((a) => (
                <ArticleCard key={a.id} data={a} />
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-200/40 pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
                Recommended <span className="text-green-700">Reads</span>
              </h2>
              <button
                onClick={() => { navigate("/articles"); window.scrollTo(0, 0); }}
                className="text-[10px] font-black text-gray-400 hover:text-green-700 uppercase tracking-widest"
              >
                All →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} data={a} />
              ))}
            </div>
          </section>
        )}

        {/* ── SHARP ENQUIRY SECTION ── */}
        <section id="enquiry-form" className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm flex flex-col lg:flex-row w-full">
  {/* Left panel - Content area stays exact */}
  <div className="lg:w-5/12 bg-slate-900 p-6 sm:p-10 flex flex-col justify-center text-white relative shrink-0">
    <span className="inline-block text-[9px] font-black uppercase tracking-widest text-green-400 mb-2">
      Expert Guidance
    </span>
    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight mb-2">
      Have Questions? <span className="text-green-400">Ask Us</span>
    </h2>
    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
      Whether you need farming tips or variant specifications advice, the Namaste Tractor team is here to guide your way.
    </p>
  </div>
  
  {/* Right panel - FORCE CHILD ELEMENTS TO STRETCH AND FILL EXTRA SPACE */}
  <div className="lg:w-7/12 p-6 sm:p-10 bg-gray-50 flex items-center justify-stretch">
    <div className="w-full flex flex-col justify-stretch items-stretch">
      <EnquiryForm
        defaultType="article"
        defaultMessage={`I read the article "${article.title}" and would like to know more.`}
        hideHeader
        transparent
      />
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

export default ArticleDetail;