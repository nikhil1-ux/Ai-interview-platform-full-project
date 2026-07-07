import React from "react";
import { Outlet ,NavLink } from "react-router-dom";
import "../style/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Recruiter</h2>

        <ul>
          <li><NavLink to="" end>Dashboard</NavLink></li>
          <li><NavLink to="create-interview">Create Interview</NavLink></li>
          <li><NavLink to="manage-interviews">Manage Interviews</NavLink></li>
          <li><NavLink to="candidates">Candidates</NavLink></li>
          <li><NavLink to="results">Results</NavLink></li>
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