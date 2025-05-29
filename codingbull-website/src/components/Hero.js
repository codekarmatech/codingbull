import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import Button from './Button';
import FluidBackground from './FluidBackground';
import { 
  fadeIn, 
  slideUp, 
  textReveal, 
  staggerContainer,
  bounce
} from '../animations/variants';

// Hero container with modern styling
const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 80px 2rem 0; /* Added top padding to prevent navbar overlap */
  background: #000000; /* Pure black for slick look */
  perspective: 2000px; /* Enhanced perspective for 3D effect */
  transform-style: preserve-3d; /* Preserve 3D for children */
  
  /* Dark gradient overlay for better text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%);
    z-index: 2; /* Above FluidBackground but below content */
    pointer-events: none;
  }
`;

// Content wrapper
const HeroContent = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3; /* Above both FluidBackground and ParticlesContainer */
  position: relative;
  transform-style: preserve-3d; /* Preserve 3D for children */
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
    padding: 0 1rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 1.5rem;
  }
`;

// Left side content
const HeroTextContent = styled(motion.div)`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 100%;
    order: 2;
  }
`;

// Right side content (image/animation)
const HeroVisual = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
    width: 100%;
  }
`;

// Headline
const Headline = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  span {
    display: block;
    color: ${props => props.theme.colors.textPrimary};
    -webkit-text-fill-color: ${props => props.theme.colors.textPrimary};
  }
`;

// Subheadline
const Subheadline = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

// Trusted by section
const TrustedBy = styled(motion.div)`
  margin-top: 3rem;
  
  h4 {
    font-size: ${props => props.theme.fontSizes.md};
    color: ${props => props.theme.colors.lightGrey};
    margin-bottom: 1rem;
  }
`;

// We'll add client logos in the future if needed

// Button group with enhanced styling
const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 100%;
    height: 15px;
    background: linear-gradient(to bottom, rgba(106, 13, 173, 0.2), transparent);
    filter: blur(10px);
    border-radius: 50%;
    opacity: 0.5;
    pointer-events: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
`;

// 3D Particles container with adjusted z-index
const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1; /* Above the FluidBackground but below the content */
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-out;
  will-change: transform;
  pointer-events: none; /* Allow clicks to pass through */
`;

