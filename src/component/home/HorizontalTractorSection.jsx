import { Link } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";

const HorizontalTractorSection = ({ tractors, loading }) => {
  return (
    <section className="px-4 py-5 bg-[#F4F7F4] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#5C7A6D] font-black mb-1">
            Explore
          </p>

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">
            Popular Tractors
          </h2>
        </div>

        <Link
          to="/tractors"
          className="text-[#0F3D2E] text-sm font-black whitespace-nowrap"
        >
          View All
        </Link>

      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">

        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[265px] max-w-[265px] shrink-0 snap-start"
              >
                <SkeletonCard />
              </div>
            ))
          : tractors.map((tractor) => (
              <Link
                key={tractor.id}
                to={`/tractor/${tractor.id}`}
                className="min-w-[265px] max-w-[265px] shrink-0 snap-start"
              >

                {/* Outer Wrapper */}
                <div className="bg-[#DDE5DF] p-2 rounded-md">

                  {/* Card */}
                 <div className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm h-full flex flex-col">

                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={tractor.imageUrl}
                        alt={tractor.model}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-2">

                        <h3 className="font-black text-[1.02rem] text-gray-900 leading-[1.2] tracking-tight line-clamp-2 min-h-[44px]">

                         {tractor.model}
                        </h3>

                        <div className="bg-[#EEF2EF] text-[#0F3D2E] text-[11px] font-black px-2.5 py-1 rounded-md whitespace-nowrap border border-gray-100 shrink-0">
                          {tractor.hp} HP
                        </div>

                      </div>

                      {/* Brand */}
                      <p className="text-gray-5000 text-sm mt-0.5 font-semibold line-clamp-1">
                        {tractor.brand}
                      </p>

                      {/* Bottom */}
                      <div className="mt-auto pt-4">

                        {/* Price */}
                        <p className="text-[2rem] font-black text-[#0F3D2E] tracking-tight leading-none">
                          ₹{tractor.price?.toLocaleString()}
                        </p>

                        {/* Button */}
                        <button className="mt-4 w-full bg-[#0F3D2E] text-white py-3 rounded-lg font-black text-sm">
                          View Tractor
                        </button>

                      </div>

                    </div>
                  </div>
                </div>

              </Link>
            ))}
      </div>

    </section>
  );
};

export default HorizontalTractorSection;