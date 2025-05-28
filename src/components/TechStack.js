import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer } from '../animations/variants';

// TechStack section container
const TechStackContainer = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(0,191,255,0.5) 50%, 
      rgba(255,255,255,0) 100%);
  }
`;

// Content wrapper
const TechStackContent = styled.div`
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

// Tech stack grid
const TechGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1.5rem;
  }
`;

// Tech item
const TechItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  cursor: pointer;
`;

// Tech icon
const TechIcon = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.mediumGrey};
  transition: all 0.3s ease;
  
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
  
  ${TechItem}:hover & {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
    background: ${props => props.theme.colors.deepGrey};
  }
`;

// Tech name
const TechName = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
`;

// Tech tooltip
const TechTooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.deepGrey};
  color: ${props => props.theme.colors.textPrimary};
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.lg};
  pointer-events: none;
  z-index: 10;
  margin-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: ${props => props.theme.colors.deepGrey} transparent transparent transparent;
  }
`;

// Tech categories
const TechCategories = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

// Category button
const CategoryButton = styled.button`
  background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.mediumGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.deepGrey};
  }
`;

// Tech stack visualization
const TechVisualization = styled(motion.div)`
  margin-top: 5rem;
  padding: 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
`;

// Visualization title
const VisualizationTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 2rem;
  text-align: center;
`;

// Roadmap section
const RoadmapSection = styled(motion.div)`
  margin-top: 5rem;
  padding: 2rem;
  background: ${props => props.theme.colors.gradientOverlay};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgba(106, 13, 173, 0.3);
`;

