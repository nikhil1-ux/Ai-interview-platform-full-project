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
      description: 'Our AI creates interview questions tailored to the job description and each candidate\'s resume',
      icon: '🤖'
    },
    {
      number: '3',
      title: 'Candidates Get Interviewed',
      description: 'Candidates upload their resume and take the AI-driven interview automatically',
      icon: '👥'
    },
    {
      number: '4',
      title: 'Get Ranked Shortlists',
      description: 'Instantly see scored, ranked candidates ready for the next round',
      icon: '📊'
    }
  ]

  const studentSteps = [
    {
      number: '1',
      title: 'Choose a Job',
      description: 'Browse open roles that match your skills and interests',
      icon: '🔍'
    },
    {
      number: '2',
      title: 'Upload Your Resume',
      description: 'Your resume shapes the interview questions you\'ll be asked',
      icon: '📄'
    },
    {
      number: '3',
      title: 'Take the AI Interview',
      description: 'Answer questions generated specifically for the role and your background',
      icon: '🎤'
    },
    {
      number: '4',
      title: 'Get Your Results',
      description: 'Receive a detailed score and feedback on your performance',
      icon: '💡'
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