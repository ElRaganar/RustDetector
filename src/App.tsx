import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";

import Landing from "./pages/Landing/Landing";
import FileSelector from "./pages/FileSelector";
import Dashboard from "./pages/dashboard/Dashboard";
import type { InferenceResult, DashboardStats } from "./pages/dashboard/Dashboard";
import ChooseUploadMethod from "./pages/ChooseUpload";

import { SignedIn, SignIn, SignUp } from "@clerk/clerk-react";
import RecentScans from "./pages/dashboard/RecentScans";
import DragandDrop from "./pages/DragandDrop";
import CameraCapture from "./pages/cameracapture";
import AIProcessingScreen from "./pages/AIProcessingScreen";
import Result from "./pages/ResultPage";

function App() {
  const navigate = useNavigate();

  // --- LIFTED STATE ---
  // These variables hold your session data while navigating between pages
  const [results, setResults] = useState<InferenceResult[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    criticalRust: 0,
    totalDetections: 0,
  });

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignIn redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp redirectUrl="/dashboard" />} />
      
      {/* Dashboard Route - Passing both results and stats to display and update */}
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard 
              results={results} 
              setResults={setResults} 
              stats={stats} 
              setStats={setStats} 
            />
          </SignedIn>
        }
      />
      
      {/* Recent Scans Route - Passing results to view history */}
      <Route
        path="/dashboard/scans"
        element={
          <SignedIn>
            <RecentScans results={results} />
          </SignedIn>
        }
      />

      {/* Other Protected Routes */}
      <Route
        path="/dashboard/fileselector"
        element={
          <SignedIn>
            <FileSelector />
          </SignedIn>
        }
      />
      
      {/* Camera Route - Passing setters so it can save the captured scan */}
      <Route
        path="/dashboard/camera"
        element={
          <SignedIn>
            <CameraCapture
              setResults={setResults}
              setStats={setStats}
            />
          </SignedIn>
        }
      />
      
      <Route path="/results" element={<Result />} />
    </Routes>
  );
}

export default App;