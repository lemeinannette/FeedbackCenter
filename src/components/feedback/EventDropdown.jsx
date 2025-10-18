// src/components/feedback/EventDropdown.jsx
import React from 'react';
import './EventDropdown.css';

const EventDropdown = ({ value, onChange, error, otherEventValue, onOtherEventChange, otherEventError, isDarkTheme }) => {
  return (
    <div className="form-group">
      <label htmlFor="event" className="form-label">Event Type</label>
      <div className="select-wrapper">
        <select
          id="event"
          name="event"
          value={value}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}
        >
          <option value="">Select an event</option>
          <option value="1">Conference</option>
          <option value="2">Workshop</option>
          <option value="3">Seminar</option>
          <option value="4">Webinar</option>
          <option value="5">Meetup</option>
          <option value="6">Training</option>
          <option value="7">Networking Event</option>
          <option value="8">Product Launch</option>
          <option value="9">Other</option>
        </select>
        <div className="select-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
      
      {value === '9' && (
        <div className="mt-3">
          <label htmlFor="otherEvent" className="form-label">Please specify</label>
          <input
            type="text"
            id="otherEvent"
            name="otherEvent"
            value={otherEventValue}
            onChange={onOtherEventChange}
            className={`form-control ${otherEventError ? 'is-invalid' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}
            placeholder="Enter event type"
          />
          {otherEventError && <div className="invalid-feedback">{otherEventError}</div>}
        </div>
      )}
    </div>
  );
};

export default EventDropdown;