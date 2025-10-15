// src/components/admin/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ title, value, icon, color }) => {
  const getCardClass = () => {
    switch (color) {
      case 'primary':
        return 'summary-card summary-card-primary';
      case 'success':
        return 'summary-card summary-card-success';
      case 'warning':
        return 'summary-card summary-card-warning';
      case 'info':
        return 'summary-card summary-card-info';
      default:
        return 'summary-card';
    }
  };

  return (
    <div className={getCardClass()}>
      <div className="summary-card-icon">
        {icon}
      </div>
      <div className="summary-card-content">
        <h3 className="summary-card-title">{title}</h3>
        <p className="summary-card-value">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;