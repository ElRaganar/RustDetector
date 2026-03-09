import { Search, SlidersHorizontal, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { InferenceResult } from "./Dashboard"; // Import your interface from Dashboard

// We now accept the session results as a prop
interface RecentScansProps {
  results: InferenceResult[];
}

const RecentScans = ({ results = [] }: RecentScansProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Newest First");

  // 1. Format the raw session results into the shape our UI expects
  const formattedScans = results.map((res, index) => {
    const totalDetections =
      res.detections.corrosion + res.detections.slippage + res.detections.crack;
    
    // Determine a dynamic severity
    let severity = "Clean";
    if (res.detections.corrosion > 0 || totalDetections >= 3) severity = "High";
    else if (totalDetections > 0) severity = "Medium";

    return {
      id: index,
      image: res.annotatedImage,
      name: `Session_Scan_${index + 1}.jpg`,
      date: new Date().toLocaleDateString(), // Today's date for the current session
      status: "Completed",
      severity: severity,
      raw: res,
    };
  });

  // 2. Apply Filters
  let filtered = formattedScans.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All Status" || s.status === status;
    return matchSearch && matchStatus;
  });

  // 3. Apply Sorting
  if (sort === "Newest First") {
    filtered = filtered.reverse();
  }

  // 4. Download Handler for Base64 strings
  const handleDownload = (base64Image: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "#0a0806" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-[#e87c3e]">
          Analysis History
        </p>
        <h1
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
        <p className="text-sm mt-1 text-gray-400">
          View and download your rust analyses from this session
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
          }}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((scan) => (
            <div
              key={scan.id}
              className="flex flex-col rounded-2xl overflow-hidden border transition-all"
              style={{
                background: "rgba(232,124,62,0.03)",
                borderColor: "rgba(232,124,62,0.1)",
              }}
            >
              {/* Image Container */}
              <div className="relative h-48 w-full bg-black">
                <img
                  src={scan.image}
                  alt={scan.name}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-md ${
                      scan.severity === "High"
                        ? "bg-red-500/80 text-white"
                        : scan.severity === "Medium"
                        ? "bg-orange-500/80 text-white"
                        : "bg-green-500/80 text-white"
                    }`}
                  >
                    {scan.severity} Risk
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-gray-200 font-medium text-sm truncate" title={scan.name}>
                    {scan.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">{scan.date}</p>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    {scan.status === "Completed" ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <AlertTriangle size={14} className="text-red-500" />
                    )}
                    <span className="text-gray-400">{scan.status}</span>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(scan.image, scan.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      background: "#e87c3e",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            </div>
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
    <p className="text-sm text-gray-500">
      You have not performed any scans during this session yet.
    </p>
  </div>
);

export default RecentScans;