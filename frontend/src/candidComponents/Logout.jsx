import { useNavigate } from "react-router-dom";
import React from 'react'

const Logout = () => {

const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
  };

  return (
       <div className="page">
      <h1>🚪 Logout</h1>

      <div className="card">
        <p>Are you sure you want to logout?</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Logout