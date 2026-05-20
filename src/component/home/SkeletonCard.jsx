const SkeletonCard = () => {
  return (
    <div className="bg-[#F8FAF8] p-2 rounded-xl">

      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">

        {/* Image */}
        <div className="aspect-[16/10] bg-gray-200 rounded-t-[1.5rem]" />

        {/* Content */}
        <div className="p-4">

          {/* Title */}
          <div className="h-5 bg-gray-200 rounded-full w-[78%] mb-3" />

          {/* Subtitle */}
          <div className="h-4 bg-gray-100 rounded-full w-[45%] mb-5" />

          {/* Price */}
          <div className="h-7 bg-gray-200 rounded-xl w-[60%] mb-5" />

          {/* Button */}
          <div className="h-11 bg-gray-200 rounded-2xl w-full" />

        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;