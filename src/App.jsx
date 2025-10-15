// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import FeedbackForm from './components/feedback/FeedbackForm'
import ThankYou from './components/feedback/ThankYou'
import AdminLogin from './components/admin/AdminLogin'
import Dashboard from './components/admin/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial render
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  function ProtectedRoute({ children }) {
    return isAuthenticated ? children : <Navigate to="/admin" />;
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin" element={<AdminLogin onLogin={login} />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard onLogout={logout} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App