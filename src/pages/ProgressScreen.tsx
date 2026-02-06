import { useEffect, useState } from "react";
import PreviewFile from "./FilePreview";

export interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

const ProgressScreen = ({
  files,
  onComplete,
}: {
  files: PreviewFile[];
  onComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return p + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
      <h2 className="mb-4 text-xl font-semibold text-[var(--color-industrial-navy)]">
        Uploading Files
      </h2>

      <p className="mb-6 text-sm text-[var(--color-neutral-slate)]">
        Uploading {files.length} files securely…
      </p>

      {/* Progress Bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-border-gray)]">
        <div
          className="h-full rounded-full bg-[var(--color-alert-orange)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-right text-sm text-[var(--color-neutral-slate)]">
        {progress}%
      </p>

      {/* File list */}
      <ul className="mt-6 space-y-2 text-sm">
        {files.map((f) => (
          <li
            key={f.url}
            className="flex justify-between rounded-md bg-[var(--color-hover-state)] px-3 py-2"
          >
            <span className="truncate">{f.file.name}</span>
            <span className="text-[var(--color-success-teal)]">✓</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressScreen;
