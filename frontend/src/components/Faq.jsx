import React, { useState } from 'react'
import '../style/Faq.css'

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How does the AI interview process work?',
      answer: 'Candidates upload their resume and select a job description. Our AI generates interview questions based on the role and the candidate\'s resume, then evaluates each answer to provide a detailed score on communication, technical knowledge, and problem-solving skills.'
    },
    {
      question: 'Can companies customize interview questions?',
      answer: 'Yes! Companies create a job description, and our AI generates relevant questions from it. Questions are also shaped by each candidate\'s resume, so every interview is tailored.'
    },
    {
      question: 'How is candidate performance scored?',
      answer: 'Responses are evaluated on multiple factors: clarity of communication, technical accuracy, relevant examples, response structure, and problem-solving approach. Each aspect gets a detailed score.'
    },
    {
      question: 'How are candidates shortlisted?',
      answer: 'Once candidates complete their AI interview, their scores are automatically ranked. Recruiters see a sorted shortlist, making it easy to identify top candidates at a glance.'
    },
    {
      question: 'How do companies access candidate information?',
      answer: 'Companies get a complete dashboard showing all candidates who interviewed for their positions, including their scores, interview transcripts, and AI-generated summaries.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Companies get a 14-day free trial with access to all features.'
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
          <p>Everything you need to know about our AI interview platform</p>
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