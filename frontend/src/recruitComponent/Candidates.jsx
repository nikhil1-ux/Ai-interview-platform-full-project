import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const STATUS_FILTERS = ["all", "assigned", "accepted", "in-progress", "completed", "rejected"];

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/recruiter/stats");
      setCandidates(res.data.data.candidates);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        c.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
        c.interviewTitle.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [candidates, statusFilter, search]);

  if (loading) {
    return (
      <div className="candidates-page">
        <h1>Candidates</h1>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidates-page">
        <h1>Candidates</h1>
        <p className="dashboard-error">{error}</p>
        <button onClick={fetchCandidates}>Retry</button>
      </div>
    );
  }

  return (
    <div className="candidates-page">
      <h1>Candidates</h1>
      <p>Everyone assigned to your interviews, across every job.</p>

      <div className="candidates-toolbar">
        <input
          type="text"
          placeholder="Search by name, email, or interview..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-chips">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`chip ${statusFilter === s ? "chip-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <table className="table-section-table">
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
          {filtered.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={6}>No candidates match your filters.</td>
            </tr>
          ) : (
            filtered.map((c) => (
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
  );
};

export default Candidates;