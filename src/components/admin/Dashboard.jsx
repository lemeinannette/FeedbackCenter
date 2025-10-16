import React, { useState, useEffect, useMemo } from 'react';
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
} from 'recharts';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [timeFilter, setTimeFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Load feedbacks safely from localStorage
  useEffect(() => {
    try {
      setLoading(true);
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
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    try {
      localStorage.setItem('darkMode', newDark);
    } catch (err) {
      console.error('Dark mode save failed:', err);
    }
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

  // Add new feedback
  const addFeedback = (newFeedback) => {
    const feedbackWithId = {
      ...newFeedback,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setFeedbacks((prev) => [...prev, feedbackWithId]);
  };

  useEffect(() => {
    window.addFeedback = addFeedback;
    return () => delete window.addFeedback;
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/admin/login';
  };

  // Export to PDF function
  const exportToPDF = () => {
    // This would typically use a library like jsPDF or react-to-pdf
    // For now, we'll create a simple CSV export
    const csvContent = [
      ['Date', 'Name', 'Group', 'Event', 'Rating', 'Feedback', 'Food', 'Ambience', 'Service', 'Overall', 'Staff', 'Facilities', 'Value'],
      ...filteredFeedbacks.map(f => [
        f.date || 'N/A',
        f.name || 'N/A',
        f.group || 'N/A',
        f.event || 'N/A',
        f.rating || 'N/A',
        f.feedback || 'N/A',
        f.food || 'N/A',
        f.ambience || 'N/A',
        f.service || 'N/A',
        f.overallExperience || 'N/A',
        f.staffProfessionalism || 'N/A',
        f.facilities || 'N/A',
        f.valueForMoney || 'N/A'
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
      return (
        (f.name || '').toLowerCase().includes(term) ||
        (f.group || '').toLowerCase().includes(term) ||
        (f.event || '').toLowerCase().includes(term) ||
        (f.feedback || '').toLowerCase().includes(term)
      );
    });

    if (timeFilter !== 'all') {
      const today = new Date();
      const start = new Date(today);
      if (timeFilter === 'week') start.setDate(today.getDate() - 7);
      if (timeFilter === 'month') start.setMonth(today.getMonth() - 1);
      if (timeFilter === 'year') start.setFullYear(today.getFullYear() - 1);
      if (timeFilter === 'today') start.setHours(0, 0, 0, 0);

      filtered = filtered.filter((f) => {
        const date = new Date(f.date);
        return timeFilter === 'today'
          ? date >= start && date <= today
          : date >= start;
      });
    }

    return filtered;
  }, [feedbacks, searchTerm, timeFilter]);

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
        trendData: [],
        eventDistribution: [],
        sentimentData: []
      };
    }

    const totalFeedbacks = filteredFeedbacks.length;
    const averageRating = (
      filteredFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedbacks
    ).toFixed(1);
    
    const recommendations = filteredFeedbacks.filter(f => f.rating >= 4).length;
    const recommendationRate = ((recommendations / totalFeedbacks) * 100).toFixed(0);
    
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const recentFeedbacks = filteredFeedbacks.filter(f => new Date(f.date) >= weekAgo).length;

    // Rating distribution
    const ratingCounts = [0, 0, 0, 0, 0];
    filteredFeedbacks.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingCounts[Math.floor(f.rating) - 1]++;
      }
    });
    
    const ratingDistribution = ratingCounts.map((count, index) => ({
      rating: `${index + 1} Star`,
      count,
      percentage: ((count / totalFeedbacks) * 100).toFixed(0)
    }));

    // Category averages
    const categories = ['food', 'ambience', 'service', 'overallExperience', 'staffProfessionalism', 'facilities', 'valueForMoney'];
    const categoryAverages = {};
    
    categories.forEach(category => {
      const validRatings = filteredFeedbacks
        .map(f => f[category])
        .filter(rating => rating !== undefined && rating !== null && !isNaN(rating));
      
      if (validRatings.length > 0) {
        categoryAverages[category] = (
          validRatings.reduce((sum, rating) => sum + Number(rating), 0) / validRatings.length
        ).toFixed(1);
      } else {
        categoryAverages[category] = 0;
      }
    });

    // Trend data (last 7 days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayFeedbacks = filteredFeedbacks.filter(f => f.date === dateStr);
      const dayRating = dayFeedbacks.length > 0
        ? (dayFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / dayFeedbacks.length).toFixed(1)
        : 0;
      
      trendData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayFeedbacks.length,
        rating: Number(dayRating)
      });
    }

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

    // Sentiment analysis based on rating
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    filteredFeedbacks.forEach(f => {
      if (f.rating >= 4) sentimentCounts.positive++;
      else if (f.rating >= 3) sentimentCounts.neutral++;
      else sentimentCounts.negative++;
    });
    
    const sentimentData = [
      { name: 'Positive', value: sentimentCounts.positive, color: '#10b981' },
      { name: 'Neutral', value: sentimentCounts.neutral, color: '#f59e0b' },
      { name: 'Negative', value: sentimentCounts.negative, color: '#ef4444' }
    ];

    return {
      totalFeedbacks,
      averageRating,
      recommendationRate,
      recentFeedbacks,
      ratingDistribution,
      categoryAverages,
      trendData,
      eventDistribution,
      sentimentData
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
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedFeedback.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Group:</span>
                  <span className="detail-value">{selectedFeedback.group || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Event:</span>
                  <span className="detail-value">{selectedFeedback.event || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{selectedFeedback.date || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">{selectedFeedback.rating || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Feedback:</span>
                  <span className="detail-value">{selectedFeedback.feedback || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Food:</span>
                  <span className="detail-value">{selectedFeedback.food || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ambience:</span>
                  <span className="detail-value">{selectedFeedback.ambience || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Service:</span>
                  <span className="detail-value">{selectedFeedback.service || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Overall Experience:</span>
                  <span className="detail-value">{selectedFeedback.overallExperience || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Staff Professionalism:</span>
                  <span className="detail-value">{selectedFeedback.staffProfessionalism || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Facilities:</span>
                  <span className="detail-value">{selectedFeedback.facilities || 'N/A'}/5</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Value for Money:</span>
                  <span className="detail-value">{selectedFeedback.valueForMoney || 'N/A'}/5</span>
                </div>
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
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-title">Total Feedbacks</h3>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">{statistics.totalFeedbacks}</div>
          <div className="stat-change positive">
            +{statistics.recentFeedbacks} this week
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-title">Average Rating</h3>
            <div className="stat-icon">⭐</div>
          </div>
          <div className="stat-value">{statistics.averageRating}/5.0</div>
          <div className="stat-change neutral">
            Based on {statistics.totalFeedbacks} reviews
          </div>
        </div>
        
        <div className="stat-card recommendation-card">
          <div className="stat-card-header">
            <h3 className="stat-title">Recommendation Rate</h3>
            <div className="stat-icon">👍</div>
          </div>
          <div className="recommendation-text">
            <div className="recommendation-percent">{statistics.recommendationRate}%</div>
            <div className="recommendation-label">Would recommend</div>
            <div className="not-recommend-percent">{100 - statistics.recommendationRate}%</div>
            <div className="not-recommend-label">Would not recommend</div>
          </div>
        </div>
      </div>

      <div className="horizontal-charts-section">
        <div className="section-header">
          <h2 className="section-title">Performance Analytics</h2>
          <p className="section-subtitle">Detailed insights into feedback trends and category performance</p>
        </div>
        
        <div className="horizontal-charts-container">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Feedback Trend</h3>
              <span className="chart-card-subtitle">Last 7 Days</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={statistics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Feedback Count"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rating"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Average Rating"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Category Performance</h3>
              <span className="chart-card-subtitle">Average Ratings</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={Object.entries(statistics.categoryAverages).map(([category, value]) => ({
                    category: category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).substring(0, 10),
                    value: Number(value)
                  }))}
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Rating Distribution</h3>
              <span className="chart-card-subtitle">Customer Satisfaction</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statistics.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-charts-section">
        <div className="section-header">
          <h2 className="section-title">Analytics Overview</h2>
          <p className="section-subtitle">Event distribution, rating patterns, and sentiment analysis</p>
        </div>
        
        <div className="analytics-charts-container">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Top Events</h3>
              <span className="chart-card-subtitle">Most frequent events</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statistics.eventDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ event, percent }) => `${event}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statistics.eventDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Rating Distribution</h3>
              <span className="chart-card-subtitle">Customer satisfaction levels</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statistics.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Sentiment Analysis</h3>
              <span className="chart-card-subtitle">Customer sentiment breakdown</span>
            </div>
            <div className="chart-card-content">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statistics.sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statistics.sentimentData.map((entry, index) => (
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

      <div className="feedback-table-container">
        <div className="table-header">
          <h2 className="table-title">Recent Feedback</h2>
          <div className="table-actions">
            <button className="export-btn" onClick={exportToPDF}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export PDF
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
                    <th>Event</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                    <th>Food</th>
                    <th>Ambience</th>
                    <th>Service</th>
                    <th>Overall</th>
                    <th>Staff</th>
                    <th>Facilities</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeedbacks.map((feedback) => (
                    <tr key={feedback.id || `${feedback.name}-${feedback.date}`}>
                      <td>{feedback.date || 'N/A'}</td>
                      <td>
                        <div className="name-group">
                          <div className="name">{feedback.name || 'N/A'}</div>
                          <div className="group">{feedback.group || 'N/A'}</div>
                        </div>
                      </td>
                      <td>{feedback.event || 'N/A'}</td>
                      <td>
                        <div className="rating-container">
                          <div className="rating-value">{feedback.rating || 'N/A'}</div>
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={`${feedback.id || feedback.name}-star-${i}`}
                                className={
                                  i < Math.floor(feedback.rating || 0)
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
                      <td className="feedback-text">{feedback.feedback || 'N/A'}</td>
                      <td>{feedback.food || 'N/A'}</td>
                      <td>{feedback.ambience || 'N/A'}</td>
                      <td>{feedback.service || 'N/A'}</td>
                      <td>{feedback.overallExperience || 'N/A'}</td>
                      <td>{feedback.staffProfessionalism || 'N/A'}</td>
                      <td>{feedback.facilities || 'N/A'}</td>
                      <td>{feedback.valueForMoney || 'N/A'}</td>
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
  );
};

export default Dashboard;