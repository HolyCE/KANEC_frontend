import React from 'react';
import './Header.css';

function Header() {
  const handleLogin = () => {
    alert('Redirecting to Login Page...');
  };

  return (
    <header className="header">
      <div className="logo">
        <span>KANEC</span> IMPACT LEDGER
      </div>

      <nav className="nav">
        {/* Center group */}
        <div className="center-links">
          <a href="#home">Home</a>
          <a href="#project">Projects</a>
          <a href="#transparency">Transparency</a>
        </div>

        {/* Right group */}
        <div className="right-links">
          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>
          <a href="#contact" className='contact-link'>Contact</a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
