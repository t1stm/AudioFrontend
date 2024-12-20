import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import Player from "./components/Player/Player"
import Search from "./pages/Search/Search"
import Login from "./pages/Login/Login"
import Queue from "./pages/Queue/Queue"
import Settings from "./pages/Settings/Settings"
import Rooms from "./pages/Rooms/Rooms"
import Chat from "./components/Chat/Chat"

const App = () => {
  return (
    <BrowserRouter>
      <div id="app">
        <div id="app-page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/chat" element={<Chat standalone={true} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <div className="sidebar">
          <Player />
          <Chat standalone={false} />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
