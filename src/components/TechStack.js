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
  padding: 12px;
  
  img {
    width: 100%;
    height: 100%;
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
          <VisualizationTitle>Our Integrated Technology Ecosystem</VisualizationTitle>
          
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            color: '#E0E0E0',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            <p>At CodingBull, we've architected a seamless technology ecosystem where each layer communicates efficiently with others, creating robust, scalable, and maintainable solutions. Our stack isn't just a collection of technologies—it's a carefully orchestrated symphony of tools working in perfect harmony.</p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
            position: 'relative'
          }}>
            {/* Frontend Layer */}
            <div style={{ 
              background: 'linear-gradient(145deg, rgba(0, 191, 255, 0.1), rgba(0, 191, 255, 0.05))',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(0, 191, 255, 0.2)',
              position: 'relative',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '20px', 
                background: '#00BFFF', 
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                CLIENT LAYER
              </div>
              <h4 style={{ color: '#00BFFF', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Frontend Architecture</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚛️</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>React + TypeScript</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Component-based UI architecture with type safety</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔄</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Redux Toolkit + RTK Query</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Centralized state management with optimized API requests</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🎨</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Tailwind CSS + Framer Motion</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Utility-first styling with fluid animations</p>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <p style={{ color: '#E0E0E0', fontStyle: 'italic' }}>
                  "Our frontend architecture prioritizes component reusability, type safety, and performance optimization through code splitting and lazy loading."
                </p>
              </div>
            </div>
            
            {/* Backend Layer */}
            <div style={{ 
              background: 'linear-gradient(145deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              position: 'relative',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '20px', 
                background: '#9C27B0', 
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                SERVICE LAYER
              </div>
              <h4 style={{ color: '#9C27B0', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Backend Infrastructure</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🐍</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Django + DRF</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Robust ORM with RESTful API capabilities</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>�</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Node.js + Express</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Event-driven architecture for real-time applications</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔐</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>JWT + OAuth2</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Secure authentication and authorization flows</p>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <p style={{ color: '#E0E0E0', fontStyle: 'italic' }}>
                  "Our microservices architecture enables independent scaling and deployment, with comprehensive API documentation via Swagger/OpenAPI."
                </p>
              </div>
            </div>
            
            {/* Data Layer */}
            <div style={{ 
              background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              position: 'relative',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '20px', 
                background: '#4CAF50', 
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                DATA LAYER
              </div>
              <h4 style={{ color: '#4CAF50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Data Management</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🐘</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>PostgreSQL + TimescaleDB</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Relational data with time-series capabilities</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🍃</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>MongoDB + Mongoose</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Document-oriented storage with schema validation</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔴</span>
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Redis + Elasticsearch</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Caching and full-text search capabilities</p>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <p style={{ color: '#E0E0E0', fontStyle: 'italic' }}>
                  "Our polyglot persistence approach selects the optimal database technology for each specific data access pattern and requirement."
                </p>
              </div>
            </div>
          </div>
          
          {/* DevOps & Infrastructure */}
          <div style={{ 
            marginTop: '3.5rem', 
            background: 'linear-gradient(145deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            position: 'relative',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-15px', 
              left: '20px', 
              background: '#FF9800', 
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              INFRASTRUCTURE LAYER
            </div>
            
            <h4 style={{ color: '#FF9800', marginBottom: '1.5rem', fontSize: '1.3rem' }}>DevOps & Cloud Infrastructure</h4>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1.2rem', 
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>🐳</div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>Containerization</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Docker + Docker Compose for consistent environments across development and production</p>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1.2rem', 
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>⚙️</div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>CI/CD Pipeline</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>GitHub Actions + Jenkins for automated testing, building, and deployment workflows</p>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1.2rem', 
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>☁️</div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>Cloud Services</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>AWS/Azure with Infrastructure as Code (Terraform) for scalable and reproducible environments</p>
              </div>
              
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                padding: '1.2rem', 
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>�</div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>Monitoring & Logging</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Prometheus + Grafana for metrics and ELK Stack for centralized logging and analysis</p>
              </div>
            </div>
          </div>
          
          {/* Integration Diagram */}
          <div style={{ 
            marginTop: '3.5rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
          }}>
            <h4 style={{ color: '#E0E0E0', marginBottom: '1.5rem' }}>Full-Stack Integration</h4>
            <p style={{ color: '#AAAAAA', marginBottom: '2rem' }}>Our technology stack is designed for seamless data flow and communication between all layers</p>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ color: '#00BFFF', fontWeight: 'bold' }}>Client Layer (React, Redux)</div>
              <div style={{ fontSize: '1.5rem' }}>↕️</div>
              <div style={{ color: '#9C27B0', fontWeight: 'bold' }}>Service Layer (Django, Node.js)</div>
              <div style={{ fontSize: '1.5rem' }}>↕️</div>
              <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>Data Layer (PostgreSQL, MongoDB)</div>
            </div>
            
            <div style={{ 
              position: 'relative',
              marginTop: '2rem',
              padding: '1rem',
              border: '1px dashed rgba(255, 152, 0, 0.5)',
              borderRadius: '8px'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#121212',
                padding: '0 10px',
                color: '#FF9800'
              }}>
                Supported By
              </div>
              <div style={{ color: '#FF9800', fontWeight: 'bold' }}>Infrastructure Layer (Docker, CI/CD, Cloud Services)</div>
            </div>
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