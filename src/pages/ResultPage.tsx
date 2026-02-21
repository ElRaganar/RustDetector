import { AlertTriangle, CheckCircle, Download, Wrench } from "lucide-react";

const Result = () => {
  return (
    <div className="p-8 space-y-8 bg-[#F8F9FB] min-h-screen">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#2B2D42]">
          Rust Detection Results
        </h1>
        <p className="text-sm text-gray-500">
          AI-powered analysis of uploaded images
        </p>
      </div>

      {/* DETECTION VISUALIZATION */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Detection Visualization</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Original Image</p>
            <div className="h-56 rounded-xl bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">
                Original Image Preview
              </span>
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Rust Heatmap Overlay</p>
            <div className="h-56 rounded-xl bg-orange-50 flex items-center justify-center">
              <span className="text-orange-400 text-sm">
                Heatmap Visualization
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYSIS SUMMARY */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Analysis Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard
            title="Rust Severity"
            value="Moderate"
            color="text-orange-600"
          />
          <SummaryCard title="Affected Area" value="18%" color="text-red-500" />
          <SummaryCard
            title="Confidence Score"
            value="97%"
            color="text-green-600"
          />
        </div>
      </section>

      {/* RUST FINDINGS */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Rust Findings</h2>

        <ul className="space-y-3">
          <Finding
            icon={<AlertTriangle className="text-red-500" size={18} />}
            text="Surface corrosion detected along panel edges"
          />
          <Finding
            icon={<AlertTriangle className="text-orange-500" size={18} />}
            text="Early-stage oxidation in lower-left quadrant"
          />
          <Finding
            icon={<CheckCircle className="text-green-500" size={18} />}
            text="No structural rust detected"
          />
        </ul>
      </section>

      {/* NEXT ACTIONS */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Recommended Next Actions</h2>

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
  <div className="rounded-xl bg-gray-50 p-4 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);

const Finding = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-start gap-3 text-sm text-gray-700">
    {icon}
    <span>{text}</span>
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
  <div className="flex items-start gap-4 rounded-xl border p-4 hover:bg-gray-50 transition">
    <div className="mt-1 text-[#FF6B35]">{icon}</div>
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

export default Result;
