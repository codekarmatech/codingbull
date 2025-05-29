import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';

// Error boundary container
const ErrorContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${props => props.theme.colors.darkGrey};
  text-align: center;
`;

// Error icon
const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.error};
`;

// Error title
const ErrorTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

// Error message
const ErrorMessage = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

// Error details (only in development)
const ErrorDetails = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.error};
  max-width: 800px;
  width: 100%;
  
  summary {
    cursor: pointer;
    color: ${props => props.theme.colors.error};
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  pre {
    background: ${props => props.theme.colors.darkGrey};
    padding: 1rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-x: auto;
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.textSecondary};
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// Action buttons container
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would integrate with your error monitoring service
    // For now, we'll just log to console
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
      console.error('Production Error:', errorData);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      error: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      componentStack: errorInfo?.componentStack || 'No component stack',
      timestamp: new Date().toISOString(),
    };

    // Create mailto link for error reporting
    const subject = encodeURIComponent('Error Report - CodingBull Website');
    const body = encodeURIComponent(`
Error Report:
${JSON.stringify(errorReport, null, 2)}

Please describe what you were doing when this error occurred:
[Your description here]
    `);
    
    window.open(`mailto:support@codingbull.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <ErrorContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </ErrorMessage>

          <ActionButtons>
            <Button variant="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
            <Button variant="secondary" onClick={this.handleGoHome}>
              Go Home
            </Button>
            <Button variant="outline" onClick={this.handleReportError}>
              Report Issue
            </Button>
          </ActionButtons>

          {isDevelopment && error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <div>
                <h4>Error Message:</h4>
                <pre>{error.message}</pre>
                
                <h4>Stack Trace:</h4>
                <pre>{error.stack}</pre>
                
                {errorInfo && (
                  <>
                    <h4>Component Stack:</h4>
                    <pre>{errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
