import React from 'react'
import '../style/Features.css'

const Features = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Questions',
      description: 'Questions are generated dynamically from the job description and each candidate\'s resume'
    },
    {
      icon: '📄',
      title: 'Resume Parsing',
      description: 'Upload a resume and let AI extract the skills and experience that shape your interview'
    },
    {
      icon: '⭐',
      title: 'Detailed Scoring',
      description: 'Get scored on communication, technical skills, and problem-solving ability'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Recruiters get detailed insights and breakdowns for every candidate'
    },
    {
      icon: '🤝',
      title: 'Recruiter Dashboard',
      description: 'Companies can review every candidate\'s responses, scores, and full report in one place'
    },
    {
      icon: '📈',
      title: 'Ranked Shortlisting',
      description: 'Candidates are automatically sorted by score so recruiters see top talent first'
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