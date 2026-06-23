import React from 'react'

const Resume = () => {
  return (
    <div className="page">
      <h1>📄 Resume</h1>

      <div className="card">
        <p>Upload your resume for AI-based interview analysis</p>
        <input type="file" />
        <button>Upload</button>
      </div>
    </div>
  )
}

export default Resume