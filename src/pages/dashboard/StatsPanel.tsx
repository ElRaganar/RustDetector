import { Image, AlertTriangle, Activity, Clock } from "lucide-react";

const stats = [
  {
    label: "Total Scans",
    value: "128",
    icon: <Image size={20} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Critical Rust",
    value: "14",
    icon: <AlertTriangle size={20} />,
    color: "bg-red-100 text-red-600",
  },
  {
    label: "Avg Severity",
    value: "42%",
    icon: <Activity size={20} />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    label: "Last Scan",
    value: "3 min ago",
    icon: <Clock size={20} />,
    color: "bg-green-100 text-green-600",
  },
];

const StatsPanel = () => {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2B2D42] mb-6">Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-sm transition"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>

            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
