// src/components/EventDropdown.jsx
import React from 'react';

const EventDropdown = ({ eventTypes, selectedEvent, onEventChange }) => {
  return (
    <select value={selectedEvent} onChange={onEventChange}>
      {eventTypes.map(type => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
};

export default EventDropdown;