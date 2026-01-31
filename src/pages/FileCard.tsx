interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

function FileCard({
  data,
  onRemove,
}: {
  data: PreviewFile;
  onRemove: () => void;
}) {
  const { file, url, valid } = data;

  return (
    <div
      className={`group relative h-[180px] rounded-lg border bg-gray-100
        transition hover:scale-[1.02]
        ${valid ? "border-gray-300 hover:border-orange-500"
                : "border-red-400"}`}
    >
      {/* Remove */}
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 flex h-6 w-6
                   items-center justify-center rounded-full
                   bg-red-500 text-xs text-white"
      >
        ✕
      </button>

      {/* Format badge */}
      <span
        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs
          ${valid ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"}`}
      >
        {file.type.split("/")[1]?.toUpperCase()}
      </span>

      {/* Image */}
      <img
        src={url}
        alt={file.name}
        className="h-full w-full rounded-lg object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-x-0 bottom-0 rounded-b-lg
                      bg-gradient-to-t from-black/70 to-transparent
                      p-2 opacity-0 transition group-hover:opacity-100">
        <p className="truncate text-xs font-medium text-white">
          {file.name}
        </p>
        <p className="text-[11px] text-gray-300">
          {(file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
}
export default FileCard;