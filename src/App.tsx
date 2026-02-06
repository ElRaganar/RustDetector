import { Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";

import Landing from "./pages/Landing";
import FileSelector from "./pages/FileSelector";
import Dashboard from "./pages/Dashboard";
import ChooseUploadMethod from "./pages/ChooseUpload";

import { SignedIn, SignIn, SignUp } from "@clerk/clerk-react";
import RecentScans from "./pages/dashboard/RecentScans";
import DragandDrop from "./pages/DragandDrop";
import CameraCapture from "./pages/cameracapture";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignIn redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp redirectUrl="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />
      <Route
        path="/dashboard/scans"
        element={
          <SignedIn>
            <RecentScans />
          </SignedIn>
        }
      />

      <Route
        path="/dashboard/fileselector"
        element={
          <SignedIn>
            <FileSelector />
          </SignedIn>
        }
      />
      <Route
        path="/dashboard/dragdrop"
        element={
          <SignedIn>
            <DragandDrop
              onFiles={(files) => {
                console.log("Dropped files:", files);
              }}
            />
          </SignedIn>
        }
      />
      <Route
        path="/dashboard/camera"
        element={
          <SignedIn>
            <CameraCapture
              onCapture={(files) => {
                console.log("Captured:", files);
              }}
            />
          </SignedIn>
        }
      />
    </Routes>
  );
}

export default App;
