import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CandidateHome = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [rank, setRank] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeData = async () => {
    setLoading(true);
    setError("");
    try {
      const [resultsRes, rankingRes] = await Promise.all([
        api.get("/auth/my-results"),
        api.get("/auth/ranking"),
      ]);

      setSummary(resultsRes.data.data.summary);
      setRank(rankingRes.data.data.myEntry?.rank ?? null);

      // Lightweight, rule-based insights derived from the score summary —
      // no separate AI-insights endpoint exists yet, so this reads real
      // numbers instead of showing static placeholder text.
      const s = resultsRes.data.data.summary;
      const tips = [];
      if (s.completedInterviews === 0) {
        tips.push("Complete your first interview to unlock personalized insights.");
      } else {
        if (s.technicalScore && s.technicalScore < 70) {
          tips.push("Improve Data Structures & Algorithms fundamentals.");
        }
        if (s.problemSolvingScore && s.problemSolvingScore < 70) {
          tips.push("Practice structured problem-solving walkthroughs.");
        }
        if (s.communicationScore && s.communicationScore >= 75) {
          tips.push("Strength: clear communication 👍");
        }
        if (s.confidenceScore && s.confidenceScore < 70) {
          tips.push("Work on pacing and confident delivery on camera.");
        }
      }
      setInsights(tips.length ? tips : ["Keep completing interviews to build your insight history."]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="welcome-section">
          <h1>👋 Welcome Back!</h1>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-home">
        <div className="welcome-section">
          <h1>👋 Welcome Back!</h1>
          <p className="dashboard-error">{error}</p>
          <button className="btn-secondary" onClick={fetchHomeData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">

      {/* HEADER */}
      <div className="welcome-section">
        <h1>👋 Welcome Back!</h1>
        <p>Track your interviews, improve skills, and grow your ranking.</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats">
        <div className="card">
          <h2>{summary.totalInterviews}</h2>
          <p>Assigned Interviews</p>
        </div>

        <div className="card">
          <h2>{summary.completedInterviews}</h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>{summary.completedInterviews ? `${summary.overallScore}%` : "—"}</h2>
          <p>Avg Score</p>
        </div>

        <div className="card">
          <h2>{rank ? `#${rank}` : "—"}</h2>
          <p>Ranking</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="actions">
        <h2>⚡ Quick Actions</h2>

        <div className="action-buttons">
          <button onClick={() => navigate("../assigned-interviews")}>
            🎤 Start Interview
          </button>
          <button onClick={() => navigate("../resume")}>
            📄 Upload Resume
          </button>
          <button onClick={() => navigate("../results")}>
            📊 View Results
          </button>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="insights">
        <h2>🤖 AI Insights</h2>
        <ul>
          {insights.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default CandidateHome;