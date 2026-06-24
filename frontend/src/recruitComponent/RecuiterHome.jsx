import React from "react";


const RecruiterHome = () => {
  return (
    <div className="recruiter-home">
      <h1>Welcome Recruiter 👋</h1>
      <p>Manage your interviews, candidates, and results from here.</p>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Interviews</h3>
          <p>25</p>
        </div>

        <div className="stat-card">
          <h3>Pending Interviews</h3>
          <p>10</p>
        </div>

        <div className="stat-card">
          <h3>Completed Interviews</h3>
          <p>15</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <button>Create Interview</button>
        <button>View Candidates</button>
        <button>Check Results</button>
      </div>
    </div>
  );
};

export default RecruiterHome;