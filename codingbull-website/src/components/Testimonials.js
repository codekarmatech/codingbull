import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer } from '../animations/variants';
import apiService from '../services/api';

// Testimonials section container
const TestimonialsContainer = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(0,191,255,0.5) 50%, 
      rgba(255,255,255,0) 100%);
  }
`;

// Content wrapper
const TestimonialsContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Section header
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

// Section title
const SectionTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${props => props.theme.colors.electricBlue};
  }
`;

// Section description
const SectionDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
`;

// Testimonial showcase
const TestimonialShowcase = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
`;

// Testimonial item
const TestimonialItem = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  box-shadow: ${props => props.theme.shadows.lg};
  text-align: center;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 30px;
    font-size: 6rem;
    color: ${props => props.theme.colors.electricBlue};
    opacity: 0.3;
    font-family: Georgia, serif;
    line-height: 1;
  }
  
  &::after {
    content: '"';
    position: absolute;
    bottom: 0;
    right: 30px;
    font-size: 6rem;
    color: ${props => props.theme.colors.electricBlue};
    opacity: 0.3;
    font-family: Georgia, serif;
    line-height: 0.5;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2.5rem 2rem;
  }
`;

// Testimonial quote
const TestimonialQuote = styled.blockquote`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textPrimary};
  line-height: 1.6;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  font-style: italic;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

// Testimonial author
const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

// Author image
const AuthorImage = styled.div`
  width: 100px;
  height: 80px;
  overflow: hidden;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Author name
const AuthorName = styled.h4`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: 0.25rem;
`;

// Author title
const AuthorTitle = styled.p`
  color: ${props => props.theme.colors.electricBlue};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

// Author company
const AuthorCompany = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

// Navigation controls
const TestimonialNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

// Nav button
const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.mediumGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    transform: translateY(-3px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: ${props => props.theme.colors.mediumGrey};
      transform: none;
    }
  }
`;

// Nav dots
const NavDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

// We're using $active prop instead of shouldForwardProp

// Nav dot
const NavDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? props.theme.colors.electricBlue 
    : props.theme.colors.lightGrey};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active 
      ? props.theme.colors.electricBlue 
      : props.theme.colors.deepPurple};
  }
`;

// Testimonial grid for desktop view
const TestimonialGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

// Testimonial card for grid view
const TestimonialCard = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 3rem;
    color: ${props => props.theme.colors.electricBlue};
    opacity: 0.3;
    font-family: Georgia, serif;
    line-height: 1;
  }
`;

// Card quote
const CardQuote = styled.blockquote`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  position: relative;
  z-index: 1;
  padding-left: 1rem;
  font-style: italic;
`;

// Card author
const CardAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
`;

// Card author image
const CardAuthorImage = styled.div`
  width: 70px;
  height: 50px;
  overflow: hidden;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Card author info
const CardAuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

// Card author name
const CardAuthorName = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: 0.25rem;
`;

// Card author title
const CardAuthorTitle = styled.p`
  color: ${props => props.theme.colors.electricBlue};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
`;

// Card author company
const CardAuthorCompany = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xs};
`;

// View toggle
const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

// Toggle button
const ToggleButton = styled.button`
  background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.mediumGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.deepPurple};
  }
