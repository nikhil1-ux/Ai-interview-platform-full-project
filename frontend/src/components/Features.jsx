import React from 'react'
import '../style/Features.css'

const Features = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Questions',
      description: 'Intelligent system generates contextual questions based on job descriptions'
    },
    {
      icon: '📹',
      title: 'Video Recording',
      description: 'Record your responses and review them to improve your performance'
    },
    {
      icon: '⭐',
      title: 'Detailed Scoring',
      description: 'Get scored on communication, technical skills, and problem-solving ability'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your progress with detailed insights and improvement areas'
    },
    {
      icon: '🤝',
      title: 'Company Integration',
      description: 'Companies can seamlessly review candidate responses and scores'
    },
    {
      icon: '🔄',
      title: 'Practice Unlimited',
      description: 'Take interviews multiple times until you master each job role'
    }
  ]

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need for successful interviews</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-box">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features