import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import Header from "./Header";
import FileGrid from "./FilePreview";
import SummaryBar from "./SummaryBar";

type PreviewFile = {
  file: File;
  url: string;
  valid: boolean;
};

export default function FileSelector() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [loading, setLoading] = useState(false);

  const openFileDialog = () => {
    setLoading(true);
    setTimeout(() => {
      inputRef.current?.click();
      setLoading(false);
    }, 500);
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const processed = Array.from(selected).map((file) => {
      const valid =
        ["image/jpeg", "image/png", "image/tiff"].includes(file.type) &&
        file.size <= 10 * 1024 * 1024;
      return { file, valid, url: URL.createObjectURL(file) };
    });
    setFiles((prev) => [...prev, ...processed]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validCount = files.filter((f) => f.valid).length;
  const invalidCount = files.filter((f) => !f.valid).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0806",
        fontFamily: "'DM Sans', sans-serif",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/tiff"
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* ── Page header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.68rem",
              color: "#e87c3e",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "0.3rem",
            }}
          >
            File Manager
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2.6rem",
              color: "#fff",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            Select Images
          </h1>
        </div>

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: "0.5rem" }}
          >
            {validCount > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#06A77D",
                  background: "rgba(6,167,125,0.1)",
                  border: "1px solid rgba(6,167,125,0.2)",
                  borderRadius: 8,
                  padding: "0.35rem 0.7rem",
                }}
              >
                <CheckCircle size={13} /> {validCount} valid
              </span>
            )}
            {invalidCount > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#D62828",
                  background: "rgba(214,40,40,0.1)",
                  border: "1px solid rgba(214,40,40,0.2)",
                  borderRadius: 8,
                  padding: "0.35rem 0.7rem",
                }}
              >
                <AlertTriangle size={13} /> {invalidCount} invalid
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Empty state ── */}
      <AnimatePresence>
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            style={{
              border: "1px solid rgba(232,124,62,0.12)",
              borderRadius: 20,
              background:
                "linear-gradient(145deg, rgba(232,124,62,0.04) 0%, #0d0b08 70%)",
              padding: "5rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.25rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "rgba(232,124,62,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderOpen size={34} color="#e87c3e" />
            </div>

            <div>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  marginBottom: "0.3rem",
                }}
              >
                No images selected
              </p>
              <p style={{ color: "#5a4a3a", fontSize: "0.8rem" }}>
                JPEG · PNG · TIFF — max 10MB each
              </p>
            </div>

            <button
              onClick={openFileDialog}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#e87c3e",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "0.75rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FolderOpen size={16} /> Browse Files
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading indicator ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(232,124,62,0.2)",
                borderTop: "2px solid #e87c3e",
              }}
            />
            <span style={{ fontSize: "0.78rem", color: "#5a4a3a" }}>
              Opening file browser…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── File grid ── */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background:
              "linear-gradient(145deg, rgba(232,124,62,0.04) 0%, #0d0b08 70%)",
            border: "1px solid rgba(232,124,62,0.1)",
            borderRadius: 20,
            padding: "1.5rem",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <ImageIcon size={16} color="#e87c3e" />
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                {files.length} Image{files.length !== 1 ? "s" : ""} Selected
              </span>
            </div>
            <button
              onClick={openFileDialog}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(232,124,62,0.08)",
                color: "#e87c3e",
                border: "1px solid rgba(232,124,62,0.2)",
                borderRadius: 10,
                padding: "0.4rem 0.9rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
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
          </div>

          <Header count={files.length} />
          <FileGrid files={files} onRemove={removeFile} />
        </motion.div>
      )}

      {/* ── Summary bar ── */}
      <div
        style={{
          background: "#0d0b08",
          border: "1px solid rgba(232,124,62,0.1)",
          borderRadius: 16,
          padding: "1rem 1.5rem",
        }}
      >
        <SummaryBar files={files} onAddMore={openFileDialog} />
      </div>
    </div>
  );
}
