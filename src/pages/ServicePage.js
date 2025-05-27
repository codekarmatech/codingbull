import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeIn, slideUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Testimonials from '../components/Testimonials';

// Service page container
const ServicePageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section
const ServiceHero = styled.section`
  background: ${props => props.theme.colors.darkGrey};
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(0,191,255,0.5) 50%, 
      rgba(255,255,255,0) 100%);
  }
`;

// Hero content
const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

// Hero text
const HeroText = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 2;
  }
`;

// Hero title
const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2.5rem;
  line-height: 1.7;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

// Hero image
const HeroImage = styled(motion.div)`
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }
  
  img {
    width: 100%;
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100%;
    height: 100%;
    border: 2px solid ${props => props.theme.colors.electricBlue};
    border-radius: ${props => props.theme.borderRadius.lg};
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 70%;
    height: 70%;
    background: ${props => props.theme.colors.deepPurple};
    border-radius: ${props => props.theme.borderRadius.lg};
    z-index: -2;
    opacity: 0.5;
  }
`;

// Overview section
const OverviewSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Overview content
const OverviewContent = styled.div`
  max-width: 1200px;
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
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

// Section description
const SectionDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
`;

// Features grid
const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Feature card
const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
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

// Feature icon
const FeatureIcon = styled(motion.div)`
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

// Feature title
const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
`;

// Feature description
const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

// Process section
const ProcessSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  position: relative;
  overflow: hidden;
`;

// Process content
const ProcessContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Process steps
const ProcessSteps = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24px;
    width: 2px;
    background: ${props => props.theme.colors.electricBlue};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 20px;
    }
  }
`;

// Process step
const ProcessStep = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 1.5rem;
  }
`;

// Step number
const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textPrimary};
  flex-shrink: 0;
  z-index: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

// Step content
const StepContent = styled.div`
  flex: 1;
`;

// Step title
const StepTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 0.75rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

// Step description
const StepDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

// Technologies section
const TechnologiesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Technologies content
const TechnologiesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Technologies grid
const TechnologiesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

// Technology card
const TechnologyCard = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

// Technology icon
const TechnologyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

// Technology name
const TechnologyName = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: 0.5rem;
`;

// FAQ section
const FAQSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
`;

// FAQ content
const FAQContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

// FAQ list
const FAQList = styled.div`
  margin-top: 3rem;
`;

// FAQ item
const FAQItem = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

// FAQ question
const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  padding: 1.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:focus {
    outline: none;
  }
  
  .icon {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  }
`;

// FAQ answer
const FAQAnswer = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

// CTA section
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  text-align: center;
`;

// CTA content
const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

// CTA title
const CTATitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

// CTA description
const CTADescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

// CTA buttons
const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

// Related services section
const RelatedServicesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
`;

// Related services content
const RelatedServicesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Related services grid
const RelatedServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Related service card
const RelatedServiceCard = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

// Related service image
const RelatedServiceImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${RelatedServiceCard}:hover & img {
    transform: scale(1.05);
  }
`;

// Related service content
const RelatedServiceContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Related service title
const RelatedServiceTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

