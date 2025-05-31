import React, { useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import Button from './Button';
import FluidBackground from './FluidBackground';
import { 
  fadeIn, 
  slideUp, 
  staggerContainer
} from '../animations/variants';

// Hero container with enhanced dark styling and optimized layout
const HeroContainer = styled.section`
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
    animation: gradientShift 15s infinite alternate ease-in-out;
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
    animation: pulseVignette 10s infinite alternate ease-in-out;
  }
  
  /* Dark color wave animations */
  @keyframes gradientShift {
    0% {
      background: linear-gradient(
        135deg, 
        rgba(5, 5, 20, 0.95) 0%, 
        rgba(10, 10, 30, 0.85) 50%,
        rgba(5, 5, 20, 0.95) 100%
      );
    }
    50% {
      background: linear-gradient(
        135deg, 
        rgba(10, 10, 30, 0.95) 0%, 
        rgba(5, 5, 20, 0.85) 50%,
        rgba(15, 15, 40, 0.95) 100%
      );
    }
    100% {
      background: linear-gradient(
        135deg, 
        rgba(15, 15, 40, 0.95) 0%, 
        rgba(10, 10, 30, 0.85) 50%,
        rgba(5, 5, 20, 0.95) 100%
      );
    }
  }
  
  @keyframes pulseVignette {
    0% {
      opacity: 0.8;
      background: radial-gradient(
        circle at center,
        transparent 30%,
        rgba(0, 0, 15, 0.4) 100%
      );
    }
    50% {
      opacity: 1;
      background: radial-gradient(
        circle at center,
        transparent 35%,
        rgba(0, 0, 25, 0.5) 100%
      );
    }
    100% {
      opacity: 0.9;
      background: radial-gradient(
        circle at center,
        transparent 25%,
        rgba(0, 0, 20, 0.45) 100%
      );
    }
  }
  
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
const HeroContent = styled(motion.div)`
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
const HeroTextContent = styled(motion.div)`
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
const HeroVisual = styled(motion.div)`
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
const Headline = styled(motion.h1)`
  font-size: clamp(2.2rem, 4.5vw, 3.5rem); /* Optimized font size */
  line-height: 1.2; /* Improved line height */
  margin-bottom: 1.5rem; /* Optimized bottom margin */
  position: relative;
  font-family: 'Montserrat', sans-serif; /* More elegant font */
  font-weight: 800; /* Bolder weight for more impact */
  letter-spacing: -0.5px; /* Tighter letter spacing for luxury feel */
  
  /* Animated glow effect */
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(10px); /* Increased blur for more dramatic effect */
    opacity: 0.4; /* Slightly increased opacity */
    animation: glowPulse 3s infinite alternate ease-in-out;
  }
  
  @keyframes glowPulse {
    0% {
      filter: blur(8px);
      opacity: 0.3;
    }
    100% {
      filter: blur(12px);
      opacity: 0.5;
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
const Subheadline = styled(motion.p)`
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
const TrustedBy = styled(motion.div)`
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
const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem; /* Optimized gap between buttons */
  margin-top: 2.5rem; /* Optimized top margin */
  position: relative;
  padding: 0.5rem 0; /* Added vertical padding */
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 100%;
    height: 15px;
    background: linear-gradient(to bottom, rgba(33, 150, 243, 0.2), transparent); /* Blue glow */
    filter: blur(10px);
    border-radius: 50%;
    opacity: 0.6;
    pointer-events: none;
    animation: glowFloat 3s infinite alternate ease-in-out;
  }
  
  @keyframes glowFloat {
    0% {
      opacity: 0.4;
      filter: blur(8px);
    }
    100% {
      opacity: 0.7;
      filter: blur(12px);
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

// Animated code block using theme variables and attrs for all dynamic styles
const CodeBlock = styled(motion.div).attrs(props => {
  return {
    // Forward ALL motion props
    variants: props.variants,
    initial: props.initial,
    animate: props.animate,
    exit: props.exit,
    transition: props.transition,
    whileHover: props.whileHover,
    whileTap: props.whileTap,
    whileFocus: props.whileFocus,
    whileDrag: props.whileDrag,
    whileInView: props.whileInView,
    
    // Apply all dynamic styles through the style prop
    style: {
      ...props.style,
      width: '100%',
      maxWidth: '580px',
      transformStyle: 'preserve-3d',
    },
    
    // Preserve className if provided
    className: props.className,
  };
})`
  background: rgba(20, 20, 30, 0.85);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textPrimary};
  box-shadow: ${props => props.theme.shadows.xl}, 
              0 0 0 1px rgba(255, 255, 255, 0.07),
              0 0 40px rgba(106, 13, 173, 0.15),
              inset 0 0 2px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  transition: all ${props => props.theme.animations.mediumBounce};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, 
      rgba(0, 0, 0, 0.6) 0%, 
      rgba(30, 30, 50, 0.6) 50%, 
      rgba(0, 0, 0, 0.6) 100%);
    border-top-left-radius: ${props => props.theme.borderRadius.md};
    border-top-right-radius: ${props => props.theme.borderRadius.md};
    border-bottom: 1px solid rgba(106, 13, 173, 0.2);
  }
  
  &::after {
    content: '• • •';
    position: absolute;
    top: 8px;
    left: 15px;
    font-size: 12px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 0 0 5px rgba(106, 13, 173, 0.5);
  }
  
  .code-header {
    position: absolute;
    top: 8px;
    right: 15px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
  }
  
  .cursor {
    display: inline-block;
    width: 2px;
    height: 18px;
    background-color: ${props => props.theme.colors.electricBlue};
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    box-shadow: ${props => props.theme.colors.glowBlue};
    border-radius: 1px;
  }
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .highlight {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: linear-gradient(to right, 
        ${props => props.theme.colors.electricBlue} 0%, 
        ${props => props.theme.colors.neonCyan} 50%, 
        ${props => props.theme.colors.electricBlue} 100%);
      transform: scaleX(0);
      transform-origin: 0 50%;
      transition: transform ${props => props.theme.animations.fastEaseOut};
      box-shadow: ${props => props.theme.colors.glowBlue};
    }
    
    &.active::after {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.xs};
    padding: 1.25rem;
    max-width: 100%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

