import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useParams } from 'react-router-dom';
import { pageTransition, fadeIn } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SEO from '../components/SEO';
import apiService from '../services/api';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: #121212;
  color: #f0f0f0;
`;

// Page content
const PageContent = styled.div`
  padding-top: 80px; // Account for fixed navbar
  position: relative;
`;

// Hero section with modern design
const ProjectsHero = styled.section`
  position: relative;
  padding: 10rem 2rem 14rem;
  background: linear-gradient(135deg, #2d3748, #1a365d);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%233a7bd5' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10rem;
    background: #1a1a1a;
    clip-path: polygon(0 60%, 100% 0, 100% 100%, 0% 100%);
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
  text-align: center;
`;

// Hero title with animated gradient
const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  color: white;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
  
  span {
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 100%;
      height: 4px;
      background: white;
      border-radius: 4px;
      transform: scaleX(0);
      transform-origin: left;
      animation: scaleIn 1.5s ease forwards 0.5s;
    }
  }
  
  @keyframes scaleIn {
    to { transform: scaleX(1); }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3.5rem;
  }
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: white;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  text-align: center;
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Project counter
const ProjectCounter = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 3rem;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  span {
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin: 0 1rem;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  p {
    font-size: 1.25rem;
    color: white;
    font-weight: 500;
  }
`;

// Project showcase section
const ProjectShowcaseSection = styled.section`
  position: relative;
  padding: 8rem 2rem;
  background: #1a1a1a;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233a7bd5' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

// Project showcase content
const ShowcaseContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`;

// Project filter tabs
const FilterTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  position: relative;
  padding: 0 1rem;

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

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
`;

// Filter tab
const FilterTab = styled.button`
  background: transparent;
  color: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.textSecondary};
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

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

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.6rem 1rem;
    font-size: ${props => props.theme.fontSizes.sm};
    
    &::after {
      bottom: -0.3rem;
      height: 2px;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.5rem 0.8rem;
    font-size: ${props => props.theme.fontSizes.xs};
  }
`;

// Project detail view (for when a project is selected)
const ProjectDetailView = styled(motion.div)`
  margin-bottom: 6rem;
  position: relative;
`;

// Project detail container
const ProjectDetailContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

// Project detail header
const ProjectDetailHeader = styled.div`
  position: relative;
  height: 500px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 400px;
  }
`;

// Project detail banner
const ProjectDetailBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3748, #1a365d);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%233a7bd5' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E") repeat;
    opacity: 0.3;
  }
  
  img {
    max-width: 60%;
    max-height: 60%;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    transform: translateY(-10px);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(-10px); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(-10px); }
  }
`;

// Project detail overlay
const ProjectDetailOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 3rem;
  background: linear-gradient(to top, rgba(30, 30, 30, 0.95) 20%, transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

// Project detail title area
const ProjectDetailTitleArea = styled.div`
  max-width: 70%;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

// Project detail category
const ProjectDetailCategory = styled.span`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(58, 123, 213, 0.15);
  color: #60a5fa;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  border: 1px solid rgba(58, 123, 213, 0.3);
`;

// Project detail title
const ProjectDetailTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

// Project detail client
const ProjectDetailClient = styled.p`
  font-size: 1.1rem;
  color: #a0aec0;
  font-weight: 500;
`;

// Project detail logo
const ProjectDetailLogo = styled.div`
  width: 100px;
  height: 100px;
  background: #2d3748;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: translateY(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(1.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 80px;
    height: 80px;
    transform: translateY(0);
  }
`;

// Project detail body
const ProjectDetailBody = styled.div`
  padding: 4rem 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  background: #1e1e1e;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    padding: 3rem 2rem;
    gap: 3rem;
  }
`;

// Project detail main content
const ProjectDetailMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Project detail section
const ProjectDetailSection = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, rgba(58, 123, 213, 0.2), rgba(0, 210, 255, 0.2));
    opacity: 0.5;
  }
  
  &:last-child::after {
    display: none;
  }
`;

// Project detail section title
const ProjectDetailSectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  color: #60a5fa;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 24px;
    background: linear-gradient(to bottom, #3a7bd5, #2b6cb0);
    margin-right: 1rem;
    border-radius: 4px;
  }
`;

// Project detail text
const ProjectDetailText = styled.p`
  color: #a0aec0;
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-size: 1.05rem;
`;

// Project detail sidebar
const ProjectDetailSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

// Project detail tech stack
const ProjectDetailTechStack = styled.div`
  background: #2d3748;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

// Tech stack title
const TechStackTitle = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #3a7bd5, #2b6cb0);
    border-radius: 3px;
  }
`;

// Tech stack list
const TechStackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

// Tech stack item
const TechStackItem = styled.span`
  background: #1e1e1e;
  border: 1px solid rgba(58, 123, 213, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  color: #a0aec0;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-color: rgba(58, 123, 213, 0.6);
    color: #60a5fa;
  }
`;

// Project detail testimonial
const ProjectDetailTestimonial = styled.div`
  background: #2d3748;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
  &::before {
    content: """;
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-size: 5rem;
    color: rgba(58, 123, 213, 0.2);
    font-family: Georgia, serif;
    line-height: 1;
  }
`;

// Testimonial quote
const TestimonialQuote = styled.blockquote`
  font-style: italic;
  color: #a0aec0;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  position: relative;
  padding: 1rem 0 0 0.5rem;
  font-size: 1.05rem;
`;

// Testimonial author
const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(58, 123, 213, 0.2);
  padding-top: 1.5rem;
`;

// Testimonial author image
const TestimonialAuthorImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #1e1e1e;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  
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
  font-weight: 700;
  color: #ffffff;
  font-size: 1.1rem;
`;

// Testimonial author title
const TestimonialAuthorTitle = styled.p`
  font-size: 0.9rem;
  color: #a0aec0;
  margin-top: 0.25rem;
`;

// Project detail back button
const ProjectDetailBackButton = styled.button`
  background: #2d3748;
  color: #a0aec0;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #60a5fa;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(58, 123, 213, 0.4);
    
    svg {
      transform: translateX(-5px);
    }
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
  const { id: projectId } = useParams();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

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
        if (response && response.results && response.results.length > 0) {
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
    
    fetchProjects();
  }, [mockProjects]);
  
  // Handle project selection from URL
  useEffect(() => {
    // Check URL parameter first, then search parameter
    const urlProjectId = projectId;
    const searchProjectId = searchParams.get('id');
    const currentProjectId = urlProjectId || searchProjectId;
    
    if (currentProjectId && projects.length > 0) {
      const selectedProject = projects.find(p => p.id.toString() === currentProjectId);
      if (selectedProject) {
        setSelectedProject(selectedProject);
      }
    } else if (!currentProjectId) {
      setSelectedProject(null);
    }
  }, [projectId, searchParams, projects]);
  
  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(project => project.category === filter);
  }, [filter, projects]);
  

  
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
              <span>Our Projects</span>
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
              <span>32+</span>
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