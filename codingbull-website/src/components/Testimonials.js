import React, { useState, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer } from '../animations/variants';
import apiService from '../services/api';
import PropTypes from 'prop-types';
import ImageWithFallback from './ImageWithFallback';

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


// Mock testimonials data for fallback (without hardcoded image paths)
const mockTestimonials = [
  {
    id: 1,
    quote: "Hiring CodingBull was a game-changer for our business. The team delivered our e-commerce platform in just 4 weeks, leading to a 30% surge in online orders.",
    author: "Deep Varma",
    title: "Managing Director",
    company: "Gujju-Masla",
    image: null // Will use fallback image component
  },
  {
    id: 2,
    quote: "The enterprise physiotherapy system built by CodingBull transformed our workflow. Their React/Django solution is robust, user-friendly, and fully compliant.",
    author: "Dr. Rajavi Dixit",
    title: "Founder & CEO",
    company: "Physioway",
    image: null // Will use fallback image component
  },
  {
    id: 3,
    quote: "Our custom attendance management dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours every month.",
    author: "Harsh Patel",
    title: "CEO",
    company: "Harsh Patel Enterprises",
    image: null // Will use fallback image component
  }
];

// Loading state component
const LoadingState = memo(({ isLoading, error }) => (
  <div className="testimonials-loading" data-testid="testimonials-loading">
    {isLoading && <div className="loading-spinner">Loading testimonials...</div>}
    {error && <div className="error-message" role="alert">{error}</div>}
  </div>
));

LoadingState.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

// Single testimonial item component for slider view
const TestimonialSliderItem = memo(({ testimonial }) => (
  <TestimonialItem
    key={testimonial.id}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
  >
    <TestimonialQuote>
      {testimonial.quote}
    </TestimonialQuote>
    <TestimonialAuthor>
      <AuthorImage>
        <ImageWithFallback 
          src={testimonial.image} 
          alt={`${testimonial.company} logo`}
          fallbackText={testimonial.company}
          showFallbackText={true}
          iconSize="24px"
        />
      </AuthorImage>
      <AuthorName>{testimonial.author}</AuthorName>
      <AuthorTitle>{testimonial.title}</AuthorTitle>
      <AuthorCompany>{testimonial.company}</AuthorCompany>
    </TestimonialAuthor>
  </TestimonialItem>
));

TestimonialSliderItem.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    quote: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    image: PropTypes.string
  }).isRequired
};

// Navigation controls component
const TestimonialNavigation = memo(({ 
  currentIndex, 
  testimonials, 
  handlePrev, 
  handleNext, 
  handleDotClick 
}) => (
  <>
    <TestimonialNav>
      <NavButton 
        onClick={handlePrev}
        disabled={testimonials.length <= 1}
        aria-label="Previous testimonial"
      >
        ←
      </NavButton>
      <NavButton 
        onClick={handleNext}
        disabled={testimonials.length <= 1}
        aria-label="Next testimonial"
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
          aria-label={`Go to testimonial ${index + 1}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
        />
      ))}
    </NavDots>
  </>
));

TestimonialNavigation.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  testimonials: PropTypes.array.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleDotClick: PropTypes.func.isRequired
};

// Grid item component
const TestimonialGridItem = memo(({ testimonial, index }) => (
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
        <ImageWithFallback 
          src={testimonial.image} 
          alt={`${testimonial.company} logo`}
          fallbackText={testimonial.company}
          showFallbackText={true}
          iconSize="20px"
        />
      </CardAuthorImage>
      <CardAuthorInfo>
        <CardAuthorName>{testimonial.author}</CardAuthorName>
        <CardAuthorTitle>{testimonial.title}</CardAuthorTitle>
        <CardAuthorCompany>{testimonial.company}</CardAuthorCompany>
      </CardAuthorInfo>
    </CardAuthor>
  </TestimonialCard>
));

TestimonialGridItem.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    quote: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    image: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

// View toggle component
const ViewToggleComponent = memo(({ view, setView }) => (
  <ViewToggle>
    <ToggleButton 
      $active={view === 'slider'} 
      onClick={() => setView('slider')}
      aria-pressed={view === 'slider'}
    >
      Showcase View
    </ToggleButton>
    <ToggleButton 
      $active={view === 'grid'} 
      onClick={() => setView('grid')}
      aria-pressed={view === 'grid'}
    >
      Grid View
    </ToggleButton>
  </ViewToggle>
));

ViewToggleComponent.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired
};

// Main Testimonials component
const Testimonials = () => {
  // State for current testimonial
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState('slider'); // 'slider' or 'grid'
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.testimonials.getTestimonials();
        console.log('Testimonials API response:', response);
        
        let testimonialsData = [];
        if (response && Array.isArray(response)) {
          testimonialsData = response;
        } else if (response && response.results && Array.isArray(response.results)) {
          testimonialsData = response.results;
        } else {
          console.warn('API response format unexpected, falling back to mock data');
          setTestimonials(mockTestimonials);
          return;
        }
        
        setTestimonials(testimonialsData);
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
  
  // Get current testimonial safely
  const currentTestimonial = testimonials.length > 0 ? testimonials[currentIndex] : null;
  
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
  
  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);
  
  // Auto-rotate testimonials
  useEffect(() => {
    if (view === 'slider' && testimonials.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 8000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [currentIndex, view, handleNext, testimonials.length]);
  
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
        
        <ViewToggleComponent view={view} setView={setView} />
        
        {view === 'slider' && (
          <TestimonialShowcase>
            {loading || error ? (
              <LoadingState isLoading={loading} error={error} />
            ) : currentTestimonial ? (
              <>
                <AnimatePresence mode="wait">
                  <TestimonialSliderItem testimonial={currentTestimonial} />
                </AnimatePresence>
                
                <TestimonialNavigation 
                  currentIndex={currentIndex}
                  testimonials={testimonials}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handleDotClick={handleDotClick}
                />
              </>
            ) : (
              <div>No testimonials available</div>
            )}
          </TestimonialShowcase>
        )}
        
        {view === 'grid' && (
          <TestimonialGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {loading || error ? (
              <LoadingState isLoading={loading} error={error} />
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <TestimonialGridItem 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  index={index} 
                />
              ))
            ) : (
              <div>No testimonials available</div>
            )}
          </TestimonialGrid>
        )}
      </TestimonialsContent>
    </TestimonialsContainer>
  );
};

export default Testimonials;
