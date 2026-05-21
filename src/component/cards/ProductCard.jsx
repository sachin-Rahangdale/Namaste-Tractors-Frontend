import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data, categoryMeta }) => {
  const navigate = useNavigate();
  const accent = categoryMeta?.accent ?? "#0F3D2E";

  // "Gram Gram" ya similar metadata items ke title duplication check ke liye logic
  const formatTitle = (title) => {
    if (!title) return "";
    const words = title.split(" ");
    if (words.length > 1 && words[0].toLowerCase() === words[1].toLowerCase()) {
      return words.slice(1).join(" ");
    }
    return title;
  };

  const displayTitle = formatTitle(data.productName);

  return (
    <div
      onClick={() => navigate(`/product/${data.id}`)}
      className="bg-[#DDE5DF] p-1 sm:p-2 rounded-none cursor-pointer h-full transition-transform duration-200"
    >
      {/* Inner Card - Symmetrical geometry layout with completely sharp edges */}
      <div className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-sm h-full flex flex-col active:scale-[0.99] md:active:scale-100 transition-all duration-200">

        {/* Image Frame */}
        <div className="aspect-[14/10] sm:aspect-[16/10] overflow-hidden bg-gray-50 rounded-none">
          <img
            loading="lazy"
            src={
              data.imageUrl ||
              "https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image"
            }
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 md:hover:scale-105 rounded-none"
          />
        </div>

        {/* Content Details Matrix */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-grow">

          {/* Product Name Title Header */}
          <h3
            className="font-extrabold text-xs sm:text-[0.98rem] text-gray-900 leading-tight tracking-tight line-clamp-2 min-h-[32px] sm:min-h-[42px]"
            style={{ color: "#111827" }}
          >
            {displayTitle}
          </h3>

          {/* Bottom Controls: Price info & Action Button */}
          <div className="mt-auto pt-2 sm:pt-3">

            {/* Location Row - Rendered perfectly in a single row right above the price */}
            {data.city && (
              <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                <svg
                  className="w-3 h-3 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{data.city}</span>
              </div>
            )}

            {/* Price + Unit Single-Row Layout */}
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span
                className="text-xl sm:text-2xl font-black tracking-tight leading-none"
                style={{ color: accent }}
              >
                ₹{data.price ? data.price.toLocaleString('en-IN') : '0'}
              </span>
              
              {data.unit && (
                <span className="text-xs sm:text-sm font-medium text-gray-400 lowercase whitespace-nowrap">
                  / {data.unit}
                </span>
              )}
            </div>

            {/* Sharp Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${data.id}`);
              }}
              className="mt-3 w-full py-2 sm:py-2.5 rounded-none text-xs sm:text-sm font-black text-white transition-all active:scale-[0.98] tracking-wide"
              style={{ backgroundColor: accent }}
            >
              Place Order / View
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;