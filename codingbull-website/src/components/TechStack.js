import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  transition: all 0.3s ease;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  span {
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  ${TechItem}:hover & {
    transform: translateY(-5px);
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
    { name: 'HTML5', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" />, useCase: 'Semantic markup for all web projects' },
    { name: 'CSS3', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" />, useCase: 'Styling and animations' },
    { name: 'JavaScript', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />, useCase: 'Core language for interactive web apps' },
    { name: 'TypeScript', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" />, useCase: 'Type-safe code for enterprise projects' },
    { name: 'React', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />, useCase: 'UI library for interactive interfaces' },
    { name: 'Redux Toolkit', category: 'frontend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt="Redux" style={{filter: "brightness(0) invert(1)"}} />, useCase: 'State management for complex apps' },
    { name: 'Tailwind CSS', category: 'frontend', icon: <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind CSS" style={{ width: 48, height: 48, background: '#fff', borderRadius: '8px', padding: 6, border: '1px solid #e0e0e0', boxSizing: 'border-box' }} />, useCase: 'Utility-first CSS framework' },

    // Backend
    { name: 'Python', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />, useCase: 'Backend development and data processing' },
    { name: 'Django', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="Django" />, useCase: 'Full-featured web framework with ORM' },
    { name: 'Flask', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original-wordmark.svg" alt="Flask" style={{filter: "brightness(0) invert(1)"}} />, useCase: 'Lightweight API development' },
    { name: 'Node.js', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />, useCase: 'JavaScript runtime for backend services' },
    { name: 'Express', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" style={{filter: "brightness(0) invert(1)"}} />, useCase: 'Web framework for Node.js' },

    // Database
    { name: 'MongoDB', category: 'database', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" />, useCase: 'NoSQL database for flexible schemas' },
    { name: 'PostgreSQL', category: 'database', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" />, useCase: 'Relational database for complex data' },
    { name: 'Redis', category: 'database', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" />, useCase: 'In-memory data store and caching' },

    // DevOps
    { name: 'Docker', category: 'devops', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" />, useCase: 'Containerization for consistent environments' },
    { name: 'GitHub Actions', category: 'devops', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub Actions" style={{filter: "brightness(0) invert(1)"}} />, useCase: 'CI/CD automation' },
    { name: 'AWS', category: 'devops', icon: <img src="/devicons/amazonwebservices-original.svg" alt="AWS" style={{background: '#fff', borderRadius: '8px', padding: 4}} />, useCase: 'Cloud infrastructure and services' },
    { name: 'Azure', category: 'devops', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" style={{filter: "brightness(0) invert(1)"}} />, useCase: 'Microsoft cloud platform' },

    // 3D & Visualization
    { name: 'Three.js', category: '3d', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" alt="Three.js" style={{background: '#fff', borderRadius: '8px'}} />, useCase: '3D graphics in the browser' },
    { name: 'WebGL', category: '3d', icon: (
      <svg width="48" height="48" viewBox="0 0 512 512" style={{ background: '#fff', borderRadius: '8px', padding: 6, border: '1px solid #e0e0e0', boxSizing: 'border-box' }} xmlns="http://www.w3.org/2000/svg">
        <g>
          <ellipse cx="256" cy="256" rx="246" ry="110" fill="#fff" stroke="#7B1FA2" strokeWidth="20"/>
          <path d="M 70 320 Q 256 420 442 320" fill="none" stroke="#7B1FA2" strokeWidth="20"/>
          <text x="50%" y="60%" textAnchor="middle" fill="#7B1FA2" fontSize="120" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif" dy=".3em">WebGL</text>
        </g>
      </svg>
    ), useCase: 'Low-level 3D rendering' },
    { name: 'React Three Fiber', category: '3d', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Three Fiber" />, useCase: 'React renderer for Three.js' }
  ];

  // Additional technologies to add
  const additionalTech = [
    // AI/ML
    { name: 'TensorFlow', category: 'ai', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" />, useCase: 'Machine learning framework' },
    { name: 'PyTorch', category: 'ai', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" alt="PyTorch" />, useCase: 'Deep learning framework' },
    
    // Mobile
    { name: 'Flutter', category: 'mobile', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" alt="Flutter" />, useCase: 'Cross-platform mobile development' },
    { name: 'Kotlin', category: 'mobile', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" alt="Kotlin" />, useCase: 'Android development' },
    { name: 'Swift', category: 'mobile', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" alt="Swift" />, useCase: 'iOS development' },
    
    // DevOps Expansion
    { name: 'Kubernetes', category: 'devops', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" alt="Kubernetes" />, useCase: 'Container orchestration' },
    { name: 'GCP', category: 'devops', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" alt="Google Cloud" />, useCase: 'Cloud infrastructure' },
    
    // Additional Web
    { name: 'GraphQL', category: 'backend', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" alt="GraphQL" />, useCase: 'API query language' }
  ];

  // Combine original and additional technologies
  const fullTechStack = [...techStack, ...additionalTech];

  // Categories
  const categories = [
    { id: 'all', name: 'All Technologies' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    { id: 'devops', name: 'DevOps' },
    { id: 'ai', name: 'AI/ML' },
    { id: 'mobile', name: 'Mobile' },
    { id: '3d', name: '3D & Visualization' }
  ];

  // State for active category and tooltip
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [activeTooltip, setActiveTooltip] = React.useState(null);

  // Filter tech stack by category
  const filteredTechStack = activeCategory === 'all'
    ? fullTechStack
    : fullTechStack.filter(tech => tech.category === activeCategory);

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

        <AnimatePresence mode="wait">
          <TechGrid
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredTechStack.map((tech, index) => (
              <TechItem
                key={`${activeCategory}-${tech.name}-${tech.category}`}
                variants={fadeIn}
                custom={index * 0.05}
                onMouseEnter={() => setActiveTooltip(tech.name)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <TechIcon>
                  {typeof tech.icon === 'string' ?
                    <span>{tech.icon}</span> :
                    tech.icon
                  }
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
        </AnimatePresence>

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
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>React + TypeScript</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Component-based UI architecture with type safety</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt="Redux Toolkit" style={{ width: 32, height: 32, marginRight: 10, filter: 'brightness(0) invert(1)' }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="RTK Query" style={{ width: 32, height: 32, marginRight: 10, opacity: 0.5 }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Redux Toolkit + RTK Query</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Centralized state management with optimized API requests</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/devicons/tailwindcss-plain.svg" alt="Tailwind CSS" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="/devicons/framer-original.svg" alt="Framer Motion" style={{ width: 32, height: 32, marginRight: 10 }} />
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
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="Django" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="DRF" style={{ width: 32, height: 32, marginRight: 10, opacity: 0.5 }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Django + DRF</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Robust ORM with RESTful API capabilities</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" style={{ width: 32, height: 32, marginRight: 10, filter: 'brightness(0) invert(1)' }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>Node.js + Express</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Event-driven architecture for real-time applications</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/devicons/jwt-plain.svg" alt="JWT" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oauth/oauth-original.svg" alt="OAuth2" style={{ width: 32, height: 32, marginRight: 10 }} />
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
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="/devicons/timescaledb-original.svg" alt="TimescaleDB" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>PostgreSQL + TimescaleDB</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Relational data with time-series capabilities</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" alt="Mongoose" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <div>
                    <p style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: '2px' }}>MongoDB + Mongoose</p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Document-oriented storage with schema validation</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" style={{ width: 32, height: 32, marginRight: 10 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg" alt="Elasticsearch" style={{ width: 32, height: 32, marginRight: 10 }} />
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
                <div style={{ marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" style={{ width: 32, height: 32 }} />
                </div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>Containerization</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>Docker + Docker Compose for consistent environments across development and production</p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.2rem',
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub Actions" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" alt="Jenkins" style={{ width: 32, height: 32, marginLeft: 8 }} />
                </div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>CI/CD Pipeline</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>GitHub Actions + Jenkins for automated testing, building, and deployment workflows</p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.2rem',
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ marginBottom: '0.8rem' }}>
                  <img src="/devicons/amazonwebservices-original.svg" alt="AWS" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" style={{ width: 32, height: 32, marginLeft: 8, filter: 'brightness(0) invert(1)' }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" alt="Terraform" style={{ width: 32, height: 32, marginLeft: 8 }} />
                </div>
                <h5 style={{ color: '#E0E0E0', marginBottom: '0.5rem' }}>Cloud Services</h5>
                <p style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>AWS/Azure with Infrastructure as Code (Terraform) for scalable and reproducible environments</p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.2rem',
                borderRadius: '8px',
                height: '100%'
              }}>
                <div style={{ marginBottom: '0.8rem' }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" alt="Prometheus" style={{ width: 32, height: 32 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" alt="Grafana" style={{ width: 32, height: 32, marginLeft: 8 }} />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg" alt="ELK Stack" style={{ width: 32, height: 32, marginLeft: 8 }} />
                </div>
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
              marginTop: '2.5rem', // Increased margin for better spacing
              padding: '1.5rem 1rem 1rem', // Increased top padding to prevent text overlap
              border: '1px dashed rgba(255, 152, 0, 0.5)',
              borderRadius: '8px'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#121212',
                padding: '0 12px', // Increased horizontal padding for better text clearance
                color: '#FF9800',
                fontSize: '0.9rem', // Slightly smaller font to prevent overlap on small screens
                whiteSpace: 'nowrap', // Prevent text wrapping
                zIndex: 1 // Ensure text appears above border
              }}>
                Supported By
              </div>
              <div style={{ 
                color: '#FF9800', 
                fontWeight: 'bold',
                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', // Responsive font size to prevent overflow
                textAlign: 'center',
                lineHeight: '1.4' // Better line height for readability
              }}>
                Infrastructure Layer (Docker, CI/CD, Cloud Services)
              </div>
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