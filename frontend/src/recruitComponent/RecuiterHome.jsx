import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../recruitCompStyle/RecruiterHome.css";

const RecruiterHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/recruiter/stats");
      setStats(res.data.data);
      setCandidates(res.data.data.candidates);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load recruiter dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="recruiter-home">
        <h1>Welcome Recruiter 👋</h1>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruiter-home">
        <h1>Welcome Recruiter 👋</h1>
        <p className="dashboard-error">{error}</p>
        <button onClick={fetchStats}>Retry</button>
      </div>
    );
  }

  return (
    <div className="recruiter-home">
      <h1>Welcome Recruiter 👋</h1>
      <p>Manage your interviews, candidates, and results from here.</p>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Interviews</h3>
          <p>{stats.totalInterviews}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Interviews</h3>
          <p>{stats.pendingInterviews}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Interviews</h3>
          <p>{stats.completedInterviews}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <button onClick={() => navigate("create-interview")}>
          Create Interview
        </button>
        <button onClick={() => document.getElementById("candidates-table")?.scrollIntoView({ behavior: "smooth" })}>
          View Candidates
        </button>
        <button onClick={fetchStats}>Refresh</button>
      </div>

      <div className="table-section" id="candidates-table">
        <h2>Candidates</h2>
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Email</th>
              <th>Interview</th>
              <th>Company</th>
              <th>Status</th>
              <th>Assigned On</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>
                  No candidates yet. Create an interview to assign one.
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.assignmentId}>
                  <td>{c.candidateName}</td>
                  <td>{c.candidateEmail}</td>
                  <td>{c.interviewTitle}</td>
                  <td>{c.company}</td>
                  <td>
                    <span className={`status-tag ${c.status}`}>{c.status}</span>
                  </td>
                  <td>
                    {c.assignedAt
                      ? new Date(c.assignedAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecruiterHome;