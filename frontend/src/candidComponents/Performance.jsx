import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../candidCompStyle/Performance.css";

const Performance = () => {
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/my-results");
      setSummary(res.data.data.summary);
      setResults(res.data.data.results);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your past results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="page">
        <h1>📊 Performance & Results</h1>
        <p>Loading your past interview results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>📊 Performance & Results</h1>
        <p className="dashboard-error">{error}</p>
        <button className="btn-secondary" onClick={fetchResults}>
          Retry
        </button>
      </div>
    );
  }

  const completed = results.filter(
    (r) => r.status === "completed" && r.finalReport
  );

  return (
    <div className="page">
      <h1>📊 Performance & Results</h1>

      {/* OVERALL SUMMARY */}
      <div className="performance-card">
        <div className="performance-overall">
          <span className="performance-overall-label">Overall Score</span>
          <span className="performance-overall-value">
            {completed.length ? `${summary.overallScore}%` : "—"}
          </span>
        </div>

        <ul className="performance-list">
          <li>
            <span className="performance-list-label">Communication</span>
            <span className="performance-tag good">
              {completed.length ? `${summary.communicationScore}%` : "—"}
            </span>
          </li>
          <li>
            <span className="performance-list-label">DSA / Technical</span>
            <span className="performance-tag needs-improvement">
              {completed.length ? `${summary.technicalScore}%` : "—"}
            </span>
          </li>
          <li>
            <span className="performance-list-label">Problem Solving</span>
            <span className="performance-tag beginner">
              {completed.length ? `${summary.problemSolvingScore}%` : "—"}
            </span>
          </li>
        </ul>
      </div>

      {/* PAST RESULTS HISTORY */}
      <h2 className="performance-history-title">Past Interviews</h2>

      {completed.length === 0 ? (
        <div className="empty-state-box">
          <p>
            No completed interviews yet. Your results will show up here once
            you finish one.
          </p>
        </div>
      ) : (
        <div className="results-list">
          {completed.map((r) => (
            <div className="result-item" key={r.sessionId}>
              <div
                className="result-item-header"
                onClick={() => toggleExpand(r.sessionId)}
              >
                <div>
                  <h3>{r.interviewTitle}</h3>
                  <span className="muted">
                    {r.company} {r.jobRole ? `· ${r.jobRole}` : ""}
                  </span>
                </div>

                <div className="result-item-meta">
                  <span className="meta-pill">
                    Overall {r.finalReport.overallScore}%
                  </span>
                  <span className="expand-arrow">
                    {expandedId === r.sessionId ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {expandedId === r.sessionId && (
                <div className="result-item-body">
                  <div className="score-row">
                    <div className="score-item">
                      <div className="label">Technical</div>
                      <div className="value">{r.finalReport.technicalScore}%</div>
                    </div>
                    <div className="score-item">
                      <div className="label">Communication</div>
                      <div className="value">{r.finalReport.communicationScore}%</div>
                    </div>
                    <div className="score-item">
                      <div className="label">Confidence</div>
                      <div className="value">{r.finalReport.confidenceScore}%</div>
                    </div>
                    <div className="score-item">
                      <div className="label">Problem Solving</div>
                      <div className="value">{r.finalReport.problemSolvingScore}%</div>
                    </div>
                  </div>

                  {r.finalReport.strengths?.length > 0 && (
                    <p>
                      <strong>Strengths:</strong> {r.finalReport.strengths.join(", ")}
                    </p>
                  )}

                  {r.finalReport.weaknesses?.length > 0 && (
                    <p>
                      <strong>Weaknesses:</strong> {r.finalReport.weaknesses.join(", ")}
                    </p>
                  )}

                  {r.finalReport.summary && (
                    <p className="result-summary-text">{r.finalReport.summary}</p>
                  )}

                  <p className="muted">
                    Completed on{" "}
                    {r.completedAt
                      ? new Date(r.completedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Performance;