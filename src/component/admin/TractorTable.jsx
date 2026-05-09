export default function TractorTable({
  tractors,
  loading,
  page,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  brands,
}) {
  const brandName = (id) =>
    brands.find(
      (b) =>
        String(b.id) === String(id)
    )?.name ?? "-";

  return (
    <>
      <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>

            Loading tractors...
          </div>
        ) : tractors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="text-7xl mb-4">
              🚜
            </div>

            <p className="text-xl">
              No tractors found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0b1120]">
                <tr className="text-slate-400 uppercase text-sm">
                  <th className="px-6 py-4 text-left">
                    Model
                  </th>

                  <th className="px-6 py-4 text-left">
                    Brand
                  </th>

                  <th className="px-6 py-4 text-left">
                    HP
                  </th>

                  <th className="px-6 py-4 text-left">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tractors.map((t) => {
                  const mainImg =
                    t.images?.find(
                      (i) =>
                        i.imageType ===
                        "MAIN"
                    );

                  return (
                    <tr
                      key={t.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {mainImg ? (
                            <img
                              src={
                                mainImg.imageUrl
                              }
                              alt={t.model}
                              className="w-20 h-16 rounded-xl object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-20 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                              🚜
                            </div>
                          )}

                          <div>
                            <p className="text-white font-bold text-lg">
                              {t.model}
                            </p>

                            <p className="text-slate-500 text-xs mt-1">
                              ID: {t.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {t.brand ??
                            brandName(
                              t.brandId
                            )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {t.hp} HP
                        </span>
                      </td>

                      <td className="px-6 py-5 text-white font-semibold text-lg">
                        ₹
                        {Number(
                          t.price ?? 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              onEdit(t)
                            }
                            className="bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 px-4 py-2 rounded-xl transition font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              onDelete(t)
                            }
                            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 px-4 py-2 rounded-xl transition font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                onClick={() => setPage(i)}
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
              page >= totalPages - 1
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

