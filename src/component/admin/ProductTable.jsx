
export default function ProductTable({
  products,
  loading,
  page,
  totalPages,
  setPage,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>

            Loading products...
          </div>
        ) : products.length ===
          0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <div className="text-7xl mb-4">
              📦
            </div>

            <p className="text-xl">
              No products found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0b1120]">
                <tr className="text-slate-400 uppercase text-sm">
                  <th className="px-6 py-4 text-left">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left">
                    City
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
                {products.map(
                  (product) => (
                    <tr
                      key={
                        product.id
                      }
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      {/* PRODUCT */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {product.imageUrl ? (
                            <img
                              src={
                                product.imageUrl
                              }
                              alt={
                                product.productName
                              }
                              className="w-24 h-20 rounded-2xl object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-24 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}

                          <div className="max-w-[400px]">
                            <p className="text-white font-bold text-lg line-clamp-2">
                              {
                                product.productName
                              }
                            </p>

                            <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                              {
                                product.description
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5">
                        <span className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {
                            product.category
                          }
                        </span>
                      </td>

                      {/* CITY */}
                      <td className="px-6 py-5 text-slate-300">
                        {
                          product.city
                        }
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-5 text-white font-bold text-lg">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <span className="text-sm text-slate-400 ml-2">
                          /
                          {
                            product.unit
                          }
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              onEdit(
                                product
                              )
                            }
                            className="bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 px-4 py-2 rounded-xl transition font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              onDelete(
                                product
                              )
                            }
                            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 px-4 py-2 rounded-xl transition font-medium"
                          >
                            Delete
                          </button>
                        </div>
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
