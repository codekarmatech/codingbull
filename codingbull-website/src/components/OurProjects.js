import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { slideInLeft, slideInRight, staggerContainer, fadeIn, slideUp } from '../animations/variants'; // Removed hoverScale
import Button from './Button';
import apiService from '../services/api';

// Projects section container
const ProjectsContainer = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  position: relative;
  overflow: hidden;
`;

// Content wrapper
const ProjectsContent = styled.div`
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

// Project showcase
const ProjectShowcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Project item
const ProjectItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: ${props => props.$reverse ? 'column-reverse' : 'column'};
    gap: 2rem;
  }
`;

// Project image
const ProjectImage = styled(motion.div)`
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

// Project content
const ProjectContentWrapper = styled(motion.div)` // Renamed to avoid conflict if ProjectContent was already a motion component
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Challenge and solution section
const MotionChallengeSection = styled(motion.div)` // Made motion component
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
const MotionTechUsedTag = styled(motion.div)` // Made motion component
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
const MotionClientQuote = styled(motion.blockquote)` // Made motion component
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

// Project category
const MotionProjectCategory = styled(motion.span)` // Made motion component
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

// Project title
const MotionProjectTitle = styled(motion.h3)` // Made motion component
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 0.5rem;
`;

// Project description
const MotionProjectDescription = styled(motion.p)` // Made motion component
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

// Project navigation
const ProjectNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

