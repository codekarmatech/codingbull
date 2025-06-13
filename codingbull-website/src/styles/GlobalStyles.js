import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset and base styles */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.deepBlue};
    color: ${props => props.theme.colors.textPrimary};
    line-height: ${props => props.theme.lineHeights.normal};
    font-weight: ${props => props.theme.fontWeights.normal};
    overflow-x: hidden;
    min-height: 100vh;
    
    /* Enhanced background with subtle gradient */
    background: linear-gradient(135deg, 
      ${props => props.theme.colors.deepBlue} 0%, 
      ${props => props.theme.colors.darkGrey} 50%, 
      ${props => props.theme.colors.deepBlue} 100%);
    background-attachment: fixed;
  }

  /* Professional scrollbar styling */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.mediumGrey};
    border-radius: ${props => props.theme.borderRadius.md};
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, 
      ${props => props.theme.colors.brandPrimary} 0%, 
      ${props => props.theme.colors.brandSecondary} 100%);
    border-radius: ${props => props.theme.borderRadius.md};
    border: 2px solid ${props => props.theme.colors.mediumGrey};
    
    &:hover {
      background: linear-gradient(135deg, 
        ${props => props.theme.colors.brandLight} 0%, 
        ${props => props.theme.colors.brandPrimary} 100%);
    }
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.colors.mediumGrey};
  }

  /* Enhanced link styles */
  a {
    text-decoration: none;
    color: ${props => props.theme.colors.brandPrimary};
    transition: all ${props => props.theme.animations.normal};
    position: relative;
    
    &:hover {
      color: ${props => props.theme.colors.brandLight};
      text-shadow: 0 0 8px rgba(79, 172, 255, 0.3);
    }
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.brandPrimary};
      outline-offset: 2px;
      border-radius: ${props => props.theme.borderRadius.sm};
    }
  }

  /* Enhanced typography hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.display};
    font-weight: ${props => props.theme.fontWeights.bold};
    line-height: ${props => props.theme.lineHeights.tight};
    margin-bottom: ${props => props.theme.spacing[6]};
    color: ${props => props.theme.colors.textPrimary};
    letter-spacing: -0.025em;
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['5xl']};
    font-weight: ${props => props.theme.fontWeights.extrabold};
    line-height: ${props => props.theme.lineHeights.none};
    margin-bottom: ${props => props.theme.spacing[8]};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSizes['4xl']};
    }
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing[6]};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
    }
  }

  h3 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin-bottom: ${props => props.theme.spacing[5]};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: ${props => props.theme.fontSizes['2xl']};
    }
  }

  h4 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin-bottom: ${props => props.theme.spacing[4]};
  }

  h5 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  h6 {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin-bottom: ${props => props.theme.spacing[3]};
  }

  /* Enhanced paragraph and text styles */
  p {
    margin-bottom: ${props => props.theme.spacing[4]};
    line-height: ${props => props.theme.lineHeights.relaxed};
    color: ${props => props.theme.colors.textSecondary};
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Professional form elements */
  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.brandPrimary};
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    background: ${props => props.theme.colors.surfaceGrey};
    border: 1px solid ${props => props.theme.colors.borderGrey};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
    color: ${props => props.theme.colors.textPrimary};
    transition: all ${props => props.theme.animations.normal};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.brandPrimary};
      box-shadow: 0 0 0 3px rgba(79, 172, 255, 0.1);
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textMuted};
    }
  }

  /* Enhanced image handling */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Professional selection styling */
  ::selection {
    background: rgba(43, 155, 244, 0.3);
    color: ${props => props.theme.colors.textPrimary};
  }

  ::-moz-selection {
    background: rgba(43, 155, 244, 0.3);
    color: ${props => props.theme.colors.textPrimary};
  }

  /* Enhanced focus styles for accessibility */
  *:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  *:focus-visible {
    outline: 3px solid ${props => props.theme.colors.brandPrimary};
    outline-offset: 2px;
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: 0 0 0 2px rgba(43, 155, 244, 0.3);
  }

  /* Smooth animations for reduced motion users */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    html {
      scroll-behavior: auto;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: #000000;
      color: #ffffff;
    }
  }
`;

export default GlobalStyles;