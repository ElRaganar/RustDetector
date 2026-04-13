function CameraPermission({ onAllow, onCancel }: any) {
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="text-center text-6xl mb-4">📷🛡️</div>

      <h2 className="text-xl font-bold text-center">
        Camera Access Required
      </h2>

      <p className="mt-2 text-center text-gray-600">
        RustDetector needs camera permission to capture images for analysis.
        Your privacy is important — we never store live feeds.
      </p>

      <ul className="mt-4 space-y-1 text-sm text-gray-500">
        <li>🔒 Secure and encrypted</li>
        <li>👁️ No recording or storage</li>
        <li>✓ Used only for capture</li>
      </ul>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onAllow}
          className="flex-1 rounded-lg bg-orange-500 py-2 text-white"
        >
          Allow Camera Access
        </button>

        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border py-2"
        >
          Use Different Method
        </button>
      </div>
    </div>
  );
}
