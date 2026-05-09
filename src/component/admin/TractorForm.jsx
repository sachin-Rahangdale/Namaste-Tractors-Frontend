import { useRef, useState } from "react";

const IMAGE_TYPES = ["MAIN", "GALLERY"];

const SPEC_FIELDS = [
  { key: "clutch", label: "Clutch", type: "text" },
  { key: "steering", label: "Steering", type: "text" },
  { key: "gearbox", label: "Gearbox", type: "text" },
  { key: "brakes", label: "Brakes", type: "text" },
  { key: "torque", label: "Torque", type: "number" },
  { key: "ptoHp", label: "PTO HP", type: "text" },
];

export default function TractorForm({
  initial,
  brands,
  onSubmit,
  onCancel,
  isEdit,
}) {
  const [form, setForm] =
    useState(initial);

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const inputRef = useRef();

  const set = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: value,
    }));

  const setSpec = (key, value) =>
    setForm((f) => ({
      ...f,
      specification: {
        ...f.specification,
        [key]: value,
      },
    }));

const handleFiles = (files) => {
  const hasMainAlready =
    images.some(
      (img) => img.type === "MAIN"
    );

  const newImgs = Array.from(files).map(
    (file, index) => ({
      file,
      preview: URL.createObjectURL(file),

      // ONLY FIRST IMAGE SHOULD BE MAIN
      type:
        !hasMainAlready && index === 0
          ? "MAIN"
          : "GALLERY",

      id: Math.random()
        .toString(36)
        .slice(2),
    })
  );

  setImages([
    ...images,
    ...newImgs,
  ]);
};


  const removeImage = (id) =>
    setImages(
      images.filter(
        (img) => img.id !== id
      )
    );

  const setType = (id, type) =>
    setImages(
      images.map((img) =>
        img.id === id
          ? { ...img, type }
          : img
      )
    );

  const submit = async () => {
    setLoading(true);

    try {
      await onSubmit(form, images);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-4xl h-screen bg-[#0b1120] border-l border-slate-800 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-[#0b1120] border-b border-slate-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white">
              {isEdit
                ? "Edit Tractor"
                : "Add Tractor"}
            </h2>

            <p className="text-slate-400 mt-2">
              Manage tractor information
            </p>
          </div>

          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-10">
          {/* BASIC */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                placeholder="Model"
                value={form.model}
                onChange={(e) =>
                  set(
                    "model",
                    e.target.value
                  )
                }
                className="bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500"
              />

              <select
                value={form.brandId}
                onChange={(e) =>
                  set(
                    "brandId",
                    e.target.value
                  )
                }
                className="bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="">
                  Select Brand
                </option>

                {brands.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                  >
                    {b.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Horsepower"
                value={form.hp}
                onChange={(e) =>
                  set(
                    "hp",
                    e.target.value
                  )
                }
                className="bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  set(
                    "price",
                    e.target.value
                  )
                }
                className="bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">
              Technical Specifications
            </h3>

            <div className="grid md:grid-cols-3 gap-5">
              {SPEC_FIELDS.map(
                (field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={
                      field.label
                    }
                    value={
                      form
                        .specification[
                        field.key
                      ]
                    }
                    onChange={(e) =>
                      setSpec(
                        field.key,
                        e.target.value
                      )
                    }
                    className="bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500"
                  />
                )
              )}
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">
              Upload Images
            </h3>

            <div
              onClick={() =>
                inputRef.current.click()
              }
              className="border-2 border-dashed border-slate-700 hover:border-yellow-500 rounded-3xl p-10 text-center cursor-pointer transition bg-[#111827]"
            >
              <div className="text-5xl mb-4">
                📸
              </div>

              <p className="text-slate-300 text-lg">
                Drop images here or
                click to browse
              </p>

              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleFiles(
                    e.target.files
                  )
                }
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden"
                  >
                    <img
                      src={img.preview}
                      alt=""
                      className="w-full h-36 object-cover"
                    />

                    <div className="p-3 space-y-3">
                      <select
                        value={img.type}
                        onChange={(e) =>
                          setType(
                            img.id,
                            e.target
                              .value
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      >
                        {IMAGE_TYPES.map(
                          (t) => (
                            <option
                              key={t}
                            >
                              {t}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        onClick={() =>
                          removeImage(
                            img.id
                          )
                        }
                        className="w-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 py-2 rounded-xl transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#0b1120] border-t border-slate-800 p-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Tractor"
              : "Create Tractor"}
          </button>
        </div>
      </div>
    </div>
  );
}

