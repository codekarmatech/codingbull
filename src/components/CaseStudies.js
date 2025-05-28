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
    flex-direction: ${props => props.$reverse ? 'column-reverse' : 'column'};
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

// Challenge and solution section
const ChallengeSection = styled.div`
  margin-top: 1rem;
  
  h4 {
    font-size: ${props => props.theme.fontSizes.md};
    color: ${props => props.theme.colors.electricBlue};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

// Tech used tag
const TechUsedTag = styled.div`
  display: inline-block;
  background: rgba(106, 13, 173, 0.2);
  border: 1px solid rgba(106, 13, 173, 0.5);
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
`;

// Client quote
const ClientQuote = styled.blockquote`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid ${props => props.theme.colors.electricBlue};
  font-style: italic;
  color: ${props => props.theme.colors.textSecondary};
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 0;
    left: 0.5rem;
    font-size: 3rem;
    color: rgba(0, 191, 255, 0.2);
    line-height: 1;
  }
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

// Custom shouldForwardProp function to filter out non-DOM props
const shouldForwardProp = prop => prop !== 'active';

// Nav dot
const NavDot = styled.button.withConfig({
  shouldForwardProp
})`
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
      title: 'Gujju-Masla E-commerce Platform',
      category: 'E-commerce',
      description: 'Designed and developed a complete e-commerce solution for Gujju-Masla, transforming their traditional business into a digital marketplace with online ordering, inventory management, and analytics.',
      image: 'https://placehold.co/800x600',
      challenge: 'Legacy processes, manual inventory tracking, and no online presence',
      solution: 'Built with React, Node.js, MongoDB, and integrated payment gateways',
      techUsed: 'React, Node.js, Express, MongoDB, Stripe',
      stats: [
        { value: '45%', label: 'Revenue Increase' },
        { value: '24/7', label: 'Online Availability' },
        { value: '30%', label: 'Operational Efficiency' }
      ],
      clientQuote: "CodingBull transformed our traditional business model with a powerful online platform that's easy to manage and has significantly increased our customer reach."
    },
    {
      id: 2,
      title: 'Physioway Healthcare Platform',
      category: 'Healthcare Tech',
      description: 'Developed a comprehensive platform for Physioway that streamlines patient management, appointment scheduling, treatment tracking, and billing for physiotherapy practices.',
      image: 'https://placehold.co/800x600',
      challenge: 'Fragmented patient data, inefficient scheduling, and manual billing processes',
      solution: 'Enterprise-grade platform with secure patient portal and practitioner dashboard',
      techUsed: 'Django, React, PostgreSQL, Docker',
      stats: [
        { value: '40%', label: 'Reduced Admin Time' },
        { value: '35%', label: 'Increased Appointments' },
        { value: '98%', label: 'Patient Satisfaction' }
      ],
      clientQuote: "The platform Pranshu built has revolutionized how we manage our practice. The efficiency gains and improved patient experience have been remarkable."
    },
    {
      id: 3,
      title: 'Harsh Patel Attendance System',
      category: 'Enterprise Solution',
      description: 'Created a custom attendance and analytics system for Harsh Patel that automates employee tracking, generates reports, and provides real-time insights into workforce management.',
      image: 'https://placehold.co/800x600',
      challenge: 'Manual attendance tracking, reporting delays, and lack of analytical insights',
      solution: 'Dashboard & analytics platform with automated reporting and visualization',
      techUsed: 'React, Node.js, MongoDB, Chart.js',
      stats: [
        { value: '60%', label: 'Reduced Reporting Time' },
        { value: '25%', label: 'Improved Compliance' },
        { value: '15hrs+', label: 'Weekly Time Saved' }
      ],
      clientQuote: "The attendance system has given us unprecedented visibility into our operations and saved countless hours of administrative work. It's been a game-changer."
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
              $reverse={currentIndex % 2 !== 0}
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
                
                <ChallengeSection>
                  <h4>Challenge</h4>
                  <p>{currentCaseStudy.challenge}</p>
                </ChallengeSection>
                
                <ChallengeSection>
                  <h4>Solution</h4>
                  <p>{currentCaseStudy.solution}</p>
                </ChallengeSection>
                
                <TechUsedTag>
                  <strong>Tech Used:</strong> {currentCaseStudy.techUsed}
                </TechUsedTag>
                
                <CaseStudyStats>
                  {currentCaseStudy.stats.map((stat, index) => (
                    <Stat key={index}>
                      <h4>{stat.value}</h4>
                      <p>{stat.label}</p>
                    </Stat>
                  ))}
                </CaseStudyStats>
                
                <ClientQuote>
                  {currentCaseStudy.clientQuote}
                </ClientQuote>
                
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