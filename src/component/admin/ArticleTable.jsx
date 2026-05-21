import React from "react";

export default function ArticleTable({
  articles,
  loading,
  page,
  totalPages,
  setPage,
  onDelete,
}) {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Loading articles data...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white">
            <div className="text-6xl mb-3"> can 📰</div>
            <p className="text-base font-bold text-gray-800">No articles found</p>
          </div>
        ) : (
          /* Responsive Scroll Wrapper Prevent Overlaps */
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[750px] border-collapse text-left">
              
              {/* Table Header Section with clean dark layout mapping */}
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[50%]">Article Content</th>
                  <th className="px-6 py-4 w-[20%]">Author</th>
                  <th className="px-6 py-4 w-[15%]">Created Date</th>
                  <th className="px-6 py-4 w-[15%] text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Rows Body Layer */}
              <tbody className="divide-y divide-gray-100 bg-white">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* COLUMN 1: IMAGE + TITLE + SHORT DESCRIPTION (FIXED OVERFLOW) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {article.mainImageUrl ? (
                          <img
                            src={article.mainImageUrl}
                            alt=""
                            loading="lazy"
                            className="w-20 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                            📰
                          </div>
                        )}

                        {/* Title and Short Description Text Constraint Blocks */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold text-gray-900 truncate leading-snug">
                            {article.title || "Untitled Draft"}
                          </h4>
                          <p className="text-gray-400 text-xs font-medium truncate mt-1">
                            {article.shortDescription || "No short brief log summary added..."}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COLUMN 2: AUTHOR VERIFICATION TAG */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-green-50 border border-green-100 text-green-700 text-[10px] font-black flex items-center justify-center rounded-xl uppercase shrink-0">
                          {article.author ? article.author[0] : "A"}
                        </div>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[140px]">
                          {article.author || "Community Admin"}
                        </span>
                      </div>
                    </td>

                    {/* COLUMN 3: TIMESTAMP DATE STRINGS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* COLUMN 4: CRITICAL OPERATION BUTTON MODULE */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          if (window.confirm("Verre, are you sure you want to delete this article?")) {
                            onDelete(article);
                          }
                        }}
                        className="bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-100 px-4 py-1.5 rounded-xl transition text-xs font-extrabold uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CENTRAL PAGINATION SYSTEM CONTROLS (ROUNDED MODES) ───────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-40 transition"
          >
            Prev
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl font-black text-xs transition border ${
                  page === i
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}