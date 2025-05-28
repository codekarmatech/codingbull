import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { hoverScale } from '../animations/variants';

// Custom shouldForwardProp function to filter out non-DOM props
const shouldForwardProp = prop => 
  !['variant', 'size', 'fullWidth', 'whileHover', 'whileTap'].includes(prop);

// Button variants
const VARIANTS = {
  primary: {
    background: props => props.theme.colors.gradientPrimary,
    color: props => props.theme.colors.textPrimary,
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: props => props.theme.colors.electricBlue,
    border: props => `2px solid ${props.theme.colors.electricBlue}`,
  },
  outline: {
    background: 'transparent',
    color: props => props.theme.colors.textPrimary,
    border: props => `2px solid ${props.theme.colors.textPrimary}`,
  },
  ghost: {
    background: 'transparent',
    color: props => props.theme.colors.electricBlue,
    border: 'none',
  },
};

// Button sizes
const SIZES = {
  sm: {
    padding: '0.5rem 1rem',
    fontSize: props => props.theme.fontSizes.sm,
  },
  md: {
    padding: '0.75rem 1.5rem',
    fontSize: props => props.theme.fontSizes.md,
  },
  lg: {
    padding: '1rem 2rem',
    fontSize: props => props.theme.fontSizes.lg,
  },
};

const StyledButton = styled(motion.button).withConfig({
  shouldForwardProp
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast} ease;
  position: relative;
  overflow: hidden;
  
  // Apply variant styles
  background: ${props => props.variant && VARIANTS[props.variant] ? VARIANTS[props.variant].background : VARIANTS.primary.background};
  color: ${props => props.variant && VARIANTS[props.variant] ? VARIANTS[props.variant].color : VARIANTS.primary.color};
  border: ${props => props.variant && VARIANTS[props.variant] ? VARIANTS[props.variant].border : VARIANTS.primary.border};
  
  // Apply size styles
  padding: ${props => props.size && SIZES[props.size] ? SIZES[props.size].padding : SIZES.md.padding};
  font-size: ${props => props.size && SIZES[props.size] ? SIZES[props.size].fontSize : SIZES.md.fontSize};
  
  // Full width option
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  // Disabled state
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  // Hover effect (when not disabled)
  &:hover:not(:disabled) {
    box-shadow: ${props => props.theme.shadows.md};
    
    ${props => props.variant === 'primary' && `
      background: ${props.theme.colors.gradientSecondary};
    `}
    
    ${props => props.variant === 'secondary' && `
      background: ${props.theme.colors.electricBlue};
      color: ${props.theme.colors.textPrimary};
    `}
    
    ${props => props.variant === 'outline' && `
      background: rgba(255, 255, 255, 0.1);
    `}
    
    ${props => props.variant === 'ghost' && `
      background: rgba(0, 191, 255, 0.1);
    `}
  }
  
  // Focus state
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.3);
  }
  
  // Active state
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  // Ripple effect
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple 0.6s linear;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false, 
  onClick,
  ...props 
}) => {
  // Ripple effect handler
  const createRipple = (event) => {
    if (disabled) return;
    
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
  };
  
  const handleClick = (event) => {
    createRipple(event);
    if (onClick && !disabled) {
      onClick(event);
    }
  };
  
  // Filter out custom props that shouldn't be passed to DOM elements
  const { whileHover, whileTap, ...buttonProps } = props;
  
  // Create motion props object to avoid passing them directly to DOM
  const motionProps = !disabled ? {
    whileHover: hoverScale,
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={handleClick}
      {...motionProps}
      {...buttonProps}
    >
      {children}
    </StyledButton>
  );
};

export default Button;