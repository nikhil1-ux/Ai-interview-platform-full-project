import React from 'react'
import "../style/Hero.css"

const Hero = () => {
  return (
    <section className = "hero">
      <div className="hero-content">
        <h1>AI-Powered Interview Platform</h1>
             <p>
          Practice interviews with AI, get instant feedback, improve your skills,
          and become job-ready faster.
        </p>

        <div className="hero-buttons">
          <button className="get-started-button">
            Start Free Interview
          </button>
          <button className="outline-btn">Watch Demo</button>
        </div>
       </div>
        
        <div className="hero-card">
          <h3>Interview Score</h3>
      <h1>92%</h1>
        <p>Excellent communication and technical skills</p>
        </div>
      
      
      
    </section>
   
  )
}

export default Hero