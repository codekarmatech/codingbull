import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn, slideUp } from '../animations/variants';
import bullLogo from '../assets/bull-logo.svg';

// Footer container
const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.darkGrey};
  padding: 5rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(0,191,255,0.5) 50%, 
      rgba(255,255,255,0) 100%);
  }
`;

// Footer content wrapper
const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Footer top section
const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Footer column
const FooterColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

// Footer logo
const FooterLogo = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: 700;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Footer description
const FooterDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  max-width: 300px;
`;

// Social links
const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

// Social link
const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.mediumGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    transform: translateY(-3px);
  }
`;

// Footer heading
const FooterHeading = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${props => props.theme.colors.electricBlue};
  }
`;

// Footer links
const FooterLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Footer link
const FooterLink = styled(motion.create(Link))`
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.theme.colors.electricBlue};
    transform: translateX(5px);
  }
  
  &::before {
    content: '→';
    margin-right: 0.5rem;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

// Contact info
const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Contact item
const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  
  .icon {
    color: ${props => props.theme.colors.electricBlue};
    font-size: 1.25rem;
    margin-top: 0.25rem;
  }
`;

// Newsletter form
const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

// Input group
const InputGroup = styled.div`
  display: flex;
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    background: ${props => props.theme.colors.mediumGrey};
    color: ${props => props.theme.colors.textPrimary};
    border-radius: ${props => props.theme.borderRadius.md} 0 0 ${props => props.theme.borderRadius.md};
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${props => props.theme.colors.electricBlue};
    }
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background: ${props => props.theme.colors.electricBlue};
    color: ${props => props.theme.colors.textPrimary};
    border: none;
    border-radius: 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${props => props.theme.colors.deepPurple};
    }
  }
`;

// Footer bottom
const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

// Copyright text
const Copyright = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

// Footer bottom links
const FooterBottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSizes.sm};
    transition: all 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.electricBlue};
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterColumn
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FooterLogo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={bullLogo} alt="CodingBull Logo" style={{ height: '40px' }} />
                <h2>CodingBull</h2>
              </div>
            </FooterLogo>
            <FooterDescription>
              Since incorporation in 2025, CodingBull Technovations Pvt Ltd has grown into a collaborative network of seasoned developers and designers led by Pranshu Dixit.
            </FooterDescription>
            <SocialLinks>
              <SocialLink 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>FB</span>
              </SocialLink>
              <SocialLink 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>TW</span>
              </SocialLink>
              <SocialLink 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>IN</span>
              </SocialLink>
              <SocialLink 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>GH</span>
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinks>
              <li>
                <FooterLink to="/" whileHover={{ x: 5 }}>Home</FooterLink>
              </li>
              <li>
                <FooterLink to="/services" whileHover={{ x: 5 }}>Services</FooterLink>
              </li>
              <li>
                <FooterLink to="#tech-stack" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tech-stack').scrollIntoView({ behavior: 'smooth' });
                }} whileHover={{ x: 5 }}>Technology</FooterLink>
              </li>
              <li>
                <FooterLink to="#our-projects" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('our-projects').scrollIntoView({ behavior: 'smooth' });
                }} whileHover={{ x: 5 }}>Our Projects</FooterLink>
              </li>
              <li>
                <FooterLink to="/about" whileHover={{ x: 5 }}>About</FooterLink>
              </li>
              <li>
                <FooterLink to="#contact" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact') && document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }} whileHover={{ x: 5 }}>Contact</FooterLink>
              </li>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <FooterHeading>Contact Us</FooterHeading>
            <ContactInfo>
              <ContactItem>
                <span className="icon">📍</span>
                <span>Registered in India</span>
              </ContactItem>
              <ContactItem>
                <span className="icon">✉️</span>
                <span>contact@codingbull.com</span>
              </ContactItem>
              <ContactItem>
                <span className="icon">⏰</span>
                <span>Our team responds to all inquiries within 24 hours</span>
              </ContactItem>
              <ContactItem>
                <span className="icon">🌐</span>
                <span>MCA Registration: 2025</span>
              </ContactItem>
            </ContactInfo>
          </FooterColumn>
          
          <FooterColumn
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <FooterHeading>Newsletter</FooterHeading>
            <p style={{ color: '#E0E0E0', marginBottom: '1rem' }}>
              Subscribe to our newsletter for the latest updates, insights, and offers.
            </p>
            <NewsletterForm>
              <InputGroup>
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </InputGroup>
            </NewsletterForm>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>
            © 2025-{new Date().getFullYear()} CodingBull Technovations Pvt Ltd | CIN: XXXX | GSTIN: YYYY | Remote-enabled team | Serving clients worldwide
          </Copyright>
          <FooterBottomLinks>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookie-policy">Cookie Policy</a>
          </FooterBottomLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;