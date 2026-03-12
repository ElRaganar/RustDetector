import { useRef, useState } from "react";
import DropZoneContent from "./DropZone";

type DropState = "idle" | "dragging" | "success";

interface DragDropZoneProps {
  onFiles: (files: FileList) => void;
}

const DragAndDrop = ({ onFiles }: DragDropZoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<DropState>("idle");
  const [count, setCount] = useState(0);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setState("dragging");
        setCount(e.dataTransfer.items.length);
      }}
      onDragLeave={() => {
        setState("idle");
        setCount(0);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        setCount(files.length);
        setState("success");
        onFiles(files);

        setTimeout(() => setState("idle"), 1500);
      }}
      onClick={() => inputRef.current?.click()}
      className={`
        relative mx-auto flex min-h-[300px] max-w-[700px]
        cursor-pointer items-center justify-center rounded-2xl
        border-4 transition-all duration-300

        ${
          state === "dragging"
            ? "border-orange-500 bg-orange-50"
            : state === "success"
              ? "border-green-500 bg-green-50"
              : "border-orange-400/50 border-dashed bg-white"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/tiff"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) return;
          setCount(e.target.files.length);
          setState("success");
          onFiles(e.target.files);
          setTimeout(() => setState("idle"), 1500);
        }}
      />

      <DropZoneContent state={state} count={count} />
    </div>
  );
};

export default DragAndDrop;
