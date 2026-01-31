import React, { useRef, useState } from 'react'
type DropState = "idle" | "dragging" | "dropped" | "success";

interface DropZoneContentProps {
  state: DropState;
  count: number;
}

const DropZoneContent = ({ state, count }: DropZoneContentProps) => {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-700">
        {state === "dragging" ? `Drop ${count} file(s)` : "Drag files here or click to browse"}
      </p>
    </div>
  );
}

function DragDropZone({ onFiles }: { onFiles: (files: FileList) => void }) {
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
        setState("success");
        onFiles(e.dataTransfer.files);
        setTimeout(() => setState("dropped"), 300);
      }}
      onClick={() => inputRef.current?.click()}
      className={`
        relative mx-auto flex min-h-[400px] max-w-[800px] cursor-pointer
        flex-col items-center justify-center rounded-2xl border-4
        transition-all duration-300

        ${
          state === "dragging"
            ? "border-orange-500 bg-orange-50"
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
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      <DropZoneContent state={state} count={count} />
    </div>
  );
}
export default DragDropZone;