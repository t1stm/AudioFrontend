import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
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
  )
}

export default App
