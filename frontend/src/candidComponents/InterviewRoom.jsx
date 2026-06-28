import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const InterviewRoom = () => {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/auth/session/${sessionId}`);

        setSession(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <p>Loading interview...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="interview-room">
      <h1>🎤 AI Interview Session</h1>

      <div className="session-box">
        <p><b>Session ID:</b> {sessionId}</p>
        <p><b>Status:</b> {session?.status}</p>
        <p><b>Started:</b> {session?.startedAt}</p>
      </div>

      <div className="chat-box">
        <p>💬 AI Interviewer will appear here</p>
      </div>
    </div>
  );
};

export default InterviewRoom;