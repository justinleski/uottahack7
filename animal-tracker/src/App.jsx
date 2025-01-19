
import './App.css';
import Camera from './components/Camera.jsx';
import Buttons from "./components/Buttons.jsx";
import Map from './components/Map.jsx';
import Profile from './components/Profile.jsx';
import Leaderboard from './components/Leaderboard.jsx'; // Added Leaderboard

// w3s
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="app-container">
          <Buttons />
          <Routes>
            <Route path="/camera" element={<Camera />} />
            <Route path="/map" element={<Map />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} /> {/* Leaderboard Route */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