// Individual star particle - using attrs for all dynamic styles
const Particle = styled(motion.div).attrs(props => {
  // Extract values with defaults
  const color = props.$color || props.theme.colors.electricBlue;
  const glow = props.$glow || '5px';
  const opacity = props.$opacity || 0.6;
  const size = props.$size || '2px';
  const blur = props.$blur || '0px';

  return {
    // Forward ALL motion props
    animate: props.animate,
    initial: props.initial,
    exit: props.exit,
    transition: props.transition,
    whileHover: props.whileHover,
    whileTap: props.whileTap,
    whileFocus: props.whileFocus,
    whileDrag: props.whileDrag,
    whileInView: props.whileInView,
    variants: props.variants,
    
    // Apply all dynamic styles through the style prop, including CSS variables
    style: {
      ...props.style,
      width: size,
      height: size,
      background: color, // Main background can still be direct for the element itself
      opacity: opacity, // Main opacity can still be direct
      filter: `blur(${blur})`,
      boxShadow: `0 0 ${glow} ${color}`, // Main boxShadow can still be direct
      // CSS Variables for use in pseudo-elements and keyframes
      '--particle-color': color,
      '--particle-glow': glow,
      '--particle-opacity': opacity,
      '--particle-glow-after': props.$glow ? `${props.$glow}` : '10px' // Specific for ::after
    },
    
    // Preserve className if provided
    className: props.className,
  };
})`
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  will-change: transform, opacity, box-shadow;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Define default values for CSS variables at the component level */
  --particle-color-default: ${props => props.theme.colors.electricBlue};
  --particle-glow-default: 5px;
  --particle-opacity-default: 0.6;
  --particle-glow-after-default: 10px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    transform: translate(-50%, -50%);
    background: var(--particle-color, var(--particle-color-default));
    box-shadow: 0 0 var(--particle-glow-after, var(--particle-glow-after-default)) var(--particle-color, var(--particle-color-default));
    border-radius: 50%;
    opacity: 0.3; /* This opacity seems static for the ::after, so it's fine */
  }
  
  &.pulsate {
    animation: pulsate 4s ease-in-out infinite alternate;
  }
  
  &.twinkle {
    animation: twinkle 7s ease-in-out infinite;
  }
  
  @keyframes pulsate {
    0% {
      box-shadow: 0 0 var(--particle-glow, var(--particle-glow-default)) var(--particle-color, var(--particle-color-default));
      opacity: var(--particle-opacity, var(--particle-opacity-default));
    }
    50% {
      /* For calc inside var, it's tricky. We might need to pass the calculated value or simplify. */
      /* Simpler: use a multiplier variable if possible, or accept less dynamic keyframes. */
      /* For now, let's assume glow can be passed as a direct value for keyframe steps if complex calc is an issue */
      box-shadow: 0 0 calc(var(--particle-glow, var(--particle-glow-default)) * 1.5) var(--particle-color, var(--particle-color-default));
      opacity: calc(var(--particle-opacity, var(--particle-opacity-default)) * 1.3); /* Ensure this doesn't exceed 1 */
    }
    100% {
      box-shadow: 0 0 calc(var(--particle-glow, var(--particle-glow-default)) * 2.5) var(--particle-color, var(--particle-color-default));
      opacity: calc(var(--particle-opacity, var(--particle-opacity-default)) * 1.7); /* Ensure this doesn't exceed 1 */
    }
  }
  
  @keyframes twinkle {
    0%, 100% {
      opacity: var(--particle-opacity, var(--particle-opacity-default));
      box-shadow: 0 0 var(--particle-glow, var(--particle-glow-default)) var(--particle-color, var(--particle-color-default));
    }
    25% {
      opacity: calc(var(--particle-opacity, var(--particle-opacity-default)) * 0.3);
      box-shadow: 0 0 calc(var(--particle-glow, var(--particle-glow-default)) * 0.5) var(--particle-color, var(--particle-color-default));
    }
    50% {
      opacity: calc(var(--particle-opacity, var(--particle-opacity-default)) * 1.5);
      box-shadow: 0 0 calc(var(--particle-glow, var(--particle-glow-default)) * 2) var(--particle-color, var(--particle-color-default));
    }
    75% {
      opacity: calc(var(--particle-opacity, var(--particle-opacity-default)) * 0.5);
      box-shadow: 0 0 calc(var(--particle-glow, var(--particle-glow-default)) * 0.7) var(--particle-color, var(--particle-color-default));
    }
  }
`;

