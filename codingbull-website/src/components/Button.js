import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../utils/accessibility';
import { shouldForwardButtonProp } from '../utils/styledHelpers';

// Professional button variants using theme system
const VARIANTS = {
  primary: {
    background: props => props.theme.colors.buttonPrimary,
    color: props => props.theme.colors.white,
    border: 'none',
    boxShadow: props => props.theme.shadows.button,
  },
  secondary: {
    background: props => props.theme.colors.buttonSecondary,
    color: props => props.theme.colors.textPrimary,
    border: props => `2px solid ${props.theme.colors.borderGrey}`,
    boxShadow: props => props.theme.shadows.base,
  },
  outline: {
    background: 'transparent',
    color: props => props.theme.colors.textPrimary,
    border: props => `2px solid ${props.theme.colors.brandPrimary}`,
    boxShadow: props => props.theme.shadows.sm,
  },
  ghost: {
    background: 'transparent',
    color: props => props.theme.colors.brandPrimary,
    border: 'none',
    boxShadow: 'none',
  },
};

// Professional button sizes using theme spacing
const SIZES = {
  sm: {
    padding: props => `${props.theme.spacing[2]} ${props.theme.spacing[3]}`,
    fontSize: props => props.theme.fontSizes.sm,
  },
  md: {
    padding: props => `${props.theme.spacing[3]} ${props.theme.spacing[6]}`,
    fontSize: props => props.theme.fontSizes.base,
  },
  lg: {
    padding: props => `${props.theme.spacing[4]} ${props.theme.spacing[8]}`,
    fontSize: props => props.theme.fontSizes.lg,
  },
};

const StyledButton = styled(motion.button).withConfig({
  shouldForwardProp: shouldForwardButtonProp
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-family: ${props => props.theme.fonts.primary};
  letter-spacing: 0.025em;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: none;

  // Apply variant styles
  background: ${props => {
    const variant = VARIANTS[props.variant] || VARIANTS.primary;
    return typeof variant.background === 'function' ? variant.background(props) : variant.background;
  }};
  color: ${props => {
    const variant = VARIANTS[props.variant] || VARIANTS.primary;
    return typeof variant.color === 'function' ? variant.color(props) : variant.color;
  }};
  border: ${props => {
    const variant = VARIANTS[props.variant] || VARIANTS.primary;
    return typeof variant.border === 'function' ? variant.border(props) : variant.border;
  }};
  box-shadow: ${props => {
    const variant = VARIANTS[props.variant] || VARIANTS.primary;
    return typeof variant.boxShadow === 'function' ? variant.boxShadow(props) : variant.boxShadow;
  }};

  // Apply size styles
  padding: ${props => {
    const size = SIZES[props.size] || SIZES.md;
    return typeof size.padding === 'function' ? size.padding(props) : size.padding;
  }};
  font-size: ${props => {
    const size = SIZES[props.size] || SIZES.md;
    return typeof size.fontSize === 'function' ? size.fontSize(props) : size.fontSize;
  }};

  // Full width option
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  // Disabled state
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  // Professional glow effect using theme
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: ${props => props.variant === 'primary' 
      ? props.theme.colors.gradientPrimary
      : props.variant === 'secondary' 
        ? props.theme.colors.gradientSecondary
        : 'transparent'};
    opacity: 0;
    border-radius: inherit;
    transition: opacity ${props => props.theme.animations.normal};
    filter: blur(8px);
  }

  // Professional hover effects using theme
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' 
      ? props.theme.shadows.buttonHover
      : props.variant === 'secondary' 
        ? props.theme.shadows.cardHover
        : props.variant === 'outline'
          ? props.theme.shadows.glow
          : 'none'};

    &::before {
      opacity: 0.7;
    }

    ${props => props.variant === 'primary' && `
      background: ${props.theme.colors.buttonHoverPrimary};
    `}

    ${props => props.variant === 'secondary' && `
      background: ${props.theme.colors.glassLight};
      color: ${props.theme.colors.brandPrimary};
      border-color: ${props.theme.colors.brandPrimary};
    `}

    ${props => props.variant === 'outline' && `
      background: ${props.theme.colors.overlayLight};
      color: ${props.theme.colors.brandPrimary};
    `}

    ${props => props.variant === 'ghost' && `
      background: ${props.theme.colors.glassLight};
      color: ${props.theme.colors.brandPrimary};
    `}
  }

  // Focus state using theme variables
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 172, 255, 0.3), 
                ${props => props.variant === 'primary' 
                  ? props.theme.shadows.buttonHover
                  : props.variant === 'secondary' 
                    ? props.theme.shadows.buttonHoverSecondary
                    : '0 8px 25px rgba(79, 172, 255, 0.2)'};
  }

  // Active state using theme variables
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${props => props.variant === 'primary' 
      ? props.theme.shadows.button
      : props.variant === 'secondary' 
        ? props.theme.shadows.buttonSecondary
        : props.variant === 'outline'
          ? props.theme.shadows.sm
          : 'none'};
  }

  // Enhanced ripple effect using theme variables
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: ${props => props.variant === 'primary' 
      ? 'rgba(79, 172, 255, 0.5)' 
      : props.variant === 'secondary' 
        ? 'rgba(79, 172, 255, 0.5)'
        : 'rgba(255, 255, 255, 0.5)'};
    transform: scale(0);
    animation: ripple 0.8s ${props => props.theme.animations.bounce};
    pointer-events: none;
  }

  @keyframes ripple {
    to {
      transform: scale(5);
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
  loading = false,
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  role,
  ...props
}) => {
  const reducedMotion = prefersReducedMotion();

  // Ripple effect handler
  const createRipple = (event) => {
    if (disabled || loading || reducedMotion) return;

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
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    createRipple(event);
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    // Handle Enter and Space keys for better accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  // Filter out custom props that shouldn't be passed to DOM elements
  const { whileHover, whileTap, ...buttonProps } = props;

  // Create enhanced motion props object with more dynamic animations
  const motionProps = !disabled && !loading && !reducedMotion ? {
    whileHover: { 
      scale: 1.05,
      y: -3,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    whileTap: { 
      scale: 0.95, 
      y: 2,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      }
    },
    initial: { 
      y: 0,
      scale: 1
    },
    animate: { 
      y: [0, -3, 0],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  } : {};

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type={type}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      role={role}
      tabIndex={disabled ? -1 : 0}
      {...motionProps}
      {...buttonProps}
    >
      {loading ? (
        <>
          <span aria-live="polite" aria-label="Loading">
            Loading...
          </span>
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default memo(Button);
