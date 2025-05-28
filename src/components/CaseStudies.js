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

// Note: CaseStudyStats and Stat components were removed as they're no longer used
// in the current implementation of the case studies display

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
const NavDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? props.theme.colors.electricBlue 
    : props.theme.colors.lightGrey};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active 
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
      title: "Gujju-Masla E-commerce Platform",
      client: "Gujju-Masla",
      logo: "/logos/gujju-masla.png",
      category: 'E-commerce',
      challenge: "Gujju-Masla needed to modernize its 40-year-old brand with an online ordering system to reach new customers.",
      solution: "Built on Django, React, Tailwind CSS, and Docker for rapid, reliable deployments.",
      outcome: "Launched in 4 weeks; online orders rose by 30% within the first month.",
      techUsed: 'Django, React, Tailwind CSS, Docker',
      testimonial: {
        quote: "Hiring CodingBull was a game-changer. The team delivered our e-commerce platform in just 4 weeks, leading to a 30% surge in online orders.",
        author: "Deep Varma",
        title: "Managing Director",
        company: "Gujju-Masla",
        image: "/logos/gujju-masla.png"
      }
    },
    {
      id: 2,
      title: "Physioway Enterprise Physiotherapy System",
      client: "Physioway",
      logo: "/logos/physioway.png",
      category: 'Healthcare Tech',
      challenge: "Physioway required a secure, enterprise-grade application to manage patient assessments and treatment plans across multiple clinics.",
      solution: "Developed with Django REST Framework, React, and integrated audit logs for HIPAA-style compliance.",
      outcome: "Deployed in 8 weeks; clinic efficiency improved by 40%, and patient satisfaction scores rose 15%.",
      techUsed: 'Django, React, PostgreSQL, Docker',
      testimonial: {
        quote: "The enterprise physiotherapy system built by CodingBull transformed our workflow. Their React/Django solution is robust, user-friendly, and fully compliant.",
        author: "Dr. Rajavi Dixit",
        title: "Founder & CEO",
        company: "Physioway",
        image: "/logos/physioway.png"
      }
    },
    {
      id: 3,
      title: "Harsh Patel Attendance Management Dashboard",
      client: "Harsh Patel Enterprises",
      logo: "/logos/harsh-patel.png",
      category: 'Enterprise Solution',
      challenge: "Harsh Patel Enterprises needed real-time attendance tracking and analytics for their distributed teams.",
      solution: "Built a custom dashboard using Flask, MongoDB, and Chart.js for live reporting, containerized with Docker.",
      outcome: "Saved over 20 hours of manual reporting per month and slashed errors by 90%.",
      techUsed: 'Flask, MongoDB, Chart.js, Docker',
      testimonial: {
        quote: "Our custom attendance management dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours every month.",
        author: "Harsh Patel",
        title: "CEO",
        company: "Harsh Patel Enterprises",
        image: "/logos/harsh-patel.png"
      }
    }
  ];
  
  // Get current case study
  const currentCaseStudy = caseStudies[currentIndex];
  
  // Handle navigation
  const handleNavClick = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <CaseStudiesContainer id="our-projects">
      <CaseStudiesContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Projects
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore how the CodingBull team transformed these businesses:
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
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: `linear-gradient(45deg, #121212, #2D2D2D)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem'
                }}>
                  <img 
                    src={currentCaseStudy.logo} 
                    alt={`${currentCaseStudy.client} logo`} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
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
                <CaseStudyDescription>Client: {currentCaseStudy.client}</CaseStudyDescription>
                
                <ChallengeSection>
                  <h4>Challenge</h4>
                  <p>{currentCaseStudy.challenge}</p>
                </ChallengeSection>
                
                <ChallengeSection>
                  <h4>Solution</h4>
                  <p>{currentCaseStudy.solution}</p>
                </ChallengeSection>
                
                <ChallengeSection>
                  <h4>Outcome</h4>
                  <p>{currentCaseStudy.outcome}</p>
                </ChallengeSection>
                
                <TechUsedTag>
                  <strong>Tech Used:</strong> {currentCaseStudy.techUsed}
                </TechUsedTag>
                
                <ClientQuote>
                  {currentCaseStudy.testimonial.quote}
                  <div style={{ marginTop: '1rem', textAlign: 'right', fontStyle: 'normal' }}>
                    — {currentCaseStudy.testimonial.author}, {currentCaseStudy.testimonial.title}, {currentCaseStudy.testimonial.company}
                  </div>
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
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Want results like these? Contact the CodingBull team
          </h3>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => document.getElementById('contact') && document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Discuss Your Project
          </Button>
        </div>
      </CaseStudiesContent>
    </CaseStudiesContainer>
  );
};

export default CaseStudies;