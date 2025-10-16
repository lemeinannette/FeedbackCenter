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
} from 'recharts';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);
  const [timeFilter, setTimeFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load feedbacks safely from localStorage
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

  // ✅ Dark mode toggle
  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    try {
      localStorage.setItem('darkMode', newDark);
    } catch (err) {
      console.error('Dark mode save failed:', err);
    }
  };

  // ✅ Save to localStorage when feedbacks change
  useEffect(() => {
    try {
      if (feedbacks.length > 0) {
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
      }
    } catch (err) {
      console.error('Error saving feedbacks:', err);
    }
  }, [feedbacks]);

  // ✅ Add new feedback
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

  // ✅ Filter feedbacks
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ✅ Handle loading and errors
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

  // ✅ Render Table
  return (
    <div className={`feedback-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Feedback Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor and analyze customer feedback
            </p>
          </div>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
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
