import React from 'react'

const  Header = ({ count }: { count: number }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Selected Files for Upload
        </h2>
        <p className="text-gray-500">
          Review your selection before uploading
        </p>
      </div>

      <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
        {count} files selected
      </span>
    </div>
  );
}

export default Header;