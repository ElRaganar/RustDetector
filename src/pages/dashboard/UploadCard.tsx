import { CloudUpload, Folder, ArrowUp, Camera, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadCard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative h-[360px]
        bg-card-white rounded-2xl p-12
        border-2 border-dashed border-alert-orange/30
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        flex flex-col items-center justify-center text-center
      "
    >
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-alert-orange/15 flex items-center justify-center">
          <CloudUpload size={40} className="text-alert-orange" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">
        Upload Images for Rust Detection
      </h2>

      <p className="text-gray-500 mb-6">
        Drag & drop or choose an option below
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard/fileselector")}
          className="upload-btn bg-alert-orange text-white"
        >
          <Folder size={18} /> Browse
        </button>

        {/* <button
          onClick={() => navigate("/dashboard/dragdrop")}
          className="upload-btn bg-processing-amber text-white"
        >
          <ArrowUp size={18} /> Drag & Drop
        </button> */}

        <button
          onClick={() => navigate("/dashboard/camera")}
          className="upload-btn bg-caution-yellow text-white"
        >
          <Camera size={18} /> Camera
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
