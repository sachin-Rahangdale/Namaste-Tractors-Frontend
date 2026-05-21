import { useCallback, useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

import { getArticles } from "../../services/articleService";
import api from "../../api/axios";

import ArticleTable from "../../component/admin/ArticleTable";
import ArticleForm from "../../component/admin/ArticleForm";

const compressImage = async (file) => {
  if (!file) return null;
  try {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  } catch (err) {
    console.error("Compression error:", err);
    return file;
  }
};

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // ================= LOAD ARTICLES =================
  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles(page, 10);
      setArticles(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error("Failed to load articles:", e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // ================= SEARCH =================
  const filtered = search
    ? articles.filter((a) =>
        a.title?.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  // ================= CREATE =================
  const handleCreate = async (form, galleryImages) => {
    try {
      // MAIN ARTICLE FORM DATA PIPELINE
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("articleType", form.articleType);

      if (form.mainImage) {
        const compressedMainImage = await compressImage(form.mainImage);
        formData.append("mainImage", compressedMainImage);
      }

      const createRes = await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const articleId = createRes.data?.id;

      // GALLERY IMAGES BATCH PROCESSING
      if (articleId && galleryImages && galleryImages.length > 0) {
        const galleryForm = new FormData();

        for (const img of galleryImages) {
          const fileToCompress = img.file || img; // Fallback handle checking structures
          if (fileToCompress instanceof File) {
            const compressed = await compressImage(fileToCompress);
            galleryForm.append("images", compressed);
          }
        }

        await api.post(`/articles/${articleId}/images`, galleryForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      loadArticles();
    } catch (e) {
      console.error("Error creating article profile ecosystem:", e);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (article) => {
    try {
      await api.delete(`/articles/${article.id}`);
      loadArticles();
    } catch (e) {
      console.error("Deletion lifecycle failure:", e);
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* ── HEADER PANEL BLOCK (PREMIUM RECTANGLE CURVES) ───────────────────── */}
        <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              Article <span className="text-green-600 NOT-italic">Management</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Draft, edit, or publish insights, farm logs and guide blogs
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.98] self-start sm:self-auto"
          >
            + Add Article
          </button>
        </div>

        {/* ── SEARCH FILTERS ROW ────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Search by article title string..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
            {filtered.length} insights entries indexed
          </div>
        </div>

        {/* ── DATA LIST TABLE WRAPPER ───────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-1 sm:p-2">
          <ArticleTable
            articles={filtered}
            loading={loading}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            onDelete={handleDelete}
          />
        </div>

        {/* ── INPUT MODAL PANEL LAYOUT ─────────────────────────────────────────── */}
        {showForm && (
          <ArticleForm
            onCancel={() => setShowForm(false)}
            onSubmit={handleCreate}
          />
        )}

        {/* Backdrop modal blur mask to ensure strong contrast layouts focus */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" />
        )}

      </div>
    </div>
  );
}