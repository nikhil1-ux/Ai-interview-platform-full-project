import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import api from "../api/axios";
import "../candidCompStyle/Logout.css";

const Logout = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <div className="page">
      <h1>🚪 Logout</h1>

      <div className="logout-card">
        <div className="logout-icon">🚪</div>
        <p>Are you sure you want to logout?</p>

        <div className="logout-actions">
          <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
          <button
            className="logout-cancel"
            onClick={() => navigate("../candidatehome")}
            disabled={loggingOut}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;