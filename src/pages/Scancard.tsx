import { Eye } from "lucide-react";

const statusColors: any = {
  Completed: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
};

const severityColors: any = {
  High: "text-red-600",
  Medium: "text-orange-500",
  Low: "text-green-600",
};

const ScanCard = ({ scan }: any) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-gray-100">
        <img
          src={scan.image}
          alt={scan.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm truncate">{scan.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${statusColors[scan.status]}`}
          >
            {scan.status}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3">{scan.date}</p>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-semibold ${severityColors[scan.severity]}`}
          >
            Severity: {scan.severity}
          </span>

          <button className="flex items-center gap-1 text-sm text-[#FF6B35] hover:underline">
            <Eye size={16} />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanCard;
