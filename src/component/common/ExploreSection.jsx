import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Tractors",
    icon: "🚜",
    to: "/tractors",
  },
  {
    title: "Products",
    icon: "🌾",
    to: "/products",
  },
  {
    title: "Articles",
    icon: "📰",
    to: "/articles",
  },
  {
    title: "Sell",
    icon: "💰",
    to: "/products/new",
  },
];

const ExploreSection = ({
  title = "Welcome to Namaste Tractors ",
  subtitle = "Explore Tractors, Sell Products and Read Articles.",
}) => {
  return (
    <section className="bg-gradient-to-br from-[#0F3D2E] via-[#13533B] to-[#1B6B4A] px-4 py-8 md:py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-green-100 text-sm md:text-lg mt-3 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-8 md:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="bg-[#FBEFF2] border border-[#F3DCE2] rounded-2xl p-4 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all hover:bg-white/15"
            >
              <div className="text-4xl mb-2">
                {item.icon}
              </div>

              <p className="text-sm md:text-base font-black text-black tracking-tight">
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