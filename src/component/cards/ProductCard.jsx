import React from 'react';
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${data.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all h-full flex flex-col"
    >
      <div className="relative">
        <img 
          src={data.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={data.productName} 
          className="w-full h-40 object-cover"
        />
        <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider">
          {data.category}
        </span>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 capitalize mb-1">
          {data.productName}
        </h3>
        
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <span className="mr-1">📍</span> {data.city}
        </div>

        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-bold text-blue-600">
              ₹{data.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/{data.unit}</span>
            </p>
          </div>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-blue-50 transition-colors">
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;