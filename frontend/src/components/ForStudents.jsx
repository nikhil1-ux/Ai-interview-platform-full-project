import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/ForStudents.css'

const ForStudents = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: '📄',
      title: 'Resume-Based Questions',
      description: 'AI tailors every question to your resume and the job description'
    },
    {
      icon: '🤖',
      title: 'AI Interviewer',
      description: 'Answer questions in a real interview conducted entirely by AI'
    },
    {
      icon: '📊',
      title: 'Instant Scoring',
      description: 'Get a detailed breakdown of your communication and technical performance'
    },
    {
      icon: '🏆',
      title: 'Stand Out to Recruiters',
      description: 'Strong scores put you at the top of the recruiter\'s shortlist'
    }
  ]

  return (
    <section className="for-students">
      <div className="container">
        <div className="students-content">
          {/* Left Side - Visual */}
          <div className="students-left">
            <div className="student-mockup">
              <div className="mockup-top">
                <h3>AI Interview</h3>
                <span className="session-badge">Question 1 of 5</span>
              </div>

              <div className="interview-card">
                <div className="question-header">
                  <h4>Question 1 of 5</h4>
                  <span className="timer">⏱️ 2:45</span>
                </div>
                <p className="question-text">
                  "Describe a complex project you worked on and explain your role in it."
                </p>
                <div className="recording-indicator">
                  <span className="recording-dot"></span>
                  Recording in progress...
                </div>
              </div>

              <div className="interview-stats">
                <div className="interview-stat">
                  <span className="stat-icon">💬</span>
                  <div>
                    <p>Fluency Score</p>
                    <span>85%</span>
                  </div>
                </div>
                <div className="interview-stat">
                  <span className="stat-icon">⚡</span>
                  <div>
                    <p>Response Time</p>
                    <span>2.5s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="students-right">
            <h2>For Students</h2>
            <p className="students-intro">
              Upload your resume, take an AI-driven interview tailored to the job, and let your results speak for themselves.
            </p>

            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn--primary"
              onClick={() => navigate('/signup?role=student')}
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForStudents