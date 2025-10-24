// src/components/feedback/FeedbackForm.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
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
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [formProgress, setFormProgress] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredRating, setHoveredRating] = useState({ name: null, value: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('feedbackFormTheme');
    if (savedTheme === 'light') {
      setIsDarkTheme(false);
      document.body.classList.remove('dark-theme');
    } else {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
    
    if (showThankYou) {
      setShowThankYou(false);
      setSubmitClicked(false);
      setSubmissionComplete(false);
      setSubmissionId(null);
    }
  }, []);

  // Calculate form progress with more sophisticated logic
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Count required fields based on feedback type
    if (formData.feedbackType === 'anonymous') {
      totalFields = 6; // event, ratings (4), recommendation
    } else if (formData.feedbackType === 'individual') {
      totalFields = 9; // name, email, contact, event, ratings (4), recommendation
    } else {
      totalFields = 9; // group name, email, contact, event, ratings (4), recommendation
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
    
    // Add comments as bonus progress
    if (formData.comments.trim()) {
      filledFields += 0.5;
    }
    
    setFormProgress(Math.min(100, Math.round((filledFields / totalFields) * 100)));
  }, [formData]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('feedbackFormTheme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const handleInputChange = useCallback((e) => {
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
  }, [errors]);

  const handleInputFocus = useCallback((name) => {
    setFocusedField(name);
  }, []);

  const handleInputBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleToggleChange = useCallback((name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  }, []);

  const handleRatingChange = useCallback((name, rating) => {
    setFormData(prev => ({
      ...prev,
      [name]: rating
    }));
  }, []);

  const handleRatingHover = useCallback((name, value) => {
    setHoveredRating({ name, value });
  }, []);

  const handleRatingLeave = useCallback(() => {
    setHoveredRating({ name: null, value: 0 });
  }, []);

  const handleRecommendationChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      wouldRecommend: value
    }));
  }, []);

  const validateForm = useCallback(() => {
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
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault();
    
    // Only proceed if the submit button was actually clicked
    if (!submitClicked) return;
    
    console.log('Submit button clicked');
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitClicked(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const uniqueId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSubmissionId(uniqueId);
      
      let dataToSubmit = {
        ...formData,
        id: uniqueId,
        submissionKey: uniqueId,
        submissionDate: new Date().toISOString(),
        submissionTimestamp: Date.now()
      };
      
      if (dataToSubmit.event === '9') {
        dataToSubmit.event = dataToSubmit.otherEvent;
      }
      delete dataToSubmit.otherEvent;
      
      dataToSubmit.food = dataToSubmit.foodRating;
      dataToSubmit.ambience = dataToSubmit.ambienceRating;
      dataToSubmit.service = dataToSubmit.serviceRating;
      dataToSubmit.overall = dataToSubmit.overallRating;
      
      dataToSubmit.recommend = dataToSubmit.wouldRecommend ? 'Yes' : 'No';
      
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
      
      window.dispatchEvent(new Event('feedbackUpdated'));
      
      setShowThankYou(true);
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ form: 'An error occurred while submitting your feedback. Please try again.' });
      setSubmitClicked(false);
      setSubmissionComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [submitClicked, validateForm, formData]);

  const handleResetForm = useCallback(() => {
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
  }, []);

  // Enhanced star rating component with hover effects
  const renderStars = useCallback((name, rating) => {
    const labelName = name === 'foodRating' ? 'Food' : 
                     name === 'ambienceRating' ? 'Ambience' : 
                     name === 'serviceRating' ? 'Service' : 
                     'Overall Experience';
    
    const isHovered = hoveredRating.name === name;
    const displayRating = isHovered ? hoveredRating.value : rating;
    
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
                className={`rating-star ${star <= displayRating ? 'active' : ''}`}
                onClick={() => handleRatingChange(name, star)}
                onMouseEnter={() => handleRatingHover(name, star)}
                onMouseLeave={handleRatingLeave}
              >
                <span className="star-icon">⭐</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }, [handleRatingChange, handleRatingHover, handleRatingLeave, hoveredRating]);

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
          
          {/* Removed onSubmit from form element to prevent automatic submission */}
          <div ref={formRef} className="feedback-form">
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
                  <label htmlFor="feedbackTypeAnonymous" className="radio-label">
                    <input
                      type="radio"
                      id="feedbackTypeAnonymous"
                      name="feedbackType"
                      value="anonymous"
                      checked={formData.feedbackType === 'anonymous'}
                      onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'anonymous' }))}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">Anonymous</span>
                  </label>
                  <label htmlFor="feedbackTypeIndividual" className="radio-label">
                    <input
                      type="radio"
                      id="feedbackTypeIndividual"
                      name="feedbackType"
                      value="individual"
                      checked={formData.feedbackType === 'individual'}
                      onChange={() => setFormData(prev => ({ ...prev, feedbackType: 'individual' }))}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">Individual</span>
                  </label>
                  <label htmlFor="feedbackTypeGroup" className="radio-label">
                    <input
                      type="radio"
                      id="feedbackTypeGroup"
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
                    <div className={`input-wrapper ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('name')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('email')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Your email"
                        autoComplete="email"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact" className="form-label">Contact</label>
                    <div className={`input-wrapper ${focusedField === 'contact' ? 'focused' : ''} ${errors.contact ? 'error' : ''}`}>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('contact')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                        placeholder="Your contact number"
                        autoComplete="tel"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.39 21 20.73 21C17.4 20.74 14.23 19.69 11.47 17.98C8.91 16.41 6.78 14.28 5.21 11.72C3.5 8.96 2.45 5.79 2.19 2.46C2.14 1.8 2.6 1.2 3.2 1.2H6.2C6.7 1.2 7.13 1.6 7.2 2.09C7.45 3.79 7.95 5.44 8.7 6.97C8.87 7.34 8.78 7.79 8.47 8.09L7.02 9.54C8.56 12.36 10.84 14.64 13.66 16.18L15.11 14.73C15.41 14.43 15.86 14.34 16.23 14.51C17.76 15.26 19.41 15.76 21.11 16.01C21.6 16.08 22 16.51 22 17.01V16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                  </div>
                </div>
              )}
              
              {/* Group Information */}
              {formData.feedbackType === 'group' && (
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="groupName" className="form-label">Group Name</label>
                    <div className={`input-wrapper ${focusedField === 'groupName' ? 'focused' : ''} ${errors.groupName ? 'error' : ''}`}>
                      <input
                        type="text"
                        id="groupName"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('groupName')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.groupName ? 'is-invalid' : ''}`}
                        placeholder="Group name"
                        autoComplete="organization"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.groupName && <div className="invalid-feedback">{errors.groupName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="groupEmail" className="form-label">Group Email</label>
                    <div className={`input-wrapper ${focusedField === 'groupEmail' ? 'focused' : ''} ${errors.groupEmail ? 'error' : ''}`}>
                      <input
                        type="email"
                        id="groupEmail"
                        name="groupEmail"
                        value={formData.groupEmail}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('groupEmail')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.groupEmail ? 'is-invalid' : ''}`}
                        placeholder="Group email"
                        autoComplete="email"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.groupEmail && <div className="invalid-feedback">{errors.groupEmail}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="groupContact" className="form-label">Group Contact</label>
                    <div className={`input-wrapper ${focusedField === 'groupContact' ? 'focused' : ''} ${errors.groupContact ? 'error' : ''}`}>
                      <input
                        type="tel"
                        id="groupContact"
                        name="groupContact"
                        value={formData.groupContact}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('groupContact')}
                        onBlur={handleInputBlur}
                        className={`form-control ${errors.groupContact ? 'is-invalid' : ''}`}
                        placeholder="Group contact number"
                        autoComplete="tel"
                      />
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.39 21 20.73 21C17.4 20.74 14.23 19.69 11.47 17.98C8.91 16.41 6.78 14.28 5.21 11.72C3.5 8.96 2.45 5.79 2.19 2.46C2.14 1.8 2.6 1.2 3.2 1.2H6.2C6.7 1.2 7.13 1.6 7.2 2.09C7.45 3.79 7.95 5.44 8.7 6.97C8.87 7.34 8.78 7.79 8.47 8.09L7.02 9.54C8.56 12.36 10.84 14.64 13.66 16.18L15.11 14.73C15.41 14.43 15.86 14.34 16.23 14.51C17.76 15.26 19.41 15.76 21.11 16.01C21.6 16.08 22 16.51 22 17.01V16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.groupContact && <div className="invalid-feedback">{errors.groupContact}</div>}
                  </div>
                </div>
              )}
              
              {/* Anonymous Information - No fields needed */}
              {formData.feedbackType === 'anonymous' && (
                <div className="form-fields">
                  <div className="form-group">
                    <div className="anonymous-notice">
                      <div className="notice-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="notice-content">
                        <h4>Your feedback will be submitted anonymously</h4>
                        <p>No personal information will be collected. Your privacy is important to us.</p>
                      </div>
                    </div>
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
              
              <div className="form-group">
                <label htmlFor="event" className="form-label">Event</label>
                <div className={`input-wrapper ${focusedField === 'event' ? 'focused' : ''} ${errors.event ? 'error' : ''}`}>
                  <select
                    id="event"
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('event')}
                    onBlur={handleInputBlur}
                    className={`form-control ${errors.event ? 'is-invalid' : ''}`}
                    autoComplete="off"
                  >
                    <option value="">Select an event</option>
                    <option value="1">Corporate Meeting</option>
                    <option value="2">Wedding Reception</option>
                    <option value="3">Birthday Party</option>
                    <option value="4">Conference</option>
                    <option value="5">Workshop</option>
                    <option value="6">Seminar</option>
                    <option value="7">Product Launch</option>
                    <option value="8">Team Building</option>
                    <option value="9">Other</option>
                  </select>
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {errors.event && <div className="invalid-feedback">{errors.event}</div>}
              </div>
              
              {formData.event === '9' && (
                <div className="form-group">
                  <label htmlFor="otherEvent" className="form-label">Please specify the event type</label>
                  <div className={`input-wrapper ${focusedField === 'otherEvent' ? 'focused' : ''} ${errors.otherEvent ? 'error' : ''}`}>
                    <input
                      type="text"
                      id="otherEvent"
                      name="otherEvent"
                      value={formData.otherEvent}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('otherEvent')}
                      onBlur={handleInputBlur}
                      className={`form-control ${errors.otherEvent ? 'is-invalid' : ''}`}
                      placeholder="Enter event type"
                      autoComplete="off"
                    />
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {errors.otherEvent && <div className="invalid-feedback">{errors.otherEvent}</div>}
                </div>
              )}
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
                    id="recommendYes"
                    className={`recommendation-btn ${formData.wouldRecommend === true ? 'active yes' : ''}`}
                    onClick={() => handleRecommendationChange(true)}
                    aria-pressed={formData.wouldRecommend === true}
                    aria-label="Yes, I would recommend"
                  >
                    <div className="recommendation-icon">
                      <span className={`emoji happy ${isDarkTheme ? 'dark-theme' : ''}`}>😊</span>
                    </div>
                    <span>YES</span>
                  </button>
                  <button
                    type="button"
                    id="recommendNo"
                    className={`recommendation-btn ${formData.wouldRecommend === false ? 'active no' : ''}`}
                    onClick={() => handleRecommendationChange(false)}
                    aria-pressed={formData.wouldRecommend === false}
                    aria-label="No, I would not recommend"
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
                <label htmlFor="comments" className="form-label">Comments</label>
                <div className={`textarea-wrapper ${focusedField === 'comments' ? 'focused' : ''}`}>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('comments')}
                    onBlur={handleInputBlur}
                    className="form-control"
                    rows="5"
                    placeholder="Tell us about your experience..."
                    autoComplete="off"
                  ></textarea>
                  <div className="textarea-counter">
                    {formData.comments.length} characters
                  </div>
                </div>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  onClick={() => {
                    setSubmitClicked(true);
                    handleSubmit();
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Feedback
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;