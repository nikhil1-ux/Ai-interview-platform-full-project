import React from "react";
import "../style/StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>AI Interview</h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>📄 Resume</li>
          <li>🎤 My Interviews</li>
          <li>📊 Results</li>
          <li>🤖 AI Feedback</li>
          <li>👤 Profile</li>
          <li>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, Nikhil 👋</h1>
        <p>Ready for your next interview?</p>

        {/* Stats */}
        <div className="stats">
          <div className="card">
            <h3>12</h3>
            <p>Total Interviews</p>
          </div>

          <div className="card">
            <h3>8</h3>
            <p>Completed</p>
          </div>

          <div className="card">
            <h3>82%</h3>
            <p>Average Score</p>
          </div>

          <div className="card">
            <h3>4</h3>
            <p>Upcoming</p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="section">
          <h2>Resume</h2>
          <p>Resume Uploaded ✅</p>
          <button>Update Resume</button>
        </div>

        {/* Upcoming Interviews */}
        <div className="section">
          <h2>Upcoming Interviews</h2>

          <div className="interview-card">
            <h4>Frontend Developer</h4>
            <p>Scheduled: Tomorrow 10 AM</p>
            <button>Start Interview</button>
          </div>

          <div className="interview-card">
            <h4>React Developer</h4>
            <p>Scheduled: Friday 3 PM</p>
            <button>Start Interview</button>
          </div>
        </div>

        {/* Recent Results */}
        <div className="section">
          <h2>Recent Results</h2>

          <table>
            <thead>
              <tr>
                <th>Interview</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>React</td>
                <td>85%</td>
              </tr>

              <tr>
                <td>Java</td>
                <td>90%</td>
              </tr>

              <tr>
                <td>DSA</td>
                <td>80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;