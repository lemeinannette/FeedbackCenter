// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isFeedbackFormPage = location.pathname === '/feedback';
  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L4 8V14C4 19.5 8.5 24.8 14 26C19.5 24.8 24 19.5 24 14V8L14 2Z" fill="white" fillOpacity="0.15"/>
                <path d="M10 12L14 16L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">Feedback Center</span>
          </Link>
          
          <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {!isFeedbackFormPage && !isAdminPage && (
              <Link to="/feedback" className="nav-link">Feedback</Link>
            )}
            {isAdminPage && (
              <>
                <Link to="/feedback" className="nav-link">Feedback</Link>
                <Link to="/admin" className="nav-link">Admin</Link>
              </>
            )}
          </nav>
          
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;