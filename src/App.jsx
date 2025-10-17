// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import FeedbackForm from './components/feedback/FeedbackForm';
import ThankYou from './components/feedback/ThankYou';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // In a real app, you would validate the token with your backend
      // For now, we'll just check if it exists
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
    return isAuthenticated ? children : <Navigate to="/admin" replace />;
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
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Header />
              <FeedbackForm />
            </>
          } />
          <Route path="/feedback" element={
            <>
              <Header />
              <FeedbackForm />
            </>
          } />
          <Route path="/thank-you" element={
            <>
              <Header />
              <ThankYou />
            </>
          } />
          
          {/* Admin login route */}
          <Route path="/admin" element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <>
              <Header />
              <AdminLogin onLogin={login} />
            </>
          } />
          
          {/* Protected dashboard route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Header />
              <Dashboard onLogout={logout} />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;