import React from 'react';
import FluidBackground from '../FluidBackground';
import HeroBackground from './HeroBackground';
import { HeroContainerStyled } from './HeroStyles';

const HeroContainer = ({ children, ...props }) => {
  return (
    <HeroContainerStyled {...props}>
      {/* Modern fluid gradient background */}
      <FluidBackground />
      
      {/* Enhanced gradient background with subtle dark color wave animations */}
      <HeroBackground />
      
      {children}
    </HeroContainerStyled>
  );
};

export default HeroContainer;
