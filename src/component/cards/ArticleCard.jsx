import React from 'react';
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Note: We use slug for articles as per your API response for better SEO
    navigate(`/article/${data.slug}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
    >
      <img 
        src={data.mainImageUrl} 
        alt={data.title} 
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
          {data.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {data.shortDescription}
        </p>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50 text-xs text-gray-400">
          <span>By {data.author}</span>
          <span>{new Date(data.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;