// Roadmap title
const RoadmapTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.electricBlue};
`;

// Roadmap description
const RoadmapDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const TechStack = () => {
  // Tech stack data
  const techStack = [
    // Frontend
    { name: 'HTML5', category: 'frontend', icon: '🌐', useCase: 'Semantic markup for all web projects' },
    { name: 'CSS3', category: 'frontend', icon: '🎨', useCase: 'Styling and animations' },
    { name: 'JavaScript', category: 'frontend', icon: 'JS', useCase: 'Core language for interactive web apps' },
    { name: 'TypeScript', category: 'frontend', icon: 'TS', useCase: 'Type-safe code for enterprise projects' },
    { name: 'React', category: 'frontend', icon: '⚛️', useCase: 'UI library for interactive interfaces' },
    { name: 'Redux Toolkit', category: 'frontend', icon: '🔄', useCase: 'State management for complex apps' },
    { name: 'Tailwind CSS', category: 'frontend', icon: '🌊', useCase: 'Utility-first CSS framework' },
    
    // Backend
    { name: 'Python', category: 'backend', icon: '🐍', useCase: 'Backend development and data processing' },
    { name: 'Django', category: 'backend', icon: '🎸', useCase: 'Full-featured web framework with ORM' },
    { name: 'Flask', category: 'backend', icon: '🧪', useCase: 'Lightweight API development' },
    { name: 'Node.js', category: 'backend', icon: '📦', useCase: 'JavaScript runtime for backend services' },
    { name: 'Express', category: 'backend', icon: '🚂', useCase: 'Web framework for Node.js' },
    
    // Database
    { name: 'MongoDB', category: 'database', icon: '🍃', useCase: 'NoSQL database for flexible schemas' },
    { name: 'PostgreSQL', category: 'database', icon: '🐘', useCase: 'Relational database for complex data' },
    { name: 'Redis', category: 'database', icon: '🔴', useCase: 'In-memory data store and caching' },
    
    // DevOps
    { name: 'Docker', category: 'devops', icon: '🐳', useCase: 'Containerization for consistent environments' },
    { name: 'GitHub Actions', category: 'devops', icon: '🔄', useCase: 'CI/CD automation' },
    { name: 'AWS', category: 'devops', icon: '☁️', useCase: 'Cloud infrastructure and services' },
    { name: 'Azure', category: 'devops', icon: '☁️', useCase: 'Microsoft cloud platform' },
    
    // 3D & Visualization
    { name: 'Three.js', category: '3d', icon: '🧊', useCase: '3D graphics in the browser' },
    { name: 'WebGL', category: '3d', icon: '🎮', useCase: 'Low-level 3D rendering' },
    { name: 'React Three Fiber', category: '3d', icon: '⚛️', useCase: 'React renderer for Three.js' }
  ];
  
  // Categories
  const categories = [
    { id: 'all', name: 'All Technologies' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    { id: 'devops', name: 'DevOps' },
    { id: '3d', name: '3D & Visualization' }
  ];
  
  // State for active category and tooltip
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [activeTooltip, setActiveTooltip] = React.useState(null);
  
  // Filter tech stack by category
  const filteredTechStack = activeCategory === 'all' 
    ? techStack 
    : techStack.filter(tech => tech.category === activeCategory);
  
  return (
    <TechStackContainer id="tech-stack">
      <TechStackContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Technology Stack
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We leverage cutting-edge technologies to build scalable, performant, and maintainable solutions for our clients.
          </SectionDescription>
        </SectionHeader>
        
        <TechCategories>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              $active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </TechCategories>
        
        <TechGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredTechStack.map((tech, index) => (
            <TechItem
              key={`${tech.name}-${index}`}
              variants={fadeIn}
              custom={index * 0.05}
              onMouseEnter={() => setActiveTooltip(tech.name)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <TechIcon>
                <span style={{ fontSize: '24px' }}>{tech.icon}</span>
              </TechIcon>
              <TechName>{tech.name}</TechName>
              
              {activeTooltip === tech.name && (
                <TechTooltip
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {tech.useCase}
                </TechTooltip>
              )}
            </TechItem>
          ))}
        </TechGrid>
        
        <TechVisualization
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <VisualizationTitle>How Our Tech Stack Interconnects</VisualizationTitle>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <h4 style={{ color: '#00BFFF', marginBottom: '1rem' }}>Frontend</h4>
              <p style={{ color: '#E0E0E0' }}>React, Redux, Tailwind CSS</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0' }}>⚛️</div>
              <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>User interfaces & experiences</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#AAAAAA',
              margin: '0 1rem'
            }}>
              ⟷
            </div>
            
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <h4 style={{ color: '#9C27B0', marginBottom: '1rem' }}>Backend</h4>
              <p style={{ color: '#E0E0E0' }}>Django, Node.js, Express</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0' }}>🔧</div>
              <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>APIs & business logic</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#AAAAAA',
              margin: '0 1rem'
            }}>
              ⟷
            </div>
            
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <h4 style={{ color: '#4CAF50', marginBottom: '1rem' }}>Database</h4>
              <p style={{ color: '#E0E0E0' }}>MongoDB, PostgreSQL</p>
              <div style={{ fontSize: '2rem', margin: '1rem 0' }}>💾</div>
              <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>Data storage & retrieval</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '3rem', 
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#FF9800', marginBottom: '1rem' }}>DevOps & Deployment</h4>
            <p style={{ color: '#E0E0E0' }}>Docker, GitHub Actions, AWS/Azure</p>
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>🚀</div>
            <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>Continuous integration, delivery & cloud infrastructure</p>
          </div>
        </TechVisualization>
        
        <RoadmapSection
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <RoadmapTitle>Technology Roadmap</RoadmapTitle>
          <RoadmapDescription>
            We're constantly exploring new technologies to enhance our capabilities and deliver even better solutions for our clients.
          </RoadmapDescription>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ 
              flex: '1 1 300px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#00BFFF', marginBottom: '0.5rem' }}>Q3 2025</h4>
              <p style={{ color: '#E0E0E0' }}>Exploring Kubernetes for container orchestration</p>
            </div>
            <div style={{ 
              flex: '1 1 300px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#00BFFF', marginBottom: '0.5rem' }}>Q4 2025</h4>
              <p style={{ color: '#E0E0E0' }}>Implementing GraphQL for more efficient API queries</p>
            </div>
          </div>
        </RoadmapSection>
      </TechStackContent>
    </TechStackContainer>
  );
};

export default TechStack;