/**
 * Professional Typography System
 * Enterprise-grade typography with Google Fonts integration and accessibility
 */

// Professional font stacks with fallbacks
export const fontStacks = {
  // Primary font stack - Modern, professional, highly readable
  primary: {
    family: "'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    display: 'swap',
    preload: true,
  },
  
  // Display font stack - For headings and hero text
  display: {
    family: "'Poppins', 'Inter', 'Helvetica Neue', Arial, sans-serif",
    weights: [400, 500, 600, 700, 800, 900],
    display: 'swap',
    preload: true,
  },
  
  // Code font stack - For technical content
  code: {
    family: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
    weights: [400, 500, 600, 700],
    display: 'swap',
    preload: false,
  },
  
  // Secondary font stack - For body text alternatives
  secondary: {
    family: "'Source Sans Pro', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    weights: [300, 400, 600, 700],
    display: 'swap',
    preload: false,
  },
};

// Professional font size scale (16px base)
export const fontSizes = {
  // Micro text
  xs: {
    size: '0.75rem',    // 12px
    lineHeight: 1.33,
    letterSpacing: '0.025em',
    use: 'Captions, labels, micro-copy',
  },
  
  // Small text
  sm: {
    size: '0.875rem',   // 14px
    lineHeight: 1.43,
    letterSpacing: '0.016em',
    use: 'Secondary text, form labels',
  },
  
  // Base text
  base: {
    size: '1rem',       // 16px
    lineHeight: 1.5,
    letterSpacing: '0',
    use: 'Body text, paragraphs',
  },
  
  // Medium text
  md: {
    size: '1.125rem',   // 18px
    lineHeight: 1.44,
    letterSpacing: '-0.006em',
    use: 'Large body text, introductions',
  },
  
  // Large text
  lg: {
    size: '1.25rem',    // 20px
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    use: 'Subheadings, large text',
  },
  
  // Extra large
  xl: {
    size: '1.5rem',     // 24px
    lineHeight: 1.33,
    letterSpacing: '-0.014em',
    use: 'Small headings, card titles',
  },
  
  // 2X large
  '2xl': {
    size: '1.875rem',   // 30px
    lineHeight: 1.27,
    letterSpacing: '-0.017em',
    use: 'Section headings',
  },
  
  // 3X large
  '3xl': {
    size: '2.25rem',    // 36px
    lineHeight: 1.22,
    letterSpacing: '-0.019em',
    use: 'Page headings',
  },
  
  // 4X large
  '4xl': {
    size: '3rem',       // 48px
    lineHeight: 1.17,
    letterSpacing: '-0.021em',
    use: 'Hero headings',
  },
  
  // 5X large
  '5xl': {
    size: '3.75rem',    // 60px
    lineHeight: 1.13,
    letterSpacing: '-0.022em',
    use: 'Display headings',
  },
  
  // 6X large
  '6xl': {
    size: '4.5rem',     // 72px
    lineHeight: 1.11,
    letterSpacing: '-0.022em',
    use: 'Large display headings',
  },
  
  // 7X large
  '7xl': {
    size: '6rem',       // 96px
    lineHeight: 1.08,
    letterSpacing: '-0.022em',
    use: 'Massive display text',
  },
};