`;

const Testimonials = () => {
  // State for current testimonial
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState('slider'); // 'slider' or 'grid'
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create a loading state UI indicator component
  const LoadingState = () => (
    <div className="testimonials-loading">
      {loading && <div className="loading-spinner">Loading testimonials...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
  
  // Mock testimonials data for fallback - defined before useEffect to avoid dependency issues
  const mockTestimonials = [
    {
      id: 1,
      quote: "Hiring CodingBull was a game-changer for our business. The team delivered our e-commerce platform in just 4 weeks, leading to a 30% surge in online orders.",
      author: "Deep Varma",
      title: "Managing Director",
      company: "Gujju-Masla",
      image: "/logos/gujju-masla.png"
    },
    {
      id: 2,
      quote: "The enterprise physiotherapy system built by CodingBull transformed our workflow. Their React/Django solution is robust, user-friendly, and fully compliant.",
      author: "Dr. Rajavi Dixit",
      title: "Founder & CEO",
      company: "Physioway",
      image: "/logos/physioway.png"
    },
    {
      id: 3,
      quote: "Our custom attendance management dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours every month.",
      author: "Harsh Patel",
      title: "CEO",
      company: "Harsh Patel Enterprises",
      image: "/logos/harsh-patel.png"
    }
  ];
  
  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.testimonials.getTestimonials();
        if (response && response.results && response.results.length > 0) {
          setTestimonials(response.results);
        } else {
          // Fallback to mock data
          setTestimonials(mockTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
        // Fallback to mock data
        setTestimonials(mockTestimonials);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  // Get current testimonial
  const currentTestimonial = testimonials[currentIndex];
  
  // Handle navigation
  const handlePrev = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);
  
  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);
  
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  
  // Auto-rotate testimonials
  useEffect(() => {
    if (view === 'slider') {
      const interval = setInterval(() => {
        handleNext();
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [currentIndex, view, handleNext]);
  
  return (
    <TestimonialsContainer id="testimonials">
      <TestimonialsContent>
        <SectionHeader>
          <SectionTitle
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Clients Say
          </SectionTitle>
          <SectionDescription
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hear from our clients about working with the CodingBull team:
          </SectionDescription>
        </SectionHeader>
        
        <ViewToggle>
          <ToggleButton 
            $active={view === 'slider'} 
            onClick={() => setView('slider')}
          >
            Showcase View
          </ToggleButton>
          <ToggleButton 
            $active={view === 'grid'} 
            onClick={() => setView('grid')}
          >
            Grid View
          </ToggleButton>
        </ViewToggle>
        
        {view === 'slider' && (
          <TestimonialShowcase>
            <AnimatePresence mode="wait">
              <TestimonialItem
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <TestimonialQuote>
                  {currentTestimonial.quote}
                </TestimonialQuote>
                <TestimonialAuthor>
                  <AuthorImage>
                    <img src={currentTestimonial.image} alt={`${currentTestimonial.company} logo`} />
                  </AuthorImage>
                  <AuthorName>{currentTestimonial.author}</AuthorName>
                  <AuthorTitle>{currentTestimonial.title}</AuthorTitle>
                  <AuthorCompany>{currentTestimonial.company}</AuthorCompany>
                </TestimonialAuthor>
              </TestimonialItem>
            </AnimatePresence>
            
            <TestimonialNav>
              <NavButton 
                onClick={handlePrev}
                disabled={testimonials.length <= 1}
              >
                ←
              </NavButton>
              <NavButton 
                onClick={handleNext}
                disabled={testimonials.length <= 1}
              >
                →
              </NavButton>
            </TestimonialNav>
            
            <NavDots>
              {testimonials.map((_, index) => (
                <NavDot 
                  key={index}
                  $active={index === currentIndex}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </NavDots>
          </TestimonialShowcase>
        )}
        
        {view === 'grid' && (
          <TestimonialGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.1}
              >
                <CardQuote>
                  {testimonial.quote}
                </CardQuote>
                <CardAuthor>
                  <CardAuthorImage>
                    <img src={testimonial.image} alt={`${testimonial.company} logo`} />
                  </CardAuthorImage>
                  <CardAuthorInfo>
                    <CardAuthorName>{testimonial.author}</CardAuthorName>
                    <CardAuthorTitle>{testimonial.title}</CardAuthorTitle>
                    <CardAuthorCompany>{testimonial.company}</CardAuthorCompany>
                  </CardAuthorInfo>
                </CardAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        )}
      </TestimonialsContent>
    </TestimonialsContainer>
  );
};

export default Testimonials;