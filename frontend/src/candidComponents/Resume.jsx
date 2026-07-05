import React, { useState } from 'react'
import api from '../api/axios'

const Resume = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setStatus("idle");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("error");
      setMessage("Please select a PDF or DOCX file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setStatus("uploading");
    setMessage("");

    try {
      const response = await api.post("/auth/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setMessage(response.data.message || "Resume uploaded successfully");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Resume upload failed. Please try again.");
    }
  };

  return (
    <div className="page">
      <h1>📄 Resume</h1>
      <div className="card">
        <p>Upload your resume for AI-based interview analysis</p>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>
        {status === "success" && <p className="success">{message}</p>}
        {status === "error" && <p className="error">{message}</p>}
      </div>
    </div>
  )
}

export default Resume