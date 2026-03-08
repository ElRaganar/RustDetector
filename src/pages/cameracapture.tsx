import { useEffect, useRef, useState } from "react";
import { Camera, AlertTriangle } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (files: FileList) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((allDevices) => {
        const cams = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(cams);
        if (cams[0]) setDeviceId(cams[0].deviceId);
      })
      .catch(() => setError("Unable to list camera devices"));
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    startCamera(deviceId);
    return stopCamera;
  }, [deviceId]);

  const startCamera = async (id: string) => {
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: id } },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch {
      setError("Camera access denied");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.png`, {
        type: "image/png",
      });
      const dt = new DataTransfer();
      dt.items.add(file);
      onCapture(dt.files);
    }, "image/png");
  };

  return (
    <div className="dash min-h-screen" style={{ background: "#0a0806" }}>
      <div className="mx-auto max-w-[720px] p-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-alert-orange mb-1">
            Capture
          </p>
          <h2 className="font-display text-4xl text-white">Camera</h2>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-danger-red text-sm border border-danger-red/20 bg-danger-red/5">
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        {/* Camera selector */}
        {devices.length > 1 && (
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-sm outline-none"
          >
            {devices.map((cam) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label || `Camera ${cam.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        )}

        {/* Video feed */}
        <div className="rounded-2xl overflow-hidden border border-border-gray">
          <video ref={videoRef} autoPlay playsInline className="w-full" />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Capture button */}
        <button
          onClick={capturePhoto}
          className="upload-btn w-full bg-alert-orange text-white flex items-center justify-center gap-2 font-semibold"
        >
          <Camera size={18} /> Capture Photo
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
