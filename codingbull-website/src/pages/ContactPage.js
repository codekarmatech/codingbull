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
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Phone validation - Enterprise level: No parentheses, max 10 digits after +91
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.replace(/[\s-]/g, ''); // Only remove spaces and hyphens

      // Check for parentheses (not allowed)
      if (/[()]/.test(cleanPhone)) {
        newErrors.phone = 'Parentheses are not allowed in phone numbers';
      } else if (cleanPhone.startsWith('+91')) {
        // Indian numbers: +91 followed by exactly 10 digits
        if (!/^\+91[1-9]\d{9}$/.test(cleanPhone)) {
          newErrors.phone = 'Indian phone number must be +91 followed by exactly 10 digits';
        }
      } else if (cleanPhone.startsWith('+')) {
        // International numbers: + followed by 7-15 digits
        if (!/^\+[1-9]\d{6,14}$/.test(cleanPhone)) {
          newErrors.phone = 'International phone number must be + followed by 7-15 digits';
        }
      } else {
        // Domestic numbers: 7-15 digits, no leading zero
        if (!/^[1-9]\d{6,14}$/.test(cleanPhone)) {
          newErrors.phone = 'Phone number must be 7-15 digits without leading zero';
        }
      }
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Submit form data to API
      await apiService.contact.submitInquiry(formData);
      
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
      setSubmitError('Failed to submit your message. Please try again later.');
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
                
                <ContactForm onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel htmlFor="name">Full Name *</FormLabel>
                    <FormInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
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
                    />
                    {errors.email && <FormError>{errors.email}</FormError>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="phone">Phone Number *</FormLabel>
                    <FormInput
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number (e.g., +917575053969 or 7575053969)"
                      value={formData.phone}
                      onChange={handleChange}
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
                    />
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