import { Image, AlertTriangle, Activity, Clock } from "lucide-react";

const stats = [
  {
    label: "Total Scans",
    value: "128",
    icon: <Image size={20} />,
    color: "#e87c3e",
  },
  {
    label: "Critical Rust",
    value: "14",
    icon: <AlertTriangle size={20} />,
    color: "#D62828",
  },
  {
    label: "Avg Severity",
    value: "42%",
    icon: <Activity size={20} />,
    color: "#F77F00",
  },
  {
    label: "Last Scan",
    value: "3 min ago",
    icon: <Clock size={20} />,
    color: "#06A77D",
  },
];

const StatsPanel = () => {
  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background:
          "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
        border: "1px solid rgba(232,124,62,0.12)",
      }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-alert-orange">
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
        Overview
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-4 rounded-xl transition"
            style={{
              background: "rgba(232,124,62,0.03)",
              border: "1px solid rgba(232,124,62,0.08)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(232,124,62,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(232,124,62,0.08)")
            }
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              {stat.icon}
            </div>

            {/* Text */}
            <div>
              <p className="text-xs text-neutral-slate">{stat.label}</p>
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
