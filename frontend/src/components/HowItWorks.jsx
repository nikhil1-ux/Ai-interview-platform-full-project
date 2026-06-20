 import React from 'react'
 import "../style/HowItWorks.css"
 
 const HowItWorks = () => {

  const steps = [
     "Create Account",
    "Upload Resume",
    "Choose Interview Type",
    "AI Conducts Interview",
    "Get Score & Feedback",
  ];
   return (
     
    <section className="how-it-works">
      <h2>How It Works</h2>

      <div className="steps">

        {steps.map((step,index)=>(

          <div className="Step-card" key={index}>
            <span>{index+1}</span>
            <h3 >{step}</h3>
          </div>
        ))}
      </div>
      </section>
   )
 }
 
 export default HowItWorks
