import React, { useState } from 'react'
import '../style/Faq.css'

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How does the AI interview process work?',
      answer: 'Students select a job description, and our AI generates interview questions based on the role. They answer on camera, and our system provides instant feedback on communication, technical knowledge, and problem-solving skills.'
    },
    {
      question: 'Can companies customize interview questions?',
      answer: 'Yes! Companies can create custom job descriptions, and our AI will generate relevant questions. They can also review and adjust questions before candidates interview.'
    },
    {
      question: 'How is student performance scored?',
      answer: 'Responses are evaluated on multiple factors: clarity of communication, technical accuracy, relevant examples, response structure, and problem-solving approach. Each aspect gets a detailed score.'
    },
    {
      question: 'Can I retake interviews to improve my score?',
      answer: 'Absolutely! Students can practice unlimited times for each job role. We recommend waiting 24 hours between attempts to allow for better preparation.'
    },
    {
      question: 'How do companies access candidate information?',
      answer: 'Companies get a complete dashboard showing all candidates who interviewed for their positions. They can view scores, watch video responses, and read AI-generated summaries.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Students get free access to 3 practice interviews. Companies get a 14-day free trial with access to all features.'
    }
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about AI Interview Pro</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">+</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq