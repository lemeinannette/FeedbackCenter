// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SummaryCard from './SummaryCard';
import FeedbackTable from './FeedbackTable';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            event: 'Annual Conference 2023',
            rating: 5,
            feedback: 'Great event! Very well organized and informative.',
            date: '2023-10-15'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            event: 'Product Launch Event',
            rating: 4,
            feedback: 'Good presentation, but the venue was a bit crowded.',
            date: '2023-10-14'
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            event: 'Customer Appreciation Day',
            rating: 5,
            feedback: 'Amazing experience! The team was very friendly and helpful.',
            date: '2023-10-13'
          },
          {
            id: 4,
            name: 'Alice Williams',
            email: 'alice@example.com',
            event: 'Tech Workshop Series',
            rating: 3,
            feedback: 'Content was good but the workshop was too short.',
            date: '2023-10-12'
          },
          {
            id: 5,
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            event: 'Community Meetup',
            rating: 4,
            feedback: 'Nice networking opportunity. Would like more structured activities next time.',
            date: '2023-10-11'
          }
        ];
        
        setFeedbackData(mockData);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setError('Failed to load feedback data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/admin');
  };

  // Calculate summary statistics
  const totalFeedback = feedbackData.length;
  const averageRating = feedbackData.length > 0 
    ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length).toFixed(1)
    : 0;
  
  const fiveStarReviews = feedbackData.filter(item => item.rating === 5).length;
  const recentFeedback = feedbackData.filter(item => {
    const feedbackDate = new Date(item.date);
    const today = new Date();
    const diffTime = Math.abs(today - feedbackDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  return (
    <div className="dashboard-container">
      <Navbar onLogout={handleLogout} />
      
      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Feedback Dashboard</h1>
            <p>Monitor and analyze customer feedback</p>
          </div>
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading feedback data...</p>
            </div>
          ) : (
            <>
              <div className="summary-cards">
                <SummaryCard 
                  title="Total Feedback" 
                  value={totalFeedback} 
                  icon="💬" 
                  color="primary"
                />
                <SummaryCard 
                  title="Average Rating" 
                  value={`${averageRating}/5`} 
                  icon="⭐" 
                  color="warning"
                />
                <SummaryCard 
                  title="5-Star Reviews" 
                  value={fiveStarReviews} 
                  icon="🏆" 
                  color="success"
                />
                <SummaryCard 
                  title="Recent Feedback" 
                  value={recentFeedback} 
                  icon="📅" 
                  color="info"
                />
              </div>
              
              <div className="feedback-table-container">
                <h2>Recent Feedback</h2>
                <FeedbackTable data={feedbackData} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;