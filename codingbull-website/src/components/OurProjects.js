import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import apiService from '../services/api';

// Optimized smooth animations - reduced complexity
const floatingParticles = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
  50% { transform: translateY(-8px) translateX(3px); opacity: 0.6; }
`;

const smoothShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const gentleGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 15px rgba(79, 172, 255, 0.2);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 25px rgba(79, 172, 255, 0.4);
    transform: scale(1.01);
  }
`;

const breathingEffect = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
`;

const energyPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(79, 172, 255, 0.3);
  }
  50% { 
    box-shadow: 0 0 20px rgba(79, 172, 255, 0.5);
  }
`;

// Main container with simplified design
const ProjectsContainer = styled.section`
  padding: ${props => props.theme.spacing[20]} ${props => props.theme.spacing[4]};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.deepBlue} 0%, 
    ${props => props.theme.colors.mediumGrey} 50%, 
    ${props => props.theme.colors.deepBlue} 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(79, 172, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(46, 139, 255, 0.08) 0%, transparent 40%);
    pointer-events: none;
    animation: ${breathingEffect} 6s ease-in-out infinite;
  }
`;

// Content wrapper with optimized glass morphism
const ProjectsContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing[8]};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.01);
    border-radius: inherit;
    border: 1px solid rgba(79, 172, 255, 0.1);
    pointer-events: none;
  }
`;

// Simplified floating particles container
const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: ${props => props.$size || '3px'};
  height: ${props => props.$size || '3px'};
  background: ${props => props.theme.colors.brandPrimary};
  border-radius: 50%;
  animation: ${floatingParticles} ${props => props.$duration || '4s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0.4;
  will-change: transform, opacity;
`;

// Section header with simplified effect
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[20]};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(79, 172, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: ${gentleGlow} 3s ease-in-out infinite;
  }
`;

// Optimized section title
const SectionTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  font-weight: ${props => props.theme.fontWeights.extrabold};
  margin-bottom: ${props => props.theme.spacing[6]};
  position: relative;
  display: inline-block;
  background: linear-gradient(
    45deg,
    ${props => props.theme.colors.brandPrimary} 0%,
    ${props => props.theme.colors.brandLight} 50%,
    ${props => props.theme.colors.brandPrimary} 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${smoothShimmer} 3s ease-in-out infinite;
  letter-spacing: -0.02em;
  will-change: background-position;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${props => props.theme.spacing[4]};
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: ${props => props.theme.colors.gradientPrimary};
    border-radius: ${props => props.theme.borderRadius.full};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

// Simplified section description
const SectionDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 800px;
  margin: 0 auto;
  line-height: ${props => props.theme.lineHeights.relaxed};
  position: relative;
  padding: ${props => props.theme.spacing[6]};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(79, 172, 255, 0.03);
    border-radius: ${props => props.theme.borderRadius.xl};
    border: 1px solid rgba(79, 172, 255, 0.08);
    backdrop-filter: blur(5px);
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
    padding: ${props => props.theme.spacing[4]};
  }
`;

// Projects showcase container
const ProjectsShowcase = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing[16]};
`;

// Simplified navigation interface
const HolographicNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(79, 172, 255, 0.2) 20%, 
      rgba(79, 172, 255, 0.4) 50%, 
      rgba(79, 172, 255, 0.2) 80%, 
      transparent 100%);
    z-index: -1;
  }
`;

