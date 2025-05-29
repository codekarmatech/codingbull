import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { pageTransition, fadeIn } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SEO from '../components/SEO';
import apiService from '../services/api';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${props => props.theme.colors.darkGrey};
`;

// Page content
const PageContent = styled.div`
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section with diagonal split design
const ProjectsHero = styled.section`
  position: relative;
  padding: 8rem 2rem 12rem;
  background: ${props => props.theme.colors.darkGrey};
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15rem;
    background: ${props => props.theme.colors.mediumGrey};
    transform: skewY(-5deg);
    transform-origin: bottom left;
    z-index: 1;
  }
`;

// Hero content
const HeroContent = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Hero title with animated underline
const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['6xl']};
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 0;
    height: 4px;
    background: ${props => props.theme.colors.electricBlue};
    animation: underline 1.5s ease forwards 0.5s;
  }
  
  @keyframes underline {
    to { width: 100%; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['5xl']};
  }
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
  text-align: center;
`;

// Project counter
const ProjectCounter = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  
  span {
    font-size: ${props => props.theme.fontSizes['7xl']};
    font-weight: 800;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 1rem;
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

// Project showcase section
const ProjectShowcaseSection = styled.section`
  position: relative;
  padding: 8rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
  z-index: 2;
`;

// Project showcase content
const ShowcaseContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Project filter tabs
const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${props => props.theme.colors.electricBlue},
      transparent
    );
  }
`;

// Filter tab
const FilterTab = styled.button`
  background: transparent;
  color: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.textSecondary};
  border: none;
  padding: 1rem 2rem;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '2rem' : '0'};
    height: 3px;
    background: ${props => props.theme.colors.electricBlue};
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.electricBlue};
    
    &::after {
      width: 2rem;
    }
  }
`;

// Project detail view (for when a project is selected)
const ProjectDetailView = styled(motion.div)`
  margin-bottom: 6rem;
`;

// Project detail container
const ProjectDetailContainer = styled.div`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.xl};
`;

// Project detail header
const ProjectDetailHeader = styled.div`
  position: relative;
  height: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 300px;
  }
`;

// Project detail banner
const ProjectDetailBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #121212, #2D2D2D);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 50%;
    max-height: 50%;
    object-fit: contain;
  }
`;

// Project detail overlay
const ProjectDetailOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  background: linear-gradient(to top, rgba(18, 18, 18, 0.9), transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

// Project detail title area
const ProjectDetailTitleArea = styled.div`
  max-width: 70%;
`;

// Project detail category
const ProjectDetailCategory = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.deepPurple};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
`;

// Project detail title
const ProjectDetailTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.textPrimary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
`;

// Project detail client
const ProjectDetailClient = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
`;

// Project detail logo
const ProjectDetailLogo = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(18, 18, 18, 0.7);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 60px;
    height: 60px;
  }
`;

// Project detail body
const ProjectDetailBody = styled.div`
  padding: 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
`;

// Project detail main content
const ProjectDetailMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Project detail section
const ProjectDetailSection = styled.div``;

// Project detail section title
const ProjectDetailSectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.electricBlue};
`;

// Project detail text
const ProjectDetailText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 1rem;
`;

// Project detail sidebar
const ProjectDetailSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Project detail tech stack
const ProjectDetailTechStack = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

// Tech stack title
const TechStackTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
`;

// Tech stack list
const TechStackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

// Tech stack item
const TechStackItem = styled.span`
  background: rgba(106, 13, 173, 0.2);
  border: 1px solid rgba(106, 13, 173, 0.5);
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

// Project detail testimonial
const ProjectDetailTestimonial = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

// Testimonial quote
const TestimonialQuote = styled.blockquote`
  font-style: italic;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: '"';
    position: absolute;
    left: 0;
    top: 0;
    font-size: 2rem;
    color: ${props => props.theme.colors.electricBlue};
    line-height: 1;
  }
`;

// Testimonial author
const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Testimonial author image
const TestimonialAuthorImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Testimonial author info
const TestimonialAuthorInfo = styled.div``;

// Testimonial author name
const TestimonialAuthorName = styled.p`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
`;

// Testimonial author title
const TestimonialAuthorTitle = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

// Project detail back button
const ProjectDetailBackButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.electricBlue};
  }
`;

