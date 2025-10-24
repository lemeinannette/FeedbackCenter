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
              <div className="logo-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="logo-text">
              <span className="logo-text-top">Feedback</span>
              <span className="logo-text-bottom">Centre</span>
            </div>
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