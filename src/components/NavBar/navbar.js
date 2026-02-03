import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-scroll';
import logo from '../../assets/logo.png'; 

// 1. Accept the 'data' prop from App.js
function Navbar({ data }) { 
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container-aligned">
        <Link to="home" smooth={true} duration={500} className="branding-left">
          <img src={logo} alt="Logo" className="nav-logo-side" />
          <div className="nav-brand-info">
            {/* 2. Use data from Supabase. The '?' prevents errors if data is still loading */}
            <h1 className="brand-name">
                {data?.full_name || "APOORVA I U"}
            </h1>
            <p className="brand-tagline">
                {data?.nav_tagline || "Computer Science | AI | Cybersecurity"}
            </p>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;