import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Camera from './components/Camera.jsx'
import Buttons from "./components/Buttons.jsx";

function App() {
  return (
    <>
      <Camera/>
      <Buttons/>
    </>
  )
}

export default App
