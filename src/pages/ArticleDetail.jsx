import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [article, setArticle]           = useState(null);
  const [comments, setComments]         = useState([]);
  const [relatedArticles, setRelated]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [newComment, setNewComment]     = useState({ name: "", content: "" });
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getArticleBySlug(slug);
      setArticle(data);

      const commentData = await getArticleComments(data.id, 0, 10);
      setComments(commentData.content || []);

      const related = await getArticles(0, 4);
      setRelated((related.content || []).filter((a) => a.id !== data.id).slice(0, 3));
    } catch (err) {
      console.error("Error loading article:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postComment(article.id, newComment);
      setNewComment({ name: "", content: "" });
      const commentData = await getArticleComments(article.id, 0, 10);
      setComments(commentData.content || []);
    } catch {
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * -0.15}s` }}
            />
          ))}
        </div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Loading Article...
        </p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Article Not Found
            </h2>
            <p className="text-slate-400 font-medium text-sm">
              This article doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/articles")}
              className="mt-4 bg-slate-900 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Back to Insights →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isValidDate =
    article.createdAt && new Date(article.createdAt).getFullYear() > 2000;

  /* ── Render body content, weaving in gallery images ── */
  const renderContent = () => {
    const paragraphs = article.content.split("\n").filter((p) => p.trim() !== "");
    const gallery = [...(article.images || [])];
    const elements = [];

    paragraphs.forEach((para, idx) => {
      elements.push(
        <p key={`p-${idx}`} className="text-slate-700 text-base md:text-lg leading-relaxed mb-6">
          {para}
        </p>
      );
      if ((idx + 1) % 2 === 0 && gallery.length > 0) {
        const imgUrl = gallery.shift();
        elements.push(
          <div key={`img-${idx}`} className="my-10 rounded-[2rem] overflow-hidden border border-slate-100 shadow-md aspect-video">
            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          </div>
        );
      }
    });

    while (gallery.length > 0) {
      const imgUrl = gallery.shift();
      elements.push(
        <div key={`rem-${gallery.length}`} className="my-10 rounded-[2rem] overflow-hidden border border-slate-100 shadow-md aspect-video">
          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <button onClick={() => navigate("/")} className="hover:text-green-600 transition-colors">Home</button>
          <span className="opacity-30">/</span>
          <button onClick={() => navigate("/articles")} className="hover:text-green-600 transition-colors">Articles</button>
          <span className="opacity-30">/</span>
          <span className="text-slate-700 line-clamp-1 lowercase">{article.title}</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 lg:px-10 space-y-10">

        {/* ══════════════ HERO ══════════════ */}
        <header className="space-y-6">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3">
            {article.category && (
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-green-600 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                {article.category}
              </span>
            )}
            {isValidDate && (
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {new Date(article.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.95]">
            {article.title}
          </h1>

          {/* Author row */}
          {article.author && (
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase">
                {article.author[0]}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">{article.author}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Author</p>
              </div>
            </div>
          )}

          {/* Cover image */}
          {article.mainImageUrl && (
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 aspect-[16/8]">
              <img
                src={article.mainImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* ══════════════ ARTICLE BODY ══════════════ */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/30 p-8 md:p-14">
          {renderContent()}
        </div>

        {/* ══════════════ COMMENTS ══════════════ */}
        <section>
          <div className="flex items-center gap-5 mb-8">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Discussion
            </h2>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-xl">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Comment Form */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 p-8 mb-8">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
              Leave a Comment
            </p>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                required
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-green-500 outline-none text-slate-900 text-sm font-bold px-5 py-4 rounded-2xl transition-all"
              />
              <textarea
                placeholder="Share your thoughts..."
                required
                rows={4}
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-green-500 outline-none text-slate-900 text-sm font-bold px-5 py-4 rounded-2xl transition-all resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 hover:bg-green-600 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                {submitting ? "Posting..." : "Post Comment →"}
              </button>
            </form>
          </div>

          {/* Comment List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex gap-5 shadow-sm">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase">
                    {c.name?.[0] || "A"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-wider">{c.name}</p>
                      <span className="text-slate-200">·</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short",
                        })}
                      </p>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-slate-100">
              <p className="text-slate-300 text-4xl mb-3">💬</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No comments yet — be the first!
              </p>
            </div>
          )}
        </section>

        {/* ══════════════ RELATED ARTICLES ══════════════ */}
        {relatedArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  Recommended <span className="text-green-600">Reads</span>
                </h2>
                <div className="h-px w-16 bg-slate-200" />
              </div>
              <button
                onClick={() => navigate("/articles")}
                className="text-[9px] font-black text-slate-400 hover:text-green-600 uppercase tracking-widest transition-colors"
              >
                All Articles →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} data={a} />
              ))}
            </div>
          </section>
        )}

        {/* ══════════════ ENQUIRY ══════════════ */}
        <section id="enquiry-form" className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row">
          {/* Left panel */}
          <div className="lg:w-5/12 bg-slate-900 p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-green-500 rounded-full mix-blend-overlay blur-3xl opacity-15 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-green-400 border border-green-500/30 bg-green-500/10 px-4 py-2 rounded-xl">
                Expert Guidance
              </span>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
                Have Questions?{" "}
                <span className="text-green-400">Ask Our Experts</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you need farming advice or want to know which tractor fits your land, the Namaste Tractor team is here to guide you.
              </p>
              <div className="space-y-4 pt-2">
                {["Free Expert Consultation", "Tractor Recommendations", "Finance Guidance"].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400 text-xs font-black">✓</div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:w-7/12 p-8 lg:p-14 bg-slate-50 flex items-center">
            <div className="w-full">
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