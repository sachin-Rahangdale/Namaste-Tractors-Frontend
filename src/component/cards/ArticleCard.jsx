import React from 'react';
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ data, featured }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/article/${data.slug}`)}
      className="bg-[#F6F9F7] p-3 border border-[#E0EAE4] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#0F3D2E]/40 transition-all duration-300 flex flex-col h-full group rounded-sm cursor-pointer"
    >
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-white mb-3 rounded-sm relative">
        <img
          src={data.mainImageUrl}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        
        {data.articleType && (
  <div className="mb-2">
    <span
      className="
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        bg-green-50
        text-green-700
        text-[11px]
        font-bold
        tracking-wide
      "
    >
      {data.articleType.replaceAll("_", " ")}
    </span>
  </div>
)}
        
        <h3 className={`font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#0F3D2E] transition-colors line-clamp-2 ${featured ? 'text-lg' : 'text-sm'}`}>
          {data.title}
        </h3>

        {/* Footer row */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-700">{data.author || 'Namaste Tractor'}</span>
          {data.createdAt && new Date(data.createdAt).getFullYear() > 2000 && (
            <span className="text-[10px] font-medium text-gray-400">
              {new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;