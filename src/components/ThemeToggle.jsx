// src/components/ThemeToggle.jsx
import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button onClick={onToggle} className="theme-toggle">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

// THIS IS THE CRITICAL LINE
export default ThemeToggle;