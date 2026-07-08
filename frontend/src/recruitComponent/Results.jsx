import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "../recruitCompStyle/Results.css";

const RECOMMENDATION_FILTERS = ["all", "Hire", "Consider", "Reject"];

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recFilter, setRecFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/recruiter/results");
      setResults(res.data.data.results);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load interview results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchesRec =
        recFilter === "all" || r.finalReport.recommendation === recFilter;
      const matchesSearch =
        !search.trim() ||
        r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        r.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.interviewTitle.toLowerCase().includes(search.toLowerCase());
      return matchesRec && matchesSearch;
    });
  }, [results, recFilter, search]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="results-page">
        <h1>Results</h1>
        <p>Loading completed interview reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <h1>Results</h1>
        <p className="dashboard-error">{error}</p>
        <button onClick={fetchResults}>Retry</button>
      </div>
    );
  }

  return (
    <div className="results-page">
      <h1>Results</h1>
      <p>AI-generated reports for every completed interview.</p>

      <div className="candidates-toolbar">
        <input
          type="text"
          placeholder="Search by candidate or interview..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-chips">
          {RECOMMENDATION_FILTERS.map((r) => (
            <button
              key={r}
              className={`chip ${recFilter === r ? "chip-active" : ""}`}
              onClick={() => setRecFilter(r)}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-box">
          <p>
            {results.length === 0
              ? "No completed interviews yet. Reports will show up here once candidates finish."
              : "No results match your filters."}
          </p>
        </div>
      ) : (
        <div className="interview-list">
          {filtered.map((r) => (
            <div className="interview-item" key={r.sessionId}>
              <div
                className="interview-item-header"
                onClick={() => toggleExpand(r.sessionId)}
              >
                <div>
                  <h3>{r.candidateName}</h3>
                  <span className="muted">
                    {r.interviewTitle} · {r.company}
                  </span>
                </div>

                <div className="interview-item-meta">
                  <span className="meta-pill">
                    Overall {r.finalReport.overallScore}%
                  </span>
                  <span className={`recommendation rec-${r.finalReport.recommendation}`}>
                    {r.finalReport.recommendation}
                  </span>
                  <span className="expand-arrow">
                    {expandedId === r.sessionId ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {expandedId === r.sessionId && (
                <div className="interview-item-body">
                  <div className="score-row">
                    <div className="score-item">
                      <div className="label">Technical</div>
                      <div className="value">{r.finalReport.technicalScore}%</div>
                    </div>
                    <div className="score-item">
                      <div className="label">Communication</div>
                      <div className="value">
                        {r.finalReport.communicationScore}%
                      </div>
                    </div>
                    <div className="score-item">
                      <div className="label">Confidence</div>
                      <div className="value">{r.finalReport.confidenceScore}%</div>
                    </div>
                    <div className="score-item">
                      <div className="label">Problem Solving</div>
                      <div className="value">
                        {r.finalReport.problemSolvingScore}%
                      </div>
                    </div>
                  </div>

                  {r.finalReport.strengths?.length > 0 && (
                    <p>
                      <strong>Strengths:</strong>{" "}
                      {r.finalReport.strengths.join(", ")}
                    </p>
                  )}

                  {r.finalReport.weaknesses?.length > 0 && (
                    <p>
                      <strong>Weaknesses:</strong>{" "}
                      {r.finalReport.weaknesses.join(", ")}
                    </p>
                  )}

                  {r.finalReport.summary && (
                    <p className="result-summary-text">
                      {r.finalReport.summary}
                    </p>
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

export default Results;