import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import SEO from '../components/SEO';
import LoadingFallback from '../components/LoadingFallback';
import { pageTransition } from '../animations/variants';

// Lazy load components that are below the fold
const OurProjects = lazy(() => import('../components/OurProjects'));
const TechStack = lazy(() => import('../components/TechStack'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Footer = lazy(() => import('../components/Footer'));

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
`;

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="CodingBull delivers cutting-edge website and mobile solutions/development services for businesses of all sizes.
         We specialize in creating responsive websites, mobile apps, and web applications
        using React, Python, Django, and Three.js. Transform your digital presence with our expert development team."
        canonical="/"
      />
      <PageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Hero />
        <Services />
        <Suspense fallback={<LoadingFallback isSection={true} text="Loading content..." />}>
          <TechStack />
          <OurProjects />
          <Testimonials />
          <Footer />
        </Suspense>
      </PageContainer>
    </>
  );
};

export default HomePage;