// src/components/feedback/FeedbackForm.jsx
import React, { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const events = [
    { id: '1', name: 'Wedding Reception', icon: '💒' },
    { id: '2', name: 'Corporate Conference', icon: '👔' },
    { id: '3', name: 'Graduation Ceremony', icon: '🎓' },
    { id: '4', name: 'Birthday Party', icon: '🎂' },
    { id: '5', name: 'Anniversary Celebration', icon: '💑' },
    { id: '6', name: 'Business Meeting', icon: '💼' },
    { id: '7', name: 'Product Launch', icon: '🚀' },
    { id: '8', name: 'Charity Gala', icon: '🎗️' },
    { id: '9', name: 'Other', icon: '📝' }
  ];

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
    setCurrentStep(1);
  };

  const renderStars = (name, rating) => {
    return (
      <div className="rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`rating-star ${star <= rating ? 'active' : ''}`}
            onClick={() => handleRatingChange(name, star)}
          >
            <span className="star-icon">★</span>
          </button>
        ))}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
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
    <div className="feedback-form-container">
      <div className="container">
        <div className="feedback-form-wrapper">
          <div className="feedback-form-header">
            <h1>We Value Your Feedback</h1>
            <p>Your input helps us improve our events and services</p>
            
            {/* Progress indicator */}
            <div className="progress-indicator">
              <div className="progress-step">
                <div className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                <div className="step-label">Information</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                <div className="step-label">Event Details</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className={`step-number ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                <div className="step-label">Ratings</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className={`step-number ${currentStep >= 4 ? 'active' : ''}`}>4</div>
                <div className="step-label">Complete</div>
              </div>
            </div>
          </div>
          
          {errors.form && (
            <div className="alert alert-danger">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Step 1: User Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Your Information</h2>
                  <p>Let us know who you are</p>
                </div>
                
                {/* Anonymous Toggle */}
                <div className="form-group">
                  <div className="toggle-container">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={() => handleToggleChange('isAnonymous')}
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-text">Submit Feedback Anonymously</span>
                    </label>
                  </div>
                </div>
                
                {/* Feedback Type Toggle */}
                {!formData.isAnonymous && (
                  <div className="form-group">
                    <label className="form-label">Feedback Type</label>
                    <div className="toggle-buttons">
                      <button
                        type="button"
                        className={`toggle-btn ${formData.feedbackType === 'individual' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, feedbackType: 'individual' }))}
                      >
                        <span className="icon">👤</span>
                        <span>Individual</span>
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${formData.feedbackType === 'group' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, feedbackType: 'group' }))}
                      >
                        <span className="icon">👥</span>
                        <span>Group</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Individual Information */}
                {!formData.isAnonymous && formData.feedbackType === 'individual' && (
                  <div className="form-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="John Doe"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="john@example.com"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contact" className="form-label">Contact Number</label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                    </div>
                  </div>
                )}
                
                {/* Group Information */}
                {!formData.isAnonymous && formData.feedbackType === 'group' && (
                  <div className="form-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="groupName" className="form-label">Group Name</label>
                        <input
                          type="text"
                          id="groupName"
                          name="groupName"
                          value={formData.groupName}
                          onChange={handleInputChange}
                          className={`form-control ${errors.groupName ? 'is-invalid' : ''}`}
                          placeholder="ABC Corporation"
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
                          placeholder="contact@abc.com"
                        />
                        {errors.groupEmail && <div className="invalid-feedback">{errors.groupEmail}</div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="groupContact" className="form-label">Group Contact Number</label>
                      <input
                        type="tel"
                        id="groupContact"
                        name="groupContact"
                        value={formData.groupContact}
                        onChange={handleInputChange}
                        className={`form-control ${errors.groupContact ? 'is-invalid' : ''}`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.groupContact && <div className="invalid-feedback">{errors.groupContact}</div>}
                    </div>
                  </div>
                )}
                
                <div className="form-navigation">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Event Information */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Event Details</h2>
                  <p>Tell us about the event you attended</p>
                </div>
                
                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="event" className="form-label">Select Event</label>
                    <div className="event-options">
                      {events.map(event => (
                        <div
                          key={event.id}
                          className={`event-option ${formData.event === event.id ? 'selected' : ''}`}
                          onClick={() => handleInputChange({ target: { name: 'event', value: event.id } })}
                        >
                          <span className="event-icon">{event.icon}</span>
                          <span className="event-name">{event.name}</span>
                        </div>
                      ))}
                    </div>
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
                </div>
                
                <div className="form-navigation">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Ratings */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Rate Your Experience</h2>
                  <p>Your feedback helps us improve</p>
                </div>
                
                <div className="form-section">
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Food</label>
                      <span className="rating-value">{formData.foodRating > 0 ? `${formData.foodRating}/5` : ''}</span>
                    </div>
                    {renderStars('foodRating', formData.foodRating)}
                    {errors.foodRating && <div className="invalid-feedback">{errors.foodRating}</div>}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Ambience</label>
                      <span className="rating-value">{formData.ambienceRating > 0 ? `${formData.ambienceRating}/5` : ''}</span>
                    </div>
                    {renderStars('ambienceRating', formData.ambienceRating)}
                    {errors.ambienceRating && <div className="invalid-feedback">{errors.ambienceRating}</div>}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Service</label>
                      <span className="rating-value">{formData.serviceRating > 0 ? `${formData.serviceRating}/5` : ''}</span>
                    </div>
                    {renderStars('serviceRating', formData.serviceRating)}
                    {errors.serviceRating && <div className="invalid-feedback">{errors.serviceRating}</div>}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Overall Experience</label>
                      <span className="rating-value">{formData.overallRating > 0 ? `${formData.overallRating}/5` : ''}</span>
                    </div>
                    {renderStars('overallRating', formData.overallRating)}
                    {errors.overallRating && <div className="invalid-feedback">{errors.overallRating}</div>}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Staff Professionalism</label>
                      <span className="rating-value">{formData.staffProfessionalismRating > 0 ? `${formData.staffProfessionalismRating}/5` : ''}</span>
                    </div>
                    {renderStars('staffProfessionalismRating', formData.staffProfessionalismRating)}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Facilities</label>
                      <span className="rating-value">{formData.facilitiesRating > 0 ? `${formData.facilitiesRating}/5` : ''}</span>
                    </div>
                    {renderStars('facilitiesRating', formData.facilitiesRating)}
                  </div>
                  
                  <div className="rating-group">
                    <div className="rating-header">
                      <label className="rating-label">Value for Money</label>
                      <span className="rating-value">{formData.valueForMoneyRating > 0 ? `${formData.valueForMoneyRating}/5` : ''}</span>
                    </div>
                    {renderStars('valueForMoneyRating', formData.valueForMoneyRating)}
                  </div>
                </div>
                
                <div className="form-navigation">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Recommendation and Comments */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Final Thoughts</h2>
                  <p>Would you recommend us and any additional feedback</p>
                </div>
                
                {/* Recommendation */}
                <div className="form-section">
                  <div className="form-group">
                    <label className="form-label">Would you recommend us?</label>
                    <div className="recommendation-options">
                      <button
                        type="button"
                        className={`recommendation-btn ${formData.wouldRecommend === true ? 'active yes' : ''}`}
                        onClick={() => handleRecommendationChange(true)}
                      >
                        <span className="emoji">😊</span>
                        <span>Yes</span>
                      </button>
                      <button
                        type="button"
                        className={`recommendation-btn ${formData.wouldRecommend === false ? 'active no' : ''}`}
                        onClick={() => handleRecommendationChange(false)}
                      >
                        <span className="emoji">😞</span>
                        <span>No</span>
                      </button>
                    </div>
                    {errors.wouldRecommend && <div className="invalid-feedback">{errors.wouldRecommend}</div>}
                  </div>
                </div>
                
                {/* Additional Comments */}
                <div className="form-section">
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
                </div>
                
                <div className="form-navigation">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;