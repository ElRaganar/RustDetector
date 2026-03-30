import { useEffect, useState } from "react";
import { Image, AlertTriangle, Activity, Clock, FileText, Download } from "lucide-react";
import type { DashboardStats } from "./Dashboard";
import { API_BASE_URL } from "../../lib/api";

interface StatsPanelProps {
  stats: DashboardStats;
}

interface ReportHistoryItem {
  scan_id: string;
  scan_time: string;
  user_name: string;
  total_images: number;
  total_detections: number;
  total_corrosion: number;
  avg_confidence: number;
  severity: string;
  risk_assessment: string;
  report_ready: boolean;
  view_url: string;
  download_url: string;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const formatScanTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };
  
  // Calculate severity
  const avgSeverity = stats.totalScans > 0 
    ? Math.min(100, Math.round((stats.totalDetections / stats.totalScans) * 20)) 
    : 0;

  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null);

  const fetchReportHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/report-history`);
      if (!res.ok) throw new Error("Failed to load report history");
      const payload = await res.json();
      setReportHistory(payload.history || []);
    } catch (error) {
      console.error("Could not fetch report history", error);
    }
  };

  useEffect(() => {
    fetchReportHistory();
  }, []);

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
      color: "#D62828",
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

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: "Operator" }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to generate report: ${response.status} ${text}`);
      }

      const data = await response.json();
      const reportUrl = `${API_BASE_URL}${data.report_url}`;
      setLastGeneratedUrl(reportUrl);
      await fetchReportHistory();
      window.open(reportUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert("Unable to generate report right now. Check server logs.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownloadReport = () => {
    const latest = [...reportHistory].reverse().find((item) => item.report_ready) || null;
    if (!latest) {
      alert("No generated reports available. Please generate one first.");
      return;
    }

    const downloadUrl = `${API_BASE_URL}${latest.download_url}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
        border: "1px solid rgba(232,124,62,0.12)",
      }}
    >
      {/* HEADER */}
      <div>
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

        {/* STATS GRID */}
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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                {stat.icon}
              </div>

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

      {/* 🔥 REPORT SECTION (NEW) */}
      <div className="mt-6 pt-4 border-t border-[#e87c3e22]">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
          AI Inspection Report
        </p>

        <div className="flex gap-3">
          {/* Generate Report */}
          <button
            onClick={handleGenerateReport}
            disabled={loadingReport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition"
            style={{
              background: "#e87c3e",
              color: "#fff",
            }}
          >
            <FileText size={16} />
            {loadingReport ? "Generating..." : "Generate Report"}
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadReport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition"
            style={{
              background: "transparent",
              border: "1px solid rgba(232,124,62,0.4)",
              color: "#e87c3e",
            }}
          >
            <Download size={16} />
            Download Latest
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-300">
          {reportHistory.length > 0 ? (
            <div className="mt-2 space-y-1">
              <p className="text-[#f4f4f4] text-xs mb-1">Previous scans:</p>
              {[...reportHistory].reverse().map((item) => (
                <div key={item.scan_id} className="bg-[#111] p-3 rounded-md border border-[#e87c3e22]">
                  <div className="flex justify-between items-start gap-3">
                    <div className="text-xs text-gray-200 space-y-1">
                      <div className="text-[#f4f4f4] font-semibold">
                        {formatScanTime(item.scan_time)}
                      </div>
                      <div className="text-gray-400">Scan ID: {item.scan_id.slice(0, 8)}...</div>
                      <div>
                        {item.total_corrosion} corrosion spots, {item.total_detections} total detections
                      </div>
                      <div>
                        Severity: <span className="text-[#e87c3e]">{item.severity}</span> | Avg confidence: {(item.avg_confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-gray-400">{item.risk_assessment}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => window.open(`${API_BASE_URL}${item.view_url}`, "_blank")}
                        className="px-2 py-1 rounded-md text-xs border border-[#e87c3e66] text-[#e87c3e]"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => window.open(`${API_BASE_URL}${item.download_url}`, "_blank")}
                        className="px-2 py-1 rounded-md text-xs border border-[#e87c3e66] text-[#e87c3e]"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">No reports generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
