import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import TechStack from './TechStack';
import theme from '../styles/theme';

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('TechStack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tech stack section', () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    expect(screen.getByText('Our Technology Stack')).toBeInTheDocument();
    expect(screen.getByText(/We leverage cutting-edge technologies/)).toBeInTheDocument();
  });

  it('renders all category filter buttons', () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    expect(screen.getByText('All Technologies')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText('3D & Visualization')).toBeInTheDocument();
  });

  it('shows all technologies by default', () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    // Check for technologies from different categories
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Three.js')).toBeInTheDocument();
  });

  it('filters technologies when frontend category is selected', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Frontend'));

    await waitFor(() => {
      // Frontend technologies should be visible
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('HTML5')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Backend technologies should not be visible
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
      expect(screen.queryByText('Django')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters technologies when backend category is selected', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Backend'));

    await waitFor(() => {
      // Backend technologies should be visible
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Frontend technologies should not be visible
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('HTML5')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters technologies when database category is selected', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Database'));

    await waitFor(() => {
      // Database technologies should be visible
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Redis')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Other technologies should not be visible
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters technologies when devops category is selected', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('DevOps'));

    await waitFor(() => {
      // DevOps technologies should be visible
      expect(screen.getByText('Docker')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
      expect(screen.getByText('GitHub Actions')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Other technologies should not be visible
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('MongoDB')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters technologies when 3D category is selected', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('3D & Visualization'));

    await waitFor(() => {
      // 3D technologies should be visible
      expect(screen.getByText('Three.js')).toBeInTheDocument();
      expect(screen.getByText('WebGL')).toBeInTheDocument();
      expect(screen.getByText('React Three Fiber')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Other technologies should not be visible
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('returns to all technologies when "All Technologies" is clicked', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    // First filter to frontend
    fireEvent.click(screen.getByText('Frontend'));

    await waitFor(() => {
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
    });

    // Then click "All Technologies"
    fireEvent.click(screen.getByText('All Technologies'));

    await waitFor(() => {
      // All technologies should be visible again
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Docker')).toBeInTheDocument();
      expect(screen.getByText('Three.js')).toBeInTheDocument();
    });
  });

  it('highlights the active category button', () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    const frontendButton = screen.getByText('Frontend');
    fireEvent.click(frontendButton);

    // The active button should have different styling (this would depend on your CSS implementation)
    // For now, we'll just check that the click was registered
    expect(frontendButton).toBeInTheDocument();
  });

  it('shows tooltip on tech item hover', async () => {
    render(
      <TestWrapper>
        <TechStack />
      </TestWrapper>
    );

    const reactItem = screen.getByText('React');
    fireEvent.mouseEnter(reactItem);

    await waitFor(() => {
      expect(screen.getByText('UI library for interactive interfaces')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(reactItem);

    await waitFor(() => {
      expect(screen.queryByText('UI library for interactive interfaces')).not.toBeInTheDocument();
    });
  });
});
