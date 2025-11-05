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
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formProgress, setFormProgress] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredRating, setHoveredRating] = useState({ name: null, value: 0 });
  const [animateIn, setAnimateIn] = useState(false);
  
  // Welcome page state
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  // Transition effects state
  const [transitionDirection, setTransitionDirection] = useState('forward');
  const [isSectionTransitioning, setIsSectionTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showParticles, setShowParticles] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // Features for the welcome page
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Rate Your Experience",
      description: "Share your thoughts on food, ambience, service, and overall experience"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21 17.3 16.3 22 10.5 22C9.1 22 7.8 21.7 6.6 21.2L2 22L3.4 17.8C2.5 16.5 2 14.9 2 13.2C2 7.4 6.7 2.7 12.5 2.7C18.3 2.7 23 7.4 23 13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Share Your Feedback",
      description: "Provide detailed comments about your experience to help us improve"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Make a Difference",
      description: "Your feedback directly contributes to enhancing our services and experiences"
    }
  ];

  // Background icons for the entire app
  const backgroundIcons = [
    { icon: 'star', top: '10%', left: '5%', size: '30px', delay: '0s' },
    { icon: 'heart', top: '20%', right: '8%', size: '25px', delay: '0.5s' },
    { icon: 'message', top: '70%', left: '7%', size: '28px', delay: '1s' },
    { icon: 'thumbs-up', top: '80%', right: '10%', size: '32px', delay: '1.5s' },
    { icon: 'chart', top: '40%', left: '3%', size: '26px', delay: '2s' },
    { icon: 'users', top: '60%', right: '5%', size: '30px', delay: '2.5s' },
    { icon: 'settings', top: '15%', left: '15%', size: '24px', delay: '3s' },
    { icon: 'check', top: '85%', left: '20%', size: '28px', delay: '3.5s' },
    { icon: 'calendar', top: '30%', right: '15%', size: '26px', delay: '4s' },
    { icon: 'bell', top: '50%', left: '10%', size: '22px', delay: '4.5s' },
  ];

  // Generate particles for transition effects
  const generateParticles = useCallback(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        duration: Math.random() * 2 + 1
      });
    }
    setParticles(newParticles);
  }, []);

  // Welcome page effect
  useEffect(() => {
    if (showWelcome) {
      const timer1 = setTimeout(() => setWelcomeStep(1), 500);
      const timer2 = setTimeout(() => setWelcomeStep(2), 1500);
      const timer3 = setTimeout(() => setWelcomeStep(3), 2500);
      const timer4 = setTimeout(() => setWelcomeStep(4), 3500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [showWelcome]);

  // Rotate through features on welcome page
  useEffect(() => {
    if (showWelcome && welcomeStep >= 4) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [showWelcome, welcomeStep, features.length]);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('feedbackFormTheme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    } else {
      setIsDarkTheme(false);
      document.body.classList.remove('dark-theme');
    }
    
    if (showThankYou) {
      setShowThankYou(false);
      setSubmitClicked(false);
      setSubmissionComplete(false);
      setSubmissionId(null);
    }
    
    // Trigger animation after component mounts
    setTimeout(() => setAnimateIn(true), 100);
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
    
    // Add particle effect when rating is selected
    generateParticles();
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  }, [generateParticles]);

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
    
    // Add particle effect when recommendation is selected
    generateParticles();
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  }, [generateParticles]);

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
    
    // Generate particles for submission effect
    generateParticles();
    setShowParticles(true);
    
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
      
      // Hide particles after submission
      setTimeout(() => setShowParticles(false), 1000);
      
      setShowThankYou(true);
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ form: 'An error occurred while submitting your feedback. Please try again.' });
      setSubmitClicked(false);
      setSubmissionComplete(false);
      setShowParticles(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [submitClicked, validateForm, formData, generateParticles]);

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

  // Handle welcome page transition to form
  const handleGetStarted = useCallback(() => {
    setIsTransitioning(true);
    generateParticles();
    setShowParticles(true);
    
    setTimeout(() => {
      setShowWelcome(false);
      setIsTransitioning(false);
      setTimeout(() => setShowParticles(false), 500);
    }, 800);
  }, [generateParticles]);

  // Handle section navigation with transition
  const handleSectionChange = useCallback((section) => {
    if (section === activeSection || isSectionTransitioning) return;
    
    // Determine transition direction
    const sections = ['personal', 'event', 'ratings', 'comments'];
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(section);
    setTransitionDirection(newIndex > currentIndex ? 'forward' : 'backward');
    
    setIsSectionTransitioning(true);
    
    // Generate particles for transition
    generateParticles();
    setShowParticles(true);
    
    setTimeout(() => {
      setActiveSection(section);
      setIsSectionTransitioning(false);
      setTimeout(() => setShowParticles(false), 500);
    }, 300);
  }, [activeSection, isSectionTransitioning, generateParticles]);

  // Enhanced star rating component with gold color
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
          <div className="rating-stars" role="group" aria-label={`Rate ${labelName}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`${name}-${star}`}
                type="button"
                className={`rating-star ${star <= displayRating ? 'active' : ''}`}
                onClick={() => handleRatingChange(name, star)}
                onMouseEnter={() => handleRatingHover(name, star)}
                onMouseLeave={handleRatingLeave}
                aria-label={`Rate ${labelName} ${star} out of 5 stars`}
                aria-pressed={star <= rating}
              >
                <svg 
                  className="star-icon" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                    fill={star <= displayRating ? "#FFD700" : "#E0E0E0"} /* Updated to gold color */
                    stroke={star <= displayRating ? "#FFA500" : "#BDBDBD"} /* Updated to gold border */
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }, [handleRatingChange, handleRatingHover, handleRatingLeave, hoveredRating]);

  // Render background icon
  const renderBackgroundIcon = (iconType) => {
    switch(iconType) {
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61C20.3292 4.04974 19.7228 3.5889 19.0554 3.25454C18.3879 2.92018 17.6725 2.71871 16.94 2.6603C16.2075 2.6019 15.4714 2.68756 14.7774 2.91243C14.0834 3.1373 13.4471 3.49633 12.9 3.96999C12.3529 3.49633 11.7166 3.1373 11.0226 2.91243C10.3286 2.68756 9.59246 2.6019 8.85996 2.6603C8.12746 2.71871 7.41207 2.92018 6.74464 3.25454C6.07722 3.5889 5.47077 4.04974 4.96 4.61C3.82469 5.82531 3.4053 7.46487 3.80996 9.01999C4.21462 10.5751 5.40633 11.8109 6.93996 12.27L12 21L17.06 12.27C18.5936 11.8109 19.7853 10.5751 20.19 9.01999C20.5946 7.46487 20.1752 5.82531 19.04 4.61H20.84Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'message':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21 17.3 16.3 22 10.5 22C9.1 22 7.8 21.7 6.6 21.2L2 22L3.4 17.8C2.5 16.5 2 14.9 2 13.2C2 7.4 6.7 2.7 12.5 2.7C18.3 2.7 23 7.4 23 13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'thumbs-up':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 9V5C14 3.9 13.1 3 12 3H11.5C10.7 3 10 3.4 9.7 4L7 9H5C3.9 9 3 9.9 3 11V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V13C21 11.9 20.1 11 19 11H17L14.3 6.7C14 6.4 13.3 6 12.5 6H12V9H14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'chart':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'users':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'settings':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.22 4.22L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.24 16.24L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.22 19.78L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.24 7.76L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'check':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C22 16.9706 17.9706 21 13 21C8.02944 21 4 16.9706 4 12C4 7.02944 8.02944 3 13 3C17.9706 3 22 7.02944 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'calendar':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'bell':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 2C3 2 1 4 1 6C1 8 2 10 6 10V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 11H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11V16C10 16.5523 10.4477 17.0523 10.8944 17.4472C11.3411 17.8421 11.8957 18 12.5 18C13.1043 18 13.6589 17.8421 14.1056 17.4472C14.5523 17.0523 15 16.5523 15 16V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
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

  // Welcome page
  if (showWelcome) {
    return (
      <div className={`feedback-app ${isDarkTheme ? 'dark-theme' : ''}`}>
        {/* Bubbly Background for Welcome Page */}
        <div className="bubbly-bg">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>

        <div className={`welcome-container ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="welcome-content">
            <div className={`welcome-logo ${welcomeStep >= 1 ? 'show' : ''}`}>
              <div className="logo-circle">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h1 className={`welcome-title ${welcomeStep >= 2 ? 'show' : ''}`}>Feedback Portal</h1>
            
            <p className={`welcome-subtitle ${welcomeStep >= 3 ? 'show' : ''}`}>
              We value your opinion and would love to hear about your experience. Your feedback helps us improve our services.
            </p>
            
            <div className={`welcome-features ${welcomeStep >= 4 ? 'show' : ''}`}>
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`feature-card ${currentFeature === index ? 'active' : ''}`}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="feature-indicators">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${currentFeature === index ? 'active' : ''}`}
                  onClick={() => setCurrentFeature(index)}
                  aria-label={`View feature ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className={`welcome-button ${welcomeStep >= 4 ? 'show' : ''}`}
              onClick={handleGetStarted}
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="welcome-decoration">
            <div className="decoration-circle decoration-1"></div>
            <div className="decoration-circle decoration-2"></div>
            <div className="decoration-circle decoration-3"></div>
            <div className="decoration-circle decoration-4"></div>
            <div className="decoration-circle decoration-5"></div>
          </div>
          
          {/* Particle Effect Container */}
          {showParticles && (
            <div className="particles-container">
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDuration: `${particle.duration}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`feedback-app ${isDarkTheme ? 'dark-theme' : ''}`}>
      {/* Bubbly Background for Form */}
      <div className="bubbly-bg">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      
      {/* Background Icons - Now visible throughout the app */}
      <div className="background-icons">
        {backgroundIcons.map((icon, index) => (
          <div
            key={index}
            className="background-icon"
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              width: icon.size,
              height: icon.size,
              animationDelay: icon.delay
            }}
          >
            {renderBackgroundIcon(icon.icon)}
          </div>
        ))}
      </div>
      
      <Header />
      
      <div className={`feedback-form-container ${isDarkTheme ? 'dark-theme' : ''} ${animateIn ? 'animate-in' : ''}`}>
        <div className="feedback-form-wrapper">
          <div className="feedback-form-header">
            <div className="header-content">
              <div className="header-title">
                <h1>Feedback Form</h1>
                <p className="form-subtitle">We value your feedback and strive to improve our services</p>
              </div>
              
              {/* Theme Toggle */}
              <button 
                className={`theme-toggle ${isDarkTheme ? 'dark' : 'light'}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <div className="toggle-track"></div>
                <div className="toggle-thumb"></div>
                <div className="toggle-icons">
                  <div className="sun-icon-static"></div>
                  <div className="moon-icon-static"></div>
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
          
          <div ref={formRef} className="feedback-form">
            {/* Form Navigation */}
            <div className="form-navigation">
              <button 
                type="button" 
                className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`}
                onClick={() => handleSectionChange('personal')}
                aria-label="Personal Information"
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
                onClick={() => handleSectionChange('event')}
                aria-label="Event Details"
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
                onClick={() => handleSectionChange('ratings')}
                aria-label="Ratings"
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
                onClick={() => handleSectionChange('comments')}
                aria-label="Comments"
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
            <div className={`form-section ${activeSection === 'personal' ? 'active' : ''} ${isSectionTransitioning ? 'transitioning' : ''} ${transitionDirection}`}>
              <div className="section-header">
                <h2>Personal Information</h2>
                <p>Tell us about yourself</p>
              </div>
              
              {/* Feedback Type - Three single radio buttons */}
              <div className="form-group">
                <h3 className="form-label">Feedback Type</h3>
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
            <div className={`form-section ${activeSection === 'event' ? 'active' : ''} ${isSectionTransitioning ? 'transitioning' : ''} ${transitionDirection}`}>
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
            <div className={`form-section ${activeSection === 'ratings' ? 'active' : ''} ${isSectionTransitioning ? 'transitioning' : ''} ${transitionDirection}`}>
              <div className="section-header">
                <h2>Your Ratings</h2>
                <p>Rate your experience with us</p>
              </div>
              
              <div className="rating-items-container">
                {renderStars('foodRating', formData.foodRating)}
                {errors.foodRating && <div className="invalid-feedback rating-error">{errors.foodRating}</div>}
                
                {renderStars('ambienceRating', formData.ambienceRating)}
                {errors.ambienceRating && <div className="invalid-feedback rating-error">{errors.ambienceRating}</div>}
                
                {renderStars('serviceRating', formData.serviceRating)}
                {errors.serviceRating && <div className="invalid-feedback rating-error">{errors.serviceRating}</div>}
                
                {renderStars('overallRating', formData.overallRating)}
                {errors.overallRating && <div className="invalid-feedback rating-error">{errors.overallRating}</div>}
              </div>
              
              {/* Recommendation with Theme-Aware Emojis */}
              <div className="form-group">
                <fieldset>
                  <legend className="form-label">Would you recommend us?</legend>
                  <div className="recommendation-options">
                    <button
                      type="button"
                      id="recommendYes"
                      className={`recommendation-btn ${formData.wouldRecommend === true ? 'active yes' : ''}`}
                      onClick={() => handleRecommendationChange(true)}
                      aria-pressed={formData.wouldRecommend === true}
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
                    >
                      <div className="recommendation-icon">
                        <span className={`emoji sad ${isDarkTheme ? 'dark-theme' : ''}`}>😞</span>
                      </div>
                      <span>NO</span>
                    </button>
                  </div>
                </fieldset>
                {errors.wouldRecommend && <div className="invalid-feedback">{errors.wouldRecommend}</div>}
              </div>
            </div>
            
            {/* Comments Section */}
            <div className={`form-section ${activeSection === 'comments' ? 'active' : ''} ${isSectionTransitioning ? 'transitioning' : ''} ${transitionDirection}`}>
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
                    if (activeSection === 'event') handleSectionChange('personal');
                    else if (activeSection === 'ratings') handleSectionChange('event');
                    else if (activeSection === 'comments') handleSectionChange('ratings');
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
                    if (activeSection === 'personal') handleSectionChange('event');
                    else if (activeSection === 'event') handleSectionChange('ratings');
                    else if (activeSection === 'ratings') handleSectionChange('comments');
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
      
      {/* Particle Effect Container */}
      {showParticles && (
        <div className="particles-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;