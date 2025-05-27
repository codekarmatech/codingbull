import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import CaseStudies from '../components/CaseStudies';
import Footer from '../components/Footer';
import { pageTransition } from '../animations/variants';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
`;

const HomePage = () => {
  return (
    <PageContainer
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Hero />
      <Services />
      <CaseStudies />
      <Footer />
    </PageContainer>
  );
};

export default HomePage;