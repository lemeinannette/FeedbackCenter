// src/components/admin/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="admin-navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <span className="logo-icon">💬</span>
            <span className="logo-text">FeedbackCenter</span>
          </Link>
          
          <div className="navbar-actions">
            <ThemeToggle />
            <button onClick={onLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;