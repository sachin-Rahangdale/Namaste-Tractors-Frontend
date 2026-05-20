import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/article/${data.slug}`)}
      className="bg-[#DDE5DF] p-2 rounded-md cursor-pointer h-full"
    >

      <div className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm h-full flex flex-col">

        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            loading="lazy"
            src={data.mainImageUrl}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">

          {/* Type */}
          {data.articleType && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#EEF2EF] text-[#0F3D2E] text-[10px] font-black tracking-wide uppercase">
                {data.articleType.replaceAll("_", " ")}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-black text-[1rem] text-gray-900 leading-[1.3] tracking-tight line-clamp-2 min-h-[44px]">
            {data.title}
          </h3>

          {/* Footer */}
          <div className="mt-auto pt-4 flex items-center justify-between">

            <span className="text-xs font-bold text-gray-600 line-clamp-1">
              {data.author || "Namaste Tractor"}
            </span>

            {data.createdAt && (
              <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap ml-2">
                {new Date(data.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;