// pages/Dashboard.jsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const Dashboard = () => (
  <>
    <SignedIn>
      <h1>Upload Rust Image</h1>
    </SignedIn>

    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default Dashboard;
