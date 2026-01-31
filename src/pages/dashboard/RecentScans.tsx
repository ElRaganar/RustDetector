import ScanCard from "../Scancard";

const scans = [
  {
    id: 1,
    image: "/sample/rust1.jpg",
    name: "pipeline_section_A.jpg",
    date: "Jan 15, 2026",
    status: "Completed",
    severity: "High",
  },
  {
    id: 2,
    image: "/sample/rust2.jpg",
    name: "storage_tank_02.png",
    date: "Jan 14, 2026",
    status: "Completed",
    severity: "Medium",
  },
  {
    id: 3,
    image: "/sample/rust3.jpg",
    name: "bridge_support.jpg",
    date: "Jan 13, 2026",
    status: "Failed",
    severity: "—",
  },
];

const RecentScans = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2B2D42]">Recent Scans</h1>
        <p className="text-gray-500 text-sm">
          View and manage your previous rust analyses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by filename..."
          className="px-4 py-2 w-64 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#FF6B35]/40"
        />

        <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
          <option>All Status</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>

        <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Grid */}
      {scans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

/**
 * Simple empty state component for when there are no scans.
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#CBD5E1"
        strokeWidth="2"
        fill="#F8FAFC"
      />
      <path
        d="M8 12h8M8 16h5"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <p className="mt-4 text-lg font-medium">No scans found</p>
    <p className="text-sm">You have not performed any scans yet.</p>
  </div>
);

export default RecentScans;
