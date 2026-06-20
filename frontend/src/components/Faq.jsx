import React from 'react'
import "../style/Faq.css"

const Faq = () => {
  return (
    < section className="faq">
      <h2>Frequently Asked Questions</h2>


      <div className="faq-box">
        <h3>Is this platform free?</h3>
        <p>Yes, students can start with free AI mock interviews.</p>
      </div>

         <div className="faq-box">
        <h3>Can recruiters use it?</h3>
        <p>Yes, recruiters can screen candidates using AI interviews.</p>
      </div>

         <div className="faq-box">
        <h3>Does it give instant feedback?</h3>
        <p>Yes, users get score, feedback, and improvement tips instantly.</p>
      </div>
      
    </section>
  )
}

export default Faq