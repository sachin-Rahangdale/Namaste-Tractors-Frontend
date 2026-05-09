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
      <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>

            Loading articles...
          </div>
        ) : articles.length ===
          0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="text-7xl mb-4">
              📰
            </div>

            <p className="text-xl">
              No articles found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0b1120]">
                <tr className="text-slate-400 uppercase text-sm">
                  <th className="px-6 py-4 text-left">
                    Article
                  </th>

                  <th className="px-6 py-4 text-left">
                    Author
                  </th>

                  <th className="px-6 py-4 text-left">
                    Created
                  </th>

                  <th className="px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {articles.map(
                  (article) => (
                    <tr
                      key={
                        article.id
                      }
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      {/* ARTICLE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {article.mainImageUrl ? (
                            <img
                              src={
                                article.mainImageUrl
                              }
                              alt={
                                article.title
                              }
                              className="w-24 h-16 rounded-xl object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-24 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                              📰
                            </div>
                          )}

                          <div className="max-w-[500px]">
                            <p className="text-white font-bold text-lg line-clamp-2">
                              {
                                article.title
                              }
                            </p>

                            <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                              {
                                article.shortDescription
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* AUTHOR */}
                      <td className="px-6 py-5">
                        <span className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {
                            article.author
                          }
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-slate-300">
                        {new Date(
                          article.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month:
                              "short",
                            year:
                              "numeric",
                          }
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() =>
                            onDelete(
                              article
                            )
                          }
                          className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 px-4 py-2 rounded-xl transition font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={page === 0}
            onClick={() =>
              setPage((p) => p - 1)
            }
            className="px-5 py-3 rounded-xl bg-[#111827] border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setPage(i)
                }
                className={`w-11 h-11 rounded-xl font-bold transition
                ${
                  page === i
                    ? "bg-yellow-500 text-black"
                    : "bg-[#111827] border border-slate-800 text-slate-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            disabled={
              page >=
              totalPages - 1
            }
            onClick={() =>
              setPage((p) => p + 1)
            }
            className="px-5 py-3 rounded-xl bg-[#111827] border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

