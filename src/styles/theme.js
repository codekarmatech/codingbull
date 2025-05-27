// Theme configuration with electric blue, deep purple, and grey color scheme
const theme = {
  colors: {
    // Primary colors
    electricBlue: '#00BFFF', // Bright electric blue for accents
    deepPurple: '#6A0DAD',   // Deep purple for secondary accents
    
    // Grey scale
    darkGrey: '#121212',     // Almost black, for backgrounds
    mediumGrey: '#2D2D2D',   // For cards, containers
    lightGrey: '#757575',    // For less important text
    
    // Text colors
    textPrimary: '#FFFFFF',  // White text for dark backgrounds
    textSecondary: '#E0E0E0', // Slightly off-white for secondary text
    
    // Additional colors
    success: '#4CAF50',      // Green for success messages
    error: '#F44336',        // Red for error messages
    warning: '#FFC107',      // Yellow for warnings
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00BFFF 0%, #6A0DAD 100%)',
    gradientSecondary: 'linear-gradient(135deg, #6A0DAD 0%, #00BFFF 100%)',
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
  
  // Animations
  animations: {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.6s',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    full: '9999px',   // Fully rounded
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
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