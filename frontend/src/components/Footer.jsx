import React from 'react'
import { Link } from 'react-router-dom'
import '../style/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          {/* Top Section */}
          <div className="footer-top">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="brand-link">
                <span className="brand-icon">🎯</span>
                <span className="brand-name">HireAI</span>
              </Link>
              <p>
                Smarter hiring with AI-driven interviews and 
                automated candidate shortlisting.
              </p>
            </div>

            {/* Links Columns */}
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>For Companies</h4>
                <ul>
                  <li><a href="#for-companies">Hiring Solutions</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/resources">Resources</a></li>
                  <li><a href="/contact">Contact Sales</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>For Students</h4>
                <ul>
                  <li><a href="#for-students">AI Interviews</a></li>
                  <li><a href="/guide">Interview Guide</a></li>
                  <li><a href="/tips">Tips & Tricks</a></li>
                  <li><a href="/community">Community</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © {currentYear} HireAI. All rights reserved.
              </p>
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer