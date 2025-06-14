import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

// Simplified gradient blob component
const GradientBlob = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  mix-blend-mode: screen;
  will-change: transform;
  transform-origin: center center;
`;

// Simplified blob styles using consistent brand blue theme
const PrimaryBlob = styled(GradientBlob)`
  width: 60vw;
  height: 60vw;
  left: 10%;
  top: 10%;
  background: radial-gradient(
    circle at center,
    rgba(43, 155, 244, 0.3) 0%,
    rgba(43, 155, 244, 0.1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const SecondaryBlob = styled(GradientBlob)`
  width: 70vw;
  height: 70vw;
  right: 5%;
  bottom: 5%;
  background: radial-gradient(
    circle at center,
    rgba(43, 155, 244, 0.2) 0%,
    rgba(43, 155, 244, 0.05) 50%,
    rgba(0, 0, 0, 0) 100%
  );
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

// Simplified aurora effect with consistent blue theme
const Aurora = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 30vh;
  bottom: -15vh;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0),
    rgba(43, 155, 244, 0.02) 30%,
    rgba(43, 155, 244, 0.04) 60%,
    rgba(0, 0, 0, 0)
  );
  filter: blur(50px);
  opacity: 0.6;
  mix-blend-mode: screen;
  z-index: 1;
`;

const FluidBackground = () => {
  
  return (
    <BackgroundContainer>
      {/* Primary brand blue blob */}
      <PrimaryBlob
        animate={{
          x: [0, 20, -10, 15, 0],
          y: [0, -15, 10, -8, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
          rotate: [0, 5, -5, 3, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />

      {/* Secondary brand blue blob */}
      <SecondaryBlob
        animate={{
          x: [0, -15, 12, -8, 0],
          y: [0, 10, -15, 5, 0],
          scale: [1, 0.95, 1.08, 0.98, 1],
          rotate: [0, -3, 8, -2, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />

      {/* Aurora effect */}
      <Aurora
        animate={{
          scaleY: [1, 1.1, 0.95, 1.05, 1],
          opacity: [0.6, 0.7, 0.5, 0.65, 0.6]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />

      {/* Noise texture overlay for grain effect */}
      <NoiseOverlay />
    </BackgroundContainer>
  );
};

export default FluidBackground;