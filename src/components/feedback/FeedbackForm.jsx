// src/components/feedback/FeedbackForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import EventDropdown from './EventDropdown';
import ThankYou from './ThankYou';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
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
    wouldRecommend: null,
    comments: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark theme
  const [activeSection, setActiveSection] = useState('personal');
  const [formProgress, setFormProgress] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // Load theme preference from localStorage specifically for the form
  useEffect(() => {
    const savedTheme = localStorage.getItem('feedbackFormTheme');
    if (savedTheme === 'light') {
      setIsDarkTheme(false);
      document.body.classList.remove('dark-theme');
    } else {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
    
    // Reset all form states on component mount
    setShowThankYou(false);
    setSubmitClicked(false);
    setSubmissionComplete(false);
    setSubmissionId(null);
    console.log('Component mounted, showThankYou reset to false');
  }, []);

  // Track state changes for debugging
  useEffect(() => {
    console.log('showThankYou changed to:', showThankYou);
  }, [showThankYou]);

  useEffect(() => {
    console.log('submissionComplete changed to:', submissionComplete);
  }, [submissionComplete]);

  // Calculate form progress
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Count required fields
    if (formData.feedbackType === 'anonymous') {
      totalFields = 5; // event, ratings, recommendation
    } else if (formData.feedbackType === 'individual') {
      totalFields = 8; // name, email, contact, event, ratings, recommendation
    } else {
      totalFields = 8; // group name, email, contact, event, ratings, recommendation
    }
    
    // Count filled fields
    if (formData.event) filledFields++;
    if (formData.foodRating > 0) filledFields++;
    if (formData.ambienceRating > 0) filledFields++;
    if (formData.serviceRating > 0) filledFields++;
    if (formData.overallRating > 0) filledFields++;
    if (formData.wouldRecommend !== null) filledFields++;
    
    if (formData.feedbackType === 'individual') {
      if (formData.name) filledFields++;
      if (formData.email) filledFields++;
      if (formData.contact) filledFields++;
    } else if (formData.feedbackType === 'group') {
      if (formData.groupName) filledFields++;
      if (formData.groupEmail) filledFields++;
      if (formData.groupContact) filledFields++;
    }
    
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Toggle theme only for the form
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('feedbackFormTheme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    } else if (formData.feedbackType === 'group') {
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
    console.log('Submit button clicked');
    
    // Only proceed if submit was actually clicked
    if (!submitClicked) {
      console.log('Submit was not clicked, aborting');
      return;
    }
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Reset submitClicked if there are validation errors
      setSubmitClicked(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for this submission
      const uniqueId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSubmissionId(uniqueId);
      
      // Prepare data for submission - matching the format from the first form
      let dataToSubmit = {
        ...formData,
        id: uniqueId,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Handle event type
      if (dataToSubmit.event === '9') {
        dataToSubmit.event = dataToSubmit.otherEvent;
      }
      delete dataToSubmit.otherEvent;
      
      // Map rating fields to match the first form's format
      dataToSubmit.food = dataToSubmit.foodRating;
      dataToSubmit.ambience = dataToSubmit.ambienceRating;
      dataToSubmit.service = dataToSubmit.serviceRating;
      dataToSubmit.overall = dataToSubmit.overallRating;
      
      // Map recommendation field
      dataToSubmit.recommend = dataToSubmit.wouldRecommend ? 'Yes' : 'No';
      
      // Map feedback type
      if (dataToSubmit.feedbackType === 'individual') {
        dataToSubmit.submissionType = 'INDIVIDUAL';
        dataToSubmit.individualName = dataToSubmit.name;
        dataToSubmit.individualEmail = dataToSubmit.email;
        dataToSubmit.individualContact = dataToSubmit.contact;
      } else if (dataToSubmit.feedbackType === 'group') {
        dataToSubmit.submissionType = 'GROUP / ORGANIZATION / ASSOCIATION';
      } else {
        dataToSubmit.submissionType = 'ANONYMOUS';
      }
      
      // Clean up the data
      delete dataToSubmit.foodRating;
      delete dataToSubmit.ambienceRating;
      delete dataToSubmit.serviceRating;
      delete dataToSubmit.overallRating;
      delete dataToSubmit.wouldRecommend;
      delete dataToSubmit.feedbackType;
      delete dataToSubmit.name;
      delete dataToSubmit.email;
      delete dataToSubmit.contact;
      
      const existingFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      existingFeedbacks.push(dataToSubmit);
      localStorage.setItem('feedbacks', JSON.stringify(existingFeedbacks));
      
      console.log('Feedback submitted:', dataToSubmit);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('feedbackUpdated'));
      
      // Set states for thank you page
      setShowThankYou(true);
      setSubmissionComplete(true);
      console.log('Setting showThankYou to true, submission complete');
      
      // Navigate to thank you page after a short delay to ensure state is set
      setTimeout(() => {
        navigate('/thank-you', { state: { from: location.pathname } });
      }, 100);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ form: 'An error occurred while submitting your feedback. Please try again.' });
      // Reset submitClicked if there's an error
      setSubmitClicked(false);
      setSubmissionComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    console.log('Resetting form');
    setFormData({
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
      wouldRecommend: null,
      comments: ''
    });
    setErrors({});
    setShowThankYou(false);
    setSubmitClicked(false);
    setSubmissionComplete(false);
    setSubmissionId(null);
    setActiveSection('personal');
    console.log('Form reset complete, showThankYou set to false');
  };

  // Modern star rating component with gold stars
  const renderStars = (name, rating) => {
    const labelName = name === 'foodRating' ? 'Food' : 
                     name === 'ambienceRating' ? 'Ambience' : 
                     name === 'serviceRating' ? 'Service' : 
                     'Overall Experience';
    
    return (
      <div className="rating-item">
        <div className="rating-label">{labelName}</div>
        <div className="rating-container">
          <div className="rating-value">
            <span className="rating-text">{rating > 0 ? `${rating}/5` : 'Not rated'}</span>
          </div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`${name}-${star}`}
                type="button"
                className={`rating-star ${star <= rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(name, star)}
              >
                <span className="star-icon">⭐</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Only show thank you message if submission is complete
  if (showThankYou === true && submissionComplete === true) {
    return (
      <div className={`feedback-app ${isDarkTheme ? 'dark-theme' : ''}`}>
        <Header />
        <ThankYou onReset={handleResetForm} />
      </div>
    );
  }

  return (
    <div className={`feedback-app ${isDarkTheme ? 'dark-theme' : ''}`}>
      <Header />
      
      <div className={`feedback-form-container ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="feedback-form-wrapper">
          <div className="feedback-form-header">
            <div className="header-content">
              <div className="header-title">
                <h1>Feedback Form</h1>
                <p className="form-subtitle">We value your feedback and strive to improve our services</p>
              </div>
              
              <button 
                className={`theme-toggle ${isDarkTheme ? 'dark' : 'light'}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <div className="toggle-track"></div>
                <div className="toggle-thumb">
                  <div className="sun-icon"></div>
                  <div className="moon-icon"></div>
                </div>
                <div className="toggle-icons">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="sun-icon-static">
                    <path fillRule="evenodd" d="M8 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 1zM8 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 13zM3.75 7.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM10.75 7.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM3.28 4.22a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06-1.06L3.28 4.22zM12.72 4.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM4.22 12.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM12.72 12.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="moon-icon-static">
                    <path d="M9.598 1.591a.75.75 0 01.785.175 7 7 0 11-8.967 8.967.75.75 0 01.96-.96 5.5 5.5 0 007.222-7.222z" />
                  </svg>
                </div>
              </button>
            </div>
            
            <div className="form-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
              </div>
              <span className="progress-text">{formProgress}% Complete</span>
            </div>
          </div>
          
          {errors.form && (
            <div className="alert alert-danger">
              {errors.form}
            </div>
          )}
          
          <form ref={formRef} onSubmit={handleSubmit} className="feedback-form">
            {/* Form Navigation */}
            <div className="form-navigation">
              <button 
                type="button" 
                className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveSection('personal')}
              >
                <div className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Personal Info</span>
              </button>
              
              <button 
                type="button" 
                className={`nav-item ${activeSection === 'event' ? 'active' : ''}`}
                onClick={() => setActiveSection('event')}
              >
                <div className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>Event Details</span>
              </button>
              
              <button 
                type="button" 
                className={`nav-item ${activeSection === 'ratings' ? 'active' : ''}`}
                onClick={() => setActiveSection('ratings')}
              >
                <div className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Ratings</span>
              </button>
              
              <button 
                type="button" 
                className={`nav-item ${activeSection === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveSection('comments')}
              >
                <div className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21 17.3 16.3 22 10.5 22C9.1 22 7.8 21.7 6.6 21.2L2 22L3.4 17.8C2.5 16.5 2 14.9 2 13.2C2 7.4 6.7 2.7 12.5 2.7C18.3 2.7 23 7.4 23 13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Comments</span>
              </button>
            </div>
            
            {/* Personal Information Section */}
            <div className={`form-section ${activeSection === 'personal' ? 'active' : ''}`}>
              <div className="section-header">
                <h2>Personal Information</h2>
                <p>Tell us about yourself</p>
              </div>
              
              {/* Feedback Type - Three single radio buttons */}
              <div className="form-group">
                <label className="form-label">Feedback Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="feedbackType"
                      value="anonymous"
                      checked={formData.feedbackType === 'anonymous'}
                      onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'anonymous' }))}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">Anonymous</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="feedbackType"
                      value="individual"
                      checked={formData.feedbackType === 'individual'}
                      onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'individual' }))}
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
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">Group/Organization</span>
                  </label>
                </div>
              </div>
              
              {/* Individual Information */}
              {formData.feedbackType === 'individual' && (
                <div className="form-fields">
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
              {formData.feedbackType === 'group' && (
                <div className="form-fields">
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
              
              {/* Anonymous Information - No fields needed */}
              {formData.feedbackType === 'anonymous' && (
                <div className="form-fields">
                  <div className="form-group">
                    <p className="anonymous-note">Your feedback will be submitted anonymously. No personal information will be collected.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Event Information Section */}
            <div className={`form-section ${activeSection === 'event' ? 'active' : ''}`}>
              <div className="section-header">
                <h2>Event Details</h2>
                <p>Tell us about the event you attended</p>
              </div>
              
              <EventDropdown
                value={formData.event}
                onChange={handleInputChange}
                error={errors.event}
                otherEventValue={formData.otherEvent}
                onOtherEventChange={handleInputChange}
                otherEventError={errors.otherEvent}
                isDarkTheme={isDarkTheme}
              />
            </div>
            
            {/* Ratings Section */}
            <div className={`form-section ${activeSection === 'ratings' ? 'active' : ''}`}>
              <div className="section-header">
                <h2>Your Ratings</h2>
                <p>Rate your experience with us</p>
              </div>
              
              <div className="rating-items-container">
                {renderStars('foodRating', formData.foodRating)}
                {errors.foodRating && <div className="invalid-feedback">{errors.foodRating}</div>}
                
                {renderStars('ambienceRating', formData.ambienceRating)}
                {errors.ambienceRating && <div className="invalid-feedback">{errors.ambienceRating}</div>}
                
                {renderStars('serviceRating', formData.serviceRating)}
                {errors.serviceRating && <div className="invalid-feedback">{errors.serviceRating}</div>}
                
                {renderStars('overallRating', formData.overallRating)}
                {errors.overallRating && <div className="invalid-feedback">{errors.overallRating}</div>}
              </div>
              
              {/* Recommendation with Theme-Aware Emojis */}
              <div className="form-group">
                <label className="form-label">Would you recommend us?</label>
                <div className="recommendation-options">
                  <button
                    type="button"
                    className={`recommendation-btn ${formData.wouldRecommend === true ? 'active yes' : ''}`}
                    onClick={() => handleRecommendationChange(true)}
                  >
                    <div className="recommendation-icon">
                      <span className={`emoji happy ${isDarkTheme ? 'dark-theme' : ''}`}>😊</span>
                    </div>
                    <span>YES</span>
                  </button>
                  <button
                    type="button"
                    className={`recommendation-btn ${formData.wouldRecommend === false ? 'active no' : ''}`}
                    onClick={() => handleRecommendationChange(false)}
                  >
                    <div className="recommendation-icon">
                      <span className={`emoji sad ${isDarkTheme ? 'dark-theme' : ''}`}>😞</span>
                    </div>
                    <span>NO</span>
                  </button>
                </div>
                {errors.wouldRecommend && <div className="invalid-feedback">{errors.wouldRecommend}</div>}
              </div>
            </div>
            
            {/* Comments Section */}
            <div className={`form-section ${activeSection === 'comments' ? 'active' : ''}`}>
              <div className="section-header">
                <h2>Additional Comments</h2>
                <p>Share any additional thoughts or suggestions</p>
              </div>
              
              <div className="form-group">
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
            </div>
            
            {/* Form Navigation Buttons */}
            <div className="form-navigation-buttons">
              {activeSection !== 'personal' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (activeSection === 'event') setActiveSection('personal');
                    else if (activeSection === 'ratings') setActiveSection('event');
                    else if (activeSection === 'comments') setActiveSection('ratings');
                  }}
                >
                  Previous
                </button>
              )}
              
              {activeSection !== 'comments' ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (activeSection === 'personal') setActiveSection('event');
                    else if (activeSection === 'event') setActiveSection('ratings');
                    else if (activeSection === 'ratings') setActiveSection('comments');
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  onClick={() => setSubmitClicked(true)} // Set submitClicked when button is clicked
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;