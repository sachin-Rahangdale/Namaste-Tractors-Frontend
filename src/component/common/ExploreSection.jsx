import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Tractors",
    icon: "🚜",
    to: "/tractors",
    bg: "bg-[#FFF1F3]",
    border: "border-[#F7D7DE]",
  },
  {
    title: "View Products",
    icon: "🌾",
    to: "/products",
    bg: "bg-[#F4F8EC]",
    border: "border-[#DDE7C8]",
  },
  {
    title: "Read Articles",
    icon: "📰",
    to: "/articles",
    bg: "bg-[#EEF4FF]",
    border: "border-[#D7E3F7]",
  },
  {
    title: "Sell Products",
    icon: "💰",
    to: "/products/new",
    bg: "bg-[#FFF7EA]",
    border: "border-[#F5E2B8]",
  },
];

const ExploreSection = ({
  title = "Welcome to Namaste Tractors",
  subtitle = "Explore tractors, farm products & farming articles.",
}) => {
  return (
    <section className="bg-gradient-to-br from-[#0F3D2E] via-[#13533B] to-[#1B6B4A] px-4 pt-8 pb-6 overflow-hidden">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">

          <p className="text-[10px] uppercase tracking-[0.3em] text-green-300 font-black mb-2">
            India’s Farming Platform
          </p>

          <h1 className="text-[2rem] md:text-4xl font-black text-white leading-[1.1] tracking-tight">
            {title}
          </h1>

          <p className="text-green-100 text-sm mt-3 leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>

        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mt-7">

          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`${item.bg} ${item.border} border rounded-md py-3 px-2 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all`}
            >

              <div className="text-[1.7rem] leading-none mb-1.5">
                {item.icon}
              </div>

              <p className="text-[11px] font-black text-gray-800 tracking-tight leading-none">
                {item.title}
              </p>

            </Link>
          ))}

        </div>

      </div>

    </section>
  );
};

export default ExploreSection;