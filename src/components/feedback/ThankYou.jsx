// src/components/feedback/form-components/ThankYouAnimation.jsx
import React from 'react';

const ThankYouAnimation = ({ onReset }) => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-animation">
        <div className="checkmark-circle">
          <div className="checkmark"></div>
        </div>
        <h2>Thank You for Your Feedback!</h2>
        <p>Your response has been recorded successfully.</p>
        <button 
          className="btn btn-primary"
          onClick={onReset}
        >
          Submit Another Feedback
        </button>
      </div>
    </div>
  );
};

export default ThankYouAnimation;