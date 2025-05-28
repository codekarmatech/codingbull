// Enhanced theme configuration with expanded color palette and gradients
const theme = {
  colors: {
    // Primary colors
    electricBlue: '#00BFFF', // Bright electric blue for accents
    deepPurple: '#6A0DAD',   // Deep purple for secondary accents
    brightPurple: '#9B30FF', // Brighter purple for highlights
    deepBlue: '#0070FF',     // Deep blue for secondary accents
    neonCyan: '#00FFFF',     // Neon cyan for glowing effects
    
    // Grey scale
    darkGrey: '#121212',     // Almost black, for backgrounds
    mediumGrey: '#2D2D2D',   // For cards, containers
    lightGrey: '#757575',    // For less important text
    deepGrey: '#1A1A1A',     // Slightly lighter than black for subtle contrast
    
    // Text colors
    textPrimary: '#FFFFFF',  // White text for dark backgrounds
    textSecondary: '#E0E0E0', // Slightly off-white for secondary text
    
    // Additional colors
    success: '#4CAF50',      // Green for success messages
    error: '#F44336',        // Red for error messages
    warning: '#FFC107',      // Yellow for warnings
    
    // Syntax highlighting colors
    syntaxKeyword: '#00AAFF',
    syntaxFunction: '#BD93F9',
    syntaxString: '#50FA7B',
    syntaxComment: '#6272A4',
    syntaxOperator: '#FFB86C',
    syntaxVariable: '#FF79C6',
    syntaxProperty: '#8BE9FD',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00BFFF 0%, #6A0DAD 100%)',
    gradientSecondary: 'linear-gradient(135deg, #6A0DAD 0%, #00BFFF 100%)',
    gradientPurple: 'linear-gradient(135deg, #6A0DAD 0%, #9B30FF 50%, #4B0082 100%)',
    gradientBlue: 'linear-gradient(135deg, #00BFFF 0%, #0070FF 50%, #00BFFF 100%)',
    gradientCyan: 'linear-gradient(135deg, #00FFFF 0%, #00BFFF 100%)',
    
    // Button gradients
    buttonPrimary: 'linear-gradient(135deg, #6A0DAD 0%, #9B30FF 50%, #4B0082 100%)',
    buttonSecondary: 'linear-gradient(135deg, #00BFFF 0%, #0070FF 50%, #00BFFF 100%)',
    buttonHoverPrimary: 'linear-gradient(135deg, #9B30FF 0%, #6A0DAD 50%, #9B30FF 100%)',
    buttonHoverSecondary: 'linear-gradient(135deg, #00BFFF 0%, #0070FF 50%, #00BFFF 100%)',
    
    // Glow effects
    glowPurple: '0 0 15px rgba(106, 13, 173, 0.6)',
    glowBlue: '0 0 15px rgba(0, 191, 255, 0.6)',
    glowCyan: '0 0 15px rgba(0, 255, 255, 0.6)',
    
    // Overlay colors
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(255, 255, 255, 0.1)',
    gradientOverlay: 'linear-gradient(135deg, rgba(106, 13, 173, 0.1) 0%, rgba(0, 191, 255, 0.1) 100%)',
  },
  
  // Typography
  fonts: {
    primary: "'Poppins', sans-serif",
    secondary: "'Roboto', sans-serif",
    code: "'Fira Code', monospace",
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '4rem',     // 64px
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },
  
  // Enhanced animations with timing functions
  animations: {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.6s',
    // Timing functions
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1.0)',
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // Combined timing and duration
    fastEaseOut: '0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    mediumBounce: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    slowEaseInOut: '0.6s cubic-bezier(0.645, 0.045, 0.355, 1.0)',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',   // Fully rounded
  },
  
  // Enhanced shadows with colored glows
  shadows: {
    sm: '0 2px 5px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.25), 0 5px 10px rgba(0, 0, 0, 0.2)',
    xl: '0 15px 35px rgba(0, 0, 0, 0.3), 0 10px 15px rgba(0, 0, 0, 0.2)',
    // Colored shadows
    purple: '0 5px 20px rgba(106, 13, 173, 0.4)',
    blue: '0 5px 20px rgba(0, 191, 255, 0.4)',
    // Button shadows
    buttonPrimary: '0 4px 15px rgba(106, 13, 173, 0.4)',
    buttonSecondary: '0 4px 15px rgba(0, 191, 255, 0.2)',
    buttonHoverPrimary: '0 8px 25px rgba(106, 13, 173, 0.6)',
    buttonHoverSecondary: '0 8px 25px rgba(0, 191, 255, 0.4)',
    // Inset shadows
    insetSm: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
    insetMd: 'inset 0 2px 5px rgba(0, 0, 0, 0.3)',
  },
  
  // Z-index
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
  },
};

export default theme;