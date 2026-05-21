import { useCallback, useEffect, useState } from "react";

import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import ProductTable from "../../component/admin/ProductTable";
import ProductEditDrawer from "../../component/admin/ProductEditDrawer";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editTarget, setEditTarget] = useState(null);

  // ================= LOAD =================
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(page, 10);
      setProducts(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ================= SEARCH =================
  const filtered = search
    ? products.filter(
        (p) =>
          p.productName?.toLowerCase().includes(search.toLowerCase()) ||
          p.city?.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  // ================= UPDATE =================
  const handleUpdate = async (payload) => {
    try {
      await updateProduct(editTarget.id, payload);
      setEditTarget(null);
      loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(`Delete "${product.productName}" ?`);
    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* HEADER PANEL (PREMIUM CURVES TINT) */}
        <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              Product <span className="text-green-600 NOT-italic">Inventory</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Manage used machinery, crops, and vegetable marketplace listings
            </p>
          </div>
        </div>

        {/* SEARCH BAR PANEL */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Search product or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
            {filtered.length} listings found
          </div>
        </div>

        {/* TABLE CONTAINER BLOCK */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-1 sm:p-2">
          <ProductTable
            products={filtered}
            loading={loading}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            onEdit={setEditTarget}
            onDelete={handleDelete}
          />
        </div>

        {/* DRAWER BACKGROUND OVERLAY MASK */}
        {editTarget && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setEditTarget(null)} />
            <ProductEditDrawer
              product={editTarget}
              onClose={() => setEditTarget(null)}
              onSubmit={handleUpdate}
            />
          </>
        )}
      </div>
    </div>
  );
}