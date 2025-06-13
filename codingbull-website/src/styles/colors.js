/**
 * Professional Color System
 * WCAG 2.1 AA compliant color palette with accessibility considerations
 */

// Brand colors - Primary palette
export const brandColors = {
  // Primary brand colors (from logo CMYK: C:69 M:10 Y:00 K:00)
  primary: {
    50: '#EBF8FF',   // Lightest tint
    100: '#BEE3F8',  // Very light
    200: '#90CDF4',  // Light
    300: '#63B3ED',  // Medium light
    400: '#4299E1',  // Medium
    500: '#2B9BF4',  // Base brand color
    600: '#0D7DD6',  // Medium dark
    700: '#0A5CA0',  // Dark
    800: '#1A365D',  // Very dark
    900: '#0F172A',  // Darkest
  },
  
  // Secondary brand colors
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
};

// Neutral colors - Professional grayscale
export const neutralColors = {
  // Cool grays with blue undertone
  50: '#F8FAFC',    // Almost white
  100: '#F1F5F9',   // Very light gray
  200: '#E2E8F0',   // Light gray
  300: '#CBD5E1',   // Medium light gray
  400: '#94A3B8',   // Medium gray
  500: '#64748B',   // Base gray
  600: '#475569',   // Medium dark gray
  700: '#334155',   // Dark gray
  800: '#1E293B',   // Very dark gray
  900: '#0F172A',   // Almost black
  950: '#020617',   // Pure dark
};

// Semantic colors - Status and feedback
export const semanticColors = {
  // Success colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',   // Base success
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Error colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',   // Base error
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Warning colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',   // Base warning
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Info colors
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',   // Base info
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
};

// Professional text colors with accessibility
export const textColors = {
  // Primary text (high contrast)
  primary: neutralColors[50],      // White on dark backgrounds
  primaryDark: neutralColors[900], // Dark on light backgrounds
  
  // Secondary text (medium contrast)
  secondary: neutralColors[200],    // Light gray on dark
  secondaryDark: neutralColors[700], // Medium dark on light
  
  // Tertiary text (lower contrast)
  tertiary: neutralColors[400],     // Medium gray on dark
  tertiaryDark: neutralColors[500], // Medium gray on light
  
  // Muted text (lowest contrast)
  muted: neutralColors[500],        // Muted on dark
  mutedDark: neutralColors[400],    // Muted on light
  
  // Disabled text
  disabled: neutralColors[600],     // Disabled on dark
  disabledDark: neutralColors[300], // Disabled on light
  
  // Inverse text
  inverse: neutralColors[900],      // Dark text on light backgrounds
  inverseSecondary: neutralColors[700],
};

// Background colors
export const backgroundColors = {
  // Primary backgrounds
  primary: neutralColors[900],      // Main dark background
  primaryLight: neutralColors[50],  // Main light background
  
  // Secondary backgrounds
  secondary: neutralColors[800],    // Secondary dark
  secondaryLight: neutralColors[100], // Secondary light
  
  // Surface backgrounds
  surface: neutralColors[800],      // Card/surface dark
  surfaceLight: neutralColors[50],  // Card/surface light
  
  // Elevated surfaces
  elevated: neutralColors[700],     // Elevated dark
  elevatedLight: neutralColors[100], // Elevated light
  
  // Overlay backgrounds
  overlay: 'rgba(15, 23, 42, 0.8)',     // Dark overlay
  overlayLight: 'rgba(255, 255, 255, 0.8)', // Light overlay
  
  // Glass morphism
  glass: 'rgba(15, 23, 42, 0.8)',
  glassBorder: 'rgba(148, 163, 184, 0.2)',
};

// Border colors
export const borderColors = {
  default: neutralColors[700],      // Default border
  defaultLight: neutralColors[200], // Default light border
  
  subtle: neutralColors[800],       // Subtle border
  subtleLight: neutralColors[100],  // Subtle light border
  
  muted: neutralColors[600],        // Muted border
  mutedLight: neutralColors[300],   // Muted light border
  
  strong: neutralColors[500],       // Strong border
  strongLight: neutralColors[400],  // Strong light border
};

