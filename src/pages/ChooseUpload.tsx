import React from 'react'
import CameraCard from './cameracard'
import BrowseFilesCard from './BrowserFileCard'
import DragDropCard from './browsefile'

type ChooseUploadMethodProps = {
  onClose: () => void | Promise<void>;
};

const ChooseUploadMethod = ({ onClose }: ChooseUploadMethodProps) => {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* Modal */}
      <div className="relative w-full max-w-[900px] bg-white rounded-2xl p-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Choose Your Upload Method
          </h2>
          <p className="text-gray-500 mt-2">
            Select how you'd like to upload images for rust analysis
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrowseFilesCard />
          <DragDropCard />
          <CameraCard />
        </div>

      </div>
    </div>
  )
}

export default ChooseUploadMethod;