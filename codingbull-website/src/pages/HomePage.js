import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import OurProjects from '../components/OurProjects';
import TechStack from '../components/TechStack';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { pageTransition } from '../animations/variants';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
`;

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="CodingBull delivers cutting-edge web and mobile solutions using React, Python, Django, and Three.js. Transform your digital presence with our expert development team."
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
        <TechStack />
        <OurProjects />
        <Testimonials />
        <Footer />
      </PageContainer>
    </>
  );
};

export default HomePage;