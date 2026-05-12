import { useRef, useState } from "react";

export default function ArticleForm({
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [articleType, setArticleType] =
    useState("TRACTOR_REVIEWS");

  const [mainImage, setMainImage] =
    useState(null);

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const galleryRef = useRef();

  // ================= GALLERY =================
  const handleGalleryFiles = (
    files
  ) => {
    setGalleryImages([
      ...galleryImages,
      ...Array.from(files),
    ]);
  };

  const removeGalleryImage = (
    index
  ) => {
    setGalleryImages(
      galleryImages.filter(
        (_, i) => i !== index
      )
    );
  };

  // ================= SUBMIT =================
  const submit = async () => {
    if (
      !title ||
      !content ||
      !mainImage
    ) {
      alert(
        "Title, content and main image are required"
      );
      return;
    }

    setLoading(true);

    try {
      await onSubmit(
        {
          title,
          content,
          articleType,
          mainImage,
        },
        galleryImages
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-5xl h-screen bg-[#0b1120] border-l border-slate-800 overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-[#0b1120] border-b border-slate-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white">
              Create Article
            </h2>

            <p className="text-slate-400 mt-2">
              Publish article and
              upload images
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
          {/* TITLE */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Article Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter article title..."
              className="w-full bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl text-lg"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Article Content
            </label>

            <textarea
              rows={12}
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              placeholder="Write article content..."
              className="w-full bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl text-lg resize-none"
            />
          </div>

          {/* ARTICLE TYPE */}
<div>
  <label className="block text-white font-semibold mb-3">
    Article Type
  </label>

  <select
    value={articleType}
    onChange={(e) =>
      setArticleType(e.target.value)
    }
    className="
      w-full
      bg-[#111827]
      border
      border-slate-800
      focus:border-yellow-500
      outline-none
      text-white
      px-5
      py-4
      rounded-2xl
      text-lg
      cursor-pointer
    "
  >
    <option value="TRACTOR_REVIEWS">
      Tractor Reviews
    </option>

    <option value="MAINTENANCE_TIPS">
      Maintenance Tips
    </option>

    <option value="NEW_LAUNCHES">
      New Launches
    </option>

    <option value="GOVERNMENT_SCHEMES">
      Government Schemes
    </option>

    <option value="FARMING_ADVICE">
      Farming Advice
    </option>

    <option value="COMPARISONS">
      Comparisons
    </option>
  </select>
</div>

          {/* MAIN IMAGE */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Main Thumbnail Image
            </label>

            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setMainImage(
                    e.target.files[0]
                  )
                }
                className="text-slate-300"
              />

              {mainImage && (
                <img
                  src={URL.createObjectURL(
                    mainImage
                  )}
                  alt=""
                  className="mt-5 w-full max-h-[350px] object-cover rounded-2xl"
                />
              )}
            </div>
          </div>

          {/* GALLERY */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-semibold">
                Gallery Images
              </label>

              <button
                onClick={() =>
                  galleryRef.current.click()
                }
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold transition"
              >
                + Add Images
              </button>
            </div>

            <input
              ref={galleryRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) =>
                handleGalleryFiles(
                  e.target.files
                )
              }
            />

            {galleryImages.length ===
            0 ? (
              <div className="border-2 border-dashed border-slate-700 rounded-3xl p-10 text-center text-slate-500 bg-[#111827]">
                No gallery images
                selected
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map(
                  (img, index) => (
                    <div
                      key={index}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(
                          img
                        )}
                        alt=""
                        className="w-full h-40 object-cover rounded-2xl border border-slate-800"
                      />

                      <button
                        onClick={() =>
                          removeGalleryImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white w-8 h-8 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
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
            className="px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
          >
            {loading
              ? "Publishing..."
              : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
