import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import './App.css'
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
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

const [activeCircleId, setActiveCircleId] = useState(null);
const [circles, setCircles] = useState([]);
const [circlesLoaded, setCirclesLoaded] = useState(false);

const circleName = circles.find(c => c._id === activeCircleId)?.name || "";
const setCircleName = (name) => {
    const circle = circles.find(c => c.name === name);
    if (circle) setActiveCircleId(circle._id);
};

async function fetchCircles() {
    try {
        const response = await fetch('/api/circles', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setCircles(data);
            if (data.length > 0) setActiveCircleId(prev => prev || data[0]._id);
        }
    } catch {
        console.log('Failed to fetch circles');
    }
    setCirclesLoaded(true);
}

useEffect(() => {
    fetchCircles();
}, []);

async function addCircle(newCircleName) {
    try {
        const response = await fetch('/api/circles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: newCircleName })
        });
        if (response.ok) {
            const newCircle = await response.json();
            setCircles(prev => [...prev, newCircle]);
            setActiveCircleId(newCircle._id);
            return newCircle._id;
        }
    } catch {
        console.log('Failed to create circle');
    }
    return null;
}

async function updateCircleName(newName) {
    try {
        const response = await fetch(`/api/circles/${activeCircleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: newName })
        });
        if (response.ok) {
            setCircles(prev => prev.map(circle =>
                circle._id === activeCircleId ? { ...circle, name: newName } : circle
            ));
        }
    } catch {
        console.log('Failed to update circle');
    }
}

async function removeCircle(circleId) {
    try {
        const response = await fetch(`/api/circles/${circleId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            const updatedCircles = circles.filter(c => c._id !== circleId);
            setCircles(updatedCircles);
            if (updatedCircles.length > 0) {
                setActiveCircleId(updatedCircles[0]._id);
            } else {
                setActiveCircleId(null);
            }
        }
    } catch {
        console.log('Failed to leave circle');
    }
}
  return (
    <LanguageProvider>
    <AuthProvider>
      <Routes>
        {/* These routes are for a user who is logged out. */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password" element={<ResetPass />} />


        {/* These routes are for a user who is logged in */}
        <Route path="/home" element={
  <ProtectedRoute>
    {circlesLoaded && circles.length === 0
      ? <NewHome circleName={circleName} setCircleName={setCircleName} />
      : <Home
          circleName={circleName}
          setCircleName={setCircleName}
          circles={circles}
          activeCircleId={activeCircleId}
          setActiveCircleId={setActiveCircleId}
        />
    }
  </ProtectedRoute>
} />

        <Route path="/managecircles" element={<ProtectedRoute><ManageCircles circleName={circleName} setCircleName={setCircleName} addCircle={addCircle} updateCircleName={updateCircleName} removeCircle={removeCircle} activeCircleId={activeCircleId} circles={circles} refreshCircles={fetchCircles} /></ProtectedRoute>} />
        <Route path="/newhome" element={<ProtectedRoute><NewHome circleName={circleName} setCircleName={setCircleName} /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar circleName={circleName} setCircleName={setCircleName} activeCircleId={activeCircleId} /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal circleName={circleName} setCircleName={setCircleName} activeCircleId={activeCircleId} /></ProtectedRoute>} />
        <Route path="/memoryboard" element={<ProtectedRoute><MemoryBoard circleName={circleName} setCircleName={setCircleName} activeCircleId={activeCircleId} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App
