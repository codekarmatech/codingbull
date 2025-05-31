// Enhanced theme configuration with expanded color palette and gradients
const theme = {
  colors: {
    // Primary colors - Dark glowing blue theme
    electricBlue: '#0D47A1', // Darker electric blue for accents
    deepBlue: '#0A1929',     // Very deep blue for backgrounds
    midBlue: '#1565C0',      // Mid-tone blue for secondary accents
    lightBlue: '#42A5F5',    // Light blue for highlights
    glowingBlue: '#2196F3',  // Glowing blue for effects
    
    // Grey scale
    darkGrey: '#050510',     // Almost black with blue tint, for backgrounds
    mediumGrey: '#0A0A1A',   // Dark blue-grey for cards, containers
    lightGrey: '#4B6A8A',    // Blue-tinted grey for less important text
    deepGrey: '#0A1525',     // Deep blue-black for subtle contrast
    
    // Text colors
    textPrimary: '#FFFFFF',  // White text for dark backgrounds
    textSecondary: '#B0C4DE', // Light steel blue for secondary text
    
    // Additional colors
    success: '#4CAF50',      // Green for success messages
    error: '#F44336',        // Red for error messages
    warning: '#FFC107',      // Yellow for warnings
    
    // Syntax highlighting colors
    syntaxKeyword: '#00AAFF',
    syntaxFunction: '#64B5F6',
    syntaxString: '#50FA7B',
    syntaxComment: '#6272A4',
    syntaxOperator: '#FFB86C',
    syntaxVariable: '#90CAF9',
    syntaxProperty: '#8BE9FD',
    
    // Gradients - Dark blue theme
    gradientPrimary: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
    gradientSecondary: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
    gradientBlue: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #0D47A1 100%)',
    gradientLightBlue: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 50%, #1976D2 100%)',
    gradientDarkBlue: 'linear-gradient(135deg, #0A1929 0%, #0D47A1 100%)',
    
    // Button gradients
    buttonPrimary: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #0D47A1 100%)',
    buttonSecondary: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 50%, #1565C0 100%)',
    buttonHoverPrimary: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 50%, #1976D2 100%)',
    buttonHoverSecondary: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 50%, #42A5F5 100%)',
    
    // Glow effects
    glowBlue: '0 0 15px rgba(13, 71, 161, 0.6)',
    glowLightBlue: '0 0 15px rgba(33, 150, 243, 0.6)',
    glowIntense: '0 0 20px rgba(21, 101, 192, 0.8)',
    
    // Overlay colors
    overlayDark: 'rgba(10, 25, 41, 0.7)',
    overlayLight: 'rgba(33, 150, 243, 0.1)',
    gradientOverlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
  },
  
  // Typography
  fonts: {
    primary: "'Poppins', sans-serif",
    secondary: "'Roboto', sans-serif",
    code: "'Fira Code', monospace",
  },
  
  // Font sizes - Reduced for more professional look
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.8125rem',  // 13px
    md: '0.875rem',   // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '1.75rem', // 28px
    '5xl': '2rem',    // 32px
    '6xl': '2.5rem',  // 40px
  },
  
  // Spacing - Increased for more spacious look
  spacing: {
    xs: '0.5rem',     // 8px
    sm: '0.75rem',    // 12px
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
  
  // Enhanced shadows with dark blue glows
  shadows: {
    sm: '0 2px 5px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.25), 0 5px 10px rgba(0, 0, 0, 0.2)',
    xl: '0 15px 35px rgba(0, 0, 0, 0.3), 0 10px 15px rgba(0, 0, 0, 0.2)',
    // Colored shadows
    darkBlue: '0 5px 20px rgba(13, 71, 161, 0.4)',
    blue: '0 5px 20px rgba(33, 150, 243, 0.4)',
    // Button shadows
    buttonPrimary: '0 4px 15px rgba(13, 71, 161, 0.4)',
    buttonSecondary: '0 4px 15px rgba(33, 150, 243, 0.2)',
    buttonHoverPrimary: '0 8px 25px rgba(13, 71, 161, 0.6)',
    buttonHoverSecondary: '0 8px 25px rgba(33, 150, 243, 0.4)',
    // Inset shadows
    insetSm: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
    insetMd: 'inset 0 2px 5px rgba(0, 0, 0, 0.3)',
    // Glow shadows
    glowDark: '0 0 20px rgba(13, 71, 161, 0.5)',
    glowMedium: '0 0 25px rgba(21, 101, 192, 0.6)',
    glowLight: '0 0 30px rgba(33, 150, 243, 0.7)',
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
