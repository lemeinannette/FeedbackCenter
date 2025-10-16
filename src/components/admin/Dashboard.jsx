/*
  ⚠️ OLD DASHBOARD DISABLED ⚠️
  This component caused repetition with FeedbackTable.jsx.
  Keeping it commented out for reference only.
*/

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
// import SummaryCard from './SummaryCard';
// import FeedbackTable from './FeedbackTable';
// import './Dashboard.css';

// const Dashboard = ({ onLogout }) => {
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFeedbackData = async () => {
//       try {
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         const mockData = [/* ... your old mock data ... */];
//         setFeedbackData(mockData);
//       } catch (error) {
//         setError('Failed to load feedback data.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchFeedbackData();
//   }, []);

//   const handleLogout = () => {
//     onLogout();
//     navigate('/admin');
//   };

//   return (
//     <div className="dashboard-container">
//       <Navbar onLogout={handleLogout} />
//       <div className="dashboard-content">
//         <div className="container">
//           <div className="dashboard-header">
//             <h1>Feedback Dashboard</h1>
//             <p>Monitor and analyze customer feedback</p>
//           </div>
//           {/* old summary + table removed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
