import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    // This would be replaced with an actual API call
    const sampleFeedbacks = [
      {
        id: 1,
        date: '2023-11-15',
        name: 'John Doe',
        group: 'Team Alpha',
        event: 'Annual Conference',
        rating: 4.5,
        feedback: 'Great event overall, well organized.',
        food: 4,
        ambience: 5,
        service: 4,
        overallExperience: 5,
        staffProfessionalism: 4,
        facilities: 5,
        valueForMoney: 4
      },
      {
        id: 2,
        date: '2023-11-14',
        name: 'Jane Smith',
        group: 'Marketing Dept',
        event: 'Product Launch',
        rating: 3.8,
        feedback: 'Good presentation but venue was a bit crowded.',
        food: 3,
        ambience: 4,
        service: 4,
        overallExperience: 4,
        staffProfessionalism: 4,
        facilities: 3,
        valueForMoney: 4
      },
      {
        id: 3,
        date: '2023-11-13',
        name: 'Robert Johnson',
        group: 'Sales Team',
        event: 'Quarterly Meeting',
        rating: 4.2,
        feedback: 'Very informative session.',
        food: 4,
        ambience: 4,
        service: 5,
        overallExperience: 4,
        staffProfessionalism: 5,
        facilities: 4,
        valueForMoney: 4
      },
      {
        id: 4,
        date: '2023-11-12',
        name: 'Emily Davis',
        group: 'HR Department',
        event: 'Training Workshop',
        rating: 4.7,
        feedback: 'Excellent training materials and instructors.',
        food: 5,
        ambience: 4,
        service: 5,
        overallExperience: 5,
        staffProfessionalism: 5,
        facilities: 4,
        valueForMoney: 5
      },
      {
        id: 5,
        date: '2023-11-11',
        name: 'Michael Wilson',
        group: 'Finance Team',
        event: 'Budget Planning',
        rating: 3.5,
        feedback: 'Content was good but room temperature was uncomfortable.',
        food: 3,
        ambience: 3,
        service: 4,
        overallExperience: 3,
        staffProfessionalism: 4,
        facilities: 3,
        valueForMoney: 4
      },
      {
        id: 6,
        date: '2023-11-10',
        name: 'Sarah Brown',
        group: 'IT Department',
        event: 'Tech Summit',
        rating: 4.9,
        feedback: 'Amazing speakers and networking opportunities.',
        food: 5,
        ambience: 5,
        service: 5,
        overallExperience: 5,
        staffProfessionalism: 5,
        facilities: 5,
        valueForMoney: 5
      },
      {
        id: 7,
        date: '2023-11-09',
        name: 'David Lee',
        group: 'Operations',
        event: 'Process Review',
        rating: 3.2,
        feedback: 'Meeting ran too long and lacked clear objectives.',
        food: 3,
        ambience: 3,
        service: 3,
        overallExperience: 3,
        staffProfessionalism: 3,
        facilities: 3,
        valueForMoney: 3
      },
      {
        id: 8,
        date: '2023-11-08',
        name: 'Lisa Garcia',
        group: 'Customer Service',
        event: 'Skills Training',
        rating: 4.4,
        feedback: 'Very practical training that I can apply immediately.',
        food: 4,
        ambience: 4,
        service: 4,
        overallExperience: 5,
        staffProfessionalism: 4,
        facilities: 4,
        valueForMoney: 4
      },
      {
        id: 9,
        date: '2023-11-07',
        name: 'James Martinez',
        group: 'Product Team',
        event: 'Design Thinking Workshop',
        rating: 4.6,
        feedback: 'Interactive and engaging session.',
        food: 4,
        ambience: 5,
        service: 4,
        overallExperience: 5,
        staffProfessionalism: 5,
        facilities: 4,
        valueForMoney: 4
      },
      {
        id: 10,
        date: '2023-11-06',
        name: 'Jennifer Taylor',
        group: 'Marketing',
        event: 'Brand Strategy',
        rating: 3.9,
        feedback: 'Good content but presentation could be improved.',
        food: 4,
        ambience: 4,
        service: 3,
        overallExperience: 4,
        staffProfessionalism: 4,
        facilities: 4,
        valueForMoney: 4
      },
      {
        id: 11,
        date: '2023-11-05',
        name: 'William Anderson',
        group: 'Sales',
        event: 'Sales Techniques',
        rating: 4.3,
        feedback: 'Learned some valuable techniques.',
        food: 4,
        ambience: 4,
        service: 4,
        overallExperience: 4,
        staffProfessionalism: 4,
        facilities: 4,
        valueForMoney: 5
      },
      {
        id: 12,
        date: '2023-11-04',
        name: 'Patricia Thomas',
        group: 'HR',
        event: 'Recruitment Strategies',
        rating: 4.1,
        feedback: 'Well-structured presentation with good examples.',
        food: 4,
        ambience: 4,
        service: 4,
        overallExperience: 4,
        staffProfessionalism: 4,
        facilities: 4,
        valueForMoney: 4
      }
    ];
    
    setFeedbacks(sampleFeedbacks);
  }, []);

  // Filter feedbacks based on search term
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feedbacks, searchTerm]);

  // Calculate current page feedbacks
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Calculate average ratings for each category
  const averageRatings = useMemo(() => {
    if (feedbacks.length === 0) return [];
    
    const categories = [
      'food', 'ambience', 'service', 'overallExperience', 
      'staffProfessionalism', 'facilities', 'valueForMoney'
    ];
    
    return categories.map(category => {
      const sum = feedbacks.reduce((acc, feedback) => acc + feedback[category], 0);
      const avg = sum / feedbacks.length;
      
      return {
        name: category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: parseFloat(avg.toFixed(1))
      };
    });
  }, [feedbacks]);

  // Calculate recommendation rate
  const recommendationRate = useMemo(() => {
    if (feedbacks.length === 0) return { wouldRecommend: 0, wouldNotRecommend: 0 };
    
    const wouldRecommend = feedbacks.filter(f => f.rating >= 4).length;
    const wouldNotRecommend = feedbacks.length - wouldRecommend;
    
    return {
      wouldRecommend: Math.round((wouldRecommend / feedbacks.length) * 100),
      wouldNotRecommend: Math.round((wouldNotRecommend / feedbacks.length) * 100)
    };
  }, [feedbacks]);

  // Calculate rating distribution for pie chart
  const ratingDistribution = useMemo(() => {
    if (feedbacks.length === 0) return [];
    
    const distribution = [
      { name: '5 Stars', value: 0, color: '#14b8a6' },
      { name: '4 Stars', value: 0, color: '#22d3ee' },
      { name: '3 Stars', value: 0, color: '#67e8f9' },
      { name: '2 Stars', value: 0, color: '#a5f3fc' },
      { name: '1 Star', value: 0, color: '#cffafe' }
    ];
    
    feedbacks.forEach(feedback => {
      const rating = Math.floor(feedback.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[5 - rating].value += 1;
      }
    });
    
    return distribution;
  }, [feedbacks]);

  return (
    <div className="feedback-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Feedback Hub</h1>
        <h2 className="dashboard-subtitle">Admin Dashboard</h2>
      </div>
      
      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search feedback..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <select 
            className="time-filter" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card recommendation-card">
          <h3 className="stat-title">Recommendation Rate</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Would Recommend', value: recommendationRate.wouldRecommend, color: '#14b8a6' },
                    { name: 'Would Not Recommend', value: recommendationRate.wouldNotRecommend, color: '#e2e8f0' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? '#14b8a6' : '#e2e8f0'
                    } />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="recommendation-text">
              <div className="recommendation-percent">{recommendationRate.wouldRecommend}%</div>
              <div className="recommendation-label">Would Recommend</div>
              <div className="not-recommend-percent">{recommendationRate.wouldNotRecommend}%</div>
              <div className="not-recommend-label">Would Not Recommend</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card rating-card">
          <h3 className="stat-title">Rating Comparison</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={averageRatings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="feedback-table-container">
        <h2 className="table-title">Recent Feedback</h2>
        
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
              {currentFeedbacks.map(feedback => (
                <tr key={feedback.id}>
                  <td>{feedback.date}</td>
                  <td>
                    <div className="name-group">
                      <div className="name">{feedback.name}</div>
                      <div className="group">{feedback.group}</div>
                    </div>
                  </td>
                  <td>{feedback.event}</td>
                  <td>
                    <div className="rating-container">
                      <div className="rating-value">{feedback.rating}</div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(feedback.rating) ? "star filled" : "star"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="feedback-text">{feedback.feedback}</td>
                  <td>{feedback.food}</td>
                  <td>{feedback.ambience}</td>
                  <td>{feedback.service}</td>
                  <td>{feedback.overallExperience}</td>
                  <td>{feedback.staffProfessionalism}</td>
                  <td>{feedback.facilities}</td>
                  <td>{feedback.valueForMoney}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination-container">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {Math.ceil(filteredFeedbacks.length / itemsPerPage)}
          </span>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3 className="chart-title">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTable;