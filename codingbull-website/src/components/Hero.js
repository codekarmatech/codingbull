import React, { useEffect } from 'react';
import { useAnimation, useMotionValue } from 'framer-motion';
import { staggerContainer } from '../animations/variants';
import HeroContainer from './hero/HeroContainer';
import HeroTextContent from './hero/HeroTextContent';
import HeroVisual from './hero/HeroVisual';
import { HeroContent } from './hero/HeroStyles';





const Hero = () => {
  // Animation controls for sequential animations
  const controls = useAnimation();

  // Mouse position for interactive elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
      <HeroContent
        className="hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <HeroTextContent />
        <HeroVisual />
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
