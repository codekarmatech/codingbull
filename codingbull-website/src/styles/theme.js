// Import enhanced color and typography systems
import colorSystem from './colors';
import typographySystem from './typography';

// Professional dark theme configuration with enhanced UX/UI elements
const theme = {
  colors: {
    // Brand colors using the new color system
    brandPrimary: colorSystem.brand.primary[500],     // Main brand color
    brandSecondary: colorSystem.brand.primary[600],   // Darker variant
    brandLight: colorSystem.brand.primary[400],       // Lighter variant
    brandDark: colorSystem.brand.primary[700],        // Darker variant for contrast
    electricBlue: colorSystem.brand.primary[500],     // Using brand color for electric blue
    deepBlue: colorSystem.neutral[900],               // Ultra-deep blue-black for main backgrounds
    midBlue: colorSystem.brand.secondary[800],        // Rich mid-tone blue for secondary elements
    lightBlue: colorSystem.brand.primary[400],        // Brand light for highlights and accents
    glowingBlue: colorSystem.brand.primary[500],      // Brand primary for interactive elements
    accentBlue: colorSystem.brand.primary[600],       // Brand secondary for CTAs
    deepPurple: colorSystem.brand.secondary[600],     // Deep purple for legacy compatibility

    // Enhanced grey scale using the new neutral system
    darkGrey: colorSystem.neutral[950],               // Almost pure black with subtle blue undertone
    mediumGrey: colorSystem.neutral[800],             // Dark grey for cards and containers
    lightGrey: colorSystem.neutral[500],              // Neutral grey for secondary text
    deepGrey: colorSystem.neutral[900],               // Deep slate for subtle backgrounds
    surfaceGrey: colorSystem.neutral[700],            // Surface grey for elevated elements
    borderGrey: colorSystem.neutral[600],             // Border grey for subtle divisions

    // Professional text hierarchy using the new color system
    textPrimary: colorSystem.text.primary,        // Pure white for primary text
    textSecondary: colorSystem.text.secondary,    // Light grey for secondary text
    textTertiary: colorSystem.text.tertiary,      // Medium grey for tertiary text
    textMuted: colorSystem.text.muted,            // Muted grey for less important text

    // Status colors using the new semantic color system
    success: colorSystem.semantic.success[500],      // Modern green for success states
    successLight: colorSystem.semantic.success[400], // Light green for success highlights
    error: colorSystem.semantic.error[500],          // Modern red for error states
    errorLight: colorSystem.semantic.error[400],     // Light red for error highlights
    warning: colorSystem.semantic.warning[500],      // Amber for warning states
    warningLight: colorSystem.semantic.warning[400], // Light amber for warning highlights
    info: colorSystem.semantic.info[500],            // Blue for informational states
    infoLight: colorSystem.semantic.info[400],       // Light blue for info highlights
    
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
    gradientPrimary: 'linear-gradient(135deg, #2B9BF4 0%, #0D7DD6 100%)',
    gradientSecondary: 'linear-gradient(135deg, #0D7DD6 0%, #0A5CA0 100%)',
    gradientAccent: 'linear-gradient(135deg, #5EBAFF 0%, #2B9BF4 100%)',
    gradientSurface: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
    gradientHero: 'linear-gradient(135deg, #0A0E1A 0%, #1E3A8A 50%, #0A0E1A 100%)',
    
    // Interactive button gradients - Updated to match brand colors
    buttonPrimary: 'linear-gradient(135deg, #2B9BF4 0%, #0D7DD6 100%)',
    buttonSecondary: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
    buttonSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    buttonDanger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    buttonHoverPrimary: 'linear-gradient(135deg, #5EBAFF 0%, #2B9BF4 100%)',
    buttonHoverSecondary: 'linear-gradient(135deg, #4B5563 0%, #6B7280 100%)',
    
    // Professional glow effects - Updated to match brand colors
    glowPrimary: '0 0 20px rgba(43, 155, 244, 0.4)',
    glowSecondary: '0 0 15px rgba(13, 125, 214, 0.3)',
    glowAccent: '0 0 25px rgba(94, 186, 255, 0.5)',
    glowSuccess: '0 0 15px rgba(16, 185, 129, 0.4)',
    glowError: '0 0 15px rgba(239, 68, 68, 0.4)',
    glowSubtle: '0 0 10px rgba(43, 155, 244, 0.2)',
    
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
  
  // Professional typography system using the new typography system
  fonts: {
    primary: typographySystem.fontStacks.primary.family,
    secondary: typographySystem.fontStacks.secondary.family,
    code: typographySystem.fontStacks.code.family,
    display: typographySystem.fontStacks.display.family,
  },

  // Enhanced font size scale using the new typography system
  fontSizes: Object.fromEntries(
    Object.entries(typographySystem.fontSizes).map(([key, value]) => [key, value.size])
  ),

  // Font weights using the new typography system
  fontWeights: typographySystem.fontWeights,

  // Line heights using the new typography system
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Typography styles for components
  typography: typographySystem.typographyStyles,
  
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
