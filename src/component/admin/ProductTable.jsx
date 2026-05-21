import React from "react";

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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Loading listings matrix...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white">
            <div className="text-6xl mb-3">📦</div>
            <p className="text-base font-bold text-gray-800">No products found</p>
          </div>
        ) : (
          /* Responsive Layout Wrapper Prevention Layer */
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[850px] border-collapse text-left">
              
              {/* Premium Dark Table Header Definition */}
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[40%]">Product Details</th>
                  <th className="px-6 py-4 w-[15%]">Category</th>
                  <th className="px-6 py-4 w-[15%]">City Location</th>
                  <th className="px-6 py-4 w-[15%]">Price Metrics</th>
                  <th className="px-6 py-4 w-[15%] text-right">Actions</th>
                </tr>
              </thead>

              {/* Data Row Mappings Matrix */}
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* COLUMN 1: PRODUCT BRAND THUMBNAIL + TITLE + DETAIL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt=""
                            loading="lazy"
                            className="w-20 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                            📦
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold text-gray-900 truncate leading-snug">
                            {product.productName || "Unnamed Variant"}
                          </h4>
                          <p className="text-gray-400 text-xs font-medium truncate mt-1">
                            {product.description || "No descriptions specified..."}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COLUMN 2: CATEGORY INDICATOR */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                        {product.category}
                      </span>
                    </td>

                    {/* COLUMN 3: CITY DATA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-gray-700 capitalize">
                        {product.city || "On-Field"}
                      </span>
                    </td>

                    {/* COLUMN 4: PRICING + UNIT BLOCK */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                        {product.unit && (
                          <span className="text-gray-400 text-xs font-bold lowercase ml-1">
                            / {product.unit}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* COLUMN 5: UPDATE ACTIONS PANEL */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-xl transition text-xs font-extrabold uppercase tracking-wider"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl transition text-xs font-extrabold uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PAGINATION PIPELINE CONTROLS ROW (ROUNDED LOOK) ─────────────────── */}
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