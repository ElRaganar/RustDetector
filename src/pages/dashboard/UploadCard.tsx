import React from "react";
import { CloudUpload, Folder, ArrowUp, Camera, Check } from "lucide-react";

const UploadCard = () => {
  return (
    <div
      className="
        relative
        h-[360px]
        bg-card-white
        rounded-2xl
        p-12
        border-2 border-dashed
        border-alert-orange/30
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        flex flex-col items-center justify-center text-center
        transition-all duration-300
        hover:border-solid
        hover:bg-hover-state
        hover:cursor-pointer
      "
    >
      <div className="mb-6 animate-float">
        <div className="w-20 h-20 rounded-full bg-alert-orange/15 flex items-center justify-center">
          <CloudUpload size={40} className="text-alert-orange" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-deep-charcoal mb-3">
        Upload Images for Rust Detection
      </h2>

      <p className="text-base text-neutral-slate mb-4">
        Drop images here or choose an upload method below
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm text-neutral-slate/80">
        {["JPG", "PNG", "TIFF", "Batch Upload"].map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-hover-state"
          >
            <Check size={14} className="text-success-teal" />
            {item}
          </span>
        ))}
        <span className="px-3 py-1 rounded-full bg-hover-state">Max 10MB</span>
      </div>

      <div className="flex gap-4">
        <button className="upload-btn text-card-white bg-alert-orange">
          <Folder size={18} /> Browse Files
        </button>

        <button className="upload-btn text-card-white bg-processing-amber">
          <ArrowUp size={18} /> Drag & Drop
        </button>

        <button className="upload-btn text-card-white bg-caution-yellow">
          <Camera size={18} /> Use Camera
        </button>
      </div>

      <div className="absolute bottom-4 flex gap-3 text-xs text-success-teal">
        <span className="flex items-center gap-1">
          ✓ Average analysis time: 3s
        </span>
        <span className="flex items-center gap-1">✓ 99% accuracy rate</span>
      </div>
    </div>
  );
};

export default UploadCard;
