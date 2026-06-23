import React from 'react'
import "../style/CandidateDashboard.css"
import { NavLink } from 'react-router-dom'


export const CandidateDashboard = () => {
  return (
  <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">🤖 AI Interview</div>

        <ul>
          <li className="active">🏠 Dashboard</li>
          <li>   
            <NavLink to="/assigned-interviews">🎤 Assigned Interviews</NavLink>
          </li>
          <li>
              <NavLink to="/resume">📄 Resume</NavLink>
          </li>
          <li>
             <NavLink to="/results">📊 Results</NavLink>
          </li>
          <li>
              <NavLink to="/ranking">🏆 Ranking</NavLink>
          </li>
          <li>
            <NavLink to="/profile">👤 Profile</NavLink>
          </li>
          <li className="logout">
            <NavLink to="/logout">🚪 Logout</NavLink>
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <h1>Welcome Back 👋</h1>
            <p>Track your interviews across companies</p>
          </div>

          <button className="btn-primary">
            + Join Latest Interview
          </button>
        </header>

        {/* COMPANY INTERVIEWS */}
        <section className="companies">

          <div className="company-card">
            <h2>📍 Google</h2>
            <p>MERN Developer Interview</p>
            <span className="status not-started">Not Started</span>
            <button>Join Interview</button>
          </div>

          <div className="company-card">
            <h2>📍 Infosys</h2>
            <p>Backend Node.js Interview</p>
            <span className="status in-progress">In Progress</span>
            <button>Continue</button>
          </div>

          <div className="company-card">
            <h2>📍 Startup XYZ</h2>
            <p>React Developer Interview</p>
            <span className="status completed">Completed</span>
            <button>View Result</button>
          </div>

        </section>

        {/* LOWER SECTION */}
        <section className="bottom">

          {/* AI INSIGHTS */}
          <div className="panel">
            <h2>🤖 AI Insights</h2>
            <ul>
              <li>Improve Node.js event loop understanding</li>
              <li>Practice system design basics</li>
              <li>Strong in React fundamentals</li>
              <li>Focus on API optimization</li>
            </ul>
          </div>

          {/* RESUME */}
          <div className="panel resume">
            <h2>📄 Resume</h2>
            <p>Upload your resume to get personalized interviews</p>
            <button>Upload Resume</button>
          </div>

        </section>

      </main>
    </div>
  )
}
