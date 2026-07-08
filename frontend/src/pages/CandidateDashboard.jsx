import React, { useEffect, useState } from "react";
import "../style/CandidateDashboard.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export const CandidateDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // close the drawer whenever the route changes (e.g. after tapping a link)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // prevent background scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="layout">

      {/* MOBILE TOPBAR (hamburger trigger) */}
      <header className="mobileTopbar">
        <div className="logo">🤖 AI Interview</div>
        <button
          className="menuBtn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* OVERLAY (tap outside to close) */}
      {menuOpen && (
        <div className="sidebarOverlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
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