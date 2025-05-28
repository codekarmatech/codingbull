import React, { Component } from 'react';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

// Styled components for the fallback UI
const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.errorBackground || '#f8d7da'}; /* Fallback if not in theme */
  color: ${({ theme }) => theme.colors.errorText || '#721c24'}; /* Fallback if not in theme */
  border: 1px solid ${({ theme }) => theme.colors.errorBorder || '#f5c6cb'}; /* Fallback if not in theme */
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.fonts.primary};

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  button {
    background-color: ${({ theme }) => theme.colors.electricBlue};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: none;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-top: ${({ theme }) => theme.spacing.md};
    transition: background-color ${({ theme }) => theme.animations.fast};

    &:hover {
      background-color: ${({ theme }) => theme.colors.deepPurple};
    }
  }

  a {
    color: ${({ theme }) => theme.colors.electricBlue};
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.deepPurple};
    }
  }
`;

class SentryErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorEventId: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    const eventId = Sentry.captureException(error, { extra: errorInfo });
    this.setState({ errorEventId: eventId });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorContainer>
          <h1>Something went wrong.</h1>
          <p>We've been notified of the issue and are working to fix it.</p>
          {this.state.errorEventId && (
            <p>
              If you'd like to help, you can tell us what happened.
              <br />
              Error ID: {this.state.errorEventId}
            </p>
          )}
          <button onClick={() => Sentry.showReportDialog({ eventId: this.state.errorEventId })}>
            Report feedback
          </button>
          <p>
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
              Click here to reload the page
            </a>
          </p>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;