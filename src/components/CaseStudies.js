import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInLeft, slideInRight } from '../animations/variants';
import Button from './Button';

// Case studies section container
const CaseStudiesContainer = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  position: relative;
  overflow: hidden;
`;

// Content wrapper
const CaseStudiesContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Section header
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

// Section title
const SectionTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${props => props.theme.colors.electricBlue};
  }
`;

// Section description
const SectionDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
`;

// Case study showcase
const CaseStudyShowcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Case study item
const CaseStudyItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: ${props => props.reverse ? 'column-reverse' : 'column'};
    gap: 2rem;
  }
`;

// Case study image
const CaseStudyImage = styled(motion.div)`
  flex: 1;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  height: 400px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  // Overlay gradient
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 18, 0.2),
      rgba(18, 18, 18, 0.5)
    );
  }
`;

// Case study content
const CaseStudyContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Case study category
const CaseStudyCategory = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.deepPurple};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

// Case study title
const CaseStudyTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 0.5rem;
`;

// Case study description
const CaseStudyDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

// Case study stats
const CaseStudyStats = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

// Individual stat
const Stat = styled.div`
  h4 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    color: ${props => props.theme.colors.electricBlue};
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
  }
`;

// Case study navigation
const CaseStudyNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

// Nav dot
const NavDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active 
    ? props.theme.colors.electricBlue 
    : props.theme.colors.lightGrey};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active 
      ? props.theme.colors.electricBlue 
      : props.theme.colors.deepPurple};
  }
`;

const CaseStudies = () => {
  // State for current case study
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Case studies data
  const caseStudies = [
    {
      id: 1,
      title: 'E-commerce Platform Transformation',
      category: 'Digital Transformation',
      description: 'Redesigned and rebuilt a legacy e-commerce platform for a global retail brand, resulting in a 45% increase in conversion rates and a 30% reduction in cart abandonment.',
      image: 'https://via.placeholder.com/800x600',
      stats: [
        { value: '45%', label: 'Conversion Increase' },
        { value: '30%', label: 'Reduced Abandonment' },
        { value: '3x', label: 'Faster Load Time' }
      ]
    },
    {
      id: 2,
      title: 'AI-Powered Healthcare Solution',
      category: 'Healthcare Tech',
      description: 'Developed an AI-driven diagnostic tool for a leading healthcare provider that improved diagnostic accuracy by 28% and reduced patient wait times by 40%.',
      image: 'https://via.placeholder.com/800x600',
      stats: [
        { value: '28%', label: 'Improved Accuracy' },
        { value: '40%', label: 'Reduced Wait Times' },
        { value: '15K+', label: 'Patients Served' }
      ]
    },
    {
      id: 3,
      title: 'FinTech Mobile App',
      category: 'Financial Technology',
      description: 'Created a secure, user-friendly mobile banking application that increased customer engagement by 60% and processed over $500M in transactions within the first year.',
      image: 'https://via.placeholder.com/800x600',
      stats: [
        { value: '60%', label: 'Increased Engagement' },
        { value: '$500M+', label: 'Transactions Processed' },
        { value: '4.8/5', label: 'App Store Rating' }
      ]
    }
  ];
  
  // Get current case study
  const currentCaseStudy = caseStudies[currentIndex];
  
  // Handle navigation
  const handleNavClick = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <CaseStudiesContainer id="case-studies">
      <CaseStudiesContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Case Studies
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore how we've helped businesses across industries achieve their digital transformation goals with innovative solutions.
          </SectionDescription>
        </SectionHeader>
        
        <CaseStudyShowcase>
          <AnimatePresence mode="wait">
            <CaseStudyItem 
              key={currentCaseStudy.id}
              reverse={currentIndex % 2 !== 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CaseStudyImage
                variants={currentIndex % 2 === 0 ? slideInLeft : slideInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Placeholder for case study image */}
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: `linear-gradient(45deg, #121212, #2D2D2D)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#757575',
                  fontSize: '1.5rem'
                }}>
                  {currentCaseStudy.title} Image
                </div>
              </CaseStudyImage>
              
              <CaseStudyContent
                variants={currentIndex % 2 !== 0 ? slideInLeft : slideInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <CaseStudyCategory>{currentCaseStudy.category}</CaseStudyCategory>
                <CaseStudyTitle>{currentCaseStudy.title}</CaseStudyTitle>
                <CaseStudyDescription>{currentCaseStudy.description}</CaseStudyDescription>
                
                <CaseStudyStats>
                  {currentCaseStudy.stats.map((stat, index) => (
                    <Stat key={index}>
                      <h4>{stat.value}</h4>
                      <p>{stat.label}</p>
                    </Stat>
                  ))}
                </CaseStudyStats>
                
                <Button variant="primary">View Full Case Study</Button>
              </CaseStudyContent>
            </CaseStudyItem>
          </AnimatePresence>
        </CaseStudyShowcase>
        
        <CaseStudyNav>
          {caseStudies.map((study, index) => (
            <NavDot 
              key={study.id}
              active={index === currentIndex}
              onClick={() => handleNavClick(index)}
            />
          ))}
        </CaseStudyNav>
      </CaseStudiesContent>
    </CaseStudiesContainer>
  );
};

export default CaseStudies;