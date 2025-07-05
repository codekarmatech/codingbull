import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn } from '../animations/variants';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import apiService from '../services/api';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${props => props.theme.colors.darkGrey};
`;

// Page content
const PageContent = styled.div`
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section with diagonal split design
const ContactHero = styled.section`
  position: relative;
  padding: 8rem 2rem 12rem;
  background: ${props => props.theme.colors.darkGrey};
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15rem;
    background: ${props => props.theme.colors.mediumGrey};
    transform: skewY(-5deg);
    transform-origin: bottom left;
    z-index: 1;
  }
`;

// Hero content
const HeroContent = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Hero title with animated underline
const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['6xl']};
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 0;
    height: 4px;
    background: ${props => props.theme.colors.electricBlue};
    animation: underline 1.5s ease forwards 0.5s;
  }
  
  @keyframes underline {
    to { width: 100%; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['5xl']};
  }
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
  text-align: center;
`;

// Contact section
const ContactSection = styled.section`
  position: relative;
  padding: 8rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  z-index: 2;
`;

// Contact content
const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

// Contact info
const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Contact info title
const ContactInfoTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.electricBlue};
  }
`;

// Contact info description
const ContactInfoDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 2rem;
`;

// Contact methods
const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Contact method
const ContactMethod = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
    background: rgba(0, 0, 0, 0.3);
  }
`;

// Contact method icon
const ContactMethodIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.deepPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

// Contact method content
const ContactMethodContent = styled.div`
  flex: 1;
`;

// Contact method title
const ContactMethodTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.textPrimary};
`;

// Contact method text
const ContactMethodText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

// Contact form container
const ContactFormContainer = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 3rem;
  box-shadow: ${props => props.theme.shadows.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem;
  }
`;

// Contact form title
const ContactFormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
`;

// Contact form
const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Form group
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Form label
const FormLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
`;

// Form input
const FormInput = styled.input`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.electricBlue};
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

// Form textarea
const FormTextarea = styled.textarea`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.md};
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.electricBlue};
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

// Form select
const FormSelect = styled.select`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.electricBlue};
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
  }
  
  option {
    background: ${props => props.theme.colors.darkGrey};
  }
`;

// Submit button
const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.electricBlue};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.colors.deepPurple};
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

// Form error message
const FormError = styled.div`
  color: #ff6b6b;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: 0.5rem;
`;

// Form success message
const FormSuccess = styled(motion.div)`
  background: rgba(46, 213, 115, 0.2);
  border: 1px solid rgba(46, 213, 115, 0.5);
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1.5rem;
  color: #2ed573;
  text-align: center;
`;

// Character counter
const CharacterCounter = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  margin-top: 0.25rem;
  
  &.warning {
    color: #ffa500;
  }
  
  &.danger {
    color: #ff6b6b;
  }
`;

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: '',
    inquiry_type: 'general'
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Handle input change with real-time validation and sanitization
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Real-time input sanitization based on field type
    switch (name) {
      case 'name':
        // Only allow letters, spaces, hyphens, apostrophes, and periods
        sanitizedValue = value.replace(/[^a-zA-Z\s\-'.]/g, '');
        // Limit to 50 characters
        sanitizedValue = sanitizedValue.slice(0, 50);
        break;
        
      case 'phone':
        // Only allow digits, limit to 10 characters
        sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
        
      case 'email':
        // Remove dangerous characters but allow valid email characters
        sanitizedValue = value.replace(/[<>'"&{}]/g, '');
        // Limit to 100 characters
        sanitizedValue = sanitizedValue.slice(0, 100);
        break;
        
      case 'subject':
        // Allow letters, numbers, spaces, and basic punctuation
        sanitizedValue = value.replace(/[^a-zA-Z0-9\s\-_.,!?()]/g, '');
        // Limit to 100 characters
        sanitizedValue = sanitizedValue.slice(0, 100);
        break;
        
      case 'message':
        // Remove dangerous characters but allow more variety for messages
        sanitizedValue = value.replace(/[<>'"&{}]/g, '');
        // Limit to 1000 characters
        sanitizedValue = sanitizedValue.slice(0, 1000);
        break;
        
      default:
        // For service dropdown and other fields, remove dangerous characters
        sanitizedValue = value.replace(/[<>'"&{}]/g, '');
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Enterprise-level validation with security measures
  const validateForm = () => {
    const newErrors = {};
    
    // Security: Check for potential injection patterns across all fields
    const checkForInjection = (value, fieldName) => {
      const injectionPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
        /javascript:/gi, // JavaScript protocol
        /on\w+\s*=/gi, // Event handlers
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, // SQL keywords
        /[<>'"&]/g, // Basic XSS characters
        /\{\{.*\}\}/g, // Template injection
        /\$\{.*\}/g, // Expression injection
      ];
      
      for (const pattern of injectionPatterns) {
        if (pattern.test(value)) {
          return `${fieldName} contains invalid characters or patterns`;
        }
      }
      return null;
    };

    // Name validation - Only letters, spaces, hyphens, apostrophes
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else {
      const nameValue = formData.name.trim();
      
      // Check for injection patterns
      const injectionError = checkForInjection(nameValue, 'Name');
      if (injectionError) {
        newErrors.name = injectionError;
      } else if (!/^[a-zA-Z\s\-'.]+$/.test(nameValue)) {
        newErrors.name = 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
      } else if (nameValue.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      } else if (nameValue.length > 50) {
        newErrors.name = 'Name cannot exceed 50 characters';
      } else if (/^\s|\s$/.test(nameValue)) {
        newErrors.name = 'Name cannot start or end with spaces';
      } else if (/\s{2,}/.test(nameValue)) {
        newErrors.name = 'Name cannot contain consecutive spaces';
      }
    }
    
    // Email validation - Enhanced security
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailValue = formData.email.trim().toLowerCase();
      
      // Check for injection patterns
      const injectionError = checkForInjection(emailValue, 'Email');
      if (injectionError) {
        newErrors.email = injectionError;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (emailValue.length > 100) {
        newErrors.email = 'Email address cannot exceed 100 characters';
      } else if (emailValue.includes('..')) {
        newErrors.email = 'Email address cannot contain consecutive dots';
      } else if (emailValue.startsWith('.') || emailValue.endsWith('.')) {
        newErrors.email = 'Email address cannot start or end with a dot';
      }
    }
    
    // Phone validation - Only digits, max 10 digits
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneValue = formData.phone.trim();
      
      // Check for injection patterns
      const injectionError = checkForInjection(phoneValue, 'Phone');
      if (injectionError) {
        newErrors.phone = injectionError;
      } else if (!/^\d{10}$/.test(phoneValue)) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      } else if (phoneValue.startsWith('0')) {
        newErrors.phone = 'Phone number cannot start with 0';
      }
    }
    
    // Subject validation - No special characters except basic punctuation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else {
      const subjectValue = formData.subject.trim();
      
      // Check for injection patterns
      const injectionError = checkForInjection(subjectValue, 'Subject');
      if (injectionError) {
        newErrors.subject = injectionError;
      } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(subjectValue)) {
        newErrors.subject = 'Subject can only contain letters, numbers, spaces, and basic punctuation (.,!?-_())';
      } else if (subjectValue.length < 5) {
        newErrors.subject = 'Subject must be at least 5 characters long';
      } else if (subjectValue.length > 100) {
        newErrors.subject = 'Subject cannot exceed 100 characters';
      } else if (/^\s|\s$/.test(subjectValue)) {
        newErrors.subject = 'Subject cannot start or end with spaces';
      } else if (/\s{2,}/.test(subjectValue)) {
        newErrors.subject = 'Subject cannot contain consecutive spaces';
      }
    }
    
    // Message validation - Allow more characters but still secure
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else {
      const messageValue = formData.message.trim();
      
      // Check for injection patterns
      const injectionError = checkForInjection(messageValue, 'Message');
      if (injectionError) {
        newErrors.message = injectionError;
      } else if (!/^[a-zA-Z0-9\s\-_.,!?()@#$%&*+=[\]{}|\\:";'<>/~`^]+$/.test(messageValue)) {
        newErrors.message = 'Message contains invalid characters';
      } else if (messageValue.length < 10) {
        newErrors.message = 'Message must be at least 10 characters long';
      } else if (messageValue.length > 1000) {
        newErrors.message = 'Message cannot exceed 1000 characters';
      } else if (/^\s|\s$/.test(messageValue)) {
        newErrors.message = 'Message cannot start or end with spaces';
      }
    }
    
    // Service validation (optional field)
    if (formData.service && formData.service.trim()) {
      const serviceValue = formData.service.trim();
      const injectionError = checkForInjection(serviceValue, 'Service');
      if (injectionError) {
        newErrors.service = injectionError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission with additional security measures
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Final sanitization before submission
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        inquiry_type: 'general'
      };
      
      // Only include service if it's selected
      if (formData.service && formData.service.trim()) {
        sanitizedData.service = formData.service.trim();
      }
      
      // Submit form data to API
      await apiService.contact.submitInquiry(sanitizedData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service: '',
        message: '',
        inquiry_type: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // More specific error handling
      if (error.message.includes('400')) {
        setSubmitError('Please check your input and try again.');
      } else if (error.message.includes('429')) {
        setSubmitError('Too many requests. Please wait a moment and try again.');
      } else if (error.message.includes('500')) {
        setSubmitError('Server error. Please try again later.');
      } else {
        setSubmitError('Failed to submit your message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with CodingBull for your web and mobile development needs. We're here to help you build your next digital solution."
        canonical="/contact"
      />
      <PageContainer
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        id="contact"
      >
        <PageContent>
          {/* Hero Section */}
          <ContactHero>
            <HeroContent>
              <HeroTitle
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                Contact Us
              </HeroTitle>
              <HeroDescription
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Have a project in mind? Let's discuss how we can help you achieve your business goals with our custom web and mobile development solutions.
              </HeroDescription>
            </HeroContent>
          </ContactHero>
          
          {/* Contact Section */}
          <ContactSection>
            <ContactContent>
              <ContactInfo>
                <div>
                  <ContactInfoTitle>Get in Touch</ContactInfoTitle>
                  <ContactInfoDescription>
                    We're here to answer any questions you may have about our services. Reach out to us and we'll respond as soon as we can.
                  </ContactInfoDescription>
                </div>
                
                <ContactMethods>
                  <ContactMethod
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ContactMethodIcon>📧</ContactMethodIcon>
                    <ContactMethodContent>
                      <ContactMethodTitle>Email Us</ContactMethodTitle>
                      <ContactMethodText>contact@codingbull.com</ContactMethodText>
                      <ContactMethodText>Our team responds to all inquiries within 24 hours</ContactMethodText>
                    </ContactMethodContent>
                  </ContactMethod>
                  
                  <ContactMethod
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <ContactMethodIcon>📱</ContactMethodIcon>
                    <ContactMethodContent>
                      <ContactMethodTitle>Call Us</ContactMethodTitle>
                      <ContactMethodText>+91 7575053969</ContactMethodText>
                      <ContactMethodText>Available Monday to Friday, 10am to 7pm IST</ContactMethodText>
                    </ContactMethodContent>
                  </ContactMethod>
                  
                  <ContactMethod
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <ContactMethodIcon>🌐</ContactMethodIcon>
                    <ContactMethodContent>
                      <ContactMethodTitle>Connect</ContactMethodTitle>
                      <ContactMethodText>Follow us on social media for updates and insights</ContactMethodText>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <motion.a 
                          href="#" 
                          whileHover={{ scale: 1.1 }} 
                          style={{ color: '#E0E0E0', fontSize: '1.5rem' }}
                        >
                          FB
                        </motion.a>
                        <motion.a 
                          href="#" 
                          whileHover={{ scale: 1.1 }} 
                          style={{ color: '#E0E0E0', fontSize: '1.5rem' }}
                        >
                          TW
                        </motion.a>
                        <motion.a 
                          href="#" 
                          whileHover={{ scale: 1.1 }} 
                          style={{ color: '#E0E0E0', fontSize: '1.5rem' }}
                        >
                          IN
                        </motion.a>
                      </div>
                    </ContactMethodContent>
                  </ContactMethod>
                </ContactMethods>
              </ContactInfo>
              
              <ContactFormContainer
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ContactFormTitle>Send Us a Message</ContactFormTitle>
                
                {submitSuccess && (
                  <FormSuccess
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Your message has been sent successfully! We'll get back to you soon.
                  </FormSuccess>
                )}
                
                {submitError && (
                  <FormError>{submitError}</FormError>
                )}
                
                <ContactForm 
                  onSubmit={handleSubmit}
                  noValidate
                  autoComplete="on"
                >
                  <FormGroup>
                    <FormLabel htmlFor="name">Full Name *</FormLabel>
                    <FormInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength="50"
                      autoComplete="name"
                      spellCheck="true"
                      required
                    />
                    {errors.name && <FormError>{errors.name}</FormError>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="email">Email Address *</FormLabel>
                    <FormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength="100"
                      autoComplete="email"
                      spellCheck="false"
                      required
                    />
                    {errors.email && <FormError>{errors.email}</FormError>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="phone">Phone Number *</FormLabel>
                    <FormInput
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter 10-digit phone number (e.g., 9876543210)"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      minLength="10"
                      pattern="[0-9]{10}"
                      autoComplete="tel"
                      inputMode="numeric"
                      required
                    />
                    {errors.phone && <FormError>{errors.phone}</FormError>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="subject">Subject *</FormLabel>
                    <FormInput
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Enter the subject of your message"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength="100"
                      minLength="5"
                      spellCheck="true"
                      required
                    />
                    {errors.subject && <FormError>{errors.subject}</FormError>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="service">Service You're Interested In</FormLabel>
                    <FormSelect
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="">Select a service</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="E-commerce Solutions">E-commerce Solutions</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Other">Other</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="message">Message *</FormLabel>
                    <FormTextarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project or inquiry"
                      value={formData.message}
                      onChange={handleChange}
                      maxLength="1000"
                      minLength="10"
                      rows="6"
                      spellCheck="true"
                      required
                    />
                    <CharacterCounter 
                      className={
                        formData.message.length > 900 ? 'danger' : 
                        formData.message.length > 800 ? 'warning' : ''
                      }
                    >
                      {formData.message.length}/1000 characters
                    </CharacterCounter>
                    {errors.message && <FormError>{errors.message}</FormError>}
                  </FormGroup>
                  
                  <SubmitButton
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </SubmitButton>
                </ContactForm>
              </ContactFormContainer>
            </ContactContent>
          </ContactSection>
          
          <Footer />
        </PageContent>
      </PageContainer>
    </>
  );
};

export default ContactPage;