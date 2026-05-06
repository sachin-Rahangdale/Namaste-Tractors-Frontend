import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Card from "../component/cards/Card"; 
import EnquiryForm from "../component/common/EnquiryForm";
// Added missing service imports
import { 
  getArticleBySlug, 
  getArticleComments, 
  getArticles,  
  postComment 
} from "../services/articleService";

const ArticleDetail = () => {
  const { slug } = useParams(); // Using slug from URL
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [newComment, setNewComment] = useState({ name: "", content: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch article by slug
      const data = await getArticleBySlug(slug);
      setArticle(data);
      
      // Fetch initial comments
      const commentData = await getArticleComments(data.id, 0, 10);
      setComments(commentData.content || []);
      
      // Fetch related articles
      const related = await getArticles(0, 6);
      setRelatedArticles(related.content.filter(a => a.id !== data.id));
    } catch (err) {
      console.error("Error loading article:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await postComment(article.id, newComment); // Post new comment
      setNewComment({ name: "", content: "" });
      // Refresh comments
      const commentData = await getArticleComments(article.id, 0, 10);
      setComments(commentData.content);
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      const res = await getArticles(nextPage, 4);
      setRelatedArticles([...relatedArticles, ...res.content]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-green-600 font-bold text-xl uppercase tracking-widest">Loading Namaste Tractor Insights...</div>;
  if (!article) return <div className="text-center py-20 font-bold text-red-500">Article not found.</div>;

  // Interleave logic: 1 image every 2 paragraphs, remaining before last para
  const renderContent = () => {
    const paragraphs = article.content.split('\n').filter(p => p.trim() !== "");
    const galleryImages = [...(article.images || [])];
    const contentElements = [];

    paragraphs.forEach((para, index) => {
      contentElements.push(
        <p key={`p-${index}`} className="text-gray-700 text-lg leading-relaxed mb-8">
          {para}
        </p>
      );

      // Rule: Every 2 paragraphs, insert 1 image
      if ((index + 1) % 2 === 0 && galleryImages.length > 0) {
        const imgUrl = galleryImages.shift();
        contentElements.push(
          <div key={`img-${index}`} className="my-10 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
            <img src={imgUrl} alt="Visual Detail" className="w-full h-full object-cover" />
          </div>
        );
      }

      // Rule: Remaining images before the final paragraph
      if (index === paragraphs.length - 2 && galleryImages.length > 0) {
        while (galleryImages.length > 0) {
          const imgUrl = galleryImages.shift();
          contentElements.push(
            <div key={`remaining-${galleryImages.length}`} className="my-10 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img src={imgUrl} alt="Additional Detail" className="w-full h-full object-cover" />
            </div>
          );
        }
      }
    });

    return contentElements;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <article className="max-w-5xl mx-auto px-4 py-12">
        {/* HEADER */}
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="bg-green-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100">
               Market Analysis
            </span>
            <span className="text-gray-400 font-bold text-sm">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-12 tracking-tighter">
            {article.title}
          </h1>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-video mb-12 transform hover:scale-[1.01] transition duration-700">
            <img src={article.mainImageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </header>

        {/* CONTENT */}
        <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-xl border border-gray-100 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="relative z-10">
            {renderContent()}
          </div>
        </div>

        {/* COMMENT SECTION */}
        <section className="mb-24 bg-white rounded-[3rem] p-10 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-black text-slate-900 mb-10 italic">Discussion ({comments.length})</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-12 space-y-4">
            <input 
              type="text" placeholder="Your Name" required
              className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
              value={newComment.name}
              onChange={(e) => setNewComment({...newComment, name: e.target.value})}
            />
            <textarea 
              placeholder="Join the discussion..." required
              className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 h-32"
              value={newComment.content}
              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
            />
            <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg">
              Post Thought
            </button>
          </form>

          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="p-6 bg-slate-50 rounded-3xl border-l-4 border-green-500">
                <p className="font-black text-slate-900 mb-2 uppercase text-sm tracking-widest">{c.name}</p>
                <p className="text-slate-600 leading-relaxed">{c.content}</p>
                <p className="text-[10px] text-gray-400 mt-3 font-bold">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED ARTICLES */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">Recommended Reads</h2>
            <div className="flex-grow h-[2px] bg-green-100 ml-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {relatedArticles.map(a => (
              <div key={a.id} className="group cursor-pointer bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition duration-500" onClick={() => navigate(`/articles/${a.slug}`)}>
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
                  <img src={a.mainImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={a.title} />
                </div>
                <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-green-600 transition px-2">
                  {a.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-16 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-green-600 transition-all uppercase text-xs tracking-[0.3em] shadow-2xl"
            >
              Explore Full Library
            </button>
          </div>
        </section>

        {/* ENQUIRY SECTION */}
        <section className="bg-slate-900 py-24 rounded-[4rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white italic tracking-tight">Need Expert Suggestions?</h2>
              <p className="text-slate-400 mt-4 text-lg">Our specialists are standing by to analyze your field requirements.</p>
            </div>
            <div className="bg-white rounded-[3.5rem] p-4 shadow-2xl">
              <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-gray-100">
                <EnquiryForm defaultType="Need Suggestion" />
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default ArticleDetail;