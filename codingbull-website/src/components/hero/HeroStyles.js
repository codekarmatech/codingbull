import styled from 'styled-components';
import { motion } from 'framer-motion';

// Hero container with enhanced dark styling and optimized layout
export const HeroContainerStyled = styled.section`
  min-height: 100vh; /* Fit in viewport without scrolling */
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 80px 2.5rem 1.5rem; /* Adjusted padding to fit in viewport */
  background: #050510; /* Deep space blue-black for ultra slick look */
  perspective: 2000px; /* Enhanced perspective for 3D effect */
  transform-style: preserve-3d; /* Preserve 3D for children */
  
  /* Enhanced dark gradient overlay with subtle animation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg, 
      rgba(5, 5, 20, 0.95) 0%, 
      rgba(10, 10, 30, 0.85) 50%,
      rgba(5, 5, 20, 0.95) 100%
    );
    z-index: 1; /* Above FluidBackground but below content */
    pointer-events: none;
    /* Removed gradientShift animation to prevent color changing */
  }
  
  /* Additional subtle vignette for professional depth with animation */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      transparent 30%,
      rgba(0, 0, 15, 0.4) 100%
    );
    z-index: 3; /* Above background elements but below content */
    pointer-events: none;
    /* Removed pulseVignette animation to prevent color changing */
  }
  
  /* Modern morphing shapes animation - 2025 trending */
  @keyframes morphingShapes {
    0%, 100% {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      transform: rotate(0deg) scale(1);
    }
    25% {
      border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
      transform: rotate(90deg) scale(1.05);
    }
    50% {
      border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
      transform: rotate(180deg) scale(0.95);
    }
    75% {
      border-radius: 60% 40% 60% 30% / 70% 30% 60% 40%;
      transform: rotate(270deg) scale(1.02);
    }
  }
  
  /* Removed gradientShift and pulseVignette keyframes to prevent color changing */
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    padding: 80px 2rem 1.5rem; /* Adjusted padding for larger screens */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 70px 1.5rem 1.5rem; /* Adjusted padding for medium screens */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 60px 1rem 1rem; /* Adjusted padding for small screens */
  }
`;

// Content wrapper with optimized spacing for a classy feel that fits in viewport
export const HeroContent = styled(motion.div)`
  max-width: 1400px; /* Optimized max-width */
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5; /* Above all background elements including gradient waves and vignette */
  position: relative;
  transform-style: preserve-3d; /* Preserve 3D for children */
  padding: 1rem 2rem; /* Optimized padding to fit in viewport */
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    gap: 3rem; /* Optimized gap between sections */
    text-align: center;
    padding: 1rem 2rem; /* Consistent padding */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 2.5rem; /* Optimized gap for medium screens */
    padding: 0.75rem 1.5rem; /* Slightly reduced padding */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 2rem; /* Optimized spacing for small screens */
    padding: 0.5rem 1rem; /* Adjusted padding */
  }
`;

// Left side content with optimized spacing
export const HeroTextContentWrapper = styled(motion.div)`
  flex: 1;
  max-width: 600px; /* Optimized max-width */
  padding-right: 2.5rem; /* Optimized spacing between columns */
  margin-top: 0.5rem; /* Reduced top margin to fit in viewport */
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 100%;
    order: 2;
    padding-right: 0; /* Remove padding on mobile */
    margin-bottom: 2rem; /* Optimized bottom margin */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%; /* Ensure full width */
    max-width: 600px; /* Limit width for better readability */
    margin: 0 auto 2rem; /* Center content with optimized margin */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-bottom: 1.5rem; /* Optimized margin on small screens */
  }
`;

// Right side content (development cycle) with optimized spacing
export const HeroVisualWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 2.5rem; /* Optimized spacing between columns */
  margin-top: 0.5rem; /* Reduced top margin to fit in viewport */
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
    width: 100%;
    margin-left: 0; /* Remove margin on mobile */
    margin-top: 2rem; /* Optimized top margin */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 600px; /* Optimized max-width */
    margin: 2rem auto 0; /* Center content with optimized margin */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 1.5rem; /* Optimized margin on small screens */
  }
`;

// Headline with enhanced gradient effect and optimized styling
export const Headline = styled(motion.h1)`
  font-size: clamp(2.2rem, 4.5vw, 3.5rem); /* Optimized font size */
  line-height: 1.2; /* Improved line height */
  margin-bottom: 1.5rem; /* Optimized bottom margin */
  position: relative;
  font-family: 'Montserrat', sans-serif; /* More elegant font */
  font-weight: 800; /* Bolder weight for more impact */
  letter-spacing: -0.5px; /* Tighter letter spacing for luxury feel */
  
  /* Clean styling without interfering glow effects */
  
  @keyframes depthFloat {
    0%, 100% {
      transform: translateZ(0px) rotateX(0deg);
      filter: blur(8px) brightness(1);
    }
    50% {
      transform: translateZ(10px) rotateX(2deg);
      filter: blur(6px) brightness(1.2);
    }
  }
  
  .main-title {
    display: inline-block;
    margin-bottom: 1rem; /* Optimized margin */
  }
  
  .company-name {
    display: block;
    margin-top: 1rem; /* Optimized margin */
    font-weight: bold;
    font-size: 0.8em;
    letter-spacing: 1.5px;
  }
  
  .letter {
    display: inline-block;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    &:hover {
      transform: translateY(-3px);
      filter: brightness(1.3);
      transition: all 0.2s ease;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1.5rem;
  }
`;

// Subheadline with enhanced styling
export const Subheadline = styled(motion.p)`
  font-size: clamp(1rem, 2.2vw, 1.2rem); /* Optimized font size */
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem; /* Optimized bottom margin */
  line-height: 1.7; /* Improved line height */
  max-width: 95%; /* Slightly wider */
  font-family: 'Open Sans', sans-serif; /* More elegant font */
  letter-spacing: 0.3px; /* Slight letter spacing for readability */
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1.5rem;
    max-width: 100%;
  }
`;

// Trusted by section with optimized spacing
export const TrustedBy = styled(motion.div)`
  margin-top: 2.5rem; /* Optimized top margin */
  padding: 1.5rem 0; /* Optimized vertical padding */
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Added subtle separator */
  
  h4 {
    font-size: ${props => props.theme.fontSizes.md}; /* Optimized font size */
    color: ${props => props.theme.colors.lightGrey};
    margin-bottom: 1rem; /* Optimized bottom margin */
    font-family: 'Montserrat', sans-serif; /* More elegant font */
    letter-spacing: 0.5px; /* Added letter spacing */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-top: 2rem;
    padding: 1rem 0;
  }
`;

// Button group with enhanced styling and optimized spacing
export const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem; /* Optimized gap between buttons */
  margin-top: 2.5rem; /* Optimized top margin */
  position: relative;
  padding: 0.5rem 0; /* Added vertical padding */
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 20px;
    background: rgba(43, 155, 244, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(43, 155, 244, 0.2);
    pointer-events: none;
    animation: glassFloat 4s infinite ease-in-out;
  }

  @keyframes glassFloat {
    0%, 100% {
      transform: translateX(-50%) translateY(0px) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateX(-50%) translateY(-3px) scale(1.05);
      opacity: 0.8;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    gap: 1.2rem;
    margin-top: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;
