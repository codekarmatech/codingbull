import React, { useEffect, useMemo } from 'react';
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
  perspective: 1000px;
  transform-style: preserve-3d;
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

// Shooting star component
const ShootingStar = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  z-index: 1;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 1px;
    background: linear-gradient(to left, white, transparent);
    right: 1px;
  }
`;

// Aurora effect
const Aurora = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 40vh;
  bottom: -20vh;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 30, 0),
    rgba(76, 0, 153, 0.05) 20%,
    rgba(0, 112, 255, 0.05) 40%,
    rgba(0, 200, 255, 0.05) 60%,
    rgba(0, 255, 200, 0.05) 80%,
    rgba(10, 10, 30, 0)
  );
  filter: blur(40px);
  opacity: 0.4;
  mix-blend-mode: screen;
  transform-origin: bottom center;
  z-index: 1;
`;

const FluidBackground = () => {
  // Animation controls for blobs - create individually to avoid hooks in callbacks
  const blobControl1 = useAnimation();
  const blobControl2 = useAnimation();
  const blobControl3 = useAnimation();
  const blobControl4 = useAnimation();
  const blobControls = [blobControl1, blobControl2, blobControl3, blobControl4];
  
  // Create random motion values for more organic movement - individually to avoid hooks in callbacks
  const randomX1 = useMotionValue(0);
  const randomX2 = useMotionValue(0);
  const randomX = [randomX1, randomX2];
  
  const randomY1 = useMotionValue(0);
  const randomY2 = useMotionValue(0);
  const randomY = [randomY1, randomY2];
  
  // Transform the motion values to create larger movements - individually to avoid hooks in callbacks
  const x1 = useTransform(randomX1, [-1, 1], [-15, 15]);
  const x2 = useTransform(randomX2, [-1, 1], [-15, 15]);
  const x = [x1, x2];
  
  const y1 = useTransform(randomY1, [-1, 1], [-15, 15]);
  const y2 = useTransform(randomY2, [-1, 1], [-15, 15]);
  const y = [y1, y2];
  
  // Animation configurations for blobs
  const blobAnimations = [
    {
      x: [0, 20, -20, 10, 0],
      y: [0, -30, 10, -20, 0],
      scale: [1, 1.1, 0.9, 1.05, 1],
      rotate: [0, 10, -10, 5, 0],
      duration: 25
    },
    {
      x: [0, -30, 20, -10, 0],
      y: [0, 20, -30, 10, 0],
      scale: [1, 0.9, 1.1, 0.95, 1],
      rotate: [0, -10, 15, -5, 0],
      duration: 30
    },
    {
      x: [0, 15, -25, 5, 0],
      y: [0, -15, -5, 25, 0],
      scale: [1, 1.05, 0.95, 1.1, 1],
      rotate: [0, 5, -15, 10, 0],
      duration: 35
    },
    {
      x: [0, -10, 30, -15, 0],
      y: [0, 25, 5, -20, 0],
      scale: [1, 0.95, 1.15, 0.9, 1],
      rotate: [0, -5, 10, -15, 0],
      duration: 40
    }
  ];
  
  // Generate shooting stars
  const shootingStars = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 + 15; // 15-60 degrees
      const distance = 100 + Math.random() * 150; // Travel distance
      const duration = 0.8 + Math.random() * 1.2; // Animation duration
      const delay = Math.random() * 15; // Random delay
      const size = 1 + Math.random() * 2; // Star size
      const tailLength = 30 + Math.random() * 70; // Tail length
      
      // Calculate end position based on angle and distance
      const radians = angle * (Math.PI / 180);
      const endX = startX + Math.cos(radians) * distance;
      const endY = startY + Math.sin(radians) * distance;
      
      return {
        id: i,
        startX,
        startY,
        endX,
        endY,
        duration,
        delay,
        size,
        tailLength
      };
    });
  }, []);
  
  // Start animations on component mount
  useEffect(() => {
    // Animate each blob with its configuration
    blobAnimations.forEach((animation, index) => {
      blobControls[index].start({
        ...animation,
        transition: { 
          duration: animation.duration, 
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror"
        }
      });
    });
    
    // Add subtle random movement for more organic feel
    const interval = setInterval(() => {
      randomX.forEach(val => val.set(Math.random() * 2 - 1));
      randomY.forEach(val => val.set(Math.random() * 2 - 1));
    }, 2000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <BackgroundContainer>
      {/* Deep purple blob */}
      <PurpleBlob
        animate={blobControls[0]}
        style={{ 
          x: x[0], 
          y: y[0]
        }}
      />
      
      {/* Electric blue blob */}
      <BlueBlob
        animate={blobControls[1]}
        style={{ 
          x: x[1], 
          y: y[1]
        }}
      />
      
      {/* Cyan accent blob */}
      <CyanBlob
        animate={blobControls[2]}
      />
      
      {/* Magenta accent blob */}
      <MagentaBlob
        animate={blobControls[3]}
      />
      
      {/* Aurora effect */}
      <Aurora 
        animate={{
          scaleY: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.4, 0.5, 0.3, 0.45, 0.4],
          filter: [
            'blur(40px)',
            'blur(45px)',
            'blur(35px)',
            'blur(42px)',
            'blur(40px)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      
      {/* Shooting stars */}
      {shootingStars.map(star => (
        <ShootingStar
          key={star.id}
          initial={{ 
            x: `${star.startX}vw`, 
            y: `${star.startY}vh`,
            opacity: 0,
            scale: 0,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
          animate={{
            x: [`${star.startX}vw`, `${star.endX}vw`],
            y: [`${star.startY}vh`, `${star.endY}vh`],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 15 + Math.random() * 20,
            times: [0, 0.1, 0.9, 1]
          }}
          style={{
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            zIndex: 3
          }}
        />
      ))}
      
      {/* Noise texture overlay for grain effect */}
      <NoiseOverlay />
    </BackgroundContainer>
  );
};

export default FluidBackground;