// Code line with attrs for all motion props and styles
const CodeLine = styled(motion.div).attrs(props => {
  return {
    // Forward ALL motion props
    variants: props.variants,
    initial: props.initial,
    animate: props.animate,
    exit: props.exit,
    transition: props.transition,
    whileHover: props.whileHover,
    whileTap: props.whileTap,
    whileFocus: props.whileFocus,
    whileDrag: props.whileDrag,
    whileInView: props.whileInView,
    custom: props.custom,
    
    // Preserve className if provided
    className: props.className,
    
    // Apply any dynamic styles
    style: props.style,
  };
})`
  margin-bottom: 0.5rem;
  display: flex;
  position: relative;
  
  .line-number {
    color: ${props => props.theme.colors.lightGrey};
    margin-right: 1rem;
    user-select: none;
    opacity: 0.6;
    min-width: 28px;
    text-align: right;
    
    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      min-width: 20px;
      margin-right: 0.5rem;
      font-size: 0.8em;
    }
  }
  
  .code-content {
    position: relative;
    flex: 1;
    overflow-x: hidden; /* Hide horizontal scrollbar */
    white-space: pre-wrap; /* Wrap text instead of scrolling */
    word-break: break-word; /* Break words to prevent overflow */
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: 0.9em;
    }
    
    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      font-size: 0.8em;
    }
  }
  
  .keyword {
    color: ${props => props.theme.colors.syntaxKeyword};
    font-weight: 600;
    text-shadow: 0 0 5px rgba(0, 170, 255, 0.4);
  }
  
  .function {
    color: ${props => props.theme.colors.syntaxFunction};
    text-shadow: 0 0 5px rgba(189, 147, 249, 0.4);
  }
  
  .string {
    color: ${props => props.theme.colors.syntaxString};
    text-shadow: 0 0 5px rgba(80, 250, 123, 0.4);
  }
  
  .comment {
    color: ${props => props.theme.colors.syntaxComment};
    font-style: italic;
    text-shadow: 0 0 5px rgba(98, 114, 164, 0.4);
  }
  
  .operator {
    color: ${props => props.theme.colors.syntaxOperator};
    text-shadow: 0 0 5px rgba(255, 184, 108, 0.4);
  }
  
  .variable {
    color: ${props => props.theme.colors.syntaxVariable};
    text-shadow: 0 0 5px rgba(255, 121, 198, 0.4);
  }
  
  .property {
    color: ${props => props.theme.colors.syntaxProperty};
    text-shadow: 0 0 5px rgba(139, 233, 253, 0.4);
  }
  
  &:hover {
    background: ${props => props.theme.colors.gradientOverlay};
    box-shadow: ${props => props.theme.shadows.insetSm};
  }
  
  &.typing {
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: ${props => props.theme.colors.electricBlue};
      box-shadow: ${props => props.theme.colors.glowBlue};
    }
  }
`;

