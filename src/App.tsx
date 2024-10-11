import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";

import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import Player from "./components/Player/Player"
import Home from "./pages/Home";

const App = () => {
  return (<>
      <Navbar />
      <div id="app">
        <Player />
        <BrowserRouter>
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
