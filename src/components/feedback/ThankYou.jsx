// src/components/feedback/ThankYou.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css'; // Add this import

const ThankYou = ({ onReset }) => {
  const navigate = useNavigate();
  
  const handleSubmitAnother = () => {
    // Call the reset function passed from parent
    if (onReset) {
      onReset();
    }
    // Navigate back to the feedback form
    navigate('/feedback');
  };
  
  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1>Thank You!</h1>
        <p>Your feedback has been successfully submitted.</p>
        <p>We appreciate your time and input. Your feedback helps us improve our services.</p>
        
        <div className="thank-you-actions">
          <button 
            className="btn btn-primary"
            onClick={handleSubmitAnother}
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;