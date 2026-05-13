import React from 'react';
import { useNavigate } from "react-router-dom";

const Card = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tractor/${data.id}`)}
      className="bg-[#F6F9F7] p-3 border border-[#E0EAE4] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#0F3D2E]/40 transition-all duration-300 flex flex-col h-full group rounded-sm cursor-pointer"
    >
      {/* Rectangle Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-white mb-3 rounded-sm">
        <img
          loading='lazys'
          src={data.imageUrl}
          alt={data.model}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            {data.brand} {data.model}
          </h2>
          <span className="shrink-0 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-sm">
            {data.hp} HP
          </span>
        </div>
        
        <div className="mt-auto pt-2">
          <p className="text-lg font-extrabold text-[#0F3D2E]">
            ₹{data.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;