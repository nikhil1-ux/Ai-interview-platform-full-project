import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/ForStudents.css'

const ForStudents = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: '🎯',
      title: 'Real-World Practice',
      description: 'Practice with actual job descriptions from top companies'
    },
    {
      icon: '🤖',
      title: 'AI Coach',
      description: 'Get instant feedback on your answers and communication'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'See how you improve with detailed score analytics'
    },
    {
      icon: '🏆',
      title: 'Confidence Builder',
      description: 'Interview multiple times until you master it'
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
                <h3>Interview Preparation</h3>
                <span className="session-badge">Session 3/5</span>
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
              Land your dream job with confidence. Practice with AI, get real feedback, and master technical interviews.
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
              Start Practicing →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForStudents