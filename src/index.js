import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Sentry from "@sentry/react";
import SentryErrorBoundary from './components/SentryErrorBoundary';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: parseFloat(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE) || 1.0, // Capture 100% of transactions by default
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/], // Commented out as no backend API yet
    // Session Replay
    replaysSessionSampleRate: parseFloat(process.env.REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) || 0.1, // Default to 10%
    replaysOnErrorSampleRate: parseFloat(process.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE) || 1.0, // Default to 100% on error
    environment: process.env.REACT_APP_ENV || "development",
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
