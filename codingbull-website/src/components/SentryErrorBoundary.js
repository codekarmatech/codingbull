import { Component } from 'react';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';

// Styled components for the fallback UI with proper fallbacks
const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.[8] || '2rem'};
  text-align: center;
  background-color: ${({ theme }) => theme?.colors?.error || '#1F2937'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#F9FAFB'};
  border: 1px solid ${({ theme }) => theme?.colors?.borderGrey || '#374151'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '0.5rem'};
  font-family: ${({ theme }) => theme?.fonts?.primary || "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"};
  max-width: 600px;
  margin: ${({ theme }) => theme?.spacing?.[8] || '2rem'} auto;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: ${({ theme }) => theme?.fontSizes?.['3xl'] || '2.25rem'};
    margin-bottom: ${({ theme }) => theme?.spacing?.[6] || '1.5rem'};
    color: ${({ theme }) => theme?.colors?.textPrimary || '#F9FAFB'};
    font-weight: 700;
    margin-top: 0;
  }

  p {
    font-size: ${({ theme }) => theme?.fontSizes?.md || '1.125rem'};
    margin-bottom: ${({ theme }) => theme?.spacing?.[4] || '1rem'};
    color: ${({ theme }) => theme?.colors?.textSecondary || '#D1D5DB'};
    line-height: ${({ theme }) => theme?.lineHeights?.relaxed || 1.625};
    max-width: 500px;
  }

  button {
    background-color: ${({ theme }) => theme?.colors?.brandPrimary || '#2B9BF4'};
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    border: none;
    padding: ${({ theme }) => theme?.spacing?.[3] || '0.75rem'} ${({ theme }) => theme?.spacing?.[6] || '1.5rem'};
    border-radius: ${({ theme }) => theme?.borderRadius?.md || '0.5rem'};
    cursor: pointer;
    font-size: ${({ theme }) => theme?.fontSizes?.base || '1rem'};
    font-weight: ${({ theme }) => theme?.fontWeights?.medium || 500};
    margin-top: ${({ theme }) => theme?.spacing?.[6] || '1.5rem'};
    margin-right: ${({ theme }) => theme?.spacing?.[4] || '1rem'};
    transition: all ${({ theme }) => theme?.animations?.fast || '150ms'};
    box-shadow: ${({ theme }) => theme?.shadows?.button || '0 4px 14px 0 rgba(43, 155, 244, 0.2)'};
    font-family: inherit;

    &:hover {
      background-color: ${({ theme }) => theme?.colors?.brandSecondary || '#0D7DD6'};
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme?.shadows?.buttonHover || '0 8px 25px 0 rgba(43, 155, 244, 0.3)'};
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(43, 155, 244, 0.4);
    }
  }

  a {
    color: ${({ theme }) => theme?.colors?.brandPrimary || '#2B9BF4'};
    text-decoration: underline;
    cursor: pointer;
    font-weight: ${({ theme }) => theme?.fontWeights?.medium || 500};
    transition: color ${({ theme }) => theme?.animations?.fast || '150ms'};
    margin-top: ${({ theme }) => theme?.spacing?.[4] || '1rem'};
    display: inline-block;

    &:hover {
      color: ${({ theme }) => theme?.colors?.brandSecondary || '#0D7DD6'};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme?.colors?.brandPrimary || '#2B9BF4'};
      outline-offset: 2px;
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