// Nebula cloud for galaxy effect - using attrs for all dynamic styles
const Nebula = styled(motion.div).attrs(props => {
  // Extract values with defaults
  const size = props.$size || '300px';
  const color = props.$color || 'rgba(106, 13, 173, 0.2)';
  const borderRadius = props.$borderRadius || '50%';
  const opacity = props.$opacity || 0.15;
  const blur = props.$blur || '40px';
  
  return {
    // Forward ALL motion props
    animate: props.animate,
    initial: props.initial,
    exit: props.exit,
    transition: props.transition,
    whileHover: props.whileHover,
    whileTap: props.whileTap,
    whileFocus: props.whileFocus,
    whileDrag: props.whileDrag,
    whileInView: props.whileInView,
    variants: props.variants,
    
    // Apply all dynamic styles through the style prop
    style: {
      ...props.style,
      width: size,
      height: size,
      borderRadius: borderRadius,
      background: `radial-gradient(ellipse, ${color} 0%, rgba(0,0,0,0) 70%)`,
      opacity: opacity,
      filter: `blur(${blur})`,
    },
  };
})`
  position: absolute;
  z-index: 0;
  mix-blend-mode: screen;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: radial-gradient(ellipse at 30% 40%, 
      rgba(255, 255, 255, 0.05) 0%, 
      rgba(0,0,0,0) 70%);
    filter: blur(15px);
    opacity: 0.5;
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
  // Animation variants for staggered code lines
  const codeLineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 0.5
      }
    })
  };
  
  // We'll use this for the typing effect on the code lines
  const typingEffect = {
    initial: { width: 0 },
    animate: { 
      width: "100%",
      transition: { 
        duration: 1.5, 
        ease: "easeInOut" 
      }
    }
  };
  
  // Animation controls for sequential animations
  const controls = useAnimation();
  
  // Mouse position for interactive elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position for parallax effect
  const rotateX = useTransform(mouseY, [0, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 500], [-5, 5]);
  
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
    document.querySelector('.particles-container')?.style.setProperty(
      'transform', 
      `rotateY(${mouseXPercent * 10}deg) rotateX(${-mouseYPercent * 10}deg)`
    );
  };
  
  // Generate random particles for galaxy star field effect
  const particles = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => {
      // Random positions in 3D space
      const x = Math.random() * 100; // % of container width
      const y = Math.random() * 100; // % of container height
      const z = Math.random() * 2000 - 1000; // z-depth (-1000px to 1000px) for enhanced deep space effect
      
      // Star size distribution - mostly small with a few larger ones
      const sizeRandom = Math.random();
      const size = sizeRandom > 0.97 ? 4 + Math.random() * 3 : // Extra large stars (3%)
                  sizeRandom > 0.9 ? 2.5 + Math.random() * 1.5 : // Large stars (7%)
                  sizeRandom > 0.7 ? 1.5 + Math.random() * 1 : // Medium stars (20%)
                  0.5 + Math.random() * 0.8; // Small stars (70%)
      
      // Blur and glow effects
      const blur = sizeRandom > 0.9 ? 0 : Math.random() * 1.2; // Sharper large stars
      const glow = sizeRandom > 0.95 ? `${8 + Math.random() * 12}px` : // Extra bright glow for largest stars
                  sizeRandom > 0.85 ? `${4 + Math.random() * 8}px` : // Bright glow for large stars
                  `${1 + Math.random() * 3}px`; // Subtle glow for smaller stars
      
      // Opacity - brighter for larger stars
      const opacity = sizeRandom > 0.95 ? 0.9 + Math.random() * 0.1 : // Brightest stars
                     sizeRandom > 0.8 ? 0.6 + Math.random() * 0.3 : // Bright stars
                     sizeRandom > 0.6 ? 0.3 + Math.random() * 0.3 : // Medium brightness
                     0.1 + Math.random() * 0.2; // Dim stars
      
      // Star colors - galaxy-like distribution with more vibrant colors on black background
      const colorRandom = Math.random();
      const colors = colorRandom > 0.92 ? ['#FF9D00', '#FF5500', '#FF8800'] : // Yellow/orange/red stars (8%)
                    colorRandom > 0.85 ? ['#FF00FF', '#FF66FF', '#CC33FF'] : // Pink/magenta stars (7%)
                    colorRandom > 0.7 ? ['#FFFFFF', '#F8F8FF', '#E6E6FA'] : // White stars (15%)
                    colorRandom > 0.4 ? ['#00BFFF', '#1E90FF', '#87CEFA', '#00FFFF'] : // Blue/cyan stars (30%)
                    ['#9370DB', '#8A2BE2', '#9932CC', '#6A0DAD', '#7B68EE']; // Purple/violet stars (40%)
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random animation durations - slower for distant stars (parallax effect)
      const zFactor = Math.abs(z) / 1000; // 0 to 1 based on z-distance
      const duration = 25 + zFactor * 65; // 25-90 seconds
      const delay = Math.random() * 10;
      
      // Enhanced animation values for more dynamic movement
      const xOffset = Math.sin(i * 0.5) * (15 + Math.random() * 10);
      const yOffset = Math.cos(i * 0.5) * (8 + Math.random() * 7);
      
      // Animation effects for stars
      const pulsate = sizeRandom > 0.9; // Only the largest stars pulsate
      const twinkle = !pulsate && sizeRandom > 0.7 && sizeRandom <= 0.9; // Medium stars twinkle
      
      return {
        id: i,
        x,
        y,
        z,
        size,
        blur,
        opacity,
        color,
        glow,
        xOffset,
        yOffset,
        duration,
        delay,
        pulsate,
        twinkle
      };
    });
  }, []);

  return (
    <HeroContainer>
      {/* Modern fluid gradient background */}
      <FluidBackground />
      
      {/* 3D Particles Animation */}
      <ParticlesContainer className="particles-container">
        {/* Enhanced nebula clouds for cinematic effect */}
        <Nebula 
          $size="550px"
          $color="rgba(76, 0, 153, 0.15)"
          $blur="65px"
          style={{ top: '15%', right: '8%', transform: 'translateZ(-700px)' }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.22, 0.15],
            rotate: [0, 7, 0],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 70, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <Nebula 
          $size="450px"
          $color="rgba(0, 112, 255, 0.12)"
          $blur="55px"
          style={{ bottom: '12%', left: '12%', transform: 'translateZ(-600px)' }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.18, 0.12],
            rotate: [0, -5, 0],
            x: [0, -25, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <Nebula 
          $size="380px"
          $color="rgba(106, 13, 173, 0.15)"
          $borderRadius="60% 40% 50% 50% / 40% 50% 50% 60%"
          $blur="50px"
          style={{ top: '60%', right: '25%', transform: 'translateZ(-650px)' }}
          animate={{ 
            scale: [1, 1.12, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 10, 0],
            x: [0, 15, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 80, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <Nebula 
          $size="320px"
          $color="rgba(255, 0, 128, 0.08)"
          $borderRadius="40% 60% 60% 40% / 60% 30% 70% 40%"
          $blur="45px"
          style={{ top: '30%', left: '20%', transform: 'translateZ(-550px)' }}
          animate={{ 
            scale: [1, 1.18, 1],
            opacity: [0.08, 0.14, 0.08],
            rotate: [0, -8, 0],
            x: [0, -10, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 65, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* Star particles */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            $size={`${particle.size}px`}
            $color={particle.color}
            $opacity={particle.opacity}
            $blur={`${particle.blur}px`}
            $glow={particle.glow}
            className={particle.pulsate ? 'pulsate' : particle.twinkle ? 'twinkle' : ''}
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              transform: `translateZ(${particle.z}px)`
            }}
            animate={{
              // Enhanced circular/elliptical motion for stars
              x: [
                0,
                particle.xOffset, 
                0,
                -particle.xOffset,
                0
              ],
              y: [
                0,
                particle.yOffset,
                0,
                -particle.yOffset,
                0
              ],
              // Subtle scaling for stars that aren't animated via CSS
              scale: particle.pulsate || particle.twinkle ? 
                [1, 1] : // No scale animation for stars with CSS animations
                [
                  1,
                  particle.size > 2 ? 1.3 : 1.15,
                  1
                ],
              // Subtle opacity changes for stars that aren't animated via CSS
              opacity: particle.pulsate || particle.twinkle ?
                [particle.opacity, particle.opacity] : // No opacity animation for stars with CSS animations
                [
                  particle.opacity,
                  particle.opacity * (particle.size > 2 ? 1.6 : 1.3),
                  particle.opacity
                ]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: particle.delay,
              // Different timing for each property for more natural movement
              x: { duration: particle.duration * 0.8 },
              y: { duration: particle.duration * 1.2 },
              scale: { duration: 3 + Math.random() * 7, repeatType: "reverse" },
              opacity: { duration: 4 + Math.random() * 6, repeatType: "reverse" }
            }}
          />
        ))}
      </ParticlesContainer>
      
      <HeroContent
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
      >
        <HeroTextContent>
          <Headline
            variants={textReveal}
          >
            Transform Ideas into Digital Products <span>with CodingBull Technovations</span>
          </Headline>
          
          <Subheadline
            variants={fadeIn}
          >
            We build enterprise-grade web & mobile applications that scale—powered by modern technologies and proven expertise.
          </Subheadline>
          
          <ButtonGroup
            variants={fadeIn}
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
          
          {/* Interactive code block with enhanced 3D effect */}
          <CodeBlock
            style={{ 
              perspective: "1500px",
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
              filter: "drop-shadow(0 0 30px rgba(0, 112, 255, 0.1))"
            }}
            variants={bounce}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03, 
              boxShadow: `${props => props.theme.shadows.xl}, 0 0 50px rgba(106, 13, 173, 0.3)`,
              transition: { duration: 0.4, ease: "backOut" }
            }}
          >
            <div className="code-header">codingbull-solution.js</div>
            <div style={{ marginTop: '20px' }}>
              {[
                {
                  lineNumber: "01",
                  content: <><span className="keyword">import</span> &#123; <span className="function">initBackend</span> &#125; <span className="keyword">from</span> <span className="string">'@codingbull/core'</span>;</>
                },
                {
                  lineNumber: "02",
                  content: <><span className="keyword">import</span> &#123; <span className="function">setupFrontend</span> &#125; <span className="keyword">from</span> <span className="string">'@codingbull/react-ui'</span>;</>
                },
                {
                  lineNumber: "03",
                  content: <><span className="keyword">import</span> &#123; <span className="function">runAnalytics</span> &#125; <span className="keyword">from</span> <span className="string">'@codingbull/analytics'</span>;</>
                },
                {
                  lineNumber: "04",
                  content: <><span className="keyword">import</span> &#123; <span className="function">deployToCloud</span> &#125; <span className="keyword">from</span> <span className="string">'@codingbull/devops'</span>;</>
                }
              ].map((line, index) => (
                <CodeLine 
                  key={index}
                  custom={index + 1} 
                  variants={codeLineVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  <span className="line-number">{line.lineNumber}</span>
                  <div className="code-content">
                    {line.content}
                  </div>
                </CodeLine>
              ))}
              {/* Special typing effect line */}
              <CodeLine 
                custom={5} 
                variants={codeLineVariants} 
                initial="hidden" 
                animate="visible" 
                className="highlight active typing"
              >
                <span className="line-number">05</span>
                <div className="code-content" style={{ overflow: 'hidden' }}>
                  <motion.span 
                    initial={typingEffect.initial}
                    animate={typingEffect.animate}
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    <span className="keyword">export default async function</span> <span className="function">createSolution</span>(&#123; <span className="variable">client</span> &#125;) &#123;
                  </motion.span>
                </div>
              </CodeLine>
              
              {/* Remaining code lines */}
              {[
                {
                  lineNumber: "06",
                  content: <><span className="keyword">try</span> &#123;</>,
                  custom: 6
                },
                {
                  lineNumber: "07",
                  content: <><span className="keyword">const</span> <span className="variable">api</span> = <span className="keyword">await</span> <span className="function">initBackend</span>(&#123; <span className="property">project</span>: <span className="variable">client</span>, <span className="property">stack</span>: [<span className="string">'Django'</span>, <span className="string">'Docker'</span>] &#125;)</>,
                  custom: 7
                },
                {
                  lineNumber: "08",
                  content: <><span className="keyword">const</span> <span className="variable">ui</span> = <span className="keyword">await</span> <span className="function">setupFrontend</span>(&#123; <span className="property">endpoint</span>: <span className="variable">api</span>.<span className="property">url</span>, <span className="property">framework</span>: <span className="string">'React'</span> &#125;)</>,
                  custom: 8
                },
                {
                  lineNumber: "09",
                  content: <><span className="keyword">await</span> <span className="function">runAnalytics</span>(&#123; <span className="property">projectId</span>: <span className="variable">api</span>.<span className="property">id</span> &#125;)</>,
                  custom: 9
                },
                {
                  lineNumber: "10",
                  content: <><span className="keyword">return</span> <span className="function">deployToCloud</span>(&#123; <span className="variable">api</span>, <span className="variable">ui</span> &#125;)</>,
                  custom: 10
                },
                {
                  lineNumber: "11",
                  content: <>&#125; <span className="keyword">catch</span> (<span className="variable">err</span>) &#123;</>,
                  custom: 11
                },
                {
                  lineNumber: "12",
                  content: <><span className="variable">console</span>.<span className="function">error</span>(<span className="string">'Build failed:'</span>, <span className="variable">err</span>)</>,
                  custom: 12
                },
                {
                  lineNumber: "13",
                  content: <><span className="keyword">throw</span> <span className="variable">err</span></>,
                  custom: 13
                },
                {
                  lineNumber: "14",
                  content: <>&#125;</>,
                  custom: 14
                },
                {
                  lineNumber: "15",
                  content: <>&#125;<span className="cursor"></span></>,
                  custom: 15
                }
              ].map((line) => (
                <CodeLine 
                  key={line.custom}
                  custom={line.custom} 
                  variants={codeLineVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  <span className="line-number">{line.lineNumber}</span>
                  <div className="code-content">
                    {line.content}
                  </div>
                </CodeLine>
              ))}
            </div>
          </CodeBlock>
        </HeroVisual>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;