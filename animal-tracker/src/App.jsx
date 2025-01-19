import './App.css'
import Camera from './components/Camera.jsx';
import Buttons from "./components/Buttons.jsx";
import Map from './components/Map.jsx';
import Profile from './components/Profile.jsx';

// w3s
import {BrowserRouter, Routes, Route} from "react-router-dom";



function App() {
  return (
    <>
    {/* <Map /> */}

    <BrowserRouter>
        <div className="app-container">
            <Buttons/>
            <Routes>
                <Route path="/camera" element={<Camera/>}></Route>
                <Route path="/Map" element={<Map/>}></Route>
                <Route path="/Profile" element={<Profile/>}></Route>
            </Routes>



        </div>
    </BrowserRouter>



</>
)
}

export default App;
