// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if current route is the feedback form
  const isFeedbackFormPage = location.pathname === '/feedback';
  // Check if current route is the admin page
  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <span className="icon-f">F</span>
                <span className="icon-c">C</span>
              </div>
              <div className="logo-text-container">
                <span className="logo-text">Feedback</span>
                <span className="logo-highlight">Center</span>
              </div>
            </Link>
            
            <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {/* Only show Feedback link if not on the feedback form page and not on admin page */}
              {!isFeedbackFormPage && !isAdminPage && (
                <Link to="/feedback" className="nav-link">
                  <span className="nav-text">Feedback</span>
                </Link>
              )}
              {/* Only show Admin link if on admin page */}
              {isAdminPage && (
                <Link to="/feedback" className="nav-link">
                  <span className="nav-text">Feedback</span>
                </Link>
              )}
              {/* Only show Admin link if on admin page */}
              {isAdminPage && (
                <Link to="/admin" className="nav-link">
                  <span className="nav-text">Admin</span>
                </Link>
              )}
            </nav>
            
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger"></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;