// Related service description
const RelatedServiceDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  flex: 1;
`;

const ServicePage = () => {
  const { slug } = useParams();
  const [openFAQ, setOpenFAQ] = React.useState(null);
  
  // Mock services data (would be fetched from API in production)
  const services = [
    {
      id: 1,
      title: 'Full-Stack Development',
      slug: 'full-stack-development',
      description: 'End-to-end development services from front-end interfaces to back-end systems.',
      longDescription: 'Our full-stack development services provide comprehensive solutions that cover both client-facing interfaces and server-side systems. We leverage the latest technologies and frameworks to build scalable, high-performance applications that meet your business needs.',
      image: 'https://via.placeholder.com/600x400',
      icon: '💻',
      features: [
        {
          icon: '🎨',
          title: 'Front-End Excellence',
          description: 'Responsive, intuitive, and engaging user interfaces built with modern frameworks like React, Angular, and Vue.js.'
        },
        {
          icon: '⚙️',
          title: 'Robust Back-End Systems',
          description: 'Scalable server-side architecture using Node.js, Python, Java, or .NET, designed for performance and reliability.'
        },
        {
          icon: '🔄',
          title: 'API Development',
          description: 'RESTful and GraphQL APIs that enable seamless communication between your front-end and back-end systems.'
        },
        {
          icon: '🗄️',
          title: 'Database Design',
          description: 'Optimized database structures using SQL or NoSQL solutions, ensuring data integrity and efficient queries.'
        },
        {
          icon: '🔍',
          title: 'Testing & Quality Assurance',
          description: 'Comprehensive testing strategies including unit, integration, and end-to-end testing to ensure robust applications.'
        },
        {
          icon: '🚀',
          title: 'DevOps Integration',
          description: 'CI/CD pipelines and infrastructure as code for streamlined deployment and maintenance.'
        }
      ],
      process: [
        {
          step: 1,
          title: 'Discovery & Planning',
          description: 'We begin by understanding your business goals, target audience, and technical requirements to create a comprehensive project roadmap.'
        },
        {
          step: 2,
          title: 'Architecture & Design',
          description: 'Our architects design the system architecture, database schema, and user interfaces, ensuring scalability and optimal performance.'
        },
        {
          step: 3,
          title: 'Development',
          description: 'Using agile methodologies, we develop both front-end and back-end components in parallel, with regular client check-ins.'
        },
        {
          step: 4,
          title: 'Testing & QA',
          description: 'Rigorous testing across multiple devices and scenarios ensures your application works flawlessly in all conditions.'
        },
        {
          step: 5,
          title: 'Deployment',
          description: 'We handle the deployment process, ensuring smooth transitions to production environments with minimal downtime.'
        },
        {
          step: 6,
          title: 'Maintenance & Support',
          description: 'Ongoing support, monitoring, and updates keep your application secure, performant, and aligned with evolving business needs.'
        }
      ],
      technologies: [
        { name: 'React', icon: '⚛️' },
        { name: 'Angular', icon: '🅰️' },
        { name: 'Vue.js', icon: '🔰' },
        { name: 'Node.js', icon: '📦' },
        { name: 'Python', icon: '🐍' },
        { name: 'Java', icon: '☕' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'PostgreSQL', icon: '🐘' },
        { name: 'AWS', icon: '☁️' },
        { name: 'Docker', icon: '🐳' },
        { name: 'Kubernetes', icon: '⎈' },
        { name: 'GraphQL', icon: '📊' }
      ],
      faqs: [
        {
          question: 'How long does a typical full-stack development project take?',
          answer: 'Project timelines vary based on complexity and scope. A simple application might take 2-3 months, while more complex enterprise solutions can take 6+ months. During our initial consultation, we will provide a detailed timeline based on your specific requirements.'
        },
        {
          question: 'Which technology stack do you recommend for my project?',
          answer: 'We recommend technology stacks based on your specific business needs, scalability requirements, existing infrastructure, and long-term goals. We are proficient in multiple stacks and will help you choose the one that best aligns with your project objectives.'
        },
        {
          question: 'Do you provide ongoing maintenance after the project is completed?',
          answer: 'Yes, we offer flexible maintenance packages to ensure your application remains secure, up-to-date, and aligned with your evolving business needs. Our support includes bug fixes, security updates, performance optimization, and feature enhancements.'
        },
        {
          question: 'How do you ensure the security of the applications you develop?',
          answer: 'Security is integrated throughout our development process. We follow industry best practices for secure coding, implement authentication and authorization mechanisms, conduct regular security audits, and stay updated on the latest vulnerabilities and mitigation strategies.'
        },
        {
          question: 'Can you work with our existing development team?',
          answer: 'Absolutely. We are experienced in collaborative development and can integrate seamlessly with your existing team. We can provide specialized expertise, augment your team is capabilities, or take on specific components of the project as needed.'
        }
      ],
      relatedServices: [
        {
          id: 2,
          title: 'Mobile App Development',
          slug: 'mobile-app-development',
          description: 'Native and cross-platform mobile applications for iOS and Android.',
          image: 'https://via.placeholder.com/600x400'
        },
        {
          id: 3,
          title: 'Cloud Solutions',
          slug: 'cloud-solutions',
          description: 'Scalable, secure, and cost-effective cloud infrastructure and services.',
          image: 'https://via.placeholder.com/600x400'
        },
        {
          id: 4,
          title: 'DevOps & CI/CD',
          slug: 'devops-cicd',
          description: 'Streamline your development workflow with automated testing and deployment.',
          image: 'https://via.placeholder.com/600x400'
        }
      ]
    },
    {
      id: 2,
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      longDescription: 'Our mobile app development services deliver high-performance, user-friendly applications that engage your audience and drive business growth. Whether you need native iOS, Android, or cross-platform solutions, we create mobile experiences that stand out in today is competitive market.',
      image: 'https://via.placeholder.com/600x400',
      icon: '📱',
      features: [
        {
          icon: '🍎',
          title: 'iOS Development',
          description: 'Native iOS applications built with Swift, optimized for performance and user experience across all Apple devices.'
        },
        {
          icon: '🤖',
          title: 'Android Development',
          description: 'Native Android applications using Kotlin or Java, designed to work seamlessly across the diverse Android ecosystem.'
        },
        {
          icon: '🔄',
          title: 'Cross-Platform Solutions',
          description: 'Efficient development using React Native or Flutter to deliver consistent experiences across both iOS and Android.'
        },
        {
          icon: '🔌',
          title: 'API Integration',
          description: 'Seamless integration with backend services, third-party APIs, and existing business systems.'
        },
        {
          icon: '🔒',
          title: 'Secure Authentication',
          description: 'Robust authentication methods including biometrics, social login, and multi-factor authentication.'
        },
        {
          icon: '📊',
          title: 'Analytics & Insights',
          description: 'Integration of analytics tools to track user behavior and provide actionable insights for continuous improvement.'
        }
      ],
      process: [
        {
          step: 1,
          title: 'Strategy & Planning',
          description: "We define your app's objectives, target audience, and key features to create a comprehensive development roadmap."
        },
        {
          step: 2,
          title: 'UI/UX Design',
          description: 'Our designers create intuitive, engaging interfaces that align with your brand and optimize the user experience.'
        },
        {
          step: 3,
          title: 'Development',
          description: 'Using agile methodologies, we develop your application with regular builds and client feedback sessions.'
        },
        {
          step: 4,
          title: 'Testing',
          description: 'Rigorous testing across multiple devices and scenarios ensures your app works flawlessly in all conditions.'
        },
        {
          step: 5,
          title: 'Deployment',
          description: 'We handle the submission process to app stores, ensuring compliance with all guidelines and requirements.'
        },
        {
          step: 6,
          title: 'Post-Launch Support',
          description: 'Ongoing maintenance, performance monitoring, and updates keep your app relevant and functioning optimally.'
        }
      ],
      technologies: [
        { name: 'Swift', icon: '🍎' },
        { name: 'Kotlin', icon: '🤖' },
        { name: 'React Native', icon: '⚛️' },
        { name: 'Flutter', icon: '💙' },
        { name: 'Firebase', icon: '🔥' },
        { name: 'AWS Amplify', icon: '☁️' },
        { name: 'GraphQL', icon: '📊' },
        { name: 'REST APIs', icon: '🔄' },
        { name: 'SQLite', icon: '🗄️' },
        { name: 'Realm', icon: '💾' },
        { name: 'Push Notifications', icon: '🔔' },
        { name: 'Analytics', icon: '📈' }
      ],
      faqs: [
        {
          question: 'Should I build a native app or a cross-platform app?',
          answer: 'The choice between native and cross-platform depends on your specific needs. Native apps offer the best performance and access to platform-specific features, while cross-platform solutions provide faster development and cost efficiency. We will help you evaluate the trade-offs based on your project requirements.'
        },
        {
          question: 'How long does it take to develop a mobile app?',
          answer: 'Development timelines vary based on complexity. A simple app might take 2-3 months, while more complex applications can take 4-6 months or more. We will provide a detailed timeline during our initial consultation based on your specific requirements.'
        },
        {
          question: 'How do you ensure my app will be approved by the App Store and Google Play?',
          answer: 'We stay current with all app store guidelines and requirements, and build compliance into our development process. Our submission specialists handle the entire process, addressing any feedback from review teams to ensure successful approval.'
        },
        {
          question: 'Can you update my existing mobile app?',
          answer: 'Yes, we can take over maintenance and enhancement of existing applications. We will begin with a thorough code review and architecture assessment to understand the current state and identify opportunities for improvement.'
        },
        {
          question: 'How do you handle app testing across multiple devices?',
          answer: 'We employ a comprehensive testing strategy that includes automated testing, device labs with physical devices, and cloud-based testing platforms that allow us to test across hundreds of device/OS combinations to ensure compatibility and performance.'
        }
      ],
      relatedServices: [
        {
          id: 1,
          title: 'Full-Stack Development',
          slug: 'full-stack-development',
          description: 'End-to-end development services from front-end interfaces to back-end systems.',
          image: 'https://via.placeholder.com/600x400'
        },
        {
          id: 5,
          title: 'UI/UX Design',
          slug: 'ui-ux-design',
          description: 'User-centered design services that create intuitive, engaging digital experiences.',
          image: 'https://via.placeholder.com/600x400'
        },
        {
          id: 6,
          title: 'QA & Testing',
          slug: 'qa-testing',
          description: 'Comprehensive quality assurance services to ensure flawless digital products.',
          image: 'https://via.placeholder.com/600x400'
        }
      ]
    }
  ];
  
  // Find the current service based on slug
  const service = services.find(s => s.slug === slug) || services[0];
  
  // Toggle FAQ
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  return (
    <ServicePageContainer
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ServiceHero>
        <HeroContent>
          <HeroText>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {service.title}
            </HeroTitle>
            <HeroDescription
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {service.longDescription}
            </HeroDescription>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                as={Link} 
                to="/contact" 
                variant="primary" 
                size="lg"
              >
                Discuss Your Project
              </Button>
            </motion.div>
          </HeroText>
          
          <HeroImage
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={service.image} alt={service.title} />
          </HeroImage>
        </HeroContent>
      </ServiceHero>
      
      <OverviewSection>
        <OverviewContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Key Features & Benefits
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our {service.title} services are designed to deliver exceptional results through these core capabilities.
            </SectionDescription>
          </SectionHeader>
          
          <FeaturesGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {service.features.map((feature, index) => (
              <FeatureCard
                key={index}
                variants={slideUp}
                custom={index * 0.1}
              >
                <FeatureIcon
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                >
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </OverviewContent>
      </OverviewSection>
      
      <ProcessSection>
        <ProcessContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Development Process
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We follow a structured, transparent approach to ensure successful outcomes for every project.
            </SectionDescription>
          </SectionHeader>
          
          <ProcessSteps>
            {service.process.map((step, index) => (
              <ProcessStep
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StepNumber>{step.step}</StepNumber>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepContent>
              </ProcessStep>
            ))}
          </ProcessSteps>
        </ProcessContent>
      </ProcessSection>
      
      <TechnologiesSection>
        <TechnologiesContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Technologies We Use
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We leverage the latest technologies and frameworks to deliver high-quality solutions.
            </SectionDescription>
          </SectionHeader>
          
          <TechnologiesGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {service.technologies.map((tech, index) => (
              <TechnologyCard
                key={index}
                variants={fadeIn}
                custom={index * 0.05}
              >
                <TechnologyIcon>{tech.icon}</TechnologyIcon>
                <TechnologyName>{tech.name}</TechnologyName>
              </TechnologyCard>
            ))}
          </TechnologiesGrid>
        </TechnologiesContent>
      </TechnologiesSection>
      
      <Testimonials />
      
      <FAQSection>
        <FAQContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find answers to common questions about our {service.title} services.
            </SectionDescription>
          </SectionHeader>
          
          <FAQList>
            {service.faqs.map((faq, index) => (
              <FAQItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FAQQuestion 
                  onClick={() => toggleFAQ(index)}
                  isOpen={openFAQ === index}
                >
                  <span>{faq.question}</span>
                  <span className="icon">+</span>
                </FAQQuestion>
                <AnimatePresence>
                  {openFAQ === index && (
                    <FAQAnswer
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </FAQAnswer>
                  )}
                </AnimatePresence>
              </FAQItem>
            ))}
          </FAQList>
        </FAQContent>
      </FAQSection>
      
      <CTASection>
        <CTAContent>
          <CTATitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Get Started?
          </CTATitle>
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's discuss how our {service.title} services can help you achieve your business goals. Our team is ready to bring your vision to life.
          </CTADescription>
          <CTAButtons
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              as={Link} 
              to="/contact" 
              variant="primary" 
              size="lg"
            >
              Contact Us
            </Button>
            <Button 
              as="a" 
              href="#" 
              variant="secondary" 
              size="lg"
            >
              Download Brochure
            </Button>
          </CTAButtons>
        </CTAContent>
      </CTASection>
      
      <RelatedServicesSection>
        <RelatedServicesContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Related Services
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore other services that complement our {service.title} offerings.
            </SectionDescription>
          </SectionHeader>
          
          <RelatedServicesGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {service.relatedServices.map((relatedService, index) => (
              <RelatedServiceCard
                key={relatedService.id}
                variants={slideUp}
                custom={index * 0.1}
              >
                <RelatedServiceImage>
                  <img src={relatedService.image} alt={relatedService.title} />
                </RelatedServiceImage>
                <RelatedServiceContent>
                  <RelatedServiceTitle>
                    <Link to={`/services/${relatedService.slug}`}>{relatedService.title}</Link>
                  </RelatedServiceTitle>
                  <RelatedServiceDescription>{relatedService.description}</RelatedServiceDescription>
                  <Button 
                    as={Link} 
                    to={`/services/${relatedService.slug}`} 
                    variant="ghost" 
                    size="sm"
                  >
                    Learn More
                  </Button>
                </RelatedServiceContent>
              </RelatedServiceCard>
            ))}
          </RelatedServicesGrid>
        </RelatedServicesContent>
      </RelatedServicesSection>
      
      <Footer />
    </ServicePageContainer>
  );
};

export default ServicePage;