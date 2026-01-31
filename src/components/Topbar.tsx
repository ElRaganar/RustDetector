import { Bell, Search, BarChart3 } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b px-8 flex items-center justify-between">
      {/* Left: Page title */}
      <div>
        <h2 className="text-xl font-semibold text-[#2B2D42]">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Upload images & monitor rust detection
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search scans..."
            className="
              pl-10 pr-4 py-2
              w-56
              text-sm
              rounded-xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-[#FF6B35]/40
            "
          />
        </div>

        <button
          className="
            relative
            p-2
            rounded-xl
            hover:bg-gray-100
            transition
          "
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </header>
  );
};

export default Topbar;
