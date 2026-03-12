import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

const SummaryBar = ({
  files,
  onAddMore,
}: {
  files: PreviewFile[];
  onAddMore: () => void;
}) => {
  const totalSize = files.reduce((s, f) => s + f.file.size, 0);
  const invalidCount = files.filter((f) => !f.valid).length;
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      {/* File info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            color: "#c4a97a",
            fontSize: "0.88rem",
          }}
        >
          {files.length} file{files.length !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
          {(totalSize / 1024 / 1024).toFixed(1)} MB
        </p>

        {files.length === 0 ? (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "#3a2818",
            }}
          >
            No files selected yet
          </p>
        ) : invalidCount === 0 ? (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "#06A77D",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <CheckCircle size={13} /> All files valid and ready
          </p>
        ) : (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "#D62828",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <AlertTriangle size={13} /> {invalidCount} invalid — please remove
            them
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.65rem" }}>
        <button
          onClick={onAddMore}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(232,124,62,0.08)",
            color: "#e87c3e",
            border: "1px solid rgba(232,124,62,0.2)",
            borderRadius: 10,
            padding: "0.55rem 1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(232,124,62,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(232,124,62,0.08)")
          }
        >
          <Plus size={14} /> Add More
        </button>

        <button
          disabled={invalidCount > 0 || files.length === 0}
          onClick={() => navigate("/Results")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background:
              invalidCount > 0 || files.length === 0
                ? "rgba(232,124,62,0.2)"
                : "#e87c3e",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "0.55rem 1.1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor:
              invalidCount > 0 || files.length === 0
                ? "not-allowed"
                : "pointer",
            opacity: invalidCount > 0 || files.length === 0 ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!(invalidCount > 0 || files.length === 0))
              e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            if (!(invalidCount > 0 || files.length === 0))
              e.currentTarget.style.opacity = "1";
          }}
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SummaryBar;
