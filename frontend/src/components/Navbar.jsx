import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../style//Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎯</span>
          <span className="brand-text">AI Interview Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop">
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('faq')}
            >
              FAQ
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Auth Buttons */}
        <div className="nav-buttons">
          <Link to="/login" className="nav-button nav-button--secondary">
            Login
          </Link>
          <Link to="/signup" className="nav-button nav-button--primary">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="navbar-mobile">
          <button 
            className="nav-link-mobile"
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>
          <button 
            className="nav-link-mobile"
            onClick={() => scrollToSection('features')}
          >
            Features
          </button>
          <button 
            className="nav-link-mobile"
            onClick={() => scrollToSection('faq')}
          >
            FAQ
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar