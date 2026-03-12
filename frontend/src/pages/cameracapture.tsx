import { useEffect, useRef, useState } from "react";
import { Camera, AlertTriangle, SwitchCamera, Loader2, X, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InferenceResult, DashboardStats } from "./dashboard/Dashboard"; // Adjust path if needed
import { API_BASE_URL } from "../lib/api";

interface CameraCaptureProps {
  setResults: React.Dispatch<React.SetStateAction<InferenceResult[]>>;
  setStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
}

const CameraCapture = ({ setResults, setStats }: CameraCaptureProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment"); // "environment" is the back camera
  
  // Review & Upload State
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Start camera whenever the facingMode changes
  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const startCamera = async (mode: "environment" | "user") => {
    stopCamera();
    setError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 }, // Try to get high resolution for better YOLO accuracy
          height: { ideal: 1080 }
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError("Camera access denied or no camera found. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Capture the frame and save it to state
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas to match video resolution perfectly
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to image file
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-scan-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setCapturedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera(); // Stop the feed while reviewing
    }, "image/jpeg", 0.95);
  };

  const retakePhoto = () => {
    setCapturedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    startCamera(facingMode); // Restart feed
  };

  // --- BACKEND UPLOAD LOGIC ---
  const handleUsePhoto = async () => {
    if (!capturedFile || !previewUrl) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("files", capturedFile);

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
      
      const newResults: InferenceResult[] = data.results.map((res: any) => ({
        originalFile: previewUrl, 
        annotatedImage: res.annotated_image,
        detections: res.detections, 
      }));

      let newCorrosionCount = 0;
      let newTotalDetections = 0;

      newResults.forEach((res) => {
        newCorrosionCount += res.detections.corrosion;
        newTotalDetections += (res.detections.corrosion + res.detections.slippage + res.detections.crack);
      });

      // Update global dashboard state
      setResults((prev) => [...newResults, ...prev]);
      setStats((prev) => ({
        totalScans: prev.totalScans + 1,
        criticalRust: prev.criticalRust + newCorrosionCount,
        totalDetections: prev.totalDetections + newTotalDetections,
      }));

      // Navigate back to dashboard to see results
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Failed to analyze. Backend: ${API_BASE_URL}\n${message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="dash min-h-screen flex flex-col items-center justify-center" style={{ background: "#0a0806" }}>
      
      {/* --- REVIEW SCREEN --- */}
      {previewUrl ? (
        <div className="w-full max-w-[800px] p-6 bg-[#121212] rounded-3xl border border-[rgba(232,124,62,0.12)] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-['Bebas_Neue'] text-white tracking-wide">Review Capture</h2>
            <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
          </div>

          <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/5 mb-6">
            <img src={previewUrl} alt="Captured" className="max-h-[500px] w-auto object-contain" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={retakePhoto}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-50"
            >
              Retake Photo
            </button>
            <button
              onClick={handleUsePhoto}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "#e87c3e" }}
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              {isProcessing ? "Analyzing with AI..." : "Analyze Image"}
            </button>
          </div>
        </div>

      ) : (

      /* --- CAMERA CAPTURE SCREEN --- */
        <div className="w-full max-w-[720px] p-6 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#e87c3e" }}>
                Live Feed
              </p>
              <h2 className="text-4xl text-white font-['Bebas_Neue'] tracking-wide">Camera Capture</h2>
            </div>
            
            {/* Switch Camera Button (Front/Back) */}
            <button 
              onClick={toggleCamera}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 transition"
              title="Switch Camera"
            >
              <SwitchCamera size={20} />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm border border-red-500/20 bg-red-500/10">
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center shadow-2xl">
             {!stream && !error && <Loader2 size={32} className="text-[#e87c3e] animate-spin" />}
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className="absolute inset-0 w-full h-full object-cover" 
             />
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <button
            onClick={capturePhoto}
            disabled={!stream}
            className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 font-semibold text-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ background: "#e87c3e" }}
          >
            <Camera size={22} /> Capture Frame
          </button>
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white text-sm font-medium transition mx-auto"
          >
            Cancel and return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
