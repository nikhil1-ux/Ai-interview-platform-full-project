import React from 'react'
import '../style/HowItWorks.css'

const HowItWorks = () => {
  const companySteps = [
    {
      number: '1',
      title: 'Create Job Description',
      description: 'Post your job details, requirements, and technical skills needed',
      icon: '📝'
    },
    {
      number: '2',
      title: 'AI Generates Questions',
      description: 'Our AI automatically creates relevant interview questions',
      icon: '🤖'
    },
    {
      number: '3',
      title: 'Receive Candidates',
      description: 'Students practice and take interviews automatically',
      icon: '👥'
    },
    {
      number: '4',
      title: 'Get Detailed Reports',
      description: 'Instant feedback, scores, and candidate assessments',
      icon: '📊'
    }
  ]

  const studentSteps = [
    {
      number: '1',
      title: 'Choose a Job',
      description: 'Browse job descriptions matching your skills and interests',
      icon: '🔍'
    },
    {
      number: '2',
      title: 'Practice Interview',
      description: 'Answer AI-generated questions in a realistic interview setting',
      icon: '🎤'
    },
    {
      number: '3',
      title: 'Get AI Feedback',
      description: 'Receive detailed feedback on communication and technical skills',
      icon: '💡'
    },
    {
      number: '4',
      title: 'Improve & Retry',
      description: 'Learn from feedback and retake interviews to improve scores',
      icon: '📈'
    }
  ]

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2>How It Works</h2>
          <p>A seamless experience designed for both companies and candidates</p>
        </div>

        {/* Two Column Layout */}
        <div className="workflows">
          {/* For Companies */}
          <div className="workflow">
            <div className="workflow-header">
              <h3>For Companies</h3>
              <span className="workflow-badge">Hiring Made Easy</span>
            </div>

            <div className="steps">
              {companySteps.map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number-circle">
                    <span className="step-icon">{step.icon}</span>
                  </div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                  {index < companySteps.length - 1 && <div className="step-line"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* For Students */}
          <div className="workflow">
            <div className="workflow-header">
              <h3>For Students</h3>
              <span className="workflow-badge">Interview Ready</span>
            </div>

            <div className="steps">
              {studentSteps.map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number-circle">
                    <span className="step-icon">{step.icon}</span>
                  </div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                  {index < studentSteps.length - 1 && <div className="step-line"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks