type DropState = "idle" | "dragging" | "success";

interface DropZoneContentProps {
  state: DropState;
  count: number;
}

const DropZoneContent = ({ state, count }: DropZoneContentProps) => {
  if (state === "dragging") {
    return (
      <p className="text-lg font-semibold text-orange-600">
        Drop {count} file(s)
      </p>
    );
  }

  if (state === "success") {
    return (
      <p className="text-lg font-semibold text-green-600">
        {count} file(s) added successfully
      </p>
    );
  }

  return (
    <p className="text-lg font-semibold text-gray-700">
      Drag files here or click to browse
    </p>
  );
};

export default DropZoneContent;
