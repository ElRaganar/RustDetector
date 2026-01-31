import { Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";

import Landing from "./pages/Landing";
import FileSelector from "./pages/FileSelector";
import Dashboard from "./pages/Dashboard";
import ChooseUploadMethod from "./pages/ChooseUpload";

import { SignedIn, SignIn, SignUp } from "@clerk/clerk-react";
import RecentScans from "./pages/dashboard/RecentScans";

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
      {/* Dashboard
      <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route
        path="/chooseupload"
        element={
          <ChooseUploadMethod
            onClose={() => navigate("/dashboard")}
          />
        }
      />

      <Route
        path="/fileselector"
        element={
          <FileSelector
            onClose={() => navigate("/chooseupload")}
          />
        }
      /> */}
    </Routes>
  );
}

export default App;
