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
          <h2>Smarter Interviews, Better Hires</h2>
          <p>
            Whether you're a candidate looking to stand out or a company 
            looking to shortlist faster, our AI-powered platform has you covered.
          </p>

          <div className="cta-buttons">
            <button 
              className="btn btn--primary btn--large"
              onClick={() => navigate('/signup?role=student')}
            >
              Start Free as Candidate
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