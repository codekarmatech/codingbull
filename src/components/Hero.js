import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import { fadeIn, slideUp, textReveal, staggerContainer } from '../animations/variants';

// Hero container
const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
  background: ${props => props.theme.colors.darkGrey};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, rgba(106, 13, 173, 0.15) 0%, rgba(18, 18, 18, 0) 70%),
                radial-gradient(circle at 80% 70%, rgba(0, 191, 255, 0.1) 0%, rgba(18, 18, 18, 0) 70%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    z-index: 1;
  }
`;

// Content wrapper
const HeroContent = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
  }
`;

// Left side content
const HeroTextContent = styled(motion.div)`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 100%;
    order: 2;
  }
`;

// Right side content (image/animation)
const HeroVisual = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
    width: 100%;
  }
`;

// Headline
const Headline = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  span {
    display: block;
    color: ${props => props.theme.colors.textPrimary};
    -webkit-text-fill-color: ${props => props.theme.colors.textPrimary};
  }
`;

// Subheadline
const Subheadline = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

// Trusted by section
const TrustedBy = styled(motion.div)`
  margin-top: 3rem;
  
  h4 {
    font-size: ${props => props.theme.fontSizes.md};
    color: ${props => props.theme.colors.lightGrey};
    margin-bottom: 1rem;
  }
`;

// We'll add client logos in the future if needed

// Button group
const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;

// Animated shape for visual interest
const AnimatedShape = styled(motion.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  filter: blur(80px);
  opacity: 0.2;
  z-index: -1;
`;

// Animated code block
const CodeBlock = styled(motion.div)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textPrimary};
  box-shadow: ${props => props.theme.shadows.lg};
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.2);
    border-top-left-radius: ${props => props.theme.borderRadius.md};
    border-top-right-radius: ${props => props.theme.borderRadius.md};
  }
  
  &::after {
    content: '• • •';
    position: absolute;
    top: 8px;
    left: 15px;
    font-size: 12px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.5);
  }
`;

// Code line
const CodeLine = styled(motion.div)`
  margin-bottom: 0.5rem;
  display: flex;
  
  .line-number {
    color: ${props => props.theme.colors.lightGrey};
    margin-right: 1rem;
    user-select: none;
  }
  
  .keyword {
    color: ${props => props.theme.colors.electricBlue};
  }
  
  .function {
    color: ${props => props.theme.colors.deepPurple};
  }
  
  .string {
    color: #4CAF50;
  }
  
  .comment {
    color: ${props => props.theme.colors.lightGrey};
    font-style: italic;
  }
`;

const Hero = () => {
  // Animation variants for staggered code lines
  const codeLineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 0.5
      }
    })
  };
  
  return (
    <HeroContainer>
      <HeroContent
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <HeroTextContent>
          <Headline
            variants={textReveal}
          >
            Founded in 2025 by Pranshu Dixit — <span>CodingBull Technovations Pvt Ltd</span>
          </Headline>
          
          <Subheadline
            variants={fadeIn}
          >
            Founded in 2025 by Pranshu Dixit, full-stack innovation with Django, React, Node.js & more—solutions for Gujju-Masla, Physioway & Harsh Patel. Full-Stack Development, Digital Transformation, Cyber Security, AI and Machine Learning.
          </Subheadline>
          
          <ButtonGroup
            variants={fadeIn}
          >
            <Button variant="primary" size="lg" onClick={() => document.getElementById('case-studies').scrollIntoView({ behavior: 'smooth' })}>See Our Case Studies</Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>View Services</Button>
          </ButtonGroup>
          
          <TrustedBy
            variants={slideUp}
          >
            <h4>Established in 2025</h4>
            <p style={{ color: '#E0E0E0', marginTop: '0.5rem' }}>
              Officially registered with mca.gov.in
            </p>
          </TrustedBy>
        </HeroTextContent>
        
        <HeroVisual>
          <AnimatedShape 
            animate={{ 
              x: [0, 30, 0],
              y: [0, 40, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <CodeBlock
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div style={{ marginTop: '20px' }}>
              <CodeLine custom={1} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">01</span>
                <span className="keyword">import</span> &#123; <span className="function">transform</span> &#125; <span className="keyword">from</span> <span className="string">'@codingbull/core'</span>;
              </CodeLine>
              <CodeLine custom={2} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">02</span>
              </CodeLine>
              <CodeLine custom={3} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">03</span><span className="comment"> Create innovative digital solutions</span>
              </CodeLine>
              <CodeLine custom={4} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">04</span><span className="keyword">const</span> <span className="function">createSolution</span> = <span className="keyword">async</span> () =&gt; &#123;
              </CodeLine>
              <CodeLine custom={5} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">05</span>  <span className="keyword">const</span> result = <span className="keyword">await</span> <span className="function">transform</span>(&#123;
              </CodeLine>
              <CodeLine custom={6} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">06</span>    business: <span className="string">'your-business'</span>,
              </CodeLine>
              <CodeLine custom={7} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">07</span>    technology: <span className="string">'cutting-edge'</span>,
              </CodeLine>
              <CodeLine custom={8} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">08</span>    innovation: <span className="string">'unlimited'</span>
              </CodeLine>
              <CodeLine custom={9} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">09</span>  &#125;);
              </CodeLine>
              <CodeLine custom={10} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">10</span>  
              </CodeLine>
              <CodeLine custom={11} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">11</span>  <span className="keyword">return</span> result.success;
              </CodeLine>
              <CodeLine custom={12} variants={codeLineVariants} initial="hidden" animate="visible">
                <span className="line-number">12</span>&#125;;
              </CodeLine>
            </div>
          </CodeBlock>
        </HeroVisual>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;