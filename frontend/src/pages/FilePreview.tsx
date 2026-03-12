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
}) => {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      style={{
        maxHeight: 420,
        overflowY: "auto",
        paddingRight: "0.25rem",
      }}
    >
      {files.map((item, i) => (
        <FileCard key={i} data={item} onRemove={() => onRemove(i)} />
      ))}
    </div>
  );
};

export default FileGrid;
