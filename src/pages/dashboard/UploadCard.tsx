import React, { useRef, useState } from "react";
import { CloudUpload, Folder, ArrowUp, Camera, Check, X } from "lucide-react";

export interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

interface UploadCardProps {
  files: PreviewFile[];
  setFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
}

const MAX_SIZE_MB = 10;

const UploadCard = ({ files, setFiles }: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  /* ---------- helpers ---------- */

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      valid: file.size <= MAX_SIZE_MB * 1024 * 1024,
    }));

    setFiles((prev) => [...prev, ...incoming]);
  };

  /* ---------- drag & drop ---------- */

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  /* ---------- camera ---------- */

  const openCamera = async () => {
    const media = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(media);
    setShowCamera(true);
    if (videoRef.current) videoRef.current.srcObject = media;
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `camera-${Date.now()}.png`, {
        type: "image/png",
      });

      addFiles([file]);
    });

    closeCamera();
  };

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setShowCamera(false);
  };

  /* ---------- UI ---------- */

  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="
          relative h-[360px]
          bg-card-white rounded-2xl p-12
          border-2 border-dashed border-alert-orange/30
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          flex flex-col items-center justify-center text-center
          transition-all hover:bg-hover-state
        "
      >
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-alert-orange/15 flex items-center justify-center">
            <CloudUpload size={40} className="text-alert-orange" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-deep-charcoal mb-3">
          Upload Images for Rust Detection
        </h2>

        <p className="text-base text-neutral-slate mb-4">
          Drag & drop or choose an option below
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
          {["JPG", "PNG", "TIFF", "Batch Upload"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-hover-state"
            >
              <Check size={14} className="text-success-teal" />
              {item}
            </span>
          ))}
          <span className="px-3 py-1 rounded-full bg-hover-state">
            Max {MAX_SIZE_MB}MB
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => inputRef.current?.click()}
            className="upload-btn bg-alert-orange text-card-white"
          >
            <Folder size={18} /> Browse
          </button>

          <button className="upload-btn bg-processing-amber text-card-white">
            <ArrowUp size={18} /> Drag & Drop
          </button>

          <button
            onClick={openCamera}
            className="upload-btn bg-caution-yellow text-card-white"
          >
            <Camera size={18} /> Camera
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* ---------- CAMERA MODAL ---------- */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[420px] text-center">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Capture Image</h3>
              <button onClick={closeCamera}>
                <X />
              </button>
            </div>

            <video ref={videoRef} autoPlay className="rounded-lg mb-4 w-full" />

            <button
              onClick={capturePhoto}
              className="w-full rounded-lg bg-alert-orange py-2 text-card-white"
            >
              Capture
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCard;
