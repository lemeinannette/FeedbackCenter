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

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [timeFilter, setTimeFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Feedback Analytics Dashboard</h1>
            <p className="dashboard-subtitle">
              Comprehensive insights into customer feedback
            </p>
          </div>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
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

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3 className="chart-title">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statistics.sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
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

      <div className="dashboard-charts">
        <div className="chart-container full-width">
          <h3 className="chart-title">Feedback Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={statistics.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
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

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3 className="chart-title">Category Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={Object.entries(statistics.categoryAverages).map(([category, value]) => ({
                category: category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value: Number(value)
              }))}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Top Events</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statistics.eventDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ event, percent }) => `${event}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
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

      <div className="feedback-table-container">
        <div className="table-header">
          <h2 className="table-title">Recent Feedback</h2>
          <div className="table-actions">
            <button className="export-btn">Export</button>
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

export default FeedbackTable;