import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

      return {
        file,
        valid,
        url: URL.createObjectURL(file),
      };
    });

    setFiles((prev) => [...prev, ...processed]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/tiff"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {loading && (
        <p className="mb-4 text-sm text-gray-500">Opening file browser...</p>
      )}

      <Header count={files.length} />

      <FileGrid files={files} onRemove={removeFile} />

      <SummaryBar
        files={files}
        onAddMore={openFileDialog}
        onContinue={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
