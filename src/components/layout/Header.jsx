// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">FeedbackCenter</span>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
