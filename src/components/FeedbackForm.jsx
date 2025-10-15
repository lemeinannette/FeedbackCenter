// src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import ThankYou from './ThankYou'; // Import the new component
import EventDropdown from './EventDropdown'; // Import the new component
import './FeedbackForm.css'; // Correct relative path

const EVENT_TYPES = ['Conference', 'Wedding', 'Graduation', 'Gala', 'Corporate Party', 'Other'];

const FeedbackForm = ({ onSubmit }) => {
  const [showThankYou, setShowThankYou] = useState(false);

  // State for the form
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [respondentType, setRespondentType] = useState('individual');
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [comment, setComment] = useState('');

  // State for conditional inputs
  const [individualName, setIndividualName] = useState('');
  const [individualEmail, setIndividualEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupEmail, setGroupEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      eventType,
      rating,
      recommendation,
      comment,
      date: new Date().toISOString(),
    };

    if (!isAnonymous) {
      payload.respondentType = respondentType;
      if (respondentType === 'individual') {
        payload.name = individualName;
        payload.email = individualEmail;
      } else {
        payload.name = groupName;
        payload.email = groupEmail;
      }
    } else {
      payload.respondentType = 'anonymous';
    }

    onSubmit(payload);
    setShowThankYou(true);
  };

  if (showThankYou) {
    return <ThankYou />; // Render the new component
  }

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2>Feedback Form</h2>
      <p className="form-description">We value your feedback! Please share your experience with us.</p>

      {/* --- Section 1: Anonymous Toggle --- */}
      <div className="form-section">
        <div className="section-header">
          <input type="checkbox" id="anonymous-checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
          <label htmlFor="anonymous-checkbox">Submit as Anonymous</label>
        </div>
      </div>

      {!isAnonymous && (
        <div className="form-section">
          <h3>Are you giving feedback as:</h3>
          <div className="toggle-group">
            <div className={`toggle-option ${respondentType === 'individual' ? 'active' : ''}`} onClick={() => setRespondentType('individual')}>Individual</div>
            <div className={`toggle-option ${respondentType === 'group' ? 'active' : ''}`} onClick={() => setRespondentType('group')}>Group / Organization / Association</div>
          </div>
        </div>
      )}

      {!isAnonymous && (
        <div className="form-section">
          {respondentType === 'individual' ? (
            <>
              <input type="text" placeholder="Your Name" value={individualName} onChange={(e) => setIndividualName(e.target.value)} />
              <input type="email" placeholder="Your Email" value={individualEmail} onChange={(e) => setIndividualEmail(e.target.value)} />
            </>
          ) : (
            <>
              <input type="text" placeholder="Group/Organization Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              <input type="email" placeholder="Group Email" value={groupEmail} onChange={(e) => setGroupEmail(e.target.value)} />
            </>
          )}
        </div>
      )}

      {/* --- Section 4: Event Info (Now using the new component) --- */}
      <div className="form-section">
        <h3>Event Information</h3>
        <EventDropdown 
          eventTypes={EVENT_TYPES}
          selectedEvent={eventType}
          onEventChange={(e) => setEventType(e.target.value)}
        />
      </div>

      {/* --- Section 5: Ratings --- */}
      <div className="form-section">
        <h3>Your Ratings</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" className={`star ${star <= rating ? 'active' : ''}`} onClick={() => setRating(star)}>★</button>
          ))}
        </div>
      </div>

      {/* --- Section 6: Recommendation --- */}
      <div className="form-section">
        <h3>Would you recommend us?</h3>
        <div className="recommendation-group">
          <button type="button" className={`rec-button ${recommendation === 'yes' ? 'yes' : ''}`} onClick={() => setRecommendation('yes')}>
            <span role="img" aria-label="yes">😊</span> Yes
          </button>
          <button type="button" className={`rec-button ${recommendation === 'no' ? 'no' : ''}`} onClick={() => setRecommendation('no')}>
            <span role="img" aria-label="no">😞</span> No
          </button>
        </div>
      </div>

      {/* --- Section 7: Comments --- */}
      <div className="form-section">
        <h3>Additional comments</h3>
        <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
      </div>

      <button type="submit" className="submit-button">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;