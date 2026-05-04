import React from 'react'
import { useNavigate } from "react-router-dom";

const Card = ({ data, onClick }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tractor/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition duration-300"
    >
      <img
        src={data.imageUrl}
        alt={data.model}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {data.model}
        </h2>
        <p className="text-sm text-gray-500">{data.brand}</p>

        <div className="flex justify-between mt-3 text-sm text-gray-700">
          <span className="bg-gray-100 px-2 py-1 rounded">
            ⚡ {data.hp} HP
          </span>
          <span className="font-semibold text-green-600">
            ₹ {data.price.toLocaleString()}
          </span>
        </div>

        <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;