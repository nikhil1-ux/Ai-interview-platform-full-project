import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/Hero.css'

const Hero = () => {
  const navigate = useNavigate()
  const [animateScore, setAnimateScore] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>AI-Powered Interview Preparation</span>
          </div>

          <h1 className="hero-title">
            Master Your Interviews with <span className="highlight">AI Feedback</span>
          </h1>

          <p className="hero-description">
            <strong>For Companies:</strong> Create job descriptions and conduct AI-powered interviews. Get detailed candidate assessments instantly.
          </p>

          <p className="hero-description">
            <strong>For Students:</strong> Practice with real-world scenarios, receive AI feedback, and interview with confidence.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">2 min</span>
              <span className="stat-label">Setup Time</span>
            </div>
          </div>

          <div className="hero-buttons">
            <button
              className="btn btn--primary"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
              <span className="btn-arrow">→</span>
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => {
                const element = document.getElementById('how-it-works')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Card Section */}
        <div className="hero-visual">
          {/* Interview Score Card */}
          <div className={`score-card ${animateScore ? 'animate' : ''}`}>
            <div className="score-header">
              <h3>Your Interview Score</h3>
              <span className="score-badge">Excellent</span>
            </div>

            <div className="score-display">
              <svg viewBox="0 0 100 100" className="score-circle">
                <circle cx="50" cy="50" r="45" className="score-circle-bg" />
                <circle cx="50" cy="50" r="45" className="score-circle-fill" />
              </svg>
              <span className="score-value">92</span>
              <span className="score-percent">%</span>
            </div>

            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="item-label">Communication</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '94%' }}></div>
                </div>
                <span className="item-value">94%</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Technical Skills</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '88%' }}></div>
                </div>
                <span className="item-value">88%</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Problem Solving</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '92%' }}></div>
                </div>
                <span className="item-value">92%</span>
              </div>
            </div>

            <p className="score-feedback">
              "Excellent communication and strong technical knowledge. Great job explaining your problem-solving approach!"
            </p>

            <button className="score-action">View Full Feedback</button>
          </div>

          {/* Floating Interview Badge */}
          <div className="floating-badge interview-badge">
            <span className="badge-icon">📋</span>
            <div>
              <p>Live Interview</p>
              <small>In Progress</small>
            </div>
          </div>

          {/* Floating Candidate Badge */}
          <div className="floating-badge candidate-badge">
            <span className="badge-icon">✅</span>
            <div>
              <p>5 Candidates</p>
              <small>Evaluated Today</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero