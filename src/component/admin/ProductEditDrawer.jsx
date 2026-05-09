
import { useState } from "react";

export default function ProductEditDrawer({
  product,
  onClose,
  onSubmit,
}) {
  const [price, setPrice] =
    useState(product.price);

  const [city, setCity] =
    useState(product.city);

  const [description, setDescription] =
    useState(
      product.description
    );

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {
    setLoading(true);

    try {
      await onSubmit({
        price:
          Number(price),
        city,
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl h-screen bg-[#0b1120] border-l border-slate-800 overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-[#0b1120] border-b border-slate-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white">
              Edit Product
            </h2>

            <p className="text-slate-400 mt-2">
              Update product listing
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-8">
          {/* PRODUCT NAME */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Product Name
            </label>

            <input
              disabled
              value={
                product.productName
              }
              className="w-full bg-slate-900 border border-slate-800 text-slate-500 px-5 py-4 rounded-2xl"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="w-full bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block text-white font-semibold mb-3">
              City
            </label>

            <input
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              className="w-full bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Description
            </label>

            <textarea
              rows={8}
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-[#0b1120] border-t border-slate-800 p-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

