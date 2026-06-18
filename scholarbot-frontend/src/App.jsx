import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SoftSkills from "./SoftSkills";
import SchedulerCalendar from "./SchedulerCalendar";

function App() {
  return (
    <Router>
      {/* Main Container */}
      <div style={{ fontFamily: "sans-serif", minHeight: "100vh" }}>
        
        {/* Navigation Bar */}
        <nav
          style={{
            background: "#2c3e50",
            padding: "15px 30px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            Home
          </Link>
          <Link to="/softskills" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            Soft Skills
          </Link>
          <Link to="/scheduler" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            Scheduler
          </Link>
        </nav>

        {/* Content Area */}
        <Routes>
          <Route 
            path="/" 
            element={<div style={{ textAlign: "center", marginTop: "50px" }}><h1>Welcome to ScholarBot</h1></div>} 
          />
          <Route path="/softskills" element={<SoftSkills />} />
          <Route path="/scheduler" element={<SchedulerCalendar />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;