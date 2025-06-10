// Professional dark theme configuration with enhanced UX/UI elements
const theme = {
  colors: {
    // Primary colors - Brand colors based on logo CMYK (C:69 M:10 Y:00 K:00)
    brandPrimary: '#4FACFF',     // Main brand color from logo
    brandSecondary: '#2E8BFF',   // Darker variant of brand color
    brandLight: '#7BC4FF',       // Lighter variant of brand color
    brandDark: '#1A6FCC',        // Darker variant for contrast
    electricBlue: '#4FACFF',     // Using brand color for electric blue
    deepBlue: '#0A0E1A',         // Ultra-deep blue-black for main backgrounds
    midBlue: '#1E3A8A',          // Rich mid-tone blue for secondary elements
    lightBlue: '#7BC4FF',        // Brand light for highlights and accents
    glowingBlue: '#4FACFF',      // Brand primary for interactive elements
    accentBlue: '#2E8BFF',       // Brand secondary for CTAs
    deepPurple: '#6366F1',       // Deep purple for legacy compatibility
    
    // Enhanced grey scale for better contrast
    darkGrey: '#030712',         // Almost pure black with subtle blue undertone
    mediumGrey: '#111827',       // Dark grey for cards and containers
    lightGrey: '#6B7280',        // Neutral grey for secondary text
    deepGrey: '#0F172A',         // Deep slate for subtle backgrounds
    surfaceGrey: '#1F2937',      // Surface grey for elevated elements
    borderGrey: '#374151',       // Border grey for subtle divisions
    
    // Professional text hierarchy
    textPrimary: '#F9FAFB',      // Pure white for primary text
    textSecondary: '#D1D5DB',    // Light grey for secondary text
    textTertiary: '#9CA3AF',     // Medium grey for tertiary text
    textMuted: '#6B7280',        // Muted grey for less important text
    
    // Status colors with better accessibility
    success: '#10B981',          // Modern green for success states
    successLight: '#34D399',     // Light green for success highlights
    error: '#EF4444',            // Modern red for error states
    errorLight: '#F87171',       // Light red for error highlights
    warning: '#F59E0B',          // Amber for warning states
    warningLight: '#FBBF24',     // Light amber for warning highlights
    info: '#3B82F6',             // Blue for informational states
    infoLight: '#60A5FA',        // Light blue for info highlights
    
    // Enhanced syntax highlighting
    syntaxKeyword: '#8B5CF6',    // Purple for keywords
    syntaxFunction: '#06B6D4',   // Cyan for functions
    syntaxString: '#10B981',     // Green for strings
    syntaxComment: '#6B7280',    // Grey for comments
    syntaxOperator: '#F59E0B',   // Orange for operators
    syntaxVariable: '#EC4899',   // Pink for variables
    syntaxProperty: '#3B82F6',   // Blue for properties
    syntaxNumber: '#F97316',     // Orange for numbers
    
    // Professional gradients - Updated with brand colors
    gradientPrimary: 'linear-gradient(135deg, #4FACFF 0%, #2E8BFF 100%)',
    gradientSecondary: 'linear-gradient(135deg, #2E8BFF 0%, #1A6FCC 100%)',
    gradientAccent: 'linear-gradient(135deg, #7BC4FF 0%, #4FACFF 100%)',
    gradientSurface: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
    gradientHero: 'linear-gradient(135deg, #0A0E1A 0%, #1E3A8A 50%, #0A0E1A 100%)',
    
    // Interactive button gradients - Updated to match brand colors
    buttonPrimary: 'linear-gradient(135deg, #4FACFF 0%, #2E8BFF 100%)',
    buttonSecondary: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
    buttonSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    buttonDanger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    buttonHoverPrimary: 'linear-gradient(135deg, #7BC4FF 0%, #4FACFF 100%)',
    buttonHoverSecondary: 'linear-gradient(135deg, #4B5563 0%, #6B7280 100%)',
    
    // Professional glow effects - Updated to match brand colors
    glowPrimary: '0 0 20px rgba(79, 172, 255, 0.4)',
    glowSecondary: '0 0 15px rgba(46, 139, 255, 0.3)',
    glowAccent: '0 0 25px rgba(123, 196, 255, 0.5)',
    glowSuccess: '0 0 15px rgba(16, 185, 129, 0.4)',
    glowError: '0 0 15px rgba(239, 68, 68, 0.4)',
    glowSubtle: '0 0 10px rgba(79, 172, 255, 0.2)',
    
    // Overlay and backdrop colors
    overlayDark: 'rgba(3, 7, 18, 0.8)',
    overlayMedium: 'rgba(15, 23, 42, 0.6)',
    overlayLight: 'rgba(59, 130, 246, 0.1)',
    backdropBlur: 'rgba(3, 7, 18, 0.9)',
    gradientOverlay: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)',
    
    // Glass morphism effects
    glassDark: 'rgba(17, 24, 39, 0.8)',
    glassMedium: 'rgba(31, 41, 55, 0.6)',
    glassLight: 'rgba(55, 65, 81, 0.4)',
    glassBorder: 'rgba(156, 163, 175, 0.2)',
  },
  
  // Professional typography system
  fonts: {
    primary: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    secondary: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    code: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace",
    display: "'Poppins', 'Inter', sans-serif",
  },
  
  // Enhanced font size scale for better hierarchy
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px - base size
    md: '1.125rem',    // 18px
    lg: '1.25rem',     // 20px
    xl: '1.5rem',      // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem',  // 36px
    '4xl': '3rem',     // 48px
    '5xl': '3.75rem',  // 60px
    '6xl': '4.5rem',   // 72px
    '7xl': '6rem',     // 96px
  },
  
  // Font weights for better typography control
  fontWeights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line heights for better readability
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Professional spacing scale for spacious design
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem',       // 384px
  },
  
  // Enhanced responsive breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },
  
  // Professional animation system
  animations: {
    // Duration
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
    
    // Easing functions for smooth interactions
    easeLinear: 'cubic-bezier(0, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easeSharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    
    // Combined animations for common use cases
    fadeIn: '300ms cubic-bezier(0, 0, 0.2, 1)',
    fadeOut: '150ms cubic-bezier(0.4, 0, 1, 1)',
    slideUp: '300ms cubic-bezier(0, 0, 0.2, 1)',
    slideDown: '300ms cubic-bezier(0, 0, 0.2, 1)',
    scaleIn: '200ms cubic-bezier(0, 0, 0.2, 1)',
    scaleOut: '150ms cubic-bezier(0.4, 0, 1, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: '600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Modern border radius scale
  borderRadius: {
    none: '0',
    sm: '0.25rem',     // 4px
    base: '0.375rem',  // 6px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px',    // Fully rounded
  },
  
  // Professional shadow system with depth and glow effects
  shadows: {
    // Basic shadows
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
    
    // Colored shadows for brand elements
    primary: '0 10px 25px -5px rgba(0, 102, 255, 0.25), 0 4px 6px -2px rgba(0, 102, 255, 0.05)',
    secondary: '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
    success: '0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
    error: '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
    warning: '0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
    
    // Interactive element shadows - Updated to match brand colors
    button: '0 4px 14px 0 rgba(79, 172, 255, 0.2)',
    buttonHover: '0 8px 25px 0 rgba(79, 172, 255, 0.3)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    
    // Glow effects for interactive elements - Updated to match brand colors
    glow: '0 0 20px rgba(79, 172, 255, 0.3)',
    glowSoft: '0 0 15px rgba(79, 172, 255, 0.2)',
    glowIntense: '0 0 30px rgba(79, 172, 255, 0.4)',
    glowSuccess: '0 0 20px rgba(16, 185, 129, 0.3)',
    glowError: '0 0 20px rgba(239, 68, 68, 0.3)',
    
    // Inset shadows for depth
    inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    insetLg: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
    
    // Glass morphism shadows
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    glassSoft: '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
  },
  
  // Professional z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

export default theme;
