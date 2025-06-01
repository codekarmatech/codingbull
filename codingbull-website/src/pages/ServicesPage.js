import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition, fadeIn, slideUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/api';

// Services page container
const ServicesPageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section
const ServicesHero = styled.section`
  background: ${props => props.theme.colors.darkGrey};
  padding: 6rem 2rem;
  text-align: center;
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
  max-width: 800px;
  margin: 0 auto;
`;

// Hero title
const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

// Services section
const ServicesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Services content
const ServicesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Services grid
const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Service card
const ServiceCard = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

// Service image
const ServiceImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ServiceCard}:hover & img {
    transform: scale(1.05);
  }
`;

// Service content
const ServiceContent = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Service title
const ServiceTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 1rem;
  
  a {
    color: ${props => props.theme.colors.textPrimary};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.electricBlue};
    }
  }
`;

// Service description
const ServiceDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  flex: 1;
`;

// Service features
const ServiceFeatures = styled.ul`
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  
  li {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.5rem;
    position: relative;
    
    &::before {
      content: '✓';
      color: ${props => props.theme.colors.electricBlue};
      position: absolute;
      left: -1.5rem;
    }
  }
`;

// Process section
const ProcessSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
`;

// Process content
const ProcessContent = styled.div`
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

// Process steps
const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// Process step
const ProcessStep = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -1rem;
    width: 2rem;
    height: 2px;
    background: ${props => props.theme.colors.electricBlue};
    transform: translateY(-50%);
    
    @media (max-width: ${props => props.theme.breakpoints.lg}) {
      display: none;
    }
  }
  
  &:last-child::after {
    display: none;
  }
`;

// Step number
const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 auto 1.5rem;
`;

// Step title
const StepTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
`;

// Step description
const StepDescription = styled.p`
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

// Default services data for fallback when API fails
const defaultServices = [
    {
      id: 1,
      name: 'Full-Stack Development',
      slug: 'full-stack-development',
      summary: 'End-to-end development services from front-end interfaces to back-end systems.',
      description: 'Complete web application development using modern technologies and best practices.',
      image: null,
      features: [
        'Responsive web applications',
        'RESTful API development',
        'Database design and optimization',
        'Third-party integrations',
        'Performance optimization'
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      slug: 'mobile-app-development',
      summary: 'Native and cross-platform mobile applications for iOS and Android.',
      description: 'Professional mobile app development for all platforms.',
      image: null,
      features: [
        'Native iOS and Android apps',
        'Cross-platform solutions (React Native, Flutter)',
        'UI/UX design for mobile',
        'App Store optimization',
        'Ongoing maintenance and updates'
      ]
    },
    {
      id: 3,
      name: 'Cloud Solutions',
      slug: 'cloud-solutions',
      summary: 'Scalable, secure, and cost-effective cloud infrastructure and services.',
      description: 'Modern cloud infrastructure and deployment solutions.',
      image: null,
      features: [
        'Cloud migration strategies',
        'AWS, Azure, and Google Cloud expertise',
        'Serverless architecture',
        'Microservices implementation',
        'DevOps automation'
      ]
    },
    {
      id: 4,
      name: 'DevOps & CI/CD',
      slug: 'devops-cicd',
      summary: 'Streamline your development workflow with automated testing and deployment.',
      description: 'Professional DevOps services and automation solutions.',
      image: null,
      features: [
        'CI/CD pipeline setup',
        'Infrastructure as Code (IaC)',
        'Containerization with Docker',
        'Kubernetes orchestration',
        'Monitoring and logging solutions'
      ]
    },
    {
      id: 5,
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      summary: 'User-centered design services that create intuitive, engaging digital experiences.',
      description: 'Professional design services focused on user experience.',
      image: null,
      features: [
        'User research and personas',
        'Wireframing and prototyping',
        'Visual design and branding',
        'Usability testing',
        'Accessibility compliance'
      ]
    },
    {
      id: 6,
      name: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
      summary: 'Harness the power of artificial intelligence to gain insights and automate processes.',
      description: 'Advanced AI and machine learning solutions for modern businesses.',
      image: null,
      features: [
        'Predictive analytics',
        'Natural language processing',
        'Computer vision solutions',
        'Recommendation systems',
        'AI integration with existing systems'
      ]
    }
];

// Process steps
const processSteps = [
    {
      number: 1,
      title: 'Discovery',
      description: 'We start by understanding your business goals, target audience, and technical requirements.'
    },
    {
      number: 2,
      title: 'Planning',
      description: 'Our team creates a detailed roadmap with timelines, milestones, and resource allocation.'
    },
    {
      number: 3,
      title: 'Development',
      description: 'Using agile methodologies, we build your solution with regular updates and feedback sessions.'
    },
    {
      number: 4,
      title: 'Delivery',
      description: 'After thorough testing, we deploy your solution and provide training and documentation.'
    }
];

const ServicesPage = () => {
  // State for services data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.services.getServices();
        if (response && response.results && response.results.length > 0) {
          setServices(response.results);
        } else {
          // Fallback to default data when no services in database
          setServices(defaultServices);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        // Fallback to default data
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []); // Empty dependency array since mockServices is now constant
  
  return (
    <>
      <SEO 
        title="Our Services" 
        description="Explore CodingBull's comprehensive range of web and mobile development services including full-stack development, mobile apps, cloud solutions, and more."
        canonical="/services"
      />
      <ServicesPageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
      <ServicesHero>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </HeroTitle>
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We offer a comprehensive range of technology solutions to help businesses innovate, grow, and stay ahead of the competition.
          </HeroDescription>
        </HeroContent>
      </ServicesHero>
      
      <ServicesSection>
        <ServicesContent>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading services...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ff6b6b' }}>
              <p>{error}</p>
              <Button 
                variant="secondary" 
                onClick={() => window.location.reload()}
                style={{ marginTop: '1rem' }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <ServicesGrid
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                variants={slideUp}
                custom={index * 0.1}
              >
                <ServiceImage>
                  <ImageWithFallback 
                    src={service.image} 
                    alt={service.name || service.title}
                    fallbackText="Service Image"
                    showFallbackText={false}
                  />
                </ServiceImage>
                <ServiceContent>
                  <ServiceTitle>
                    <Link to={`/services/${service.slug}`}>{service.name || service.title}</Link>
                  </ServiceTitle>
                  <ServiceDescription>{service.summary || service.description}</ServiceDescription>
                  {service.features && (
                    <ServiceFeatures>
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ServiceFeatures>
                  )}
                  <Button 
                    as={Link} 
                    to={`/services/${service.slug}`} 
                    variant="primary"
                  >
                    Learn More
                  </Button>
                </ServiceContent>
              </ServiceCard>
              ))}
            </ServicesGrid>
          )}
        </ServicesContent>
      </ServicesSection>
      
      <ProcessSection>
        <ProcessContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Process
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
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </ProcessStep>
            ))}
          </ProcessSteps>
        </ProcessContent>
      </ProcessSection>
      
      <Testimonials />
      
      <CTASection>
        <CTAContent>
          <CTATitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your Project?
          </CTATitle>
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's discuss how our services can help you achieve your business goals. Our team is ready to bring your vision to life.
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
      
      <Footer />
    </ServicesPageContainer>
    </>
  );
};

export default ServicesPage;
