import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ data }) => {
  const navigate = useNavigate();

  // "Mahindra Mahindra 585" jaise text duplication ko clear karne ke liye logic
  const formatTitle = (title) => {
    if (!title) return "";
    const words = title.split(" ");
    if (words.length > 1 && words[0].toLowerCase() === words[1].toLowerCase()) {
      return words.slice(1).join(" "); // Pehla repeated word hata dega
    }
    return title;
  };

  const displayTitle = formatTitle(data.model);

  return (
    <div
      onClick={() => navigate(`/tractor/${data.id}`)}
      className="bg-[#DDE5DF] p-1 sm:p-2 rounded-none cursor-pointer h-full transition-transform duration-200"
    >
      {/* Inner Card - Rounded edges completely removed (rounded-none) for a sharp geometric look */}
      <div className="bg-white rounded-none overflow-hidden border border-gray-200 shadow-sm h-full flex flex-col active:scale-[0.99] md:active:scale-100 transition-all duration-200">

        {/* Image - Sharp aspect container */}
        <div className="aspect-[14/10] sm:aspect-[16/10] overflow-hidden bg-gray-50 rounded-none">
          <img
            loading="lazy"
            src={data.imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 md:hover:scale-105 rounded-none"
          />
        </div>

        {/* Content Box */}
        <div className="p-2.5 sm:p-3 flex flex-col flex-grow">

          {/* Top Row: Title + HP Badge */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            {/* Title */}
            <h2 className="font-extrabold text-xs sm:text-[1rem] text-gray-900 leading-tight tracking-tight line-clamp-2 min-h-[32px] sm:min-h-[42px]">
              {displayTitle}
            </h2>

            {/* HP Badge - Keeping a tiny radius (rounded-sm) so it doesn't look like an accidental block, or make it rounded-none if you want 100% sharp */}
            <span className="shrink-0 text-[11px] sm:text-[10px] font-black text-[#0F3D2E] bg-[#EEF2EF] border border-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-none whitespace-nowrap mt-0.5">
              {data.hp} HP
            </span>
          </div>

          {/* Bottom Layout: Price + CTA Button */}
          <div className="mt-auto pt-2 sm:pt-4">
            {/* Price */}
            <p className="text-xl sm:text-[1.4rem] font-black text-[#0F3D2E] tracking-tight leading-none">
              ₹{data.price ? data.price.toLocaleString('en-IN') : 'N/A'}
            </p>

            {/* View Button - Sharp Rectangle design */}
            <button 
              className="mt-2 sm:mt-3 w-full bg-[#0F3D2E] md:hover:bg-[#14543f] text-white py-1.5 sm:py-2.5 rounded-none font-bold sm:font-black text-xs sm:text-sm tracking-wide transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tractor/${data.id}`);
              }}
            >
              View Tractor
            </button>
          </div>

          {/* Location field check */}
          {data.city && (
            <div className="text-[10px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5 uppercase tracking-wider">
              <span>📍</span> {data.city}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Card;