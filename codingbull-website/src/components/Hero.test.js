import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import Hero from './Hero';

// Mock the Button component
jest.mock('./Button', () => {
  return function MockButton(props) {
    return <button data-testid="mock-button">{props.children}</button>;
  };
});

// Mock the animations
jest.mock('../animations/variants', () => ({
  fadeIn: {},
  slideUp: {},
  textReveal: {},
  staggerContainer: {},
}));

// Mock the framer-motion animations to avoid test warnings
jest.mock('framer-motion', () => {
  const mockComponent = (type) => {
    return ({ children, ...props }) => {
      const MockComponent = type;
      return <MockComponent {...props}>{children}</MockComponent>;
    };
  };
  
  return {
    motion: {
      div: mockComponent('div'),
      h1: mockComponent('h1'),
      h2: mockComponent('h2'),
      h3: mockComponent('h3'),
      p: mockComponent('p'),
      span: mockComponent('span'),
      button: mockComponent('button'),
      section: mockComponent('section'),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('Hero Component', () => {
  test('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <Hero />
      </ThemeProvider>
    );
  });

  test('renders the headline text correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Hero />
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Full-Stack Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital Transformation/i)).toBeInTheDocument();
  });

  test('renders the code block with correct comment', () => {
    render(
      <ThemeProvider theme={theme}>
        <Hero />
      </ThemeProvider>
    );
    
    // This tests our fixed comment line
    expect(screen.getByText(/Create innovative digital solutions/i)).toBeInTheDocument();
  });
});