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
      title: 'Full-Stack Development',
      description: 'End-to-end development services from front-end interfaces to back-end systems.',
      features: [
        'React, Angular, Vue.js front-end',
        'Node.js, Python, Java back-end',
        'Database design and optimization',
        'API development and integration'
      ]
    },
    {
      id: 2,
      icon: '🚀',
      title: 'Digital Transformation',
      description: 'Transform your business with innovative digital solutions and strategies.',
      features: [
        'Legacy system modernization',
        'Cloud migration and optimization',
        'Process automation',
        'Digital strategy consulting'
      ]
    },
    {
      id: 3,
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: [
        'React Native development',
        'Native iOS (Swift) development',
        'Native Android (Kotlin) development',
        'App Store optimization'
      ]
    },
    {
      id: 4,
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Scalable, secure, and cost-effective cloud infrastructure and services.',
      features: [
        'AWS, Azure, Google Cloud',
        'Serverless architecture',
        'Microservices implementation',
        'DevOps and CI/CD pipelines'
      ]
    },
    {
      id: 5,
      icon: '🔒',
      title: 'Cybersecurity',
      description: 'Protect your digital assets with comprehensive security solutions.',
      features: [
        'Security assessment and auditing',
        'Penetration testing',
        'Secure coding practices',
        'Compliance (GDPR, HIPAA, etc.)'
      ]
    },
    {
      id: 6,
      icon: '🤖',
      title: 'AI & Machine Learning',
      description: 'Leverage the power of AI to gain insights and automate processes.',
      features: [
        'Predictive analytics',
        'Natural language processing',
        'Computer vision solutions',
        'AI-powered automation'
      ]
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
            We offer a comprehensive range of technology services to help businesses innovate, transform, and grow in the digital era.
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
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesContent>
    </ServicesContainer>
  );
};

export default Services;