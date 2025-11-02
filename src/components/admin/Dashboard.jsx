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

      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Feedback Analytics Dashboard</h1>
            <p className="dashboard-subtitle">
              Comprehensive insights into customer feedback
            </p>
          </div>
          <div className="header-actions">
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="logout-btn" 
              onClick={() => setShowLogoutModal(true)}
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="time-filter-inline"
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
        
        <div className="sort-container">
          <select
            className="sort-select"
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
      </div>

      <div className="dashboard-main">
        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-card">
            <div className="summary-card-header">
              <h3 className="summary-title">Total Feedback</h3>
              <div className="summary-icon">📊</div>
            </div>
            <div className="summary-value">{statistics.totalFeedbacks}</div>
            <div className="summary-details">
              <div className="summary-detail">
                <span className="detail-label">This Week:</span>
                <span className="detail-value">+{statistics.recentFeedbacks}</span>
              </div>
              <div className="summary-detail">
                <span className="detail-label">Avg. Per Day:</span>
                <span className="detail-value">{(statistics.totalFeedbacks / 30).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card-header">
              <h3 className="summary-title">Average Rating</h3>
              <div className="summary-icon">⭐</div>
            </div>
            <div className="summary-value">{statistics.averageRating}/5.0</div>
            <div className="summary-details">
              <div className="summary-detail">
                <span className="detail-label">Food:</span>
                <span className="detail-value">{statistics.categoryAverages.food}/5</span>
              </div>
              <div className="summary-detail">
                <span className="detail-label">Service:</span>
                <span className="detail-value">{statistics.categoryAverages.service}/5</span>
              </div>
              <div className="summary-detail">
                <span className="detail-label">Ambience:</span>
                <span className="detail-value">{statistics.categoryAverages.ambience}/5</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card recommendation-summary">
            <div className="summary-card-header">
              <h3 className="summary-title">Recommendation Rate</h3>
              <div className="summary-icon">👍</div>
            </div>
            <div className="recommendation-text">
              <div className="recommendation-percent">{statistics.recommendationRate}%</div>
              <div className="recommendation-label">Would recommend</div>
              <div className="not-recommend-container">
                <div className="not-recommend-percent">{100 - statistics.recommendationRate}%</div>
                <div className="not-recommend-label">Would not recommend</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <div>
              <h2 className="charts-title">Analytics Overview</h2>
              <p className="charts-subtitle">Category performance and rating patterns</p>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Category Performance</h3>
                <span className="chart-card-subtitle">Average Ratings</span>
              </div>
              <div className="chart-card-content">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { category: 'Food', value: Number(statistics.categoryAverages.food) },
                    { category: 'Ambience', value: Number(statistics.categoryAverages.ambience) },
                    { category: 'Service', value: Number(statistics.categoryAverages.service) },
                    { category: 'Overall', value: Number(statistics.categoryAverages.overall) }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="Rating" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Rating Distribution</h3>
                <span className="chart-card-subtitle">Rating breakdown by category</span>
              </div>
              <div className="chart-card-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.categoryRatingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgRating" fill="#6366f1" name="Average Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Section */}
        <div className="distribution-section">
          <div className="distribution-header">
            <div>
              <h2 className="distribution-title">Distribution Analysis</h2>
              <p className="distribution-subtitle">Customer recommendations and submission types</p>
            </div>
          </div>
          
          <div className="distribution-container">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Recommendation Distribution</h3>
                <span className="chart-card-subtitle">Would customers recommend us?</span>
              </div>
              <div className="chart-card-content">
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
              <div className="chart-card-header">
                <h3 className="chart-card-title">Submission Types</h3>
                <span className="chart-card-subtitle">How customers are submitting feedback</span>
              </div>
              <div className="chart-card-content">
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

        {/* Table Section */}
        <div className="feedback-table-container">
          <div className="table-header">
            <h2 className="table-title">Recent Feedback</h2>
            <div className="table-actions">
              <button className="export-btn" onClick={exportToCSV}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <div className="no-feedback-container">
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
    </div>
  );
};

export default Dashboard;