// Optimized navigation button
const NavButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(79, 172, 255, 0.1);
  border: 2px solid rgba(79, 172, 255, 0.3);
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: bold;
  position: relative;
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  will-change: transform, background-color, border-color;
  
  &:hover:not(:disabled) {
    background: rgba(79, 172, 255, 0.2);
    border-color: ${props => props.theme.colors.brandPrimary};
    box-shadow: 0 0 20px rgba(79, 172, 255, 0.3);
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

// Removed unused styled components that were causing ESLint warnings

// Optimized projects gallery
const ProjectsGallery = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  padding: ${props => props.theme.spacing[8]} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: ${props => props.theme.spacing[6]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
    padding: ${props => props.theme.spacing[6]} 0;
  }
`;

// Simplified project card
const ProjectCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8);
  border-radius: ${props => props.theme.borderRadius['2xl']};
  overflow: hidden;
  border: 1px solid rgba(79, 172, 255, 0.2);
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  will-change: transform, box-shadow, border-color;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(79, 172, 255, 0.05) 0%, 
      rgba(46, 139, 255, 0.02) 50%, 
      rgba(123, 196, 255, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    border-radius: inherit;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(79, 172, 255, 0.2);
    border-color: ${props => props.theme.colors.brandPrimary};
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    &:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
`;

// Holographic project preview with 3D effects
const ProjectPreview = styled.div`
  height: 280px;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.8) 0%, 
    rgba(30, 58, 138, 0.4) 50%, 
    rgba(15, 23, 42, 0.8) 100%);
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(79, 172, 255, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(0.8) contrast(1.1) saturate(1.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(79, 172, 255, 0.3) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(46, 139, 255, 0.3) 100%);
    opacity: ${props => props.$hasImage ? 0.3 : 0.9};
    z-index: 1;
    transition: opacity 0.4s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 30% 30%, rgba(79, 172, 255, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(46, 139, 255, 0.2) 0%, transparent 50%);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: ${props => props.$hasImage ? 0.1 : 0.7};
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  &:hover img {
    transform: scale(1.08) rotateZ(1deg);
    filter: brightness(1.1) contrast(1.2) saturate(1.4);
  }
`;

// Holographic project icon for projects without images
const HolographicIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  z-index: 3;
  opacity: ${props => props.$hasImage ? 0 : 1};
  transition: all 0.4s ease;
  
  &::before {
    content: '⚡';
    display: block;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(79, 172, 255, 0.6));
    animation: ${floatingParticles} 4s ease-in-out infinite;
  }
  
  &:hover::before {
    transform: scale(1.2);
    filter: drop-shadow(0 0 30px rgba(79, 172, 255, 0.8));
  }
`;

// Futuristic project content area with glass morphism
const ProjectContent = styled.div`
  padding: 2.5rem;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(79, 172, 255, 0.5) 50%, 
      transparent 100%);
  }
`;

// Holographic project category badge
const ProjectCategory = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(79, 172, 255, 0.1);
  border: 1px solid rgba(79, 172, 255, 0.3);
  color: ${props => props.theme.colors.brandPrimary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  position: relative;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: conic-gradient(from 0deg, 
      ${props => props.theme.colors.brandPrimary}, 
      ${props => props.theme.colors.brandLight}, 
      ${props => props.theme.colors.brandSecondary}, 
      ${props => props.theme.colors.brandPrimary});
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &::after {
    content: '●';
    color: ${props => props.theme.colors.brandPrimary};
    animation: ${energyPulse} 2s ease-in-out infinite;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    background: rgba(79, 172, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(79, 172, 255, 0.2);
  }
`;

// Futuristic project title with holographic effect
const ProjectTitle = styled(motion.h3)`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 800;
  line-height: 1.2;
  position: relative;
  transition: all 0.4s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(79, 172, 255, 0.1) 50%, 
      transparent 70%);
    background-size: 200% 200%;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
    border-radius: ${props => props.theme.borderRadius.md};
  }
  
  &:hover {
    background: linear-gradient(45deg, 
      ${props => props.theme.colors.brandPrimary}, 
      ${props => props.theme.colors.brandLight}, 
      ${props => props.theme.colors.brandSecondary});
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(79, 172, 255, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
`;

// Enhanced project client with digital styling
const ProjectClient = styled(motion.p)`
  color: ${props => props.theme.colors.textTertiary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-family: ${props => props.theme.fonts.code};
  margin-bottom: 2rem;
  font-weight: 600;
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: ${props => props.theme.colors.brandPrimary};
    animation: ${energyPulse} 1.5s ease-in-out infinite;
  }
`;

// Futuristic project details with data panels
const ProjectDetails = styled(motion.div)`
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

// Individual detail item with holographic styling
const DetailItem = styled(motion.div)`
  padding: 1rem;
  background: rgba(79, 172, 255, 0.05);
  border: 1px solid rgba(79, 172, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  position: relative;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${props => props.theme.colors.gradientPrimary};
    border-radius: 0 ${props => props.theme.borderRadius.sm} ${props => props.theme.borderRadius.sm} 0;
  }
  
  &:hover {
    background: rgba(79, 172, 255, 0.1);
    border-color: rgba(79, 172, 255, 0.3);
    transform: translateX(5px);
  }
  
  h4 {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.brandPrimary};
    margin-bottom: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: ${props => props.theme.fonts.code};
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 30px;
      height: 1px;
      background: ${props => props.theme.colors.brandPrimary};
      box-shadow: 0 0 5px rgba(79, 172, 255, 0.5);
    }
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSizes.sm};
    line-height: 1.6;
    margin: 0;
  }
