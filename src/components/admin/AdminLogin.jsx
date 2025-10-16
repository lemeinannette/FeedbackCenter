// src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll accept any non-empty credentials
      if (formData.username === 'admin' && formData.password === 'password') {
        // Generate a mock token
        const token = 'mock-jwt-token-' + Date.now();
        onLogin(token);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="container">
        <div className="admin-login-wrapper">
          <div className="admin-login-header">
            <h1>Admin Portal</h1>
            <p>Sign in to access the dashboard</p>
          </div>
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="admin-login-footer">
            <p>Demo credentials: username: admin, password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;