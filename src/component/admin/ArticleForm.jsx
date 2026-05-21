import React, { useRef, useState } from "react";

export default function ArticleForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articleType, setArticleType] = useState("TRACTOR_REVIEWS");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const galleryRef = useRef();

  // ================= GALLERY HANDLING =================
  const handleGalleryFiles = (files) => {
    setGalleryImages([
      ...galleryImages,
      ...Array.from(files),
    ]);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // ================= SUBMIT FLOW =================
  const submit = async () => {
    if (!title || !content || !mainImage) {
      alert("Verre, title, content and main image are required!");
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      
      {/* ── DRAWER WORKSPACE CONTAINER (PREMIUM SMOOTH SCROLL LIGHT THEME) ── */}
      <div className="w-full max-w-4xl h-screen bg-white border-l border-gray-200 flex flex-col shadow-2xl transition-all">
        
        {/* HEADER BLOCK TINT */}
        <div className="sticky top-0 z-20 bg-slate-900 px-6 py-5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">
              Create New <span className="text-green-500 NOT-italic">Article</span>
            </h2>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Draft and publish tech logs, guides or machine reviews
            </p>
          </div>

          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* FORM REGISTRATION CORE BODY */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* ARTICLE TITLE INPUT */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Article Heading Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Swaraj 744 XT Long Term Usage Review"
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-semibold transition-all placeholder:text-gray-400"
            />
          </div>

          {/* DYNAMIC ARTICLE SELECT TYPE */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Select Feed Classification Type
            </label>
            <select
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all"
            >
              <option value="TRACTOR_REVIEWS">Tractor Reviews</option>
              <option value="MAINTENANCE_TIPS">Maintenance Tips</option>
              <option value="NEW_LAUNCHES">New Launches</option>
              <option value="GOVERNMENT_SCHEMES">Government Schemes</option>
              <option value="FARMING_ADVICE">Farming Advice</option>
              <option value="COMPARISONS">Comparisons</option>
            </select>
          </div>

          {/* MAIN COVER IMAGE CONTAINER */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Primary Hero Feature Image
            </label>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col items-start gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
              />

              {mainImage && (
                <div className="w-full max-h-[260px] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <img
                    src={URL.createObjectURL(mainImage)}
                    alt="Main Banner Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* COMPACT TEXTAREA BODY CONTENT */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
              Main Article Markdown Body Content
            </label>
            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting the detailed technical contents paragraphs here..."
              className="w-full bg-white border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 outline-none text-gray-900 px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* MULTIPLE IMAGES GALLERY FIELD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Inline Gallery Assets
              </label>

              <button
                type="button"
                onClick={() => galleryRef.current.click()}
                className="bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                + Add Media
              </button>
            </div>

            <input
              ref={galleryRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => handleGalleryFiles(e.target.files)}
            />

            {galleryImages.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-2xl py-8 text-center text-xs font-bold uppercase tracking-wider text-gray-400 bg-white shadow-inner">
                No supplementary media content selected
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryImages.map((img, index) => (
                  <div key={index} className="relative group aspect-video border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                    <img
                      src={URL.createObjectURL(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STICKY FOOTER CONTROLS ROW */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-end gap-3 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? "Publishing Ecosystem Logs..." : "Publish Article"}
          </button>
        </div>

      </div>
    </div>
  );
}