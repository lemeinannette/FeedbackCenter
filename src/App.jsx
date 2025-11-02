// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import FeedbackForm from './components/feedback/FeedbackForm';
import ThankYou from './components/feedback/ThankYou';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import './styles/theme.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for authentication token on app load
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        
        // Check if token exists and is not expired
        if (token) {
          // Check for token expiration if stored in localStorage
          const expirationDate = localStorage.getItem('adminTokenExpiration');
          if (expirationDate) {
            const now = new Date();
            const expDate = new Date(expirationDate);
            if (now > expDate) {
              // Token expired, clear it
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminTokenExpiration');
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(true);
            }
          } else {
            // No expiration date (session token), assume valid
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear any potentially corrupted tokens
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiration');
        sessionStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const login = (token, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('adminToken', token);
      // Set expiration for 7 days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      localStorage.setItem('adminTokenExpiration', expirationDate.toISOString());
    } else {
      sessionStorage.setItem('adminToken', token);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiration');
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  // Show loading screen while checking authentication
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
          
          {/* Admin login route - redirect to dashboard if already authenticated */}
          <Route path="/admin" element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <>
              <Header />
              <AdminLogin onLogin={login} />
            </>
          } />
          
          {/* Protected dashboard route - always check authentication */}
          <Route path="/dashboard" element={
            isAuthenticated ? 
            <>
              <Header />
              <Dashboard onLogout={logout} />
            </> : 
            <Navigate to="/admin" replace />
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;