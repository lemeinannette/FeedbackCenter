// src/components/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ currentView, setCurrentView }) => {
  return (
    <header className="header">
      <h1>FeedbackCenter</h1>
      <nav>
        <button
          className={currentView === 'guest' ? 'active' : ''}
          onClick={() => setCurrentView('guest')}
        >
          Give Feedback
        </button>
        <button
          className={currentView === 'admin' ? 'active' : ''}
          onClick={() => setCurrentView('admin')}
        >
          Admin Dashboard
        </button>
      </nav>
    </header>
  );
};

// THIS IS THE CRITICAL LINE
export default Header;