import { Routes, Route } from 'react-router-dom';
import { useState } from "react";
import './App.css'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// these imports are for the pages created in the other files. check /src/pages to see pages
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/SignUpPage/SignUp';
import Login from './pages/LoginPage/Login';
import ForgotPass from './pages/ForgotPassword/ForgotPass';
import ResetPass from './pages/ResetPassword/ResetPass';
import Home from './pages/Homepage/Home';
import NewHome from './pages/NewUserHomePage/NewHome';
import ManageCircles from './pages/ManageCircles/ManageCircles';
import Calendar from './pages/Calendar/Calendar';
import Journal from './pages/Journal/Journal';
import MemoryBoard from './pages/MemoryBoard/MemoryBoard';
import Settings from './pages/Settings/Settings';

function App() {
  //any javascript needed would go in this area here
  //The current state for the circle name is saved to this jsx file so that it's saved across the pages with the header. This will likely have to be edited to incorporate the backend later on.
  const [circleName, setCircleName] = useState("Capstone 2025!");

  return (
    <AuthProvider>
      <Routes>
        {/* These routes are for a user who is logged out. */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password" element={<ResetPass />} />


        {/* These routes are for a user who is logged in */}
        <Route path="/home" element={<ProtectedRoute><Home circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/newhome" element={<ProtectedRoute><NewHome circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/managecircles" element={<ProtectedRoute><ManageCircles circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/memoryboard" element={<ProtectedRoute><MemoryBoard circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App
