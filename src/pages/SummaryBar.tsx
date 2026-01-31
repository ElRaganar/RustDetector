interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

const  SummaryBar = ({
  files,
  onAddMore,
}: {
  files: PreviewFile[];
  onAddMore: () => void;
}) => {
  const totalSize = files.reduce((s, f) => s + f.file.size, 0);
  const invalidCount = files.filter(f => !f.valid).length;

  return (
    <div className="sticky bottom-0 mt-6 flex items-center justify-between
                    rounded-lg bg-blue-50 p-4">
      <div className="text-sm">
        <p className="font-medium text-gray-700">
          {files.length} files ready • {(totalSize / 1024 / 1024).toFixed(1)} MB
        </p>

        {invalidCount === 0 ? (
          <p className="text-green-600">
            ✓ All files are valid and ready to upload!
          </p>
        ) : (
          <p className="text-red-600">
            {invalidCount} files are invalid. Please remove them.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAddMore}
          className="rounded-lg border border-gray-400 px-4 py-2 text-sm"
        >
          Add More Files
        </button>

        <button
          disabled={invalidCount > 0}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm
                     text-white disabled:opacity-50"
        >
          Continue to Upload
        </button>
      </div>
    </div>
  );
}

export default SummaryBar;