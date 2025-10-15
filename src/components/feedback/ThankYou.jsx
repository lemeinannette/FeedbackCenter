// src/components/ThankYou.jsx
import React from 'react';
import './ThankYou.css'; // Relative path to the CSS file in the same folder

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <div className="checkmark-circle">
        <div className="background"></div>
        <div className="checkmark"></div>
      </div>
      <h2>Thank You!</h2>
      <p>Your feedback has been received.</p>
    </div>
  );
};

export default ThankYou;