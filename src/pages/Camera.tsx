import React, {useState} from 'react'
import CameraReview from './CameraReview';
const [mode, setMode] = useState<"camera" | "review">("camera");


{mode === "camera" && <CameraLive onCapture={setCapturedImage} />}

{mode === "review" && (
  <CameraReview
    image={capturedImage}
    onRetake={() => setMode("camera")}
    onUse={() => navigate("/preview")}
  />
)}