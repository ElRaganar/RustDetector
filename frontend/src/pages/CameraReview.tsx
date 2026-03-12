type ReviewProps = {
  imageUrl: string;
  onUse: () => void;
  onRetake: () => void;
  onTakeAnother: () => void;
};
type CameraState = "camera" | "review";

export default function CameraReview({
  imageUrl,
  onUse,
  onRetake,
  onTakeAnother,
}: ReviewProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left spacer (camera slid out) */}
      <div className="w-1/2 bg-black transition-transform duration-300 -translate-x-full" />

      {/* Review Panel */}
      <div className="w-1/2 bg-gray-900 text-white p-6 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Review Capture</h2>
          <div className="flex gap-2">
            <button
              onClick={onRetake}
              className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-800"
            >
              Retake
            </button>
            <button
              onClick={onUse}
              className="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Use This Photo
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Captured"
            className="max-h-[400px] object-contain cursor-grab"
          />

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button className="h-8 w-8 bg-gray-800 rounded text-lg">+</button>
            <button className="h-8 w-8 bg-gray-800 rounded text-lg">−</button>
          </div>
        </div>

        {/* Image Info */}
        <div className="mt-4 text-sm text-gray-300 space-y-1">
          <p>Resolution: 3840 × 2160</p>
          <p>Size: 3.2 MB</p>
          <p>Format: JPG</p>
          <p>Timestamp: Jan 15, 2026 at 2:45 PM</p>
        </div>

        {/* Quality Indicators */}
        <div className="mt-4 space-y-1 text-sm">
          <p className="text-green-400">✓ Good lighting</p>
          <p className="text-green-400">✓ In focus</p>
          <p className="text-yellow-400">⚠ Slight blur detected</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onUse}
            className="flex-1 bg-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Use This Photo
          </button>

          <button
            onClick={onRetake}
            className="flex-1 border border-gray-500 py-3 rounded-lg hover:bg-gray-800"
          >
            Retake
          </button>

          <button
            onClick={onTakeAnother}
            className="px-4 py-3 text-sm text-gray-300 hover:underline"
          >
            Take Another
          </button>
        </div>
      </div>
    </div>
  );
}
