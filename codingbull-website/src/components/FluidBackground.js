import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
`;

// Using .attrs to handle motion props and reduce class generation
const GradientBlob = styled(motion.div).attrs(props => ({
  // Explicitly forward motion props
  animate: props.animate,
  style: props.style,
}))`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  mix-blend-mode: screen;
  will-change: transform;
  transform-origin: center center;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

// Specific blob styles using theme variables
const PurpleBlob = styled(GradientBlob)`
  width: 50vw;
  height: 50vw;
  left: 20%;
  top: 20%;
  background: ${props => `radial-gradient(
    circle at center, 
    ${props.theme.colors.brightPurple}4D 0%, 
    ${props.theme.colors.deepPurple}1A 70%, 
    rgba(0, 0, 0, 0) 100%
  )`};
`;

const BlueBlob = styled(GradientBlob)`
  width: 60vw;
  height: 60vw;
  right: 10%;
  bottom: 10%;
  background: ${props => `radial-gradient(
    circle at center, 
    ${props.theme.colors.electricBlue}40 0%, 
    ${props.theme.colors.deepBlue}1A 70%, 
    rgba(0, 0, 0, 0) 100%
  )`};
`;

const CyanBlob = styled(GradientBlob)`
  width: 40vw;
  height: 40vw;
  left: 5%;
  bottom: 15%;
  background: ${props => `radial-gradient(
    circle at center, 
    ${props.theme.colors.neonCyan}26 0%, 
    ${props.theme.colors.electricBlue}0D 70%, 
    rgba(0, 0, 0, 0) 100%
  )`};
`;

const MagentaBlob = styled(GradientBlob)`
  width: 45vw;
  height: 45vw;
  right: 15%;
  top: 5%;
  background: ${props => `radial-gradient(
    circle at center, 
    rgba(255, 0, 128, 0.15) 0%, 
    ${props.theme.colors.deepPurple}0D 70%, 
    rgba(0, 0, 0, 0) 100%
  )`};
`;

const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.05;
  z-index: 2;
  pointer-events: none;
`;

const FluidBackground = () => {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  
  // Create random motion values for more organic movement
  const randomX1 = useMotionValue(0);
  const randomY1 = useMotionValue(0);
  const randomX2 = useMotionValue(0);
  const randomY2 = useMotionValue(0);
  
  // Transform the motion values to create larger movements
  const x1 = useTransform(randomX1, [-1, 1], [-10, 10]);
  const y1 = useTransform(randomY1, [-1, 1], [-10, 10]);
  const x2 = useTransform(randomX2, [-1, 1], [-15, 15]);
  const y2 = useTransform(randomY2, [-1, 1], [-15, 15]);
  
  // Animation sequences for each blob
  const animateBlob1 = async () => {
    await controls1.start({
      x: [0, 20, -20, 10, 0],
      y: [0, -30, 10, -20, 0],
      scale: [1, 1.1, 0.9, 1.05, 1],
      rotate: [0, 10, -10, 5, 0],
      transition: { 
        duration: 25, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    });
  };
  
  const animateBlob2 = async () => {
    await controls2.start({
      x: [0, -30, 20, -10, 0],
      y: [0, 20, -30, 10, 0],
      scale: [1, 0.9, 1.1, 0.95, 1],
      rotate: [0, -10, 15, -5, 0],
      transition: { 
        duration: 30, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    });
  };
  
  const animateBlob3 = async () => {
    await controls3.start({
      x: [0, 15, -25, 5, 0],
      y: [0, -15, -5, 25, 0],
      scale: [1, 1.05, 0.95, 1.1, 1],
      rotate: [0, 5, -15, 10, 0],
      transition: { 
        duration: 35, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    });
  };
  
  const animateBlob4 = async () => {
    await controls4.start({
      x: [0, -10, 30, -15, 0],
      y: [0, 25, 5, -20, 0],
      scale: [1, 0.95, 1.15, 0.9, 1],
      rotate: [0, -5, 10, -15, 0],
      transition: { 
        duration: 40, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    });
  };
  
  // Start animations on component mount
  useEffect(() => {
    animateBlob1();
    animateBlob2();
    animateBlob3();
    animateBlob4();
    
    // Add subtle random movement for more organic feel
    const interval = setInterval(() => {
      randomX1.set(Math.random() * 2 - 1);
      randomY1.set(Math.random() * 2 - 1);
      randomX2.set(Math.random() * 2 - 1);
      randomY2.set(Math.random() * 2 - 1);
    }, 2000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <BackgroundContainer>
      {/* Deep purple blob */}
      <PurpleBlob
        animate={controls1}
        style={{ 
          x: x1, 
          y: y1
        }}
      />
      
      {/* Electric blue blob */}
      <BlueBlob
        animate={controls2}
        style={{ 
          x: x2, 
          y: y2
        }}
      />
      
      {/* Cyan accent blob */}
      <CyanBlob
        animate={controls3}
      />
      
      {/* Magenta accent blob */}
      <MagentaBlob
        animate={controls4}
      />
      
      {/* Noise texture overlay for grain effect */}
      <NoiseOverlay />
    </BackgroundContainer>
  );
};

export default FluidBackground;