// src/components/feedback/EventDropdown.jsx
import React from 'react';

const EventDropdown = ({ value, onChange, className }) => {
  const events = [
    { id: '1', name: 'Annual Conference 2023' },
    { id: '2', name: 'Product Launch Event' },
    { id: '3', name: 'Customer Appreciation Day' },
    { id: '4', name: 'Tech Workshop Series' },
    { id: '5', name: 'Community Meetup' },
    { id: '6', name: 'Webinar: Industry Trends' },
    { id: '7', name: 'Training Session' },
    { id: '8', name: 'Networking Event' }
  ];

  return (
    <select
      id="event"
      name="event"
      value={value}
      onChange={onChange}
      className={`form-control ${className || ''}`}
    >
      <option value="">Select an event</option>
      {events.map(event => (
        <option key={event.id} value={event.id}>
          {event.name}
        </option>
      ))}
    </select>
  );
};

export default EventDropdown;