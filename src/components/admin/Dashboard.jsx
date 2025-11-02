// src/components/admin/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const Dashboard = ({ onLogout }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);
  const [timeFilter, setTimeFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      // Check for token expiration if stored in localStorage
      const expirationDate = localStorage.getItem('adminTokenExpiration');
      if (expirationDate) {
        const now = new Date();
        const expDate = new Date(expirationDate);
        if (now > expDate) {
          // Token expired, clear it and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminTokenExpiration');
          navigate('/admin');
          return;
        }
      }
      
      // Load feedbacks data
      try {
        const storedFeedbacks = localStorage.getItem('feedbacks');
        if (storedFeedbacks) {
          setFeedbacks(JSON.parse(storedFeedbacks));
        }
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load feedback data.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('darkMode', newDark);
  };

  // Save to localStorage when feedbacks change
  useEffect(() => {
    try {
      if (feedbacks.length > 0) {
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
      }
    } catch (err) {
      console.error('Error saving feedbacks:', err);
    }
  }, [feedbacks]);

  // Logout function
  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiration');
    sessionStorage.removeItem('adminToken');
    
    if (onLogout) {
      onLogout();
    }
    
    navigate('/admin');
  };

  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Name', 'Group', 'Event Name', 'Food', 'Ambience', 'Service', 'Overall', 'Recommend', 'Comments'],
      ...filteredFeedbacks.map(f => [
        f.submissionDate || f.date || 'N/A',
        f.individualName || f.groupName || 'Anonymous',
        f.groupName || 'N/A',
        f.event || 'N/A',
        f.food || 'N/A',
        f.ambience || 'N/A',
        f.service || 'N/A',
        f.overall || 'N/A',
        f.recommend || 'N/A',
        f.comments || 'N/A'
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete feedback function
  const deleteFeedback = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    setShowActionMenu(null);
  };

  // View feedback details
  const viewFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowActionMenu(null);
  };

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    if (!feedbacks.length) return [];

    let filtered = feedbacks.filter((f) => {
      const term = searchTerm.toLowerCase();
      const name = f.individualName || f.groupName || '';
      const group = f.groupName || '';
      const event = f.event || '';
      const comments = f.comments || '';
      
      return (
        name.toLowerCase().includes(term) ||
        group.toLowerCase().includes(term) ||
        event.toLowerCase().includes(term) ||
        comments.toLowerCase().includes(term)
      );
    });

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(f => {
        const feedbackDate = new Date(f.submissionDate || f.date);
        return feedbackDate >= startDate;
      });
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day
      filtered = filtered.filter(f => {
        const feedbackDate = new Date(f.submissionDate || f.date);
        return feedbackDate <= endDate;
      });
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const today = new Date();
      const start = new Date(today);
      if (timeFilter === 'week') start.setDate(today.getDate() - 7);
      if (timeFilter === 'month') start.setMonth(today.getMonth() - 1);
      if (timeFilter === 'year') start.setFullYear(today.getFullYear() - 1);
      if (timeFilter === 'today') start.setHours(0, 0, 0, 0);

      filtered = filtered.filter((f) => {
        const date = new Date(f.submissionDate || f.date);
        return timeFilter === 'today'
          ? date >= start && date <= today
          : date >= start;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'date') {
        aValue = new Date(a.submissionDate || a.date);
        bValue = new Date(b.submissionDate || b.date);
      } else if (sortBy === 'overall') {
        aValue = parseFloat(a.overall) || 0;
        bValue = parseFloat(b.overall) || 0;
      } else if (sortBy === 'recommend') {
        aValue = a.recommend === 'Yes' ? 1 : 0;
        bValue = b.recommend === 'Yes' ? 1 : 0;
      } else {
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [feedbacks, searchTerm, timeFilter, dateRange, sortBy, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!filteredFeedbacks.length) {
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        recommendationRate: 0,
        recentFeedbacks: 0,
        ratingDistribution: [],
        categoryAverages: {},
        eventDistribution: [],
        recommendationData: [],
        submissionTypeData: [],
        categoryRatingData: []
      };
    }

    const totalFeedbacks = filteredFeedbacks.length;
    const validRatings = filteredFeedbacks
      .map(f => parseFloat(f.overall))
      .filter(rating => !isNaN(rating));
    
    const averageRating = validRatings.length > 0
      ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1)
      : 0;
    
    const recommendations = filteredFeedbacks.filter(f => f.recommend === 'Yes').length;
    const recommendationRate = ((recommendations / totalFeedbacks) * 100).toFixed(0);
    
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const recentFeedbacks = filteredFeedbacks.filter(f => {
      const date = new Date(f.submissionDate || f.date);
      return date >= weekAgo;
    }).length;

    // Rating distribution for each category
    const categories = ['food', 'ambience', 'service', 'overall'];
    const categoryRatingData = [];
    
    categories.forEach(category => {
      const ratingCounts = [0, 0, 0, 0, 0];
      filteredFeedbacks.forEach(f => {
        const rating = parseFloat(f[category]);
        if (rating >= 1 && rating <= 5) {
          ratingCounts[Math.floor(rating) - 1]++;
        }
      });
      
      // Calculate average for this category
      const validRatings = filteredFeedbacks
        .map(f => parseFloat(f[category]))
        .filter(rating => !isNaN(rating));
      
      const avgRating = validRatings.length > 0
        ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1)
        : 0;
      
      categoryRatingData.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        avgRating: parseFloat(avgRating),
        rating1: ratingCounts[0],
        rating2: ratingCounts[1],
        rating3: ratingCounts[2],
        rating4: ratingCounts[3],
        rating5: ratingCounts[4]
      });
    });

    // Category averages
    const categoryAverages = {};
    
    categories.forEach(category => {
      const validRatings = filteredFeedbacks
        .map(f => parseFloat(f[category]))
        .filter(rating => !isNaN(rating));
      
      if (validRatings.length > 0) {
        categoryAverages[category] = (
          validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
        ).toFixed(1);
      } else {
        categoryAverages[category] = 0;
      }
    });

    // Event distribution
    const eventCounts = {};
    filteredFeedbacks.forEach(f => {
      const event = f.event || 'Unknown';
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
    
    const eventDistribution = Object.entries(eventCounts)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 events

    // Recommendation data
    const wouldRecommend = filteredFeedbacks.filter(f => f.recommend === 'Yes').length;
    const wouldNotRecommend = filteredFeedbacks.filter(f => f.recommend === 'No').length;
    
    const recommendationData = [
      { name: 'Would Recommend', value: wouldRecommend, color: '#10b981' },
      { name: 'Would Not Recommend', value: wouldNotRecommend, color: '#ef4444' }
    ];

    // Submission type data
    const submissionTypeCounts = {
      'INDIVIDUAL': 0,
      'GROUP / ORGANIZATION / ASSOCIATION': 0,
      'ANONYMOUS': 0
    };
    
    filteredFeedbacks.forEach(f => {
      const type = f.submissionType || 'ANONYMOUS';
      if (submissionTypeCounts[type] !== undefined) {
        submissionTypeCounts[type]++;
      }
    });
    
    const submissionTypeData = [
      { name: 'Individual', value: submissionTypeCounts['INDIVIDUAL'], color: '#3b82f6' },
      { name: 'Group', value: submissionTypeCounts['GROUP / ORGANIZATION / ASSOCIATION'], color: '#8b5cf6' },
      { name: 'Anonymous', value: submissionTypeCounts['ANONYMOUS'], color: '#6b7280' }
    ];

    return {
      totalFeedbacks,
      averageRating,
      recommendationRate,
      recentFeedbacks,
      categoryAverages,
      eventDistribution,
      recommendationData,
      submissionTypeData,
      categoryRatingData
    };
  }, [filteredFeedbacks]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle loading and errors
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading feedback data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className={`feedback-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Logout</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowLogoutModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout from the admin dashboard?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Details Modal */}
      {selectedFeedback && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <h3 className="modal-title">Feedback Details</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setSelectedFeedback(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="feedback-details">
                <div className="detail-row">
                  <span className="detail-label">Submission Type:</span>
                  <span className="detail-value">{selectedFeedback.submissionType || 'N/A'}</span>
                </div>
                {selectedFeedback.individualName && (
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedFeedback.individualName}</span>
                  </div>
                )}
                {selectedFeedback.groupName && (
                  <div className="detail-row">
                    <span className="detail-label">Group Name:</span>
                    <span className="detail-value">{selectedFeedback.groupName}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Event Name:</span>
                  <span className="detail-value">{selectedFeedback.event || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {selectedFeedback.submissionDate 
                      ? new Date(selectedFeedback.submissionDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Food Rating:</span>
                  <span className="detail-value">{selectedFeedback.food || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ambience Rating:</span>
                  <span className="detail-value">{selectedFeedback.ambience || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Service Rating:</span>
                  <span className="detail-value">{selectedFeedback.service || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Overall Rating:</span>
                  <span className="detail-value">{selectedFeedback.overall || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Would Recommend:</span>
                  <span className="detail-value">{selectedFeedback.recommend || 'N/A'}</span>
                </div>
                {selectedFeedback.comments && (
                  <div className="detail-row">
                    <span className="detail-label">Comments:</span>
                    <span className="detail-value">{selectedFeedback.comments}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary" 
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" fill="url(#gradient1)" />
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">FeedbackHub</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('overview');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-text">Overview</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('analytics');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-text">Analytics</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('feedback');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-text">Feedback</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('reports');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-text">Reports</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('settings');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.325 4.317C10.751 2.56 13.249 2.56 13.675 4.317C13.73 4.539 13.852 4.736 14.018 4.887C14.185 5.038 14.389 5.139 14.609 5.179C16.408 5.506 16.408 8.494 14.609 8.821C14.389 8.861 14.185 8.962 14.018 9.113C13.852 9.264 13.73 9.461 13.675 9.683C13.249 11.44 10.751 11.44 10.325 9.683C10.27 9.461 10.148 9.264 9.982 9.113C9.815 8.962 9.611 8.861 9.391 8.821C7.592 8.494 7.592 5.506 9.391 5.179C9.611 5.139 9.815 5.038 9.982 4.887C10.148 4.736 10.27 4.539 10.325 4.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12C15.3978 12 15.7794 12.158 16.0607 12.4393C16.342 12.7206 16.5 13.1022 16.5 13.5C16.5 13.8978 16.342 14.2794 16.0607 14.5607C15.7794 14.842 15.3978 15 15 15C14.6022 15 14.2206 14.842 13.9393 14.5607C13.658 14.2794 13.5 13.8978 13.5 13.5C13.5 13.1022 13.658 12.7206 13.9393 12.4393C14.2206 12.158 14.6022 12 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.5 19C5.89782 19 6.27936 19.158 6.56066 19.4393C6.84196 19.7206 7 20.1022 7 20.5C7 20.8978 6.84196 21.2794 6.56066 21.5607C6.27936 21.842 5.89782 22 5.5 22C5.10218 22 4.72064 21.842 4.43934 21.5607C4.15804 21.2794 4 20.8978 4 20.5C4 20.1022 4.15804 19.7206 4.43934 19.4393C4.72064 19.158 5.10218 19 5.5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-text">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <span>A</span>
            </div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button 
            className="logout-btn-sidebar"
            onClick={() => setShowLogoutModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="header-title">
              <h1>Feedback Analytics</h1>
              <p>Comprehensive insights into customer feedback</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="header-actions">
              <button 
                className="icon-btn"
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
              >
                {darkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V1M12 23V21M4.22 4.22L2.81 2.81M21.19 21.19L19.78 19.78M1 12H3M21 12H23M4.22 19.78L2.81 21.19M21.19 2.81L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              
              <button 
                className="icon-btn notification-btn"
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="notification-badge">3</span>
              </button>
              
              <button 
                className="icon-btn"
                onClick={() => setShowLogoutModal(true)}
                title="Logout"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 3H9C8.44772 3 8 3.44772 8 4V8C8 8.55228 8.44772 9 9 9H15C15.5523 9 16 8.55228 16 8V4C16 3.44772 15.5523 3 15 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 13V19M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Total Feedback</h3>
                    <div className="stat-value">{statistics.totalFeedbacks}</div>
                    <div className="stat-change positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      +{statistics.recentFeedbacks} this week
                    </div>
                  </div>
                </div>
                
                <div className="stat-card secondary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Average Rating</h3>
                    <div className="stat-value">{statistics.averageRating}/5.0</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={`star-${i}`}
                          className={
                            i < Math.floor(parseFloat(statistics.averageRating) || 0)
                              ? 'star filled'
                              : 'star'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="stat-card success">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Recommendation Rate</h3>
                    <div className="stat-value">{statistics.recommendationRate}%</div>
                    <div className="stat-change positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      +5% from last month
                    </div>
                  </div>
                </div>
                
                <div className="stat-card warning">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>Pending Reviews</h3>
                    <div className="stat-value">7</div>
                    <div className="stat-change negative">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      2 overdue
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                <div className="section-header">
                  <h2>Analytics Overview</h2>
                  <div className="time-filter">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                </div>
                
                <div className="charts-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Category Performance</h3>
                      <div className="chart-actions">
                        <button className="icon-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 15S6 9 12 9S20 15 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 20S6 14 12 14S20 20 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button className="icon-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="chart-content">
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={[
                          { category: 'Food', value: Number(statistics.categoryAverages.food) },
                          { category: 'Ambience', value: Number(statistics.categoryAverages.ambience) },
                          { category: 'Service', value: Number(statistics.categoryAverages.service) },
                          { category: 'Overall', value: Number(statistics.categoryAverages.overall) }
                        ]}>
                          <PolarGrid strokeDasharray="3 3" />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis angle={90} domain={[0, 5]} />
                          <Radar name="Rating" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Rating Distribution</h3>
                      <div className="chart-actions">
                        <button className="icon-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 15S6 9 12 9S20 15 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 20S6 14 12 14S20 20 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button className="icon-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="chart-content">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statistics.categoryRatingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="avgRating" fill="#6366f1" name="Average Rating" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Section */}
              <div className="distribution-section">
                <div className="section-header">
                  <h2>Distribution Analysis</h2>
                </div>
                
                <div className="distribution-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Recommendation Distribution</h3>
                    </div>
                    <div className="chart-content">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statistics.recommendationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statistics.recommendationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Submission Types</h3>
                    </div>
                    <div className="chart-content">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statistics.submissionTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statistics.submissionTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'feedback' && (
            <div className="feedback-tab">
              {/* Table Section */}
              <div className="feedback-table-container">
                <div className="table-header">
                  <h2>Recent Feedback</h2>
                  <div className="table-actions">
                    <div className="sort-container">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Sort by Date</option>
                        <option value="overall">Sort by Rating</option>
                        <option value="recommend">Sort by Recommendation</option>
                        <option value="event">Sort by Event</option>
                      </select>
                      <button
                        className="sort-order-btn"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                    <button className="btn btn-primary" onClick={exportToCSV}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Export CSV
                    </button>
                  </div>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="no-feedback-container">
                    <div className="no-feedback-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>No feedback data available</h3>
                    <p>Feedback will appear here when clients submit the form.</p>
                  </div>
                ) : (
                  <>
                    <div className="table-container">
                      <table className="feedback-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Name/Group</th>
                            <th>Type</th>
                            <th>Event Name</th>
                            <th>Overall</th>
                            <th>Recommend</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFeedbacks.map((feedback, index) => (
                            <tr key={feedback.id || `feedback-${index}-${Date.now()}`}>
                              <td>
                                {feedback.submissionDate 
                                  ? new Date(feedback.submissionDate).toLocaleDateString()
                                  : 'N/A'}
                              </td>
                              <td>
                                <div className="name-group">
                                  <div className="name">
                                    {feedback.individualName || feedback.groupName || 'Anonymous'}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="submission-type-badge">
                                  {feedback.submissionType === 'INDIVIDUAL' && 'Individual'}
                                  {feedback.submissionType === 'GROUP / ORGANIZATION / ASSOCIATION' && 'Group'}
                                  {feedback.submissionType === 'ANONYMOUS' && 'Anonymous'}
                                </span>
                              </td>
                              <td>{feedback.event || 'N/A'}</td>
                              <td>
                                <div className="rating-container">
                                  <div className="rating-value">{feedback.overall || 'N/A'}/5</div>
                                  <div className="rating-stars">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={`${feedback.id || `feedback-${index}`}-star-${i}`}
                                        className={
                                          i < Math.floor(parseFloat(feedback.overall) || 0)
                                            ? 'star filled'
                                            : 'star'
                                        }
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`recommendation-badge ${feedback.recommend === 'Yes' ? 'yes' : 'no'}`}>
                                  {feedback.recommend || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <div className="action-menu-container">
                                  <button 
                                    className="action-menu-btn"
                                    onClick={() => setShowActionMenu(showActionMenu === feedback.id ? null : feedback.id)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="1"></circle>
                                      <circle cx="12" cy="5" r="1"></circle>
                                      <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                  </button>
                                  {showActionMenu === feedback.id && (
                                    <div className="action-menu">
                                      <button 
                                        className="action-menu-item"
                                        onClick={() => viewFeedbackDetails(feedback)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                          <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View Details
                                      </button>
                                      <button 
                                        className="action-menu-item"
                                        onClick={() => deleteFeedback(feedback.id)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6"></polyline>
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pagination-container">
                      <div className="pagination-info">
                        Showing {indexOfFirstItem + 1} to{' '}
                        {Math.min(indexOfLastItem, filteredFeedbacks.length)} of{' '}
                        {filteredFeedbacks.length} entries
                      </div>
                      <div className="pagination-controls">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn"
                        >
                          Previous
                        </button>
                        <div className="page-numbers">
                          {Array.from(
                            { length: Math.ceil(filteredFeedbacks.length / itemsPerPage) },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={`page-${page}`}
                              onClick={() => paginate(page)}
                              className={`page-number ${currentPage === page ? 'active' : ''}`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={
                            currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)
                          }
                          className="pagination-btn"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Feedback Trends</h3>
                  <div className="chart-content">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[
                        { name: 'Jan', feedback: 20 },
                        { name: 'Feb', feedback: 35 },
                        { name: 'Mar', feedback: 45 },
                        { name: 'Apr', feedback: 30 },
                        { name: 'May', feedback: 55 },
                        { name: 'Jun', feedback: 40 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="feedback" stroke="#6366f1" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3>Rating Breakdown</h3>
                  <div className="chart-content">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={[
                        { name: 'Food', rating: 4.2 },
                        { name: 'Service', rating: 3.8 },
                        { name: 'Ambience', rating: 4.5 },
                        { name: 'Overall', rating: 4.1 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rating" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="reports-tab">
              <div className="reports-container">
                <div className="report-card">
                  <h3>Monthly Report</h3>
                  <p>Comprehensive feedback analysis for the current month</p>
                  <button className="btn btn-primary">Generate Report</button>
                </div>
                
                <div className="report-card">
                  <h3>Custom Date Range</h3>
                  <p>Generate a report for a specific time period</p>
                  <div className="date-range-picker">
                    <input type="date" />
                    <span>to</span>
                    <input type="date" />
                  </div>
                  <button className="btn btn-primary">Generate Report</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-container">
                <div className="settings-card">
                  <h3>Notification Settings</h3>
                  <div className="setting-item">
                    <label>Email Notifications</label>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <div className="setting-item">
                    <label>Push Notifications</label>
                    <div className="toggle-switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </div>
                  </div>
                </div>
                
                <div className="settings-card">
                  <h3>Data Management</h3>
                  <div className="setting-item">
                    <label>Auto-save Drafts</label>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </div>
                  </div>
                  <div className="setting-item">
                    <label>Data Retention Period</label>
                    <select>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;