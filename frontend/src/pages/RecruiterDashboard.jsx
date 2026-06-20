import React from "react";
import "../style/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Recruiter</h2>

        <ul>
          <li>Dashboard</li>
          <li>Create Interview</li>
          <li>Manage Interviews</li>
          <li>Candidates</li>
          <li>Results</li>
        </ul>
      </aside>

      <main className="content">
        <h1>Recruiter Dashboard</h1>

        <div className="cards">
          <div className="card">
            <h3>Total Interviews</h3>
            <p>25</p>
          </div>

          <div className="card">
            <h3>Pending</h3>
            <p>10</p>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <p>15</p>
          </div>
        </div>

        <div className="table-section">
          <h2>Recent Interviews</h2>

          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Difficulty</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Frontend Developer</td>
                <td>Medium</td>
                <td>Pending</td>
              </tr>

              <tr>
                <td>Java Developer</td>
                <td>Hard</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;