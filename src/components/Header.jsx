import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    alert('Redirecting to Login Page...');
    // For now, redirect to dashboard since we don't have login
    navigate('/dashboard');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <header className="header">
      <div className="logo">
        <span>KANEC</span> IMPACT LEDGER
      </div>

      <nav className="nav">
        {/* Center group */}
        <div className="center-links">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/transparency">Transparency</Link>
          {/* Add Dashboard link */}
          <button className="dashboard-button" onClick={handleDashboard}>
            Dashboard
          </button>
        </div>

        {/* Right group */}
        <div className="right-links">
          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>
          <Link to="/contact" className="contact-link">Contact</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;