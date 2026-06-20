import React from 'react'
import "../style/Features.css"


const Features = () => {

  const features= [
      {
    title: "AI Mock Interviews",
    description: "Practice interviews with AI-generated questions."
  },
  {
    title: "Instant Feedback",
    description: "Get detailed feedback instantly."
  },
  {
    title: "Resume Analysis",
    description: "Improve your resume using AI insights."
  },
  {
    title: "Performance Analytics",
    description: "Track interview progress and performance."
  },
  {
    title: "Video Interview Support",
    description: "Conduct and record video interviews."
  },
  {
    title: "Email Notifications",
    description: "Receive updates and reminders via email."
  }
  ];

  return (
   <section className="features">
          <h2>Powerful Features</h2>
      <p>Everything needed for students and recruiters.</p>
      
      <div className="features-grid">
        
        {features.map((item,index)=>(
         <div className="feature-card" key={index}>

            <h3>{item.title}</h3>
           <p>{item.description}</p>
          
      
         
         
          </div>
           
          
        ))}
      
        </div>
      
   </section>
  )
}

export default Features