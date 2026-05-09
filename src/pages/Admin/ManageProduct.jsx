import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import ProductTable from "../../component/admin/ProductTable";

import ProductEditDrawer from "../../component/admin/ProductEditDrawer";

export default function ManageProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [editTarget, setEditTarget] =
    useState(null);

  // ================= LOAD =================
  const loadProducts =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getProducts(
            page,
            10
          );

        setProducts(
          data.content ?? []
        );

        setTotalPages(
          data.totalPages ?? 1
        );
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
          p.productName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          p.city
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      )
    : products;

  // ================= UPDATE =================
  const handleUpdate =
    async (payload) => {
      try {
        await updateProduct(
          editTarget.id,
          payload
        );

        setEditTarget(null);

        loadProducts();
      } catch (e) {
        console.error(e);
      }
    };

  // ================= DELETE =================
  const handleDelete =
    async (product) => {
      const confirmDelete =
        window.confirm(
          `Delete "${product.productName}" ?`
        );

      if (!confirmDelete) return;

      try {
        await deleteProduct(
          product.id
        );

        loadProducts();
      } catch (e) {
        console.error(e);
      }
    };

  return (
    <div className="h-full bg-[#0b1120] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              Product Management
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Manage marketplace
              listings
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search product or city..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full md:w-[420px] bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl text-lg"
          />

          <div className="flex items-center text-slate-400 text-lg">
            {filtered.length} products
            found
          </div>
        </div>

        {/* TABLE */}
        <ProductTable
          products={filtered}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          onEdit={
            setEditTarget
          }
          onDelete={
            handleDelete
          }
        />

        {/* EDIT */}
        {editTarget && (
          <ProductEditDrawer
            product={
              editTarget
            }
            onClose={() =>
              setEditTarget(
                null
              )
            }
            onSubmit={
              handleUpdate
            }
          />
        )}
      </div>
    </div>
  );
}