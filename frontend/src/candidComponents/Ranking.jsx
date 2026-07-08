import React, { useEffect, useState } from "react";
import api from "../api/axios";


const medal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

const Ranking = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myEntry, setMyEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRanking = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/ranking");
      setLeaderboard(res.data.data.leaderboard);
      setMyEntry(res.data.data.myEntry);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load the leaderboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>🏆 Ranking</h1>
        <p className="page-skeleton">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>🏆 Ranking</h1>
        <p className="page-error">{error}</p>
        <button onClick={fetchRanking}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🏆 Ranking</h1>

      {myEntry && (
        <div className="my-rank-banner">
          <div>
            <p>Your Rank</p>
            <h2>#{myEntry.rank}</h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>Average Score</p>
            <h2>{myEntry.avgScore}%</h2>
          </div>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>
            No rankings yet. Complete an AI interview to appear on the
            leaderboard.
          </p>
        </div>
      ) : (
        <div className="leaderboard-card">
          {leaderboard.map((entry) => (
            <div
              className={`leaderboard-row ${entry.isYou ? "is-you" : ""}`}
              key={entry.candidateId}
            >
              <div className={`rank-number top-${entry.rank}`}>
                {medal(entry.rank) || `#${entry.rank}`}
              </div>
              <div className="rank-name">
                {entry.name}
                {entry.isYou && <span className="rank-you-badge">You</span>}
              </div>
              <div className="rank-interviews">
                {entry.interviews} interview{entry.interviews === 1 ? "" : "s"}
              </div>
              <div className="rank-score">{entry.avgScore}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;