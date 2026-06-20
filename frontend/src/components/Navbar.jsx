import React from 'react'
import "../style/Navbar.css";
import { Link } from "react-router-dom";
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const Navbar = () => {
  return (
    <nav className = "navbar">
      <h2 className = "navbar-brand">AI Interview Pro</h2>
      
      <ul className = "navbar-links">
        <li>features</li>
        <li>FAQ</li>

      </ul>
      
      <div className = "nav-buttons">
        <Link to="/login">
        <button className = "login-button">
          Login
        </button>
        </Link>
       <Link to="/signup">
        <button className = "signup-button">
          Sign Up
       </button></Link>

      </div>
    </nav>
  )
}

export default Navbar