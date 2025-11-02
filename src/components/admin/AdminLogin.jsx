// src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple authentication logic (in a real app, this would be a server call)
      if (username === 'admin' && password === 'password') {
        // Generate a simple token (in a real app, this would be a JWT from the server)
        const token = 'admin-token-' + Date.now();
        
        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem('adminToken', token);
          // Set expiration for 7 days
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          localStorage.setItem('adminTokenExpiration', expirationDate.toISOString());
        } else {
          // Store in sessionStorage for session-only login
          sessionStorage.setItem('adminToken', token);
        }
        
        if (onLogin) {
          onLogin(token, rememberMe);
        }
        
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-username" className="form-label">Username</label>
            <input
              type="text"
              id="admin-username"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="remember-me"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Remember me for 7 days</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>For demo purposes, use: username: <strong>admin</strong>, password: <strong>password</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;