import React from "react";


const CandidateHome = () => {
  return (
    <div className="dashboard-home">

      {/* HEADER */}
      <div className="welcome-section">
        <h1>👋 Welcome Back!</h1>
        <p>Track your interviews, improve skills, and grow your ranking.</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats">
        <div className="card">
          <h2>3</h2>
          <p>Assigned Interviews</p>
        </div>

        <div className="card">
          <h2>1</h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>85%</h2>
          <p>Avg Score</p>
        </div>

        <div className="card">
          <h2>#12</h2>
          <p>Ranking</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="actions">
        <h2>⚡ Quick Actions</h2>

        <div className="action-buttons">
          <button>🎤 Start Interview</button>
          <button>📄 Upload Resume</button>
          <button>📊 View Results</button>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="insights">
        <h2>🤖 AI Insights</h2>
        <ul>
          <li>Improve Data Structures & Algorithms</li>
          <li>Practice System Design Basics</li>
          <li>Focus on Node.js backend optimization</li>
          <li>Strength: React fundamentals 👍</li>
        </ul>
      </div>

    </div>
  );
};

export default CandidateHome;