`;

// Futuristic tech stack with glowing tags
const TechStack = styled(motion.div)`
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TechTag = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(79, 172, 255, 0.1);
  border: 1px solid rgba(79, 172, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  color: ${props => props.theme.colors.brandPrimary};
  position: relative;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: conic-gradient(from 0deg, 
      transparent 0deg,
      rgba(79, 172, 255, 0.5) 90deg,
      transparent 180deg,
      rgba(79, 172, 255, 0.5) 270deg,
      transparent 360deg);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &::after {
    content: '◆';
    font-size: 0.6em;
    color: ${props => props.theme.colors.brandPrimary};
    opacity: 0.7;
  }
  
  &:hover {
    background: rgba(79, 172, 255, 0.2);
    border-color: ${props => props.theme.colors.brandPrimary};
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 25px rgba(79, 172, 255, 0.3);
    
    &::before {
      opacity: 1;
      animation: ${energyPulse} 1.5s ease-in-out infinite;
    }
  }
`;

// Futuristic action buttons container
const ProjectActions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

// Holographic view more button
const ViewMoreButton = styled(motion.button)`
  background: rgba(79, 172, 255, 0.1);
  color: ${props => props.theme.colors.textPrimary};
  border: 2px solid rgba(79, 172, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.sm};
  font-family: ${props => props.theme.fonts.code};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: conic-gradient(from 0deg, 
      ${props => props.theme.colors.brandPrimary}, 
      ${props => props.theme.colors.brandLight}, 
      ${props => props.theme.colors.brandSecondary}, 
      ${props => props.theme.colors.brandPrimary});
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &::after {
    content: '→';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
    font-size: 1.2em;
  }
  
  &:hover {
    background: rgba(79, 172, 255, 0.2);
    border-color: ${props => props.theme.colors.brandPrimary};
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
      0 15px 35px rgba(79, 172, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    &::before {
      opacity: 1;
      animation: ${energyPulse} 2s ease-in-out infinite;
    }
    
    &::after {
      transform: translateY(-50%) translateX(5px);
    }
  }
`;

// Quantum navigation indicators
const QuantumIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[4]};
  margin: ${props => props.theme.spacing[12]} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(79, 172, 255, 0.3) 50%, 
      transparent 100%);
    z-index: -1;
  }
`;

// Quantum navigation dot
const QuantumDot = styled(motion.button)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? 'rgba(79, 172, 255, 0.8)' 
    : 'rgba(79, 172, 255, 0.2)'};
  border: 2px solid ${props => props.$active 
    ? props.theme.colors.brandPrimary 
    : 'rgba(79, 172, 255, 0.3)'};
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, 
      transparent 0deg,
      rgba(79, 172, 255, 0.4) 90deg,
      transparent 180deg,
      rgba(79, 172, 255, 0.4) 270deg,
      transparent 360deg);
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: ${props => props.theme.colors.brandPrimary};
    border-radius: 50%;
    opacity: ${props => props.$active ? 1 : 0};
    box-shadow: 0 0 10px rgba(79, 172, 255, 0.8);
    animation: ${props => props.$active ? energyPulse : 'none'} 1.5s ease-in-out infinite;
  }
  
  &:hover {
    transform: scale(1.3);
    background: rgba(79, 172, 255, 0.6);
    border-color: ${props => props.theme.colors.brandPrimary};
    
    &::before {
      opacity: 1;
    }
  }
`;

// Futuristic CTA Section with holographic effects
const CTASection = styled(motion.div)`
  text-align: center;
  padding: 4rem 3rem;
  background: rgba(15, 23, 42, 0.8);
  border-radius: ${props => props.theme.borderRadius['3xl']};
  border: 2px solid rgba(79, 172, 255, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  margin-top: ${props => props.theme.spacing[16]};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(79, 172, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(46, 139, 255, 0.1) 0%, transparent 50%),
      linear-gradient(45deg, transparent 30%, rgba(79, 172, 255, 0.05) 50%, transparent 70%);
    pointer-events: none;

  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: conic-gradient(from 0deg, 
      transparent 0deg,
      rgba(79, 172, 255, 0.4) 90deg,
      transparent 180deg,
      rgba(79, 172, 255, 0.4) 270deg,
      transparent 360deg);
    border-radius: inherit;
    z-index: -1;
    animation: ${energyPulse} 1.5s ease-in-out infinite;
  }
