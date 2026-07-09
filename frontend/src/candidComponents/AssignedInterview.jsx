import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "../candidCompStyle/AssignedInterview.css";
import toast from "react-hot-toast";
 
const AssignedInterview = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingId, setStartingId] = useState(null);
 
  const navigate = useNavigate();
 
  // ---------------------------
  // Fetch Assigned Interviews
  // ---------------------------
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        toast.loading("Loading interviews...");
        setLoading(true);
        setError(null);
 
        const res = await api.get("/auth/my-interviews");
        setAssignments(res.data.data.assignments || []);
      } catch (err) {
       toast.error(
          err.response?.data?.message || "Failed to load interviews"
        );
        setError(
          err.response?.data?.message || "Failed to load interviews"
        );
      } finally {
        setLoading(false);
      }
    };
 
    fetchInterviews();
  }, []);
 
  // ---------------------------
  // Start Interview Handler
  // ---------------------------
  const startInterview = async (assignmentId, interviewTitle) => {
    try {
      setStartingId(assignmentId);
      setError(null);
 
      const res = await api.post(
        `/auth/assignment/${assignmentId}/start`
      );
 
      const { sessionId } = res.data.data;
 
      navigate(`/interview/${sessionId}`, {
        state: {
          interviewTitle,
          sessionId,
        },
      });
    } catch (err) {
      console.error("Start interview error:", err);
      setError(
        err.response?.data?.message || "Failed to start interview"
      );
    } finally {
      setStartingId(null);
    }
  };
 
  // ---------------------------
  // UI States
  // ---------------------------
  if (loading) {
    return <p className="loading">Loading interviews...</p>;
  }
 
  if (!loading && assignments.length === 0) {
    return <p className="no-interviews">No interviews assigned yet</p>;
  }
 
  // ---------------------------
  // Main UI
  // ---------------------------
  return (
    <div className="page">
      <h1>🎤 Assigned Interviews</h1>
 
      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
 
      <div className="interviews-container">
        {assignments.map((assignment) => {
          const interview = assignment.interviewId;
 
          return (
            <div className="card" key={assignment._id}>
              
              {/* Header */}
              <div className="card-header">
                <h3>{interview?.title || "Untitled Interview"}</h3>
 
                <span className={`status-badge status-${assignment.status}`}>
                  {assignment.status === "assigned"
                    ? "Not Started"
                    : assignment.status === "in-progress"
                    ? "In Progress"
                    : "Completed"}
                </span>
              </div>
 
              {/* Body */}
              <div className="card-body">
                <p>
                  <strong>Company:</strong>{" "}
                  {interview?.company || "N/A"}
                </p>
 
                <p>
                  <strong>Role:</strong>{" "}
                  {interview?.jobRole || "N/A"}
                </p>
 
                <p>
                  <strong>Duration:</strong>{" "}
                  {interview?.duration || "N/A"} minutes
                </p>
 
                <p>
                  <strong>Skills:</strong>{" "}
                  {interview?.skills || "N/A"}
                </p>
              </div>
 
              {/* Footer */}
              <div className="card-footer">
                <button
                  onClick={() =>
                    startInterview(
                      assignment._id,
                      interview?.title
                    )
                  }
                  disabled={
                    startingId === assignment._id ||
                    assignment.status === "completed"
                  }
                  className={`btn ${
                    assignment.status === "completed"
                      ? "btn-disabled"
                      : "btn-primary"
                  }`}
                >
                  {startingId === assignment._id ? (
                    <>
                      <span className="spinner"></span>
                      Starting...
                    </>
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
          );
        })}
      </div>
    </div>
  );
};
 
export default AssignedInterview;
