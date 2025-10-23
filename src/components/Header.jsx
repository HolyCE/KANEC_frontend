import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
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