// Project cards container
const ProjectCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Project card
const ProjectCard = styled(motion.div)`
  position: relative;
  height: 500px;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 400px;
  }
`;

// Project card image
const ProjectCardImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #121212, #2D2D2D);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  img {
    max-width: 60%;
    max-height: 60%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }
  
  ${ProjectCard}:hover & img {
    transform: scale(1.1);
  }
`;

// Project card overlay
const ProjectCardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(18, 18, 18, 0.95) 30%,
    rgba(18, 18, 18, 0.7) 60%,
    rgba(18, 18, 18, 0.3)
  );
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  transition: opacity 0.3s ease;
  opacity: 0;
  
  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

// Project card category
const ProjectCardCategory = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.deepPurple};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

// Project card title
const ProjectCardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
`;

// Project card description
const ProjectCardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Project card button
const ProjectCardButton = styled(Button)`
  align-self: flex-start;
`;

// No projects message
const NoProjectsMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.textPrimary};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }
`;

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create a loading state UI indicator component
  const LoadingIndicator = () => (
    <div className="loading-container">
      {loading && <div className="loading-spinner">Loading projects...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
  
  // Mock projects data for fallback - defined before useEffect to avoid dependency issues
  const mockProjects = useMemo(() => [
    {
      id: 1,
      title: "Gujju-Masla E-commerce Platform",
      client: "Gujju-Masla",
      logo: "/logos/gujju-masla.png",
      image: "/images/projects/gujju-masla.jpg",
      category: 'E-commerce',
      challenge: "Gujju-Masla needed to modernize its 40-year-old brand with an online ordering system to reach new customers.",
      solution: "Built on Django, React, Tailwind CSS, and Docker for rapid, reliable deployments.",
      outcome: "Launched in 4 weeks; online orders rose by 30% within the first month.",
      technologies: ['React', 'Django', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
      testimonial: {
        quote: "Hiring CodingBull was a game-changer for our business. The team delivered our e-commerce platform in just 4 weeks, leading to a 30% surge in online orders.",
        author: "Rajesh Patel",
        title: "CEO, Gujju-Masla"
      },
      description: "A modern e-commerce platform for a 40-year-old spice brand, enabling online ordering and expanding their customer base.",
      featured: true
    },
    {
      id: 2,
      title: "Physioway Enterprise Physiotherapy System",
      client: "Physioway",
      logo: "/logos/physioway.png",
      image: "/images/projects/physioway.jpg",
      category: 'Healthcare',
      challenge: "Physioway required a secure, enterprise-grade application to manage patient assessments and treatment plans across multiple clinics.",
      solution: "Developed with Django REST Framework, React, and integrated audit logs for HIPAA-style compliance.",
      outcome: "Deployed in 8 weeks; clinic efficiency improved by 40%, and patient satisfaction scores rose 15%.",
      technologies: ['Django', 'React', 'PostgreSQL', 'Docker', 'Redux'],
      testimonial: {
        quote: "The enterprise physiotherapy system built by CodingBull transformed our workflow. Their React/Django solution is robust, user-friendly, and fully compliant.",
        author: "Dr. Rajavi Dixit",
        title: "Founder & CEO",
        company: "Physioway",
        image: "/logos/physioway.png"
      },
      description: "A secure, enterprise-grade application for managing patient assessments and treatment plans across multiple physiotherapy clinics.",
      featured: true
    },
    {
      id: 3,
      title: "Harsh Patel Attendance Management Dashboard",
      client: "Harsh Patel Enterprises",
      logo: "/logos/harsh-patel.png",
      image: "/images/projects/harsh-patel.jpg",
      category: 'Enterprise',
      challenge: "Harsh Patel Enterprises needed real-time attendance tracking and analytics for their distributed teams.",
      solution: "Built a custom dashboard using Flask, MongoDB, and Chart.js for live reporting, containerized with Docker.",
      outcome: "Saved over 20 hours of manual reporting per month and slashed errors by 90%.",
      technologies: ['Flask', 'MongoDB', 'Chart.js', 'Docker', 'Python'],
      testimonial: {
        quote: "Our custom attendance management dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours every month.",
        author: "Harsh Patel",
        title: "CEO",
        company: "Harsh Patel Enterprises",
        image: "/logos/harsh-patel.png"
      },
      description: "A real-time attendance tracking and analytics dashboard for distributed teams, saving hours of manual reporting.",
      featured: false
    }
  ], []);
  
  // Stats data
  const stats = [
    { value: '10+', label: 'Projects Completed' },
    { value: '8+', label: 'Happy Clients' },
    { value: '2+', label: 'Years Experience' },
    { value: '3+', label: 'Industries Served' }
  ];
  
  // Filter categories
  const filterCategories = [
    { id: 'all', label: 'All Projects' },
    { id: 'E-commerce', label: 'E-commerce' },
    { id: 'Healthcare', label: 'Healthcare' },
    { id: 'Enterprise', label: 'Enterprise' }
  ];
  
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.projects.getProjects();
        if (response && response.results) {
          setProjects(response.results);
        } else {
          // Fallback to mock data
          setProjects(mockProjects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        // Fallback to mock data
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch technologies
    const fetchTechnologies = async () => {
      try {
        const response = await apiService.projects.getTechnologies();
        if (response && response.results) {
          setTechnologies(response.results);
        }
      } catch (err) {
        console.error('Error fetching technologies:', err);
      }
    };
    
    fetchProjects();
    fetchTechnologies();
  }, [mockProjects]);
  
  // Handle project selection from URL
  useEffect(() => {
    const projectId = searchParams.get('id');
    if (projectId) {
      const selectedProject = projects.find(p => p.id.toString() === projectId);
      if (selectedProject) {
        setSelectedProject(selectedProject);
      }
    }
  }, [searchParams, projects]);
  
  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(project => project.category === filter);
  }, [filter, projects]);
  
  // Get unique categories from projects
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projects.map(project => project.category))];
    return uniqueCategories;
  }, [projects]);
  
  // Handle filter change
  const handleFilterChange = (category) => {
    setFilter(category);
    setSelectedProject(null);
    setSearchParams({ category });
  };
  
  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSearchParams({ id: project.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle back button click
  const handleBackClick = () => {
    setSelectedProject(null);
    setSearchParams({ category: filter !== 'all' ? filter : '' });
  };
  
  return (
    <PageContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <SEO 
        title="Our Projects | CodingBull"
        description="Explore our portfolio of custom software solutions across e-commerce, healthcare, enterprise, and more."
      />
      <PageContent>
        {/* Hero Section */}
        <ProjectsHero>
          <HeroContent>
            <HeroTitle
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
            >
              Our Projects
            </HeroTitle>
            <HeroDescription
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our portfolio of custom software solutions that have helped businesses transform their operations and achieve their goals.
            </HeroDescription>
            
            {/* Project Counter */}
            <ProjectCounter
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p>Over</p>
              <span>{projects.length || '10'}+</span>
              <p>Projects Delivered</p>
            </ProjectCounter>
          </HeroContent>
        </ProjectsHero>
        
        {/* Project Showcase Section */}
        <ProjectShowcaseSection>
          <ShowcaseContent>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <>
                {selectedProject ? (
                  <ProjectDetailView
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProjectDetailBackButton onClick={handleBackClick}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Back to Projects
                    </ProjectDetailBackButton>
                    
                    <ProjectDetailContainer>
                      <ProjectDetailHeader>
                        <ProjectDetailBanner>
                          <img src={selectedProject.image} alt={selectedProject.title} />
                        </ProjectDetailBanner>
                        <ProjectDetailOverlay>
                          <ProjectDetailTitleArea>
                            <ProjectDetailCategory>{selectedProject.category}</ProjectDetailCategory>
                            <ProjectDetailTitle>{selectedProject.title}</ProjectDetailTitle>
                            <ProjectDetailClient>Client: {selectedProject.client}</ProjectDetailClient>
                          </ProjectDetailTitleArea>
                          <ProjectDetailLogo>
                            <img src={selectedProject.logo} alt={`${selectedProject.client} logo`} />
                          </ProjectDetailLogo>
                        </ProjectDetailOverlay>
                      </ProjectDetailHeader>
                      
                      <ProjectDetailBody>
                        <ProjectDetailMain>
                          <ProjectDetailSection>
                            <ProjectDetailSectionTitle>Project Overview</ProjectDetailSectionTitle>
                            <ProjectDetailText>{selectedProject.description}</ProjectDetailText>
                          </ProjectDetailSection>
                          
                          <ProjectDetailSection>
                            <ProjectDetailSectionTitle>The Challenge</ProjectDetailSectionTitle>
                            <ProjectDetailText>{selectedProject.challenge}</ProjectDetailText>
                          </ProjectDetailSection>
                          
                          <ProjectDetailSection>
                            <ProjectDetailSectionTitle>Our Solution</ProjectDetailSectionTitle>
                            <ProjectDetailText>{selectedProject.solution}</ProjectDetailText>
                          </ProjectDetailSection>
                          
                          <ProjectDetailSection>
                            <ProjectDetailSectionTitle>The Outcome</ProjectDetailSectionTitle>
                            <ProjectDetailText>{selectedProject.outcome}</ProjectDetailText>
                          </ProjectDetailSection>
                        </ProjectDetailMain>
                        
                        <ProjectDetailSidebar>
                          <ProjectDetailTechStack>
                            <TechStackTitle>Technologies Used</TechStackTitle>
                            <TechStackList>
                              {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                                <TechStackItem key={index}>{tech}</TechStackItem>
                              ))}
                            </TechStackList>
                          </ProjectDetailTechStack>
                          
                          {selectedProject.testimonial && (
                            <ProjectDetailTestimonial>
                              <TestimonialQuote>
                                {selectedProject.testimonial.quote}
                              </TestimonialQuote>
                              <TestimonialAuthor>
                                {selectedProject.testimonial.image && (
                                  <TestimonialAuthorImage>
                                    <img src={selectedProject.testimonial.image} alt={selectedProject.testimonial.author} />
                                  </TestimonialAuthorImage>
                                )}
                                <TestimonialAuthorInfo>
                                  <TestimonialAuthorName>{selectedProject.testimonial.author}</TestimonialAuthorName>
                                  <TestimonialAuthorTitle>
                                    {selectedProject.testimonial.title}
                                    {selectedProject.testimonial.company && `, ${selectedProject.testimonial.company}`}
                                  </TestimonialAuthorTitle>
                                </TestimonialAuthorInfo>
                              </TestimonialAuthor>
                            </ProjectDetailTestimonial>
                          )}
                        </ProjectDetailSidebar>
                      </ProjectDetailBody>
                    </ProjectDetailContainer>
                  </ProjectDetailView>
                ) : (
                  <>
                    <FilterTabs>
                      {filterCategories.map(category => (
                        <FilterTab
                          key={category.id}
                          $active={filter === category.id}
                          onClick={() => handleFilterChange(category.id)}
                        >
                          {category.label}
                        </FilterTab>
                      ))}
                    </FilterTabs>
                    
                    {filteredProjects.length > 0 ? (
                      <ProjectCardsContainer>
                        <AnimatePresence>
                          {filteredProjects.map(project => (
                            <ProjectCard
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5 }}
                              whileHover={{ y: -10 }}
                              onClick={() => handleProjectSelect(project)}
                            >
                              <ProjectCardImage>
                                <img src={project.image} alt={project.title} />
                              </ProjectCardImage>
                              <ProjectCardOverlay>
                                <ProjectCardCategory>{project.category}</ProjectCardCategory>
                                <ProjectCardTitle>{project.title}</ProjectCardTitle>
                                <ProjectCardDescription>{project.description}</ProjectCardDescription>
                                <ProjectCardButton variant="outline">View Project</ProjectCardButton>
                              </ProjectCardOverlay>
                            </ProjectCard>
                          ))}
                        </AnimatePresence>
                      </ProjectCardsContainer>
                    ) : (
                      <NoProjectsMessage>
                        <h3>No projects found</h3>
                        <p>We couldn't find any projects matching your filter criteria. Please try a different category.</p>
                        <Button onClick={() => handleFilterChange('all')}>View All Projects</Button>
                      </NoProjectsMessage>
                    )}
                  </>
                )}
              </>
            )}
          </ShowcaseContent>
        </ProjectShowcaseSection>
      </PageContent>
      <Footer />
    </PageContainer>
  );
};

export default ProjectsPage;