import { useEffect, useRef, useState } from "react";

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

  // Get all cameras
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

  // Start camera when device changes
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
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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
    <div className="mx-auto max-w-[720px] rounded-2xl border p-6">
      {error && <p className="mb-2 text-red-500">{error}</p>}

      {/* Camera selector */}
      {devices.length > 1 && (
        <select
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
        >
          {devices.map((cam) => (
            <option key={cam.deviceId} value={cam.deviceId}>
              {cam.label || `Camera ${cam.deviceId.slice(0, 6)}`}
            </option>
          ))}
        </select>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="mx-auto rounded-xl"
      />

      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={capturePhoto}
        className="mt-4 w-full rounded-lg bg-orange-500 py-2 font-semibold text-white"
      >
        Capture Photo
      </button>
    </div>
  );
};

export default CameraCapture;