`;

// Holographic CTA Title
const CTATitle = styled(motion.h3)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 900;
  position: relative;
  background: linear-gradient(45deg, 
    ${props => props.theme.colors.brandPrimary}, 
    ${props => props.theme.colors.brandLight}, 
    ${props => props.theme.colors.brandSecondary});
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  text-shadow: 0 0 30px rgba(79, 172, 255, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(79, 172, 255, 0.1), transparent);
    background-size: 200% 200%;

    z-index: -1;
    border-radius: ${props => props.theme.borderRadius.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

// Enhanced CTA Description
const CTADescription = styled(motion.p)`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-size: ${props => props.theme.fontSizes.xl};
  line-height: 1.7;
  position: relative;
  padding: ${props => props.theme.spacing[4]};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(79, 172, 255, 0.05);
    border-radius: ${props => props.theme.borderRadius.xl};
    border: 1px solid rgba(79, 172, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
    padding: ${props => props.theme.spacing[3]};
  }
`;



const OurProjects = () => {
  // Hooks
  const navigate = useNavigate();
  
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [isInView, setIsInView] = useState(false);
  
  // Refs
  const ref = useRef(null);
  
  // Custom useInView hook replacement
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Pagination settings
  const projectsPerPage = 6;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  
  // Generate floating particles - reduced count
  const generateParticles = useCallback(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 3 + 5}s`,
      delay: `${Math.random() * 2}s`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
  }, []);
  
  const particles = generateParticles();
  
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.projects.getProjects();
        if (response && response.results && Array.isArray(response.results)) {
          // Transform API data to match component expectations
          const transformedProjects = response.results.map(project => ({
            id: project.id,
            title: project.title,
            client: project.client_name,
            image: project.image,
            category: project.category,
            challenge: project.challenge,
            solution: project.solution,
            outcome: project.outcome,
            techUsed: Array.isArray(project.technologies) 
              ? project.technologies.map(tech => tech.name || tech)
              : (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : ['Various technologies'])
          }));
          setProjects(transformedProjects);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        // Enhanced fallback data with better content
        setProjects([
          {
            id: 'fallback-1',
            title: "E-commerce Platform",
            client: "Retail Solutions Inc.",
            image: null,
            category: 'E-commerce',
            challenge: "Modernize 40-year-old brand with online ordering system to reach new customers and compete digitally.",
            solution: "Built scalable platform with Django backend, React frontend, and Docker deployment for reliability.",
            outcome: "Launched in 4 weeks; 30% increase in online orders and 50% growth in customer base within first month.",
            techUsed: ['Django', 'React', 'Tailwind CSS', 'Docker', 'PostgreSQL']
          },
          {
            id: 'fallback-2',
            title: "Healthcare Management System",
            client: "MedTech Solutions",
            image: null,
            category: 'Healthcare',
            challenge: "Secure, enterprise-grade application to manage operations across multiple healthcare locations.",
            solution: "Developed HIPAA-compliant system with Django REST Framework, React, and advanced security features.",
            outcome: "Deployed in 8 weeks; 40% operational efficiency improvement and 15% increase in patient satisfaction.",
            techUsed: ['Django', 'React', 'PostgreSQL', 'Docker', 'Redis']
          },
          {
            id: 'fallback-3',
            title: "Analytics Dashboard",
            client: "DataFlow Enterprises",
            image: null,
            category: 'Analytics',
            challenge: "Real-time tracking and analytics solution for distributed teams and complex data workflows.",
            solution: "Custom dashboard with Flask backend, MongoDB for data storage, and interactive Chart.js visualizations.",
            outcome: "Saved 20+ hours monthly manual work, reduced errors by 90%, and improved decision-making speed.",
            techUsed: ['Flask', 'MongoDB', 'Chart.js', 'Docker', 'Redis']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Update visible projects when page changes
  useEffect(() => {
    const startIndex = currentPage * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    setVisibleProjects(projects.slice(startIndex, endIndex));
  }, [projects, currentPage, projectsPerPage]);

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const goToNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages - 1, page));
  };

  // Project click handler
  const handleProjectClick = (project) => {
    console.log('Project clicked:', project);
    // Navigate to individual project page
    navigate(`/our-projects/${project.id}`);
  };
  
  // Show loading state
  if (loading) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
              Loading projects...
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
              {error}
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  // Show empty state
  if (!projects.length) {
    return (
      <ProjectsContainer id="our-projects">
        <ProjectsContent>
          <SectionHeader>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Projects
            </SectionTitle>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
              No projects available at the moment.
            </div>
          </SectionHeader>
        </ProjectsContent>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer id="our-projects" ref={ref}>
      {/* Floating Particles */}
      <ParticlesContainer>
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            $size={particle.size}
            $duration={particle.duration}
            $delay={particle.delay}
            style={{
              top: particle.top,
              left: particle.left,
            }}
          />
        ))}
      </ParticlesContainer>

      <ProjectsContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our Projects
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover how we've transformed businesses with innovative solutions and cutting-edge technology. 
            Each project represents our commitment to excellence and innovation in the digital realm.
          </SectionDescription>
        </SectionHeader>

        <ProjectsShowcase>
          {/* Holographic Navigation - only shown when there are more than 3 projects */}
          {projects.length > 3 && (
            <HolographicNav>
              <NavButton
                onClick={goToPrevious}
                disabled={currentPage === 0}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(79, 172, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeOut"
                }}
              >
                ←
              </NavButton>
              
              <NavButton
                onClick={goToNext}
                disabled={currentPage >= totalPages - 1}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(79, 172, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeOut"
                }}
              >
                →
              </NavButton>
            </HolographicNav>
          )}

          {/* Optimized Projects Gallery */}
          <ProjectsGallery
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence>
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={`${project.id}-${currentPage}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  }}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.02,
                    transition: { 
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                  <ProjectPreview $hasImage={!!project.image}>
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={`${project.title} preview`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <HolographicIcon $hasImage={!!project.image} />
                  </ProjectPreview>
              
              <ProjectContent>
                <ProjectCategory>
                  {project.category}
                </ProjectCategory>
                
                <ProjectTitle>
                  {project.title}
                </ProjectTitle>
                
                <ProjectClient>
                  Client: {project.client}
                </ProjectClient>
                
                <ProjectDetails>
                  <DetailItem>
                    <h4>Challenge</h4>
                    <p>{project.challenge}</p>
                  </DetailItem>
                  
                  <DetailItem>
                    <h4>Solution</h4>
                    <p>{project.solution}</p>
                  </DetailItem>
                  
                  <DetailItem>
                    <h4>Outcome</h4>
                    <p>{project.outcome}</p>
                  </DetailItem>
                </ProjectDetails>
                
                <TechStack>
                  {project.techUsed.map((tech, techIndex) => (
                    <TechTag
                      key={techIndex}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -1,
                        backgroundColor: "rgba(79, 172, 255, 0.2)"
                      }}
                      transition={{ 
                        duration: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {tech}
                    </TechTag>
                  ))}
                </TechStack>
                
                <ProjectActions>
                  <ViewMoreButton
                    whileHover={{ 
                      scale: 1.02, 
                      y: -1,
                      boxShadow: "0 8px 25px rgba(79, 172, 255, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ 
                      duration: 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project);
                    }}
                  >
                    View Details
                  </ViewMoreButton>
                </ProjectActions>
              </ProjectContent>
            </ProjectCard>
          ))}
        </AnimatePresence>
      </ProjectsGallery>

      {/* Quantum Navigation Indicators - only shown when there are more than 3 projects */}
      {projects.length > 3 && (
        <QuantumIndicators>
          {Array.from({ length: totalPages }, (_, index) => (
            <QuantumDot
              key={index}
              $active={currentPage === index}
              onClick={() => goToPage(index)}
              whileHover={{ 
                scale: 1.2,
                boxShadow: "0 0 20px rgba(79, 172, 255, 0.6)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ 
                duration: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ))}
        </QuantumIndicators>
      )}
    </ProjectsShowcase>

        {/* CTA Section */}
        <CTASection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CTATitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Ready to Start Your Project?
          </CTATitle>
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Let's discuss how we can help transform your business with innovative technology solutions. 
            Our team is ready to bring your vision to life.
          </CTADescription>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link to="/contact">
              <Button 
                variant="primary" 
                size="lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
              </Button>
            </Link>
          </motion.div>
        </CTASection>
      </ProjectsContent>
    </ProjectsContainer>
  );
};

export default OurProjects;