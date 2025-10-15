// src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

const Dashboard = ({ feedbackData }) => {
  // Calculate statistics
  const totalFeedback = feedbackData.length;
  const averageRating = feedbackData.length > 0 
    ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
    : 0;
  const eventsReviewed = new Set(feedbackData.map(f => f.eventType)).size;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-section">
        <div className="stat-card"><h3>{totalFeedback}</h3><p>Total Feedback</p></div>
        <div className="stat-card"><h3>{averageRating} / 5</h3><p>Average Rating</p></div>
        <div className="stat-card"><h3>{eventsReviewed}</h3><p>Events Reviewed</p></div>
      </div>

      <div className="feedback-list-section">
        <h2>Recent Feedback</h2>
        <div className="feedback-list">
          {feedbackData.map(item => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-header">
                <span className="feedback-author">{item.guestName || 'Anonymous'}</span>
                <span className="feedback-event">{item.eventType}</span>
                <span className="feedback-rating">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
              </div>
              <p className="feedback-comment">{item.comment}</p>
              <span className="feedback-date">{new Date(item.date).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// THIS IS THE CRITICAL LINE
export default Dashboard;