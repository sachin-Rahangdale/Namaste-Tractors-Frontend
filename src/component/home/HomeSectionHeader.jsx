import { Link } from "react-router-dom";

const HomeSectionHeader = ({ title, to, linkText }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-black text-gray-900 tracking-tight">
        {title}
      </h2>

      <Link
        to={to}
        className="text-[#0F3D2E] font-black text-sm"
      >
        {linkText} →
      </Link>
    </div>
  );
};

export default HomeSectionHeader;