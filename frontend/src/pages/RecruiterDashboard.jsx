import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import "../style/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // close the drawer whenever the route changes
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

  // switch body to the lighter "paper" text/background register used by
  // logged-in dashboards, instead of the dark marketing-page defaults
  useEffect(() => {
    document.body.classList.add("app-shell");
    return () => {
      document.body.classList.remove("app-shell");
    };
  }, []);

  return (
    <div className="dashboard">

      {/* MOBILE TOPBAR (hamburger trigger) */}
      <header className="mobileTopbar">
        <h2>Recruiter</h2>
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

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h2>Recruiter</h2>

        <ul>
          <li><NavLink to="" end>Dashboard</NavLink></li>
          <li><NavLink to="create-interview">Create Interview</NavLink></li>
          <li><NavLink to="manage-interviews">Manage Interviews</NavLink></li>
          <li><NavLink to="candidates">Candidates</NavLink></li>
          <li><NavLink to="results">Results</NavLink></li>
          <li><NavLink to="logout">Logout</NavLink></li>
        </ul>
      </aside>

      <main className="content">
        {/* Nested pages will render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterDashboard;