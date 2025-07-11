import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition, fadeIn, slideUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import ImageWithFallback from '../components/ImageWithFallback';
import bullLogo from '../assets/codingbulllogo.png';

// About page container
const AboutPageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section
const AboutHero = styled.section`
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

// Hero subtitle
const HeroSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

// Hero image - Logo with cinematic effect
const HeroImage = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }
  
  img {
    width: 80%;
    max-width: 400px;
    filter: drop-shadow(0 0 25px rgba(43, 155, 244, 0.6));
    z-index: 2;
    transition: all 0.5s ease-in-out;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(43, 155, 244, 0.2) 0%, rgba(13, 125, 214, 0.1) 50%, rgba(10, 14, 26, 0) 70%);
    border-radius: 50%;
    z-index: 1;
    animation: pulse 4s infinite alternate ease-in-out;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(30deg);
    width: 400px;
    height: 400px;
    border: 2px solid rgba(43, 155, 244, 0.2);
    border-radius: 50%;
    z-index: 0;
    animation: rotate 20s infinite linear;
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.5;
      width: 300px;
      height: 300px;
    }
    100% {
      opacity: 0.8;
      width: 350px;
      height: 350px;
    }
  }
  
  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  
  .logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(43, 155, 244, 0.4) 0%, rgba(13, 125, 214, 0.1) 40%, rgba(10, 14, 26, 0) 70%);
    filter: blur(20px);
    z-index: 0;
    opacity: 0.8;
    border-radius: 50%;
  }
  
  .logo-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 350px;
    border: 1px solid rgba(94, 186, 255, 0.3);
    border-radius: 50%;
    z-index: 0;
    animation: spin 15s infinite linear;
  }
  
  .logo-ring-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(43, 155, 244, 0.2);
    border-radius: 50%;
    z-index: 0;
    animation: spin 25s infinite linear reverse;
  }
  
  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

// Stats section
const StatsSection = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Stats content
const StatsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Stats grid
const StatsGrid = styled(motion.div)`
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

// Stat card
const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

// Stat value
const StatValue = styled.h3`
  font-size: ${props => props.theme.fontSizes['4xl']};
  margin-bottom: 0.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Stat label
const StatLabel = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
`;

// Story section
const StorySection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  position: relative;
  overflow: hidden;
`;

// Story content
const StoryContent = styled.div`
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

// Timeline
const Timeline = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: ${props => props.theme.colors.electricBlue};
    transform: translateX(-50%);
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 30px;
    }
  }
`;

// Timeline item
const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  position: relative;
  margin-bottom: 4rem;
  width: 50%;
  
  &:nth-child(even) {
    align-self: flex-end;
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 30px;
    margin-left: auto;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    right: -6px;
    width: 12px;
    height: 12px;
    background: ${props => props.theme.colors.electricBlue};
    border-radius: 50%;
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 24px;
      right: auto;
    }
  }
  
  &:nth-child(even)::before {
    right: auto;
    left: -6px;
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 24px;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    padding-right: 0;
    padding-left: 60px;
    
    &:nth-child(even) {
      padding-left: 60px;
    }
  }
`;

// Timeline content
const TimelineContent = styled.div`
  background: ${props => props.theme.colors.mediumGrey};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    right: 100%;
    border: 10px solid transparent;
    border-right-color: ${props => props.theme.colors.mediumGrey};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      display: none;
    }
  }
  
  ${TimelineItem}:nth-child(even) & {
    &::before {
      right: auto;
      left: 100%;
      border-right-color: transparent;
      border-left-color: ${props => props.theme.colors.mediumGrey};
      
      @media (max-width: ${props => props.theme.breakpoints.md}) {
        display: none;
      }
    }
  }
`;

// Timeline year
const TimelineYear = styled.div`
  position: absolute;
  top: 15px;
  left: -85px;
  background: ${props => props.theme.colors.deepPurple};
  color: ${props => props.theme.colors.textPrimary};
  padding: 0.25rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 600;
  
  ${TimelineItem}:nth-child(even) & {
    left: auto;
    right: -85px;
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      right: auto;
      left: -45px;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    left: -45px;
  }
`;

// Timeline title
const TimelineTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
`;

// Timeline description
const TimelineDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

// Team section
const TeamSection = styled.section`
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
    height: 100%;
    background: radial-gradient(circle at 20% 30%, rgba(43, 155, 244, 0.05) 0%, rgba(10, 14, 26, 0) 70%);
    pointer-events: none;
  }
`;

// Team content
const TeamContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Intentionally removed unused team components that were replaced by the founder section

// Founder section - new layout
const FounderSection = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// Founder image container
const FounderImageContainer = styled(motion.div)`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  aspect-ratio: 1 / 1.2;
  box-shadow: ${props => props.theme.shadows.lg};
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(10, 14, 26, 0) 0%, rgba(10, 14, 26, 0.8) 100%);
    z-index: 1;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid ${props => props.theme.colors.electricBlue};
    border-radius: ${props => props.theme.borderRadius.lg};
    opacity: 0;
    transform: scale(1.05);
    transition: all 0.3s ease;
    z-index: 0;
  }
  
  &:hover::after {
    opacity: 0.5;
    transform: scale(1);
  }
  
  &:hover::before {
    opacity: 0.3;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 500px;
    margin: 0 auto;
  }
`;

// Founder image
const FounderImage = styled.div`
  width: 100%;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${FounderImageContainer}:hover & img {
    transform: scale(1.05);
  }
`;

// Founder info
const FounderInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    text-align: center;
  }
`;

// Founder name
const FounderName = styled(motion.h3)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 0.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
`;

// Founder position
const FounderPosition = styled(motion.p)`
  color: ${props => props.theme.colors.electricBlue};
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: ${props => props.theme.fontSizes.lg};
  letter-spacing: 0.5px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

// Founder bio
const FounderBio = styled(motion.p)`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

// Founder quote
const FounderQuote = styled(motion.blockquote)`
  position: relative;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  background: ${props => props.theme.colors.glassLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.theme.colors.electricBlue};
  font-style: italic;
  color: ${props => props.theme.colors.textPrimary};
  
  &::before {
    content: '"';
    position: absolute;
    top: 0;
    left: 1rem;
    font-size: 4rem;
    line-height: 1;
    color: ${props => props.theme.colors.electricBlue};
    opacity: 0.3;
  }
`;

// Founder skills
const FounderSkills = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

// Skill tag
const SkillTag = styled(motion.span)`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.glassLight};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    color: ${props => props.theme.colors.white};
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

// Founder social links
const FounderSocial = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

// Social link
const SocialLink = styled(motion.a)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${props => props.theme.colors.glassLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(43, 155, 244, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    color: ${props => props.theme.colors.white};
    border-color: transparent;
    box-shadow: 0 0 15px rgba(43, 155, 244, 0.5);
    transform: translateY(-3px);
  }
  
  span {
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
`;

// Values section
const ValuesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
`;

// Values content
const ValuesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Values grid
const ValuesGrid = styled(motion.div)`
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

// Value card
const ValueCard = styled(motion.div)`
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

// Value icon
const ValueIcon = styled(motion.div)`
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

// Value title
const ValueTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 1rem;
`;

// Value description
const ValueDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

// CTA section
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  text-align: center;
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

const AboutPage = () => {
  // Reference for the logo section to trigger animations on scroll
  const logoRef = useRef(null);
  const isInView = useInView(logoRef, { once: false, amount: 0.3 });
  const logoAnimControls = useAnimation();
  
  // Animate logo when it comes into view
  useEffect(() => {
    if (isInView) {
      logoAnimControls.start({
        scale: [1, 1.05, 1],
        filter: ["drop-shadow(0 0 15px rgba(43, 155, 244, 0.4))", "drop-shadow(0 0 30px rgba(43, 155, 244, 0.7))", "drop-shadow(0 0 15px rgba(43, 155, 244, 0.4))"],
        transition: {
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    }
  }, [isInView, logoAnimControls]);

  // Company stats
  const stats = [
    { value: '1', label: 'Year Experience' },
    { value: '30+', label: 'Projects Completed' },
    { value: '15+', label: 'Services Offered' },
    { value: '3', label: 'Core Technologies' }
  ];
  
  // Company timeline
  const timeline = [
    {
      year: '2025',
      title: 'Company Founded',
      description: 'CodingBull was officially registered with mca.gov.in by Pranshu Dixit with a vision to provide innovative technology solutions to businesses.'
    },
    {
      year: '2025',
      title: 'First Client Project',
      description: 'Successfully delivered our first client project, establishing our reputation for quality and innovation in the tech space.'
    },
    {
      year: '2025',
      title: 'Web Development Focus',
      description: 'Specialized in creating responsive, user-friendly web applications using modern frameworks and technologies.'
    },
    {
      year: '2025',
      title: 'Digital Transformation Services',
      description: 'Expanded service offerings to include digital transformation consulting for small to medium businesses.'
    }
  ];
  
  // Founder information
  const founder = {
    name: 'Pranshu Dixit',
    position: 'Founder & CEO',
    bio: "With over a decade of experience in software development and digital innovation, Pranshu founded CodingBull in 2025 with a vision to bridge the gap between technology and business success. His background in full-stack development, combined with expertise in modern frameworks and cloud architecture, has helped numerous businesses transform their digital presence. Pranshu leads our team with a focus on quality, innovation, and client satisfaction, ensuring every project exceeds expectations.",
    quote: "By 2025, digital transformation won't be just an option—it will be the foundation of business survival and growth. At CodingBull, we're committed to being at the forefront of this evolution, creating solutions that not only solve today's challenges but anticipate tomorrow's opportunities.",
    image: null,
    skills: ['Full-Stack Development', 'React & Next.js', 'Node.js', 'Cloud Architecture', 'UI/UX Design', 'Digital Strategy', 'AI Integration', 'Performance Optimization']
  };
  
  // Company values
  const values = [
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We constantly push the boundaries of what is possible, embracing new technologies and methodologies to deliver cutting-edge solutions.'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'We believe in the power of teamwork, both internally and with our clients, to achieve exceptional results through shared knowledge and expertise.'
    },
    {
      icon: '🔍',
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality in everything we do, with attention to detail and a focus on exceeding expectations.'
    },
    {
      icon: '🌱',
      title: 'Growth',
      description: 'We foster continuous learning and development, helping our team members and clients grow and adapt in an ever-changing technological landscape.'
    },
    {
      icon: '🔒',
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical practices, building trust with our clients, partners, and team members.'
    },
    {
      icon: '🌍',
      title: 'Global Perspective',
      description: 'We embrace diversity of thought and experience, leveraging our global presence to bring unique insights and solutions to our clients.'
    }
  ];
  
  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about CodingBull's journey, our expert team, and the values that drive our innovative web and mobile development solutions."
        canonical="/about"
      />
      <AboutPageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
      <AboutHero>
        <HeroContent>
          <HeroText>
            <HeroTitle
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              About CodingBull
            </HeroTitle>
            <HeroSubtitle
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transforming Ideas into Powerful Technology Solutions
            </HeroSubtitle>
            <HeroDescription
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              CodingBull is a technology company founded in 2025 by Pranshu Dixit, specializing in innovative digital solutions for businesses. As a team, we focus on delivering high-quality, customized web development and digital transformation services to help businesses thrive in the digital era.
            </HeroDescription>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                as={Link} 
                to="/contact" 
                variant="primary" 
                size="lg"
              >
                Get in Touch
              </Button>
            </motion.div>
          </HeroText>
          
          <HeroImage
            ref={logoRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.5 }
            }}
          >
            <motion.div 
              className="logo-glow"
              animate={{
                opacity: [0.6, 0.9, 0.6],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div 
              className="logo-ring"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div 
              className="logo-ring-2"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.img 
              src={bullLogo} 
              alt="CodingBull Logo"
              initial={{ y: 0 }}
              animate={logoAnimControls}
              whileHover={{ 
                scale: 1.1,
                filter: "drop-shadow(0 0 30px rgba(43, 155, 244, 0.8))",
                transition: { duration: 0.3 }
              }}
            />
          </HeroImage>
        </HeroContent>
      </AboutHero>
      
      <StatsSection>
        <StatsContent>
          <StatsGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                variants={slideUp}
                custom={index * 0.1}
              >
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsContent>
      </StatsSection>
      
      <StorySection>
        <StoryContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Journey
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Though we're just beginning our journey in 2025, CodingBull was founded with a clear vision and purpose. We're committed to innovation, quality, and delivering exceptional value to our clients from day one.
            </SectionDescription>
          </SectionHeader>
          
          <Timeline>
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TimelineContent>
                  <TimelineYear>{item.year}</TimelineYear>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </StoryContent>
      </StorySection>
      
      <TeamSection>
        <TeamContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Meet Our Founder
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              CodingBull is led by a visionary founder who combines deep technical expertise with strategic business acumen. Our leadership brings together cutting-edge development skills, innovative design thinking, and a relentless commitment to delivering exceptional value to our clients.
            </SectionDescription>
          </SectionHeader>
          
          <FounderSection>
            <FounderImageContainer
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <FounderImage>
                <ImageWithFallback 
                  src={founder.image} 
                  alt={founder.name}
                  fallbackText="Pranshu Dixit"
                  showFallbackText={true}
                />
              </FounderImage>
            </FounderImageContainer>
            
            <FounderInfo
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <FounderName
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {founder.name}
              </FounderName>
              
              <FounderPosition
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {founder.position}
              </FounderPosition>
              
              <FounderBio
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {founder.bio}
              </FounderBio>
              
              <FounderQuote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {founder.quote}
              </FounderQuote>
              
              <FounderSkills
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {founder.skills.map((skill, index) => (
                  <SkillTag 
                    key={index}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
                  >
                    {skill}
                  </SkillTag>
                ))}
              </FounderSkills>
              
              <FounderSocial
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <SocialLink 
                  href="https://www.linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span>LI</span>
                </SocialLink>
                <SocialLink 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span>TW</span>
                </SocialLink>
                <SocialLink 
                  href="mailto:contact@codingbull.com" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span>EM</span>
                </SocialLink>
              </FounderSocial>
            </FounderInfo>
          </FounderSection>
        </TeamContent>
      </TeamSection>
      
      <ValuesSection>
        <ValuesContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Core Values
            </SectionTitle>
            <SectionDescription
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              These principles guide everything we do, from how we develop solutions to how we interact with our clients and each other.
            </SectionDescription>
          </SectionHeader>
          
          <ValuesGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <ValueCard
                key={index}
                variants={slideUp}
                custom={index * 0.1}
              >
                <ValueIcon
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                >
                  {value.icon}
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesContent>
      </ValuesSection>
      
      <Testimonials />
      
      <CTASection>
        <CTAContent>
          <CTATitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Transform Your Business?
          </CTATitle>
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's discuss how our technology solutions can help you innovate, grow, and stay ahead of the competition. Our team is ready to bring your vision to life.
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
              as={Link} 
              to="/services" 
              variant="secondary" 
              size="lg"
            >
              Explore Services
            </Button>
          </CTAButtons>
        </CTAContent>
      </CTASection>
      
      <Footer />
    </AboutPageContainer>
    </>
  );
};

export default AboutPage;