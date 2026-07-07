import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ManageInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchInterviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/recruiter/interviews");
      setInterviews(res.data.data.interviews);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="manage-interviews">
        <h1>Manage Interviews</h1>
        <p>Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-interviews">
        <h1>Manage Interviews</h1>
        <p className="dashboard-error">{error}</p>
        <button onClick={fetchInterviews}>Retry</button>
      </div>
    );
  }

  return (
    <div className="manage-interviews">
      <div className="manage-header">
        <div>
          <h1>Manage Interviews</h1>
          <p>All interviews you've created, with candidate progress.</p>
        </div>
        <button className="primaryBtn" onClick={() => navigate("../create-interview")}>
          + Create Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="empty-state-box">
          <p>You haven't created any interviews yet.</p>
          <button className="primaryBtn" onClick={() => navigate("../create-interview")}>
            Create your first interview
          </button>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.map((i) => (
            <div className="interview-item" key={i.interviewId}>
              <div
                className="interview-item-header"
                onClick={() => toggleExpand(i.interviewId)}
              >
                <div>
                  <h3>{i.title}</h3>
                  <span className="muted">
                    {i.company} · {i.jobRole}
                  </span>
                </div>

                <div className="interview-item-meta">
                  <span className="meta-pill">{i.total} assigned</span>
                  <span className="meta-pill completed">{i.completed} completed</span>
                  <span className="meta-pill pending">{i.pending} pending</span>
                  <span className="expand-arrow">
                    {expandedId === i.interviewId ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {expandedId === i.interviewId && (
                <div className="interview-item-body">
                  <div className="interview-details">
                    <p>
                      <strong>Skills:</strong>{" "}
                      {Array.isArray(i.skills) ? i.skills.join(", ") : i.skills}
                    </p>
                    <p>
                      <strong>Questions:</strong> {i.questions || "—"} &nbsp;|&nbsp;
                      <strong> Duration:</strong> {i.duration || "—"} mins
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(i.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <table className="mini-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {i.candidates.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="muted">
                            No candidate assigned yet.
                          </td>
                        </tr>
                      ) : (
                        i.candidates.map((c, idx) => (
                          <tr key={idx}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>
                              <span className={`status-tag ${c.status}`}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageInterviews;