import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/ForCompanies.css'

const ForCompanies = () => {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: '⚡',
      title: 'Save Time',
      description: 'Automated, AI-driven interviews reduce screening time by 70%'
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Cut recruitment costs by removing manual first-round screening'
    },
    {
      icon: '📊',
      title: 'Data Driven',
      description: 'Every candidate is scored on communication, technical skill, and problem solving'
    },
    {
      icon: '🎯',
      title: 'Ranked Shortlists',
      description: 'Instantly see candidates ranked by score, ready for the next round'
    }
  ]

  return (
    <section className="for-companies" id="for-companies">
      <div className="container">
        <div className="companies-content">
          {/* Left Side - Benefits */}
          <div className="companies-left">
            <h2>For Companies</h2>
            <p className="companies-intro">
              Set a job description, let AI interview every candidate based on their resume, and get a ranked shortlist in return.
            </p>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>

            <button 
              className="btn btn--primary"
              onClick={() => navigate('/signup?role=company')}
            >
              Start Hiring →
            </button>
          </div>

          {/* Right Side - Visual */}
          <div className="companies-right">
            <div className="company-mockup">
              <div className="mockup-header">
                <h3>Job Openings</h3>
                <span className="badge">3 New</span>
              </div>

              <div className="job-card">
                <h4>Senior Developer</h4>
                <p>15 candidates • 8 interviews completed</p>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '53%' }}></div>
                  </div>
                  <span className="progress-text">53%</span>
                </div>
              </div>

              <div className="job-card">
                <h4>Product Manager</h4>
                <p>12 candidates • 5 interviews completed</p>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '42%' }}></div>
                  </div>
                  <span className="progress-text">42%</span>
                </div>
              </div>

              <div className="mockup-stats">
                <div className="stat">
                  <span className="stat-label">Avg Response Time</span>
                  <span className="stat-value">2 hours</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Candidates Screened</span>
                  <span className="stat-value">127</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForCompanies