type DropState = "idle" | "dragging" | "success" | "dropped";


function DropZoneContent({
  state,
  count,
}: {
  state: DropState;
  count: number;
}) {
  return (
    <>
      {/* File count badge */}
      {state === "dragging" && (
        <span className="absolute top-6 right-6 flex h-10 w-10
                         items-center justify-center rounded-full
                         bg-orange-500 text-white font-bold
                         animate-scale-in">
          {count}
        </span>
      )}

      {/* Icon */}
      <div
        className={`mb-6 text-orange-400 text-[100px]
          ${state === "dragging" ? "animate-bounce" : "animate-pulse"}
        `}
      >
        ☁️⬆️
      </div>

      {/* Text */}
      <h2
        className={`font-semibold transition-all
          ${state === "dragging"
            ? "text-3xl text-orange-600"
            : "text-2xl text-gray-800"}
        `}
      >
        {state === "dragging"
          ? "Release to Upload These Files"
          : "Drag Images Here to Upload"}
      </h2>

      <p className="mt-2 text-gray-500">
        Or click anywhere in this area to browse
      </p>

      {/* Format pills */}
      <div className="mt-4 flex gap-2">
        {["JPG", "PNG", "TIFF"].map((f) => (
          <span
            key={f}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs"
          >
            {f}
          </span>
        ))}
      </div>

      <p className="mt-2 text-sm text-gray-400">
        Maximum 10MB per file
      </p>
    </>
  );
}
