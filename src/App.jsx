// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';

// Mock data to simulate a backend
const initialFeedback = [
  { id: 1, guestName: 'Alice', email: 'a@b.com', eventType: 'Conference', rating: 5, comment: 'Great event!', date: '2023-10-26T10:00:00Z' },
  { id: 2, guestName: 'Bob', eventType: 'Wedding', rating: 4, comment: 'Beautiful venue.', date: '2023-10-25T14:30:00Z' },
];

function App() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [currentView, setCurrentView] = useState('guest'); // 'guest' or 'admin'
  const [theme, setTheme] = useState('light');

  // Theme management logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to handle new feedback submission
  const handleFeedbackSubmit = (newFeedback) => {
    const feedbackWithId = { ...newFeedback, id: Date.now() };
    setFeedback(prevFeedback => [feedbackWithId, ...prevFeedback]);
  };

  return (
    <div className="app-container">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {currentView === 'guest' ? (
          <FeedbackForm onSubmit={handleFeedbackSubmit} />
        ) : (
          <Dashboard feedbackData={feedback} />
        )}
      </main>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </div>
  );
}

export default App;