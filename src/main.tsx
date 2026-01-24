import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ClerkProvider } from "@clerk/clerk-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} >
    <Router>
      <App />
    </Router>
  </ClerkProvider>
    
    
  </StrictMode>,
)
