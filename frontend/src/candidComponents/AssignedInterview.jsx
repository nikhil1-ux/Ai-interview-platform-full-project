import React from 'react'

const AssignedInterview = () => {
  return (
     <div className="page">
      <h1>🎤 Assigned Interviews</h1>

      <div className="card">
        <h3>Google - MERN Developer</h3>
        <p>Status: Not Started</p>
        <button>Start Interview</button>
      </div>

      <div className="card">
        <h3>Infosys - Backend Node</h3>
        <p>Status: In Progress</p>
        <button>Continue</button>
      </div>
    </div>
  )
}

export default AssignedInterview