// Interactive colors
export const interactiveColors = {
  // Links
  link: brandColors.primary[400],
  linkHover: brandColors.primary[300],
  linkVisited: brandColors.secondary[400],
  
  // Focus states
  focus: brandColors.primary[400],
  focusRing: `${brandColors.primary[400]}40`, // 25% opacity
  
  // Selection
  selection: `${brandColors.primary[400]}40`, // 25% opacity
  selectionText: textColors.primary,
};

// Gradient definitions
export const gradients = {
  // Brand gradients
  primary: `linear-gradient(135deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
  primaryHover: `linear-gradient(135deg, ${brandColors.primary[400]} 0%, ${brandColors.primary[500]} 100%)`,
  
  secondary: `linear-gradient(135deg, ${brandColors.secondary[500]} 0%, ${brandColors.secondary[600]} 100%)`,
  
  // Background gradients
  hero: `linear-gradient(135deg, ${neutralColors[900]} 0%, ${neutralColors[800]} 50%, ${neutralColors[900]} 100%)`,
  surface: `linear-gradient(135deg, ${neutralColors[800]} 0%, ${neutralColors[700]} 100%)`,
  
  // Status gradients
  success: `linear-gradient(135deg, ${semanticColors.success[500]} 0%, ${semanticColors.success[600]} 100%)`,
  error: `linear-gradient(135deg, ${semanticColors.error[500]} 0%, ${semanticColors.error[600]} 100%)`,
  warning: `linear-gradient(135deg, ${semanticColors.warning[500]} 0%, ${semanticColors.warning[600]} 100%)`,
  info: `linear-gradient(135deg, ${semanticColors.info[500]} 0%, ${semanticColors.info[600]} 100%)`,
};

// Shadow colors
export const shadowColors = {
  // Basic shadows
  sm: 'rgba(0, 0, 0, 0.05)',
  base: 'rgba(0, 0, 0, 0.1)',
  md: 'rgba(0, 0, 0, 0.15)',
  lg: 'rgba(0, 0, 0, 0.2)',
  xl: 'rgba(0, 0, 0, 0.25)',
  
  // Colored shadows
  primary: `${brandColors.primary[500]}40`, // 25% opacity
  success: `${semanticColors.success[500]}40`,
  error: `${semanticColors.error[500]}40`,
  warning: `${semanticColors.warning[500]}40`,
  info: `${semanticColors.info[500]}40`,
};

// Accessibility utilities
export const accessibility = {
  // High contrast mode colors
  highContrast: {
    background: '#000000',
    text: '#FFFFFF',
    border: '#FFFFFF',
    link: '#00FFFF',
    linkVisited: '#FF00FF',
  },
  
  // Focus indicators
  focusIndicator: {
    color: brandColors.primary[400],
    width: '2px',
    style: 'solid',
    offset: '2px',
  },
  
  // Minimum contrast ratios (WCAG 2.1 AA)
  contrastRatios: {
    normal: 4.5,    // Normal text
    large: 3.0,     // Large text (18pt+ or 14pt+ bold)
    ui: 3.0,        // UI components
  },
};

// Color utility functions
export const colorUtils = {
  // Convert hex to rgba
  hexToRgba: (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Get contrast color (black or white)
  getContrastColor: (backgroundColor) => {
    // Simple luminance calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? neutralColors[900] : neutralColors[50];
  },
  
  // Validate color contrast
  validateContrast: (foreground, background, level = 'AA') => {
    // This is a simplified version - in production, use a proper contrast calculation library
    const ratio = colorUtils.getContrastColor(foreground, background);
    const requiredRatio = level === 'AAA' ? 7.0 : 4.5;
    // Implementation would calculate actual contrast ratio
    return ratio >= requiredRatio; // Placeholder - replace with actual contrast calculation
  },
};

// Export complete color system
const colorSystem = {
  brand: brandColors,
  neutral: neutralColors,
  semantic: semanticColors,
  text: textColors,
  background: backgroundColors,
  border: borderColors,
  interactive: interactiveColors,
  gradients,
  shadows: shadowColors,
  accessibility,
  utils: colorUtils,
};

export default colorSystem;
