import { Routes, Route } from 'react-router-dom';
import './App.css'

// these imports are for the pages created in the other files. check /src/pages to see pages
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/SignUpPage/SignUp';
import Login from './pages/LoginPage/Login';
import Home from './pages/Homepage/Home';
import ManageCircles from './pages/ManageCircles/ManageCircles';
import Calendar from './pages/Calendar/Calendar';
import Journal from './pages/Journal/Journal';
import MemoryBoard from './pages/MemoryBoard/MemoryBoard';
import Settings from './pages/Settings/Settings';


function App() {
  // any javascript needed would go in this area here

  return (
    // pages will load based on the URL. So a user on the landing page's URL will be routed to that jsx file's output. We don't need to edit these unless we're adding more pages, but for most components the useState hook would be a good choice.
    <Routes>
      {/* These routes are for a user who is logged out. */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* These routes are for a user who is logged in */}
      <Route path="/home" element={<Home />} />
      <Route path="/managecircles" element={<ManageCircles />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/memoryboard" element={<MemoryBoard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App
