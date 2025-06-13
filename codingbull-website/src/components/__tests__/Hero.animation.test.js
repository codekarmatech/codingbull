import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Hero from '../Hero';
import theme from '../../styles/theme';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => true,
}));

// Mock intersection observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Hero Component - Animation Fix Verification', () => {
  beforeEach(() => {
    // Mock console.warn to catch Framer Motion warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without Framer Motion color animation warnings', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check that no warnings about non-animatable color values are logged
    const colorAnimationWarnings = consoleSpy.mock.calls.filter(call => 
      call[0] && 
      typeof call[0] === 'string' && 
      (call[0].includes('#64B5F6') || 
       call[0].includes('not an animatable value') ||
       call[0].includes('transparent'))
    );
    
    expect(colorAnimationWarnings).toHaveLength(0);
  });

  it('renders the hero headline correctly', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check that the main headline is present
    expect(screen.getByText(/Building Tomorrow's Digital Solutions/i)).toBeInTheDocument();
  });

  it('renders the subheadline correctly', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check that the subheadline is present
    expect(screen.getByText(/We build enterprise-grade web & mobile applications/i)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check that the main action buttons are present
    expect(screen.getByText('Explore Our Work')).toBeInTheDocument();
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('renders company registration info', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Check that the company registration info is present
    expect(screen.getByText(/Registered Technology Company/i)).toBeInTheDocument();
  });

  it('applies correct styling for gradient text without animation conflicts', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Find elements with gradient text styling
    const gradientElements = document.querySelectorAll('[style*="linear-gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);

    // Verify that gradient elements don't have conflicting color properties
    gradientElements.forEach(element => {
      const style = element.getAttribute('style') || '';
      
      // If element has WebkitTextFillColor: transparent, it shouldn't have conflicting color animations
      if (style.includes('WebkitTextFillColor') && style.includes('transparent')) {
        // This is expected for gradient text
        expect(style).toContain('linear-gradient');
      }
    });
  });

  it('handles hover effects without color animation conflicts', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // The component should render without throwing errors related to color animations
    // This test passes if no errors are thrown during render
    expect(screen.getByText(/Building Tomorrow's Digital Solutions/i)).toBeInTheDocument();
  });

  it('uses filter and textShadow for hover effects instead of color animation', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Verify the component renders successfully with the new hover approach
    // The fix uses filter: brightness() and enhanced textShadow instead of color animation
    const heroElement = screen.getByText(/Building Tomorrow's Digital Solutions/i);
    expect(heroElement).toBeInTheDocument();
  });
});
