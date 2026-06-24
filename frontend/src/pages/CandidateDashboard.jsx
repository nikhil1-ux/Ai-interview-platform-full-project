import React from "react";
import "../style/CandidateDashboard.css";
import { NavLink, Outlet } from "react-router-dom";

export const CandidateDashboard = () => {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">🤖 AI Interview</div>

        <ul>
          <li ><NavLink to="candidatehome">🏠 Dashboard</NavLink></li>
          <li><NavLink to="assigned-interviews">🎤 Assigned Interviews</NavLink></li>
          <li><NavLink to="resume">📄 Resume</NavLink></li>
          <li><NavLink to="results">📊 Results</NavLink></li>
          <li><NavLink to="ranking">🏆 Ranking</NavLink></li>
          <li><NavLink to="profile">👤 Profile</NavLink></li>
          <li className="logout"><NavLink to="logout">🚪 Logout</NavLink></li>
        </ul>
      </aside>

      {/* MAIN CONTENT CHANGES HERE */}
      <main className="main">
        <Outlet />
      </main>

    </div>
  );
};