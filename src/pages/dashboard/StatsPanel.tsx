import { Image, AlertTriangle, Activity, Clock } from "lucide-react";
import type { DashboardStats } from "./Dashboard";

interface StatsPanelProps {
  stats: DashboardStats;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  
  // Calculate a mock "Severity" percentage based on detections vs total scans
  const avgSeverity = stats.totalScans > 0 
    ? Math.min(100, Math.round((stats.totalDetections / stats.totalScans) * 20)) 
    : 0;

  // Build the display array dynamically
  const displayStats = [
    {
      label: "Total Scans",
      value: stats.totalScans.toString(),
      icon: <Image size={20} />,
      color: "#e87c3e",
    },
    {
      label: "Critical Rust",
      value: stats.criticalRust.toString(),
      icon: <AlertTriangle size={20} />,
      color: "#D62828", // Matches corrosion dark red
    },
    {
      label: "Avg Severity",
      value: `${avgSeverity}%`,
      icon: <Activity size={20} />,
      color: "#F77F00",
    },
    {
      label: "Last Scan",
      value: stats.totalScans > 0 ? "Just now" : "--",
      icon: <Clock size={20} />,
      color: "#06A77D",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
        border: "1px solid rgba(232,124,62,0.12)",
      }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-[#e87c3e]">
        Dashboard
      </p>
      <h3
        className="mb-6"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.8rem",
          letterSpacing: "0.04em",
          lineHeight: 1,
          color: "#fff",
        }}
      >
        Session Overview
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {displayStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-4 rounded-xl transition"
            style={{
              background: "rgba(232,124,62,0.03)",
              border: "1px solid rgba(232,124,62,0.08)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(232,124,62,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(232,124,62,0.08)")}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              {stat.icon}
            </div>

            {/* Text details */}
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p
                className="font-semibold"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.04em",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
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