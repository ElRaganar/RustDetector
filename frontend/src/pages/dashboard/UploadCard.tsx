import { useState, useRef, useCallback } from "react";
import { CloudUpload, Folder, Camera, X, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type{ InferenceResult, DashboardStats } from "./Dashboard"; // Make sure these are exported from Dashboard.tsx
import { API_BASE_URL } from "../../lib/api";

interface QueueFile {
  id: string;
  file: File;
  url: string;
}

interface UploadCardProps {
  setResults: React.Dispatch<React.SetStateAction<InferenceResult[]>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
}

const UploadCard = ({ setResults, isProcessing, setIsProcessing, setStats }: UploadCardProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueueFile[]>([]);

  const addFiles = useCallback((raw: FileList | File[]) => {
    const valid = Array.from(raw).filter((f) => f.type.startsWith("image/"));
    const mapped: QueueFile[] = valid.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      url: URL.createObjectURL(f),
    }));
    setQueue((prev) => [...prev, ...mapped]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => setQueue((prev) => prev.filter((f) => f.id !== id));

  // --- API CONNECTION & LOGIC ---
  const handleAnalyze = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);
    setResults([]); // Clear previous scan results from the screen

    try {
      // 1. Pack all queued files into a FormData object
      const formData = new FormData();
      queue.forEach((qFile) => {
        // The key "files" MUST match what FastAPI expects in def predict_batch(files: ...)
        formData.append("files", qFile.file); 
      });

      // 2. Send the batch to your FastAPI backend
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Backend error (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`,
        );
      }

      const data = await response.json();
      
      // 3. Map the backend response back to our frontend format
      const newResults: InferenceResult[] = data.results.map((res: any, index: number) => ({
        originalFile: queue[index].url, 
        annotatedImage: res.annotated_image,
        detections: res.detections, 
      }));

      // 4. Calculate the stats from this batch to update the StatsPanel
      let newCorrosionCount = 0;
      let newTotalDetections = 0;

      newResults.forEach((res) => {
        newCorrosionCount += res.detections.corrosion;
        newTotalDetections += (res.detections.corrosion + res.detections.slippage + res.detections.crack);
      });

      // Update the global stats state running in Dashboard.tsx
      setStats((prev) => ({
        totalScans: prev.totalScans + newResults.length,
        criticalRust: prev.criticalRust + newCorrosionCount,
        totalDetections: prev.totalDetections + newTotalDetections,
      }));

      // 5. Display the images and clear the queue
      setResults(newResults);
      setQueue([]); 
      
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Failed to analyze. Backend: ${API_BASE_URL}\n${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(232,124,62,0.05) 0%, #0d0b08 60%)",
        border: "1px solid rgba(232,124,62,0.12)",
        borderRadius: 24,
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        fontFamily: "'DM Sans', sans-serif",
        height: "100%",
      }}
    >
      {/* Header Area */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.68rem", color: "#e87c3e", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.3rem" }}>
            Rust Detection
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>
            Upload Images
          </h2>
        </div>
        
        {/* Analyze Button */}
        {queue.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleAnalyze}
            disabled={isProcessing}
            style={{
              background: isProcessing ? "rgba(232,124,62,0.5)" : "#e87c3e",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0.55rem 1.1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: isProcessing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle size={14} />
            )}
            {isProcessing ? "Analyzing..." : `Analyze ${queue.length}`}
          </motion.button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        animate={{
          borderColor: dragging ? "#e87c3e" : "rgba(232,124,62,0.2)",
          background: dragging ? "rgba(232,124,62,0.07)" : "rgba(232,124,62,0.02)",
        }}
        transition={{ duration: 0.2 }}
        style={{
          border: "2px dashed rgba(232,124,62,0.2)",
          borderRadius: 16,
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <motion.div
          animate={{ y: dragging ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: "rgba(232,124,62,0.1)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <CloudUpload size={30} color="#e87c3e" />
        </motion.div>

        <div>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Drop images here</p>
          <p style={{ color: "#5a4a3a", fontSize: "0.78rem" }}>or use the buttons below — JPG, PNG up to 20MB</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files!)}
        />
      </motion.div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            background: "#e87c3e", color: "#fff", border: "none", borderRadius: 12,
            padding: "0.75rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Folder size={16} /> Browse Files
        </button>

        <button
          onClick={() => navigate("/dashboard/camera")}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            background: "rgba(232,124,62,0.08)", color: "#e87c3e", border: "1px solid rgba(232,124,62,0.25)",
            borderRadius: 12, padding: "0.75rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: "0.85rem", cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,124,62,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(232,124,62,0.08)")}
        >
          <Camera size={16} /> Camera
        </button>
      </div>

      {/* File Queue Display */}
      <AnimatePresence>
        {queue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <p style={{ fontSize: "0.68rem", color: "#3a2818", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Queue — {queue.length} file{queue.length !== 1 ? "s" : ""}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: 160, overflowY: "auto" }}>
              <AnimatePresence mode="popLayout">
                {queue.map((qf) => (
                  <motion.div
                    key={qf.id} layout initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12, height: 0 }} transition={{ duration: 0.25 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.65rem", background: "rgba(232,124,62,0.04)",
                      border: "1px solid rgba(232,124,62,0.08)", borderRadius: 10, padding: "0.5rem 0.65rem",
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
                      <img src={qf.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <p style={{ flex: 1, fontSize: "0.78rem", color: "#c4a97a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {qf.file.name}
                    </p>
                    <span style={{ fontSize: "0.7rem", color: "#5a4a3a" }}>{(qf.file.size / 1024).toFixed(0)}KB</span>
                    <button onClick={() => remove(qf.id)} style={{ background: "none", border: "none", color: "#3a2818", cursor: "pointer", display: "flex", flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCard;
