import { LayoutDashboard, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const itemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
     ${
       pathname === path
         ? "bg-[#FF6B35]/10 text-[#FF6B35]"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  return (
    <aside className="w-64 h-screen bg-white border-r px-6 py-8">
      <h1 className="text-xl font-bold text-[#FF6B35] mb-10">RustDetector</h1>

      <nav className="space-y-2">
        <Link to="/dashboard" className={itemClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/dashboard/scans" className={itemClass("/dashboard/scans")}>
          <History size={18} />
          Recent Scans
        </Link>

        <Link
          to="/dashboard/settings"
          className={itemClass("/dashboard/settings")}
        >
          <Settings size={18} />
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
