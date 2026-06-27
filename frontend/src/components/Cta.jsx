import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/Cta.css'

const CTA = () => {
  const navigate = useNavigate()

  return (
    <section className="cta">
      <div className="cta-container">
        <div className="cta-content">
          <span className="cta-badge">Ready to Get Started?</span>
          <h2>Join Thousands of Successful Interviews</h2>
          <p>
            Whether you're a student looking to ace your interviews or a company 
            seeking top talent, AI Interview Pro is your ultimate solution.
          </p>

          <div className="cta-buttons">
            <button 
              className="btn btn--primary btn--large"
              onClick={() => navigate('/signup?role=student')}
            >
              Start Free as Student
            </button>
            <button 
              className="btn btn--secondary btn--large"
              onClick={() => navigate('/signup?role=company')}
            >
              Start Free as Company
            </button>
          </div>

          <p className="cta-subtext">
            No credit card required • Free trial • Cancel anytime
          </p>
        </div>

        <div className="cta-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </div>
    </section>
  )
}

export default CTA