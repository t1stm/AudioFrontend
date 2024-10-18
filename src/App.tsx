import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from "react";

import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import Player from "./components/Player/Player"
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login"

const App = () => {
  return (<BrowserRouter>
      <div id="app">
        <div id="app-page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Search />} />
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
