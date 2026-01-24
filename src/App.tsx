
import { Route, Routes } from 'react-router-dom';
import './index.css'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import {
  SignIn,
  SignUp
} from "@clerk/clerk-react";


function App() {
 

  return (
  <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/sign-in/*" element={<SignIn />} />
  <Route path="/sign-up/*" element={<SignUp />} />
  <Route path="/dashboard" element={<Dashboard />} />

</Routes>
  )
}

export default App