// Professional font weights with semantic names
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Typography component styles
export const typographyStyles = {
  // Heading styles
  h1: {
    fontSize: fontSizes['5xl'].size,
    fontWeight: fontWeights.extrabold,
    lineHeight: fontSizes['5xl'].lineHeight,
    letterSpacing: fontSizes['5xl'].letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '2rem',
  },
  
  h2: {
    fontSize: fontSizes['4xl'].size,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['4xl'].lineHeight,
    letterSpacing: fontSizes['4xl'].letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '1.5rem',
  },
  
  h3: {
    fontSize: fontSizes['3xl'].size,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes['3xl'].lineHeight,
    letterSpacing: fontSizes['3xl'].letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '1.25rem',
  },
  
  h4: {
    fontSize: fontSizes['2xl'].size,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes['2xl'].lineHeight,
    letterSpacing: fontSizes['2xl'].letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '1rem',
  },
  
  h5: {
    fontSize: fontSizes.xl.size,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xl.lineHeight,
    letterSpacing: fontSizes.xl.letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '0.75rem',
  },
  
  h6: {
    fontSize: fontSizes.lg.size,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg.lineHeight,
    letterSpacing: fontSizes.lg.letterSpacing,
    fontFamily: fontStacks.display.family,
    marginBottom: '0.75rem',
  },
  
  // Body text styles
  body: {
    fontSize: fontSizes.base.size,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.base.lineHeight,
    letterSpacing: fontSizes.base.letterSpacing,
    fontFamily: fontStacks.primary.family,
    marginBottom: '1rem',
  },
  
  bodyLarge: {
    fontSize: fontSizes.md.size,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.md.lineHeight,
    letterSpacing: fontSizes.md.letterSpacing,
    fontFamily: fontStacks.primary.family,
    marginBottom: '1.25rem',
  },
  
  // Utility text styles
  caption: {
    fontSize: fontSizes.sm.size,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.sm.lineHeight,
    letterSpacing: fontSizes.sm.letterSpacing,
    fontFamily: fontStacks.primary.family,
  },
  
  overline: {
    fontSize: fontSizes.xs.size,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xs.lineHeight,
    letterSpacing: '0.1em',
    fontFamily: fontStacks.primary.family,
    textTransform: 'uppercase',
  },
  
  // Code styles
  code: {
    fontSize: fontSizes.sm.size,
    fontWeight: fontWeights.normal,
    lineHeight: 1.6,
    letterSpacing: '0',
    fontFamily: fontStacks.code.family,
  },
  
  codeBlock: {
    fontSize: fontSizes.sm.size,
    fontWeight: fontWeights.normal,
    lineHeight: 1.7,
    letterSpacing: '0',
    fontFamily: fontStacks.code.family,
  },
};

// Responsive typography breakpoints
export const responsiveTypography = {
  mobile: {
    h1: { fontSize: fontSizes['4xl'].size },
    h2: { fontSize: fontSizes['3xl'].size },
    h3: { fontSize: fontSizes['2xl'].size },
    h4: { fontSize: fontSizes.xl.size },
    h5: { fontSize: fontSizes.lg.size },
    h6: { fontSize: fontSizes.base.size },
  },
  
  tablet: {
    h1: { fontSize: fontSizes['5xl'].size },
    h2: { fontSize: fontSizes['4xl'].size },
    h3: { fontSize: fontSizes['3xl'].size },
    h4: { fontSize: fontSizes['2xl'].size },
    h5: { fontSize: fontSizes.xl.size },
    h6: { fontSize: fontSizes.lg.size },
  },
};

// Font loading utilities
export const generateFontFaceCSS = (fontStack) => {
  const { family, weights, display } = fontStack;
  const fontName = family.split(',')[0].replace(/['"]/g, '');
  
  return weights.map(weight => `
    @font-face {
      font-family: ${fontName};
      font-weight: ${weight};
      font-display: ${display};
      src: url('/fonts/${fontName.toLowerCase()}-${weight}.woff2') format('woff2'),
           url('/fonts/${fontName.toLowerCase()}-${weight}.woff') format('woff');
    }
  `).join('\n');
};

// Google Fonts URL generator - optimized for critical fonts only
export const generateGoogleFontsURL = () => {
  const fonts = [
    'Inter:wght@400;500;600;700',  // Only critical weights
    'Poppins:wght@600;700;800',   // Only critical weights
  ];

  return `https://fonts.googleapis.com/css2?${fonts.map(font => `family=${font}`).join('&')}&display=swap`;
};

// Generate critical font CSS for immediate loading
export const generateCriticalFontCSS = () => {
  return `
    /* Critical font loading - prevents FOIT and preload warnings */
    @import url('${generateGoogleFontsURL()}');

    /* Ensure fonts are applied immediately */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-display: swap;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-display: swap;
    }
  `;
};

const typographySystem = {
  fontStacks,
  fontSizes,
  fontWeights,
  typographyStyles,
  responsiveTypography,
  generateFontFaceCSS,
  generateGoogleFontsURL,
  generateCriticalFontCSS,
};

export default typographySystem;
