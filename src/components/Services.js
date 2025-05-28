import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '../animations/variants';

// Services section container
const ServicesContainer = styled.section`
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
const ServicesContent = styled.div`
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

// Services grid
const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

// Service card
const ServiceCard = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.theme.colors.gradientPrimary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

// Tech stack label
const TechStackLabel = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  h4 {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.electricBlue};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

// Clients label
const ClientsLabel = styled.div`
  margin-top: 0.75rem;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.lightGrey};
  font-style: italic;
`;

// CTA wrapper
const CTAWrapper = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
`;

// Service icon
const ServiceIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
`;

// Service title
const ServiceTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
`;

// Service description
const ServiceDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

// Service features list
const ServiceFeatures = styled.ul`
  list-style: none;
  margin-top: 1.5rem;
`;

// Service feature item
const ServiceFeature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &::before {
    content: '✓';
    color: ${props => props.theme.colors.electricBlue};
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

const Services = () => {
  // Services data
  const services = [
    {
      id: 1,
      icon: '💻',
      title: 'Custom Web & Mobile Apps',
      description: 'Our team handles front-end and back-end development with end-to-end services.',
      features: [
        'HTML5, JavaScript/TypeScript',
        'React, Redux Toolkit',
        'Tailwind CSS',
        'Responsive & cross-platform design'
      ],
      techStack: 'HTML5, JavaScript/TypeScript, React, Redux Toolkit, Tailwind CSS',
      clients: 'LinkedInFresh Consulting'
    },
    {
      id: 2,
      icon: '🚀',
      title: 'Backend & API Development',
      description: 'Our engineers build robust, scalable backend systems and APIs that power your applications.',
      features: [
        'Python, Django, Flask',
        'Node.js, Express',
        'RESTful & GraphQL APIs',
        'MongoDB, PostgreSQL'
      ],
      techStack: 'Python, Django, Flask, Node.js, Docker, MongoDB',
      clients: 'Mind the ProductFull Scale'
    },
    {
      id: 3,
      icon: '🎮',
      title: '3D & Visualization',
      description: 'Our specialists create immersive 3D experiences and data visualizations for web applications.',
      features: [
        'Three.js, WebGL',
        'React Three Fiber',
        'Interactive 3D models',
        'Data visualization'
      ],
      techStack: 'Three.js, WebGL, React Three Fiber',
      clients: 'Reddit'
    },
    {
      id: 4,
      icon: '🐳',
      title: 'DevOps & Containerization',
      description: 'Our DevOps experts streamline your development and deployment processes with modern practices.',
      features: [
        'Docker containerization',
        'CI/CD with GitHub Actions',
        'AWS, Azure, Google Cloud',
        'Serverless architecture',
        'Microservices implementation',
        'DevOps and CI/CD pipelines'
      ],
      techStack: 'Docker, CI/CD (GitHub Actions), AWS/Azure/Google Cloud deployment',
      clients: 'Asana'
    },
    {
      id: 5,
      icon: '🔒',
      title: 'Cybersecurity',
      description: 'Our security team protects your digital assets with comprehensive security solutions.',
      features: [
        'Security assessment and auditing',
        'Penetration testing',
        'Secure coding practices',
        'Compliance (GDPR, HIPAA, etc.)'
      ],
      techStack: 'Security frameworks, encryption, authentication systems, Geo fencing',
      clients: 'Enterprise clients'
    },
    {
      id: 6,
      icon: '🤖',
      title: 'AI & Machine Learning',
      description: 'Our AI specialists help you leverage the power of AI to gain insights and automate processes.',
      features: [
        'Predictive analytics',
        'Natural language processing',
        'Computer vision solutions',
        'AI-powered automation'
      ],
      techStack: 'Python, TensorFlow, PyTorch, scikit-learn',
      clients: 'Research and enterprise projects'
    },
    {
      id: 7,
      icon: '🏢',
      title: 'Enterprise Platforms',
      description: 'Our team delivers turnkey solutions for businesses including attendance systems and healthcare platforms.',
      features: [
        'Physioway healthcare platform',
        'Attendance systems',
        'Custom dashboards',
        'Analytics and reporting'
      ],
      techStack: 'Full-stack technologies, Django, React, PostgreSQL',
      clients: 'Physioway, Harsh Patel, Cynet'
    }
  ];
  
  return (
    <ServicesContainer id="services">
      <ServicesContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our multidisciplinary team delivers a comprehensive range of technology services to help businesses innovate, transform, and grow in the digital era.
          </SectionDescription>
        </SectionHeader>
        
        <ServicesGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              variants={slideUp}
              custom={index * 0.1}
              whileHover={{ y: -5 }}
            >
              <ServiceIcon
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
              >
                {service.icon}
              </ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, i) => (
                  <ServiceFeature key={i}>{feature}</ServiceFeature>
                ))}
              </ServiceFeatures>
              
              <TechStackLabel>
                <h4>Technology Stack</h4>
                <p>{service.techStack}</p>
              </TechStackLabel>
              
              {service.clients && (
                <ClientsLabel>
                  Used by: {service.clients}
                </ClientsLabel>
              )}
              
              <CTAWrapper>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'transparent',
                    color: '#00BFFF',
                    border: '2px solid #00BFFF',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => document.getElementById('contact') && document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Discuss Your Project
                </motion.button>
              </CTAWrapper>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesContent>
    </ServicesContainer>
  );
};

export default Services;