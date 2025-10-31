import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <img 
              src="/reallogo.png" 
              alt="KANEC IMPACT LEDGER" 
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-main">KANEC</span>
              <span className="logo-sub">IMPACT LEDGER</span>
            </div>
          </Link>
        </div>

        <button 
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
            About Us
          </Link>
          <Link to="/projects" className="nav-link" onClick={closeMobileMenu}>
            Projects
          </Link>
          <Link to="/donors" className="nav-link" onClick={closeMobileMenu}>
            Donors
          </Link>
          <Link to="/signin" className="btn-login" onClick={closeMobileMenu}>
            Log In
          </Link>
          <Link to="/donate" className="btn-donate" onClick={closeMobileMenu}>
            Donate
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;