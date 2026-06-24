import React from "react";
import { Outlet ,NavLink } from "react-router-dom";
import "../style/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Recruiter</h2>

        <ul>
          <li>Dashboard</li>
          <li><NavLink to ="create-interview">Create Interview</NavLink></li>
          <li>Manage Interviews</li>
          <li>Candidates</li>
          <li>Results</li>
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