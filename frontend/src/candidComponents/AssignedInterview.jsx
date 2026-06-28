import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js';


const AssignedInterview = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingId, setStartingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await api.get("/auth/my-interviews");
        setAssignments(res.data.data.assignments || []);
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to load interviews";
        setError(errorMsg);
        console.error("Fetch interviews error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const startInterview = async (assignmentId, interviewTitle) => {
    setStartingId(assignmentId);
    setError(null);
    try {
      const res = await api.post(`/auth/assignment/${assignmentId}/start`);
      const { sessionId } = res.data.data;
      navigate(`/interview/${sessionId}`, {
        state: { interviewTitle, sessionId }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to start interview";
      setError(errorMsg);
      console.error("Start interview error:", err);
      setStartingId(null);
    }
  };

  return (
    <div className="page">
      <h1>🎤 Assigned Interviews</h1>
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {loading ? (
        <p className="loading">Loading interviews...</p>
      ) : assignments.length === 0 ? (
        <p className="no-interviews">No interviews assigned yet</p>
      ) : (
        <div className="interviews-container">
          {assignments.map((assignment) => (
            <div className="card" key={assignment._id}>
              <div className="card-header">
                <h3>{assignment.interviewId?.title || "Untitled Interview"}</h3>
                <span className={`status-badge status-${assignment.status}`}>
                  {assignment.status === "assigned" ? "Not Started" 
                    : assignment.status === "in-progress" ? "In Progress" 
                    : "Completed"}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Company:</strong> {assignment.interviewId?.company || "N/A"}</p>
                <p><strong>Role:</strong> {assignment.interviewId?.jobRole || "N/A"}</p>
                <p><strong>Duration:</strong> {assignment.interviewId?.duration || "N/A"} minutes</p>
                <p><strong>Skills:</strong> {assignment.interviewId?.skills || "N/A"}</p>
              </div>
              <div className="card-footer">
                <button
                  onClick={() => startInterview(assignment._id, assignment.interviewId?.title)}
                  disabled={startingId === assignment._id || assignment.status === "completed"}
                  className={`btn ${assignment.status === "completed" ? "btn-disabled" : "btn-primary"}`}
                >
                  {startingId === assignment._id ? (
                    <><span className="spinner"></span> Starting...</>
                  ) : assignment.status === "assigned" ? (
                    "Start Interview"
                  ) : assignment.status === "in-progress" ? (
                    "Resume Interview"
                  ) : (
                    "View Results"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AssignedInterview;