// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrainListPage from "./TrainListPage";
import TrainDetailsPage from "./TrainDetailsPage";
import "./App.css"; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<TrainListPage />} />
          <Route path="/train/:id" element={<TrainDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
