import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import Player from "./components/Player/Player"
import Search from "./pages/Search/Search"
import Login from "./pages/Login/Login"
import Queue from "./pages/Queue/Queue"
import Settings from "./pages/Settings/Settings"
import Rooms from "./pages/Rooms/Rooms"

const App = () => {
  return (
    <BrowserRouter>
      <div id="app">
        <div id="app-page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <div className="sidebar">
          <Player />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
