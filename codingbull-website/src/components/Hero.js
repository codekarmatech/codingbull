import { useEffect } from 'react';
import { useAnimation, useMotionValue } from 'framer-motion';
import { staggerContainer } from '../animations/variants';
import HeroContainer from './hero/HeroContainer';
import HeroTextContent from './hero/HeroTextContent';
import HeroVisual from './hero/HeroVisual';
import DevelopmentCycle from './hero/DevelopmentCycle';
import { HeroContent, DevelopmentCycleWrapper } from './hero/HeroStyles';





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
      {/* Full-screen particle system */}
      <HeroVisual />

      <HeroContent
        className="hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <HeroTextContent />
        
        {/* LocalBusiness Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "CodingBull Technovations PVT LTD",
            "image": "https://codingbullz.com/codingbulllogo.png",
            "@id": "https://codingbullz.com",
            "url": "https://codingbullz.com",
            "telephone": "+91 7984891664",
            "priceRange": "$$$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Ghatlodia",
              "addressLocality": "Ahmedabad",
              "postalCode": "380061",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 23.0225,
              "longitude": 72.5714
            },
            "sameAs": [
              "https://linkedin.com/company/codingbull",
              "https://twitter.com/codingbullz"
            ]
          })}
        </script>

        {/* Development cycle positioned in layout */}
        <DevelopmentCycleWrapper>
          <DevelopmentCycle />
        </DevelopmentCycleWrapper>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
