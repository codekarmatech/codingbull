import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer } from '../animations/variants';

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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid ${props => props.theme.colors.electricBlue};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

// Custom shouldForwardProp function to filter out non-DOM props
const shouldForwardProp = prop => prop !== 'active';

// Nav dot
const NavDot = styled.button.withConfig({
  shouldForwardProp
})`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active 
    ? props.theme.colors.electricBlue 
    : props.theme.colors.lightGrey};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active 
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.electricBlue};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
const ToggleButton = styled.button.withConfig({
  shouldForwardProp
})`
  background: ${props => props.active ? props.theme.colors.electricBlue : props.theme.colors.mediumGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.electricBlue : props.theme.colors.deepPurple};
  }
`;

const Testimonials = () => {
  // State for current testimonial
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState('slider'); // 'slider' or 'grid'
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "CodingBull transformed our outdated systems into a modern, scalable platform that has significantly improved our operational efficiency. Their team's expertise and dedication to our project exceeded our expectations.",
      author: "Jennifer Martinez",
      title: "CTO",
      company: "HealthTech Solutions",
      image: "https://placehold.co/150"
    },
    {
      id: 2,
      quote: "Working with CodingBull on our e-commerce platform was a game-changer for our business. They delivered a solution that not only met our immediate needs but was built with future growth in mind.",
      author: "Michael Chang",
      title: "Director of Digital",
      company: "Global Retail Inc.",
      image: "https://placehold.co/150"
    },
    {
      id: 3,
      quote: "The AI-powered analytics dashboard CodingBull developed has given us unprecedented insights into our customer behavior. Their team took the time to understand our business challenges and delivered a solution that directly addressed them.",
      author: "Sarah Johnson",
      title: "Head of Customer Experience",
      company: "DataDrive Analytics",
      image: "https://placehold.co/150"
    },
    {
      id: 4,
      quote: "CodingBull's expertise in cloud migration saved us months of downtime and potential data loss. Their methodical approach and clear communication throughout the project made a complex process manageable.",
      author: "Robert Williams",
      title: "IT Director",
      company: "Enterprise Solutions Ltd.",
      image: "https://placehold.co/150"
    },
    {
      id: 5,
      quote: "We approached CodingBull with a challenging mobile app concept, and they delivered beyond our expectations. Their development process was transparent, and they were responsive to our feedback at every stage.",
      author: "Lisa Chen",
      title: "Product Manager",
      company: "MobileFirst Technologies",
      image: "https://placehold.co/150"
    },
    {
      id: 6,
      quote: "The custom CRM solution developed by CodingBull has streamlined our sales process and improved our team's productivity by over 40%. Their ongoing support has been exceptional.",
      author: "David Patel",
      title: "Sales Director",
      company: "Growth Ventures",
      image: "https://placehold.co/150"
    }
  ];
  
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
            Client Testimonials
          </SectionTitle>
          <SectionDescription
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Don't just take our word for it. Here's what our clients have to say about working with CodingBull.
          </SectionDescription>
        </SectionHeader>
        
        <ViewToggle>
          <ToggleButton 
            active={view === 'slider'} 
            onClick={() => setView('slider')}
          >
            Showcase View
          </ToggleButton>
          <ToggleButton 
            active={view === 'grid'} 
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
                    <img src={currentTestimonial.image} alt={currentTestimonial.author} />
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
                  active={index === currentIndex}
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
                    <img src={testimonial.image} alt={testimonial.author} />
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