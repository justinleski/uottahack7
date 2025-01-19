import './App.css';
import Camera from './components/Camera.jsx';
import Buttons from "./components/Buttons.jsx";
import Map from './components/Map.jsx';
import Profile from './components/Profile.jsx';
import Leaderboard from './components/Leaderboard.jsx';

// w3s
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="app-container">
          <Buttons />
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} /> {/* Redirect to Map */}
            <Route path="/map" element={<Map />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
