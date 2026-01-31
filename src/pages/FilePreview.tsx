import FileCard from "./FileCard";

interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

const FileGrid = ({
  files,
  onRemove,
}: {
  files: PreviewFile[];
  onRemove: (i: number) => void;
}) =>  {
  return (
    <div className="grid max-h-[420px] grid-cols-2 gap-4 overflow-y-auto
                    md:grid-cols-4 lg:grid-cols-5">
      {files.map((item, i) => (
        <FileCard
          key={i}
          data={item}
          onRemove={() => onRemove(i)}
        />
      ))}
    </div>
  );
}

export default FileGrid;