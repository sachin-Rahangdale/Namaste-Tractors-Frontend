import React from 'react';
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data, categoryMeta }) => {
  const navigate = useNavigate();
  const accent = categoryMeta?.accent ?? "#0F3D2E";

  return (
    <div
      onClick={() => navigate(`/product/${data.id}`)}
      className="bg-[#F6F9F7] p-3 border border-[#E0EAE4] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group rounded-sm cursor-pointer"
      onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    >
      {/* Rectangle Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-white mb-3 rounded-sm">
        <img
          loading='lazy'
          src={data.imageUrl || "https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image"}
          alt={data.productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        <h3
          className="text-sm font-semibold text-gray-900 capitalize leading-snug mb-1 transition-colors group-hover:text-[var(--accent)]"
          style={{ "--accent": accent }}
        >
          {data.productName}
        </h3>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {data.city}
        </p>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <p className="text-base font-bold leading-none" style={{ color: accent }}>
            ₹{data.price.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-sm">
            per {data.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;