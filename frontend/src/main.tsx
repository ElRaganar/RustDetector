import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark, neobrutalism } from "@clerk/themes";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MissingClerkKey = () => (
  <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
    <h1 style={{ fontSize: 20, marginBottom: 8 }}>
      Missing Clerk Publishable Key
    </h1>
    <p>
      Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env</code> (project
      root) or export it in your shell, then restart Vite.
    </p>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {clerkKey ? (
      <ClerkProvider
        publishableKey={clerkKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
      >
        <Router>
          <App />
        </Router>
      </ClerkProvider>
    ) : (
      <MissingClerkKey />
    )}
  </StrictMode>,
);
