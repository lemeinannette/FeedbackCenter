// src/components/feedback/EventDropdown.jsx
import React from 'react';

const EventDropdown = ({ value, onChange, error, otherEventValue, onOtherEventChange, otherEventError }) => {
  const events = [
    { id: '1', name: 'Wedding Reception' },
    { id: '2', name: 'Corporate Conference' },
    { id: '3', name: 'Graduation Ceremony' },
    { id: '4', name: 'Birthday Party' },
    { id: '5', name: 'Anniversary Celebration' },
    { id: '6', name: 'Business Meeting' },
    { id: '7', name: 'Product Launch' },
    { id: '8', name: 'Charity Gala' },
    { id: '9', name: 'Other' }
  ];

  return (
    <>
      <div className="form-group">
        <label htmlFor="event" className="form-label">Event Information</label>
        <select
          id="event"
          name="event"
          value={value}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        >
          <option value="">Select Event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      
      {value === '9' && (
        <div className="form-group">
          <label htmlFor="otherEvent" className="form-label">Please specify the event type</label>
          <textarea
            id="otherEvent"
            name="otherEvent"
            value={otherEventValue}
            onChange={onOtherEventChange}
            className={`form-control ${otherEventError ? 'is-invalid' : ''}`}
            rows="3"
            placeholder="Please describe your event..."
          ></textarea>
          {otherEventError && <div className="invalid-feedback">{otherEventError}</div>}
        </div>
      )}
    </>
  );
};

export default EventDropdown;