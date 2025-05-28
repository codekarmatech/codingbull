import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants';
import OurProjects from '../components/OurProjects';
import Footer from '../components/Footer';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${props => props.theme.colors.darkGrey};
`;

// Page content
const PageContent = styled.div`
  padding-top: 80px; // Account for fixed navbar
`;

const ProjectsPage = () => {
  return (
    <PageContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageContent>
        <OurProjects />
        <Footer />
      </PageContent>
    </PageContainer>
  );
};

export default ProjectsPage;