// Nav dot
const MotionNavDot = styled(motion.button)` // Made motion component
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

const OurProjects = () => {
  // State for current project and data
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.projects.getProjects();
        if (response && response.results && Array.isArray(response.results)) {
          // Transform API data to match component expectations
          const transformedProjects = response.results.map(project => ({
            id: project.id,
            title: project.title,
            client: project.client_name,
            logo: project.image, // Use project image for project display
            category: project.category,
            challenge: project.challenge,
            solution: project.solution,
            outcome: project.outcome,
            techUsed: Array.isArray(project.technologies) 
              ? project.technologies.map(tech => tech.name || tech).join(', ')
              : (typeof project.technologies === 'string' ? project.technologies : 'Various technologies'),
            testimonial: project.testimonial || {
              quote: "Great project experience with CodingBull team.",
              author: "Client",
              title: "Position",
              company: project.client_name,
              image: project.logo // Use client logo for testimonial
            }
          }));
          setProjects(transformedProjects);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        // Fallback to mock data (no hardcoded image paths)
        setProjects([
          {
            id: 'fallback-1',
            title: "E-commerce Platform",
            client: "Client Company",
            logo: null, // No hardcoded paths - will use fallback image component
            category: 'E-commerce',
            challenge: "Client needed to modernize their brand with an online ordering system to reach new customers.",
            solution: "Built on Django, React, Tailwind CSS, and Docker for rapid, reliable deployments.",
            outcome: "Launched in 4 weeks; online orders rose by 30% within the first month.",
            techUsed: 'Django, React, Tailwind CSS, Docker',
            testimonial: {
              quote: "Working with this development team was a game-changer. They delivered our platform on time and exceeded expectations.",
              author: "Business Owner",
              title: "Managing Director",
              company: "Client Company",
              image: null // No hardcoded paths
            }
          },
          {
            id: 'fallback-2',
            title: "Enterprise Management System",
            client: "Healthcare Client",
            logo: null, // No hardcoded paths
            category: 'Healthcare Tech',
            challenge: "Client required a secure, enterprise-grade application to manage operations across multiple locations.",
            solution: "Developed with Django REST Framework, React, and integrated security features for compliance.",
            outcome: "Deployed in 8 weeks; operational efficiency improved by 40%, and satisfaction scores rose 15%.",
            techUsed: 'Django, React, PostgreSQL, Docker',
            testimonial: {
              quote: "The enterprise system transformed our workflow. The solution is robust, user-friendly, and fully compliant.",
              author: "Technical Director",
              title: "Founder & CEO",
              company: "Healthcare Client",
              image: null // No hardcoded paths
            }
          },
          {
            id: 'fallback-3',
            title: "Analytics Dashboard",
            client: "Enterprise Client",
            logo: null, // No hardcoded paths
            category: 'Enterprise Solution',
            challenge: "Client needed real-time tracking and analytics for their distributed teams.",
            solution: "Built a custom dashboard using modern technologies for live reporting and analytics.",
            outcome: "Saved over 20 hours of manual work per month and reduced errors by 90%.",
            techUsed: 'Flask, MongoDB, Chart.js, Docker',
            testimonial: {
              quote: "Our custom dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours.",
              author: "Operations Manager",
              title: "CEO",
              company: "Enterprise Client",
              image: null // No hardcoded paths
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Get current project
  const currentProject = projects[currentIndex];
  
  // Handle navigation
  const handleNavClick = (index) => {
    setCurrentIndex(index);
  };
  
  // Show loading state
  if (loading) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
              Loading projects...
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
              {error}
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  // Show empty state
  if (!projects.length) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
              No projects available at the moment.
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer id="our-projects">
      <ProjectsContent>
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
        
        <ProjectShowcase>
          <AnimatePresence mode="wait">
            <ProjectItem 
              key={currentProject.id}
              $reverse={currentIndex % 2 !== 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectImage
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
                    src={currentProject.logo} 
                    alt={`${currentProject.client} logo`} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
              </ProjectImage>
              
              <ProjectContentWrapper
                variants={staggerContainer} // Apply staggerContainer here
                initial="hidden" // Initial for stagger is hidden
                animate="visible" // Animate to visible when parent (ProjectItem) is in view or animates
                // We will apply whileInView to ProjectItem if needed, for now, this animates with ProjectItem
              >
                <MotionProjectCategory variants={fadeIn}>{currentProject.category}</MotionProjectCategory>
                <MotionProjectTitle variants={fadeIn}>{currentProject.title}</MotionProjectTitle>
                <MotionProjectDescription variants={fadeIn}>Client: {currentProject.client}</MotionProjectDescription>
                
                <MotionChallengeSection variants={slideUp}>
                  <h4>Challenge</h4>
                  <p>{currentProject.challenge}</p>
                </MotionChallengeSection>
                
                <MotionChallengeSection variants={slideUp}>
                  <h4>Solution</h4>
                  <p>{currentProject.solution}</p>
                </MotionChallengeSection>
                
                <MotionChallengeSection variants={slideUp}>
                  <h4>Outcome</h4>
                  <p>{currentProject.outcome}</p>
                </MotionChallengeSection>
                
                <MotionTechUsedTag variants={fadeIn}>
                  <strong>Tech Used:</strong> {currentProject.techUsed}
                </MotionTechUsedTag>
                
                <MotionClientQuote variants={fadeIn}>
                  {currentProject.testimonial.quote}
                  <div style={{ marginTop: '1rem', textAlign: 'right', fontStyle: 'normal' }}>
                    — {currentProject.testimonial.author}, {currentProject.testimonial.title}, {currentProject.testimonial.company}
                  </div>
                </MotionClientQuote>
                
                <motion.div variants={fadeIn}> {/* Wrapper for the Link/Button to be part of stagger */}
                  <Link to={`/our-projects?id=${currentProject.id}`}>
                    <Button variant="primary">View Project Details</Button>
                  </Link>
                </motion.div>
              </ProjectContentWrapper>
            </ProjectItem>
          </AnimatePresence>
        </ProjectShowcase>
        
        <ProjectNav>
          {projects.map((project, index) => (
            <MotionNavDot
              key={project.id}
              $active={index === currentIndex}
              onClick={() => handleNavClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </ProjectNav>
        
        <motion.div // Animate the CTA section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '0.5rem'
          }}
        >
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
            Get in Touch
          </Button>
        </motion.div>
      </ProjectsContent>
    </ProjectsContainer>
  );
};

export default OurProjects;