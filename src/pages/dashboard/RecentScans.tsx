import ScanCard from "../Scancard";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Newest First");

  const filtered = scans.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All Status" || s.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 min-h-screen" style={{ background: "#0a0806" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-alert-orange">
          Analysis History
        </p>
        <h1
          className="text-deep-charcoal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.6rem",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#fff",
          }}
        >
          Recent Scans
        </h1>
        <p className="text-sm mt-1 text-neutral-slate">
          View and manage your previous rust analyses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: "rgba(232,124,62,0.06)",
            border: "1px solid rgba(232,124,62,0.15)",
            minWidth: 220,
          }}
        >
          <Search size={14} color="#5a4a3a" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
            style={{ color: "#c4a97a" }}
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(232,124,62,0.06)",
            border: "1px solid rgba(232,124,62,0.15)",
            color: "#c4a97a",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option>All Status</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(232,124,62,0.06)",
            border: "1px solid rgba(232,124,62,0.15)",
            color: "#c4a97a",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

const EmptyState = () => (
  <div
    className="flex flex-col items-center justify-center py-24 rounded-2xl"
    style={{
      border: "1px solid rgba(232,124,62,0.1)",
      background: "rgba(232,124,62,0.02)",
    }}
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: "rgba(232,124,62,0.08)" }}
    >
      <SlidersHorizontal size={28} color="#e87c3e" style={{ opacity: 0.5 }} />
    </div>
    <p
      className="text-lg mb-1"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: "0.04em",
        color: "#fff",
      }}
    >
      No Scans Found
    </p>
    <p className="text-sm text-neutral-slate">
      You have not performed any scans yet.
    </p>
  </div>
);

export default RecentScans;