const Hero = () => {
  // Get theme from context for use in component
  const theme = React.useContext(ThemeContext);
  
  // Code animation variants for typing effect
  const codeLineVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: custom => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };
  
  // Typing effect for code content
  const typingEffect = {
    hidden: { width: 0, opacity: 0 },
    visible: custom => ({
      width: "100%",
      opacity: 1,
      transition: {
        delay: custom * 0.15 + 0.1,
        duration: 0.8,
        ease: "easeInOut"
      }
    })
  };
  
  // Animation controls for sequential animations
  const controls = useAnimation();
  
  // Mouse position for interactive elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position for parallax effect - used for subtle background movement
  const backgroundY = useTransform(mouseY, [0, 300], [-15, 15]);
  const backgroundX = useTransform(mouseX, [0, 500], [-15, 15]);
  
  // Start animations in sequence
  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
      // Additional animations can be sequenced here
    };
    
    sequence();
  }, [controls]);
  
  // Handle mouse move for interactive elements
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    
    // Calculate mouse position as percentage of container (-0.5 to 0.5)
    const mouseXPercent = (clientX - left) / width - 0.5;
    const mouseYPercent = (clientY - top) / height - 0.5;
    
    // Apply subtle rotation to the container based on mouse position
    document.querySelector('.hero-content')?.style.setProperty(
      'transform', 
      `rotateY(${mouseXPercent * 3}deg) rotateX(${-mouseYPercent * 3}deg) translateZ(0px)`
    );
  };

  return (
    <HeroContainer>
      {/* Modern fluid gradient background */}
      <FluidBackground />
      
      {/* Enhanced gradient background with subtle dark color wave animations */}
      <div className="gradient-background" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {/* Gradient overlays with subtle motion */}
        <motion.div 
          style={{
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 30%, rgba(10, 36, 99, 0.1) 0%, transparent 70%)',
            zIndex: 2
          }}
          animate={{ x: backgroundX, y: backgroundY }}
          transition={{ type: 'spring', stiffness: 10, damping: 20 }}
        />
        
        <motion.div 
          style={{
            position: 'absolute',
            bottom: '0%',
            right: '0%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 70%, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
            zIndex: 2
          }}
          animate={{ x: backgroundX, y: backgroundY }}
          transition={{ type: 'spring', stiffness: 8, damping: 25, delay: 0.1 }}
        />
        
        {/* Dark color wave animations - multiple subtle waves */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            width: '120%',
            height: '200px',
            background: 'linear-gradient(90deg, rgba(5, 5, 20, 0.05), rgba(10, 10, 30, 0.08))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.2,
            zIndex: 2
          }}
          animate={{
            y: ['0%', '5%', '0%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '30%',
            right: '-10%',
            width: '120%',
            height: '180px',
            background: 'linear-gradient(90deg, rgba(10, 10, 30, 0.08), rgba(15, 15, 40, 0.05))',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.15,
            zIndex: 2
          }}
          animate={{
            y: ['0%', '-4%', '0%'],
          }}
          transition={{
            duration: 20,
            delay: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '-5%',
            width: '110%',
            height: '150px',
            background: 'linear-gradient(90deg, rgba(15, 15, 40, 0.06), rgba(10, 36, 99, 0.08))',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.2,
            zIndex: 2
          }}
          animate={{
            y: ['0%', '6%', '0%'],
          }}
          transition={{
            duration: 15,
            delay: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        {/* Blue accent waves */}
        <motion.div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-10%',
            width: '120%',
            height: '200px',
            background: 'linear-gradient(90deg, rgba(10, 36, 99, 0.04), rgba(33, 150, 243, 0.06))',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.15,
            zIndex: 2
          }}
          animate={{
            y: ['0%', '3%', '0%'],
          }}
          transition={{
            duration: 22,
            delay: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '-10%',
            width: '120%',
            height: '220px',
            background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.06), rgba(10, 36, 99, 0.04))',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.15,
            zIndex: 2
          }}
          animate={{
            y: ['0%', '-3%', '0%'],
          }}
          transition={{
            duration: 20,
            delay: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        {/* Animated border glows */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(62, 146, 204, 0.4), transparent)',
            opacity: 0.4
          }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
          }}
          transition={{ 
            opacity: { duration: 8, repeat: Infinity, repeatType: 'reverse' },
            backgroundPosition: { duration: 15, repeat: Infinity, repeatType: 'reverse' }
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.4), transparent)',
            opacity: 0.4
          }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
          }}
          transition={{ 
            opacity: { duration: 8, delay: 4, repeat: Infinity, repeatType: 'reverse' },
            backgroundPosition: { duration: 15, delay: 2, repeat: Infinity, repeatType: 'reverse' }
          }}
        />
      </div>
      
      <HeroContent
        className="hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <HeroTextContent>
          <Headline
            data-text="CodingBull Technovations"
            style={{ 
              marginBottom: "2rem", // Optimized spacing
              lineHeight: 1.3, // Improved line height for better readability
              padding: "0.5rem 0" // Added vertical padding
            }}
          >
            {/* Company name now as the main title with larger, more prominent styling */}
            <div className="main-title" style={{ marginBottom: "1.5rem" }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(90deg, #2979FF 0%, #00B0FF 100%)", // Professional blue gradient
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  textShadow: "0 5px 20px rgba(33, 150, 243, 0.3)",
                  fontSize: "clamp(2.5rem, 5vw, 3.8rem)", // Optimized font size
                  fontWeight: "900", // Extra bold
                  letterSpacing: "-0.5px", // Tighter letter spacing for luxury feel
                  wordBreak: "keep-all", // Prevents breaking words in awkward places
                  hyphens: "auto", // Allows hyphenation for better text wrapping
                  paddingRight: "0.5rem", // Ensures space at the end of lines
                  fontFamily: "'Montserrat', sans-serif" // More elegant font
                }}
              >
                CodingBull Technovations
              </motion.div>
            </div>
            
            {/* Transform Ideas now as the secondary tagline with enhanced styling */}
            <motion.div 
              className="company-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              style={{
                display: "block", // Changed to block for better mobile layout
                borderTop: "1px solid rgba(33, 150, 243, 0.3)",
                paddingTop: "1.2rem",
                marginTop: "1.5rem", // Optimized spacing
                position: "relative"
              }}
            >
              {/* Animated gradient text with letter animation */}
              <motion.div
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontSize: "clamp(1.3rem, 2.8vw, 1.6rem)", // Optimized font size
                  fontWeight: "600", // Semi-bold
                  letterSpacing: "0.5px",
                  lineHeight: 1.4,
                  fontFamily: "'Open Sans', sans-serif" // More elegant font
                }}
              >
                {/* Split text into individual letters for animation */}
                {"Transform Ideas into Digital Products".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.03, 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    style={{
                      display: "inline-block",
                      color: letter === " " ? "transparent" : "rgba(255, 255, 255, 0.95)",
                      textShadow: letter === " " ? "none" : "0 0 10px rgba(33, 150, 243, 0.4)",
                      marginRight: letter === " " ? "0.4em" : "0",
                      background: letter === " " ? "none" : "linear-gradient(135deg, #4B91F1 0%, #1976D2 100%)",
                      WebkitBackgroundClip: letter === " " ? "none" : "text",
                      WebkitTextFillColor: letter === " " ? "transparent" : "transparent",
                    }}
                    whileHover={{
                      y: -3,
                      scale: 1.1,
                      color: "#2196F3",
                      textShadow: "0 0 15px rgba(33, 150, 243, 0.5)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>
              
              {/* Animated underline */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "2px",
                  background: "linear-gradient(to right, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.7), rgba(33, 150, 243, 0.3))",
                  marginTop: "0.5rem",
                  boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)"
                }}
              />
            </motion.div>
          </Headline>
          
          <Subheadline
            variants={fadeIn}
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)", // Responsive font size
              lineHeight: 1.7, // Improved line height for better readability
              color: "rgba(255, 255, 255, 0.85)", // Slightly softer white for better contrast
              marginBottom: "2.5rem", // Increased spacing
              maxWidth: "95%", // Ensure text doesn't stretch too wide
              letterSpacing: "0.3px" // Slightly improved letter spacing
            }}
          >
            We build enterprise-grade web & mobile applications that scale—powered by modern technologies and proven expertise.
          </Subheadline>
          
          <ButtonGroup
            variants={fadeIn}
            style={{ marginTop: "3rem" }} // Increased spacing
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => document.getElementById('our-projects').scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.8, 
                  duration: 0.5,
                  ease: [0.175, 0.885, 0.32, 1.275]
                }
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(106, 13, 173, 0.5)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Our Work
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 1.0, 
                  duration: 0.5,
                  ease: [0.175, 0.885, 0.32, 1.275]
                }
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0, 112, 255, 0.3)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              Our Services
            </Button>
          </ButtonGroup>
          
          <TrustedBy
            variants={slideUp}
          >
            <motion.p 
              style={{ color: '#E0E0E0', fontSize: '0.9rem', letterSpacing: '0.5px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Registered Technology Company • MCA India
            </motion.p>
          </TrustedBy>
        </HeroTextContent>
        
        <HeroVisual>
          {/* Modern 3D development cycle display */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ 
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Floating 3D elements representing development cycle */}
            <motion.div
              style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* Central glowing orb */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.9, 1.1, 0.9],
                  opacity: 1,
                  boxShadow: [
                    '0 0 30px rgba(33, 150, 243, 0.4)',
                    '0 0 50px rgba(33, 150, 243, 0.6)',
                    '0 0 30px rgba(33, 150, 243, 0.4)'
                  ]
                }}
                transition={{ 
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1 },
                  boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30%, #2196F3, #0D47A1)',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 0 30px rgba(33, 150, 243, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span>CODING<br/>BULL</span>
              </motion.div>
              
              {/* Orbital ring */}
              <motion.div
                initial={{ opacity: 0, rotateZ: 0 }}
                animate={{ 
                  opacity: 1, 
                  rotateZ: 360,
                }}
                transition={{ 
                  opacity: { duration: 1 },
                  rotateZ: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
                style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  boxShadow: 'inset 0 0 20px rgba(33, 150, 243, 0.1), 0 0 10px rgba(33, 150, 243, 0.2)',
                  zIndex: 1
                }}
              />
              
              {/* Development cycle elements */}
              {['BUILD', 'TEST', 'DEPLOY', 'INNOVATE'].map((item, index) => {
                const angle = (index * 90) * (Math.PI / 180);
                const x = Math.cos(angle) * 140;
                const y = Math.sin(angle) * 140;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x, y, scale: 0.7 }}
                    animate={{ 
                      opacity: 1, 
                      x: [x, x + (x * 0.05), x],
                      y: [y, y + (y * 0.05), y],
                      scale: [0.8, 1, 0.8],
                      boxShadow: [
                        '0 0 15px rgba(33, 150, 243, 0.3)',
                        '0 0 25px rgba(33, 150, 243, 0.5)',
                        '0 0 15px rgba(33, 150, 243, 0.3)'
                      ]
                    }}
                    transition={{ 
                      opacity: { duration: 0.8, delay: 0.3 + (index * 0.2) },
                      x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
                      boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                    }}
                    whileHover={{
                      scale: 1.2,
                      boxShadow: '0 0 30px rgba(33, 150, 243, 0.7)',
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      position: 'absolute',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30%, rgba(33, 150, 243, 0.9), rgba(13, 71, 161, 0.9))',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 0 15px rgba(33, 150, 243, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      zIndex: 3
                    }}
                  >
                    {item}
                  </motion.div>
                );
              })}
              
              {/* Connecting lines */}
              {[0, 1, 2, 3].map((index) => {
                const startAngle = (index * 90) * (Math.PI / 180);
                const endAngle = ((index + 1) % 4 * 90) * (Math.PI / 180);
                
                const startX = Math.cos(startAngle) * 140;
                const startY = Math.sin(startAngle) * 140;
                const endX = Math.cos(endAngle) * 140;
                const endY = Math.sin(endAngle) * 140;
                
                // Calculate the length and angle of the line
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
                
                return (
                  <motion.div
                    key={`line-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ 
                      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                    }}
                    style={{
                      position: 'absolute',
                      width: `${length}px`,
                      height: '1px',
                      background: 'linear-gradient(to right, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.7), rgba(33, 150, 243, 0.3))',
                      boxShadow: '0 0 8px rgba(33, 150, 243, 0.5)',
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '0 0',
                      left: `${startX + 140}px`,
                      top: `${startY + 140}px`,
                      zIndex: 0
                    }}
                  />
                );
              })}
              
              {/* Particle effects */}
              {[...Array(20)].map((_, index) => {
                const size = Math.random() * 4 + 1;
                const angle = Math.random() * 360 * (Math.PI / 180);
                const distance = Math.random() * 120 + 20;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const duration = Math.random() * 8 + 4;
                
                return (
                  <motion.div
                    key={`particle-${index}`}
                    initial={{ opacity: 0, x, y, scale: 0 }}
                    animate={{ 
                      opacity: [0, 0.7, 0],
                      x: [x, x * 1.2],
                      y: [y, y * 1.2],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: '50%',
                      background: 'rgba(33, 150, 243, 0.8)',
                      boxShadow: '0 0 5px rgba(33, 150, 243, 0.8)',
                      zIndex: 1
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        </HeroVisual>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;