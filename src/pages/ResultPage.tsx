import { AlertTriangle, CheckCircle, Download, Wrench } from "lucide-react";

const Result = () => {
  return (
    <div
      className="dash p-8 space-y-8 min-h-screen"
      style={{ background: "#0a0806" }}
    >
      {/* PAGE HEADER */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-alert-orange mb-1">
          Analysis Complete
        </p>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.8rem",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#fff",
          }}
        >
          Rust Detection Results
        </h1>
        <p className="text-sm text-neutral-slate mt-1">
          AI-powered analysis of uploaded images
        </p>
      </div>

      {/* DETECTION VISUALIZATION */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background:
            "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
          borderColor: "rgba(232,124,62,0.12)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.04em",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          Detection Visualization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-slate mb-2">
              Original Image
            </p>
            <div
              className="h-56 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(232,124,62,0.08)",
              }}
            >
              <span className="text-sm text-neutral-slate">
                Original Image Preview
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-slate mb-2">
              Rust Heatmap Overlay
            </p>
            <div
              className="h-56 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(232,124,62,0.04)",
                border: "1px solid rgba(232,124,62,0.15)",
              }}
            >
              <span className="text-sm text-alert-orange">
                Heatmap Visualization
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYSIS SUMMARY */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background:
            "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
          borderColor: "rgba(232,124,62,0.12)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.04em",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          Analysis Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard title="Rust Severity" value="Moderate" color="#F77F00" />
          <SummaryCard title="Affected Area" value="18%" color="#D62828" />
          <SummaryCard title="Confidence Score" value="97%" color="#06A77D" />
        </div>
      </section>

      {/* RUST FINDINGS */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background:
            "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
          borderColor: "rgba(232,124,62,0.12)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.04em",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          Rust Findings
        </h2>

        <ul className="space-y-3">
          <Finding
            icon={<AlertTriangle className="text-danger-red" size={18} />}
            text="Surface corrosion detected along panel edges"
          />
          <Finding
            icon={<AlertTriangle className="text-processing-amber" size={18} />}
            text="Early-stage oxidation in lower-left quadrant"
          />
          <Finding
            icon={<CheckCircle className="text-success-teal" size={18} />}
            text="No structural rust detected"
          />
        </ul>
      </section>

      {/* NEXT ACTIONS */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background:
            "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
          borderColor: "rgba(232,124,62,0.12)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.04em",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          Recommended Next Actions
        </h2>

        <div className="space-y-4">
          <Action
            icon={<Wrench size={18} />}
            title="Schedule Maintenance"
            desc="Clean and treat affected areas within 30 days."
          />
          <Action
            icon={<Download size={18} />}
            title="Download Report"
            desc="Export full analysis with heatmaps and severity scores."
          />
        </div>
      </section>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const SummaryCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => (
  <div
    className="rounded-xl p-4 text-center"
    style={{ background: `${color}0f`, border: `1px solid ${color}30` }}
  >
    <p className="text-xs text-neutral-slate tracking-widest uppercase mb-2">
      {title}
    </p>
    <p
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "2.2rem",
        letterSpacing: "0.04em",
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </p>
  </div>
);

const Finding = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li
    className="flex items-start gap-3 text-sm px-4 py-3 rounded-xl"
    style={{
      background: "rgba(232,124,62,0.03)",
      border: "1px solid rgba(232,124,62,0.08)",
    }}
  >
    {icon}
    <span style={{ color: "#c4a97a" }}>{text}</span>
  </li>
);

const Action = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div
    className="flex items-start gap-4 rounded-xl p-4 transition-all cursor-pointer"
    style={{
      background: "rgba(232,124,62,0.04)",
      border: "1px solid rgba(232,124,62,0.1)",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.borderColor = "rgba(232,124,62,0.3)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.borderColor = "rgba(232,124,62,0.1)")
    }
  >
    <div
      className="mt-1 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(232,124,62,0.1)", color: "#e87c3e" }}
    >
      {icon}
    </div>
    <div>
      <p className="font-semibold text-sm" style={{ color: "#fff" }}>
        {title}
      </p>
      <p className="text-xs text-neutral-slate mt-0.5">{desc}</p>
    </div>
  </div>
);

export default Result;
