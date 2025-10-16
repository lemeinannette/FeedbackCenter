// src/components/feedback/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    isAnonymous: false,
    feedbackType: 'individual', // 'individual' or 'group'
    // Individual fields
    name: '',
    email: '',
    contact: '',
    // Group fields
    groupName: '',
    groupEmail: '',
    groupContact: '',
    // Event information
    event: '',
    otherEvent: '',
    // Ratings
    foodRating: 0,
    ambienceRating: 0,
    serviceRating: 0,
    overallRating: 0,
    staffProfessionalismRating: 0,
    facilitiesRating: 0,
    valueForMoneyRating: 0,
    // Recommendation
    wouldRecommend: null,
    // Additional comments
    comments: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();

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

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleToggleChange = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleRatingChange = (name, rating) => {
    setFormData(prev => ({
      ...prev,
      [name]: rating
    }));
  };

  const handleRecommendationChange = (value) => {
    setFormData(prev => ({
      ...prev,
      wouldRecommend: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate based on feedback type and anonymous status
    if (!formData.isAnonymous) {
      if (formData.feedbackType === 'individual') {
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        
        if (!formData.contact.trim()) {
          newErrors.contact = 'Contact number is required';
        }
      } else {
        if (!formData.groupName.trim()) {
          newErrors.groupName = 'Group name is required';
        }
        
        if (!formData.groupEmail.trim()) {
          newErrors.groupEmail = 'Group email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.groupEmail)) {
          newErrors.groupEmail = 'Group email is invalid';
        }
        
        if (!formData.groupContact.trim()) {
          newErrors.groupContact = 'Group contact number is required';
        }
      }
    }
    
    if (!formData.event) {
      newErrors.event = 'Please select an event';
    }
    
    if (formData.event === '9' && !formData.otherEvent.trim()) {
      newErrors.otherEvent = 'Please specify the event type';
    }
    
    if (formData.foodRating === 0) {
      newErrors.foodRating = 'Please rate the food';
    }
    
    if (formData.ambienceRating === 0) {
      newErrors.ambienceRating = 'Please rate the ambience';
    }
    
    if (formData.serviceRating === 0) {
      newErrors.serviceRating = 'Please rate the service';
    }
    
    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Please rate the overall experience';
    }
    
    if (formData.wouldRecommend === null) {
      newErrors.wouldRecommend = 'Please indicate if you would recommend us';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the data to your backend
      console.log('Feedback submitted:', formData);
      
      // Show thank you message
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ form: 'An error occurred while submitting your feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      isAnonymous: false,
      feedbackType: 'individual',
      name: '',
      email: '',
      contact: '',
      groupName: '',
      groupEmail: '',
      groupContact: '',
      event: '',
      otherEvent: '',
      foodRating: 0,
      ambienceRating: 0,
      serviceRating: 0,
      overallRating: 0,
      staffProfessionalismRating: 0,
      facilitiesRating: 0,
      valueForMoneyRating: 0,
      wouldRecommend: null,
      comments: ''
    });
    setErrors({});
    setShowThankYou(false);
  };

  const renderStars = (name, rating) => {
    return (
      <div className="rating-container">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`rating-star ${star <= rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(name, star)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  fill={star <= rating ? "#FFD700" : "none"}
                  stroke={star <= rating ? "#FFD700" : "#ddd"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
        <div className="rating-info">
          <span className="rating-text">Selected: {rating}</span>
        </div>
      </div>
    );
  };

  if (showThankYou) {
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
            onClick={handleResetForm}
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`feedback-app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Navigation Bar - Only one navbar with teal green background */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" rx="6" fill="#008080"/>
                <path d="M8 15L12 9L16 11L20 7L22 15L18 19L14 17L10 21L8 15Z" fill="white"/>
                <circle cx="15" cy="15" r="2" fill="#008080"/>
              </svg>
              <span className="logo-text">FeedbackCenter</span>
            </div>
          </div>
          
          <div className="navbar-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#admin" className="nav-link">Admin</a>
          </div>
        </div>
      </nav>
      
      <div className="feedback-form-container">
        <div className="feedback-form-wrapper">
          <div className="feedback-form-header">
            <h1>Feedback Form</h1>
            <p>Your input helps us improve our events and services</p>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V1M12 23V21M4.22 4.22L2.81 2.81M21.19 21.19L19.78 19.78M1 12H3M21 12H23M4.22 19.78L2.81 21.19M19.78 4.22L21.19 2.81" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>
          
          {errors.form && (
            <div className="alert alert-danger">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Anonymous Toggle */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={() => handleToggleChange('isAnonymous')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">SUBMIT AS ANONYMOUS</span>
              </label>
            </div>
            
            {/* Feedback Type */}
            <div className="form-group">
              <label className="form-label">ARE YOU GIVING FEEDBACK AS:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="feedbackType"
                    value="individual"
                    checked={formData.feedbackType === 'individual'}
                    onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'individual' }))}
                    disabled={formData.isAnonymous}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Individual</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="feedbackType"
                    value="group"
                    checked={formData.feedbackType === 'group'}
                    onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'group' }))}
                    disabled={formData.isAnonymous}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">GROUP / ORGANIZATION / ASSOCIATION</span>
                </label>
              </div>
            </div>
            
            {/* Individual Information */}
            {!formData.isAnonymous && formData.feedbackType === 'individual' && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Your name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Your email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact" className="form-label">Contact</label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                    placeholder="Your contact number"
                  />
                  {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                </div>
              </div>
            )}
            
            {/* Group Information */}
            {!formData.isAnonymous && formData.feedbackType === 'group' && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="groupName" className="form-label">Group Name</label>
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.groupName ? 'is-invalid' : ''}`}
                    placeholder="Group name"
                  />
                  {errors.groupName && <div className="invalid-feedback">{errors.groupName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="groupEmail" className="form-label">Group Email</label>
                  <input
                    type="email"
                    id="groupEmail"
                    name="groupEmail"
                    value={formData.groupEmail}
                    onChange={handleInputChange}
                    className={`form-control ${errors.groupEmail ? 'is-invalid' : ''}`}
                    placeholder="Group email"
                  />
                  {errors.groupEmail && <div className="invalid-feedback">{errors.groupEmail}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="groupContact" className="form-label">Group Contact</label>
                  <input
                    type="tel"
                    id="groupContact"
                    name="groupContact"
                    value={formData.groupContact}
                    onChange={handleInputChange}
                    className={`form-control ${errors.groupContact ? 'is-invalid' : ''}`}
                    placeholder="Group contact number"
                  />
                  {errors.groupContact && <div className="invalid-feedback">{errors.groupContact}</div>}
                </div>
              </div>
            )}
            
            {/* Event Information */}
            <div className="form-group">
              <label htmlFor="event" className="form-label">Event Information</label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                className={`form-control ${errors.event ? 'is-invalid' : ''}`}
              >
                <option value="">Select an event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.event && <div className="invalid-feedback">{errors.event}</div>}
            </div>
            
            {formData.event === '9' && (
              <div className="form-group">
                <label htmlFor="otherEvent" className="form-label">Please specify the event type</label>
                <textarea
                  id="otherEvent"
                  name="otherEvent"
                  value={formData.otherEvent}
                  onChange={handleInputChange}
                  className={`form-control ${errors.otherEvent ? 'is-invalid' : ''}`}
                  rows="3"
                  placeholder="Please describe your event..."
                ></textarea>
                {errors.otherEvent && <div className="invalid-feedback">{errors.otherEvent}</div>}
              </div>
            )}
            
            {/* Ratings */}
            <div className="ratings-section">
              <h3>Your Ratings</h3>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Food</label>
                </div>
                {renderStars('foodRating', formData.foodRating)}
                {errors.foodRating && <div className="invalid-feedback">{errors.foodRating}</div>}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Ambience</label>
                </div>
                {renderStars('ambienceRating', formData.ambienceRating)}
                {errors.ambienceRating && <div className="invalid-feedback">{errors.ambienceRating}</div>}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Service</label>
                </div>
                {renderStars('serviceRating', formData.serviceRating)}
                {errors.serviceRating && <div className="invalid-feedback">{errors.serviceRating}</div>}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Overall Experience</label>
                </div>
                {renderStars('overallRating', formData.overallRating)}
                {errors.overallRating && <div className="invalid-feedback">{errors.overallRating}</div>}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Staff Professionalism</label>
                </div>
                {renderStars('staffProfessionalismRating', formData.staffProfessionalismRating)}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Facilities</label>
                </div>
                {renderStars('facilitiesRating', formData.facilitiesRating)}
              </div>
              
              <div className="rating-group">
                <div className="rating-header">
                  <label className="rating-label">Value for Money</label>
                </div>
                {renderStars('valueForMoneyRating', formData.valueForMoneyRating)}
              </div>
            </div>
            
            {/* Recommendation */}
            <div className="form-group">
              <label className="form-label">Would you recommend us?</label>
              <div className="recommendation-options">
                <button
                  type="button"
                  className={`recommendation-btn ${formData.wouldRecommend === true ? 'active yes' : ''}`}
                  onClick={() => handleRecommendationChange(true)}
                >
                  <div className="recommendation-icon">
                    <span className="emoji happy">😊</span>
                  </div>
                  <span>YES</span>
                </button>
                <button
                  type="button"
                  className={`recommendation-btn ${formData.wouldRecommend === false ? 'active no' : ''}`}
                  onClick={() => handleRecommendationChange(false)}
                >
                  <div className="recommendation-icon">
                    <span className="emoji sad">😞</span>
                  </div>
                  <span>NO</span>
                </button>
              </div>
              {errors.wouldRecommend && <div className="invalid-feedback">{errors.wouldRecommend}</div>}
            </div>
            
            {/* Additional Comments */}
            <div className="form-group">
              <label htmlFor="comments" className="form-label">Additional Comments</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="form-control"
                rows="5"
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;