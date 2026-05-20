import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data, categoryMeta }) => {
  const navigate = useNavigate();

  const accent = categoryMeta?.accent ?? "#0F3D2E";

  return (
    <div
      onClick={() => navigate(`/product/${data.id}`)}
      className="bg-[#DDE5DF] p-2 rounded-md cursor-pointer h-full"
    >

      {/* Inner Card */}
      <div className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm h-full flex flex-col transition-all duration-300">

        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            loading="lazy"
            src={
              data.imageUrl ||
              "https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image"
            }
            alt={data.productName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">

          {/* Product Name */}
          <h3
            className="font-black text-[0.98rem] text-gray-900 leading-[1.25] tracking-tight line-clamp-2 min-h-[42px]"
            style={{ color: "#111827" }}
          >
            {data.productName}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">

            <svg
              className="w-3 h-3 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="line-clamp-1 font-medium">
              {data.city}
            </span>

          </div>

          {/* Bottom */}
          <div className="mt-auto pt-4">

            {/* Price */}
            <div className="flex items-end justify-between gap-2">

              <p
                className="text-[1.65rem] font-black tracking-tight leading-none"
                style={{ color: accent }}
              >
                ₹{data.price.toLocaleString()}
              </p>

              <span className="text-[10px] font-bold text-gray-500 bg-[#EEF2EF] px-2 py-1 rounded-md whitespace-nowrap">
                per {data.unit}
              </span>

            </div>

            {/* Button */}
            <button
              className="mt-4 w-full py-3 rounded-lg text-sm font-black text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              View Product
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;