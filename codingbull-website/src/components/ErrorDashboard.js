/**
 * Simple Error Dashboard Component
 * For viewing error tracking data (development/admin use)
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import errorTracker from '../services/errorTracking';

const DashboardContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors.darkGrey};
  color: ${props => props.theme.colors.textPrimary};
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: ${props => props.theme.colors.brandPrimary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.mediumGrey};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.color || props.theme.colors.brandPrimary};
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.colors.textPrimary};
    font-size: ${props => props.theme.fontSizes.lg};
  }
  
  .value {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: bold;
    color: ${props => props.color || props.theme.colors.brandPrimary};
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const InfoSection = styled.div`
  background: ${props => props.theme.colors.mediumGrey};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  
  h2 {
    color: ${props => props.theme.colors.brandPrimary};
    margin-bottom: 1rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .info-item {
    background: ${props => props.theme.colors.darkGrey};
    padding: 1rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    
    .label {
      color: ${props => props.theme.colors.textSecondary};
      font-size: ${props => props.theme.fontSizes.sm};
      margin-bottom: 0.25rem;
    }
    
    .value {
      color: ${props => props.theme.colors.textPrimary};
      font-weight: 500;
    }
  }
`;

const BreadcrumbsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  .breadcrumb-item {
    background: ${props => props.theme.colors.darkGrey};
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    border-left: 3px solid ${props => props.theme.colors.brandSecondary};
    
    .timestamp {
      color: ${props => props.theme.colors.textSecondary};
      font-size: ${props => props.theme.fontSizes.xs};
      margin-bottom: 0.25rem;
    }
    
    .action {
      color: ${props => props.theme.colors.textPrimary};
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .details {
      color: ${props => props.theme.colors.textSecondary};
      font-size: ${props => props.theme.fontSizes.sm};
    }
  }
`;

const ToggleButton = styled.button`
  background: ${props => props.theme.colors.brandPrimary};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background: ${props => props.theme.colors.brandSecondary};
  }
`;

const ErrorDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({});
  const [browserInfo, setBrowserInfo] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Get current session info
      setSessionInfo({
        sessionId: errorTracker.sessionId,
        userId: errorTracker.userId,
        startTime: new Date().toISOString(),
        currentUrl: window.location.href
      });

      // Get browser info
      setBrowserInfo(errorTracker.getBrowserInfo());

      // Get breadcrumbs
      setBreadcrumbs([...errorTracker.breadcrumbs]);

      // Update breadcrumbs every 5 seconds
      const interval = setInterval(() => {
        setBreadcrumbs([...errorTracker.breadcrumbs]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
        <ToggleButton onClick={() => setIsVisible(true)}>
          Show Error Dashboard
        </ToggleButton>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999, 
      background: 'rgba(0,0,0,0.9)',
      overflow: 'auto'
    }}>
      <DashboardContainer>
        <DashboardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>🔍 Error Tracking Dashboard</h1>
              <p>Real-time monitoring and debugging information</p>
            </div>
            <ToggleButton onClick={() => setIsVisible(false)}>
              Close Dashboard
            </ToggleButton>
          </div>
        </DashboardHeader>

        <StatsGrid>
          <StatCard color="#4FACFF">
            <h3>Session ID</h3>
            <div className="value">{sessionInfo.sessionId?.substring(0, 12)}...</div>
            <div className="description">Current user session</div>
          </StatCard>

          <StatCard color="#00D4AA">
            <h3>User ID</h3>
            <div className="value">{sessionInfo.userId?.substring(0, 12)}...</div>
            <div className="description">Anonymous user identifier</div>
          </StatCard>

          <StatCard color="#FF6B6B">
            <h3>Breadcrumbs</h3>
            <div className="value">{breadcrumbs.length}</div>
            <div className="description">User actions tracked</div>
          </StatCard>

          <StatCard color="#FFD93D">
            <h3>Page Load Time</h3>
            <div className="value">{errorTracker.getPageLoadTime() || 'N/A'}ms</div>
            <div className="description">Current page load performance</div>
          </StatCard>
        </StatsGrid>

        <InfoSection>
          <h2>🌐 Browser Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">Browser</div>
              <div className="value">{browserInfo.browser}</div>
            </div>
            <div className="info-item">
              <div className="label">Operating System</div>
              <div className="value">{browserInfo.os}</div>
            </div>
            <div className="info-item">
              <div className="label">Device Type</div>
              <div className="value">{browserInfo.device}</div>
            </div>
            <div className="info-item">
              <div className="label">Language</div>
              <div className="value">{browserInfo.language}</div>
            </div>
            <div className="info-item">
              <div className="label">Screen Resolution</div>
              <div className="value">
                {browserInfo.screen?.width} x {browserInfo.screen?.height}
              </div>
            </div>
            <div className="info-item">
              <div className="label">Viewport Size</div>
              <div className="value">
                {browserInfo.viewport?.width} x {browserInfo.viewport?.height}
              </div>
            </div>
            <div className="info-item">
              <div className="label">Memory Usage</div>
              <div className="value">{errorTracker.getMemoryUsage() || 'N/A'} MB</div>
            </div>
            <div className="info-item">
              <div className="label">Online Status</div>
              <div className="value">{browserInfo.onLine ? 'Online' : 'Offline'}</div>
            </div>
          </div>
        </InfoSection>

        <InfoSection>
          <h2>🍞 User Breadcrumbs</h2>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            Recent user actions and navigation events (last {breadcrumbs.length} actions)
          </p>
          <BreadcrumbsList>
            {breadcrumbs.length === 0 ? (
              <div style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                No breadcrumbs yet. Interact with the page to see tracking data.
              </div>
            ) : (
              breadcrumbs.slice().reverse().map((breadcrumb, index) => (
                <div key={index} className="breadcrumb-item">
                  <div className="timestamp">
                    {new Date(breadcrumb.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="action">
                    {breadcrumb.type}: {breadcrumb.message}
                  </div>
                  {breadcrumb.data && (
                    <div className="details">
                      {JSON.stringify(breadcrumb.data, null, 2)}
                    </div>
                  )}
                </div>
              ))
            )}
          </BreadcrumbsList>
        </InfoSection>

        <InfoSection>
          <h2>⚙️ Configuration</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">Error Tracking Enabled</div>
              <div className="value">{errorTracker.isEnabled ? 'Yes' : 'No'}</div>
            </div>
            <div className="info-item">
              <div className="label">Environment</div>
              <div className="value">{process.env.NODE_ENV}</div>
            </div>
            <div className="info-item">
              <div className="label">API Endpoint</div>
              <div className="value">{errorTracker.apiEndpoint}</div>
            </div>
            <div className="info-item">
              <div className="label">Max Breadcrumbs</div>
              <div className="value">{errorTracker.maxBreadcrumbs}</div>
            </div>
          </div>
        </InfoSection>

        <InfoSection>
          <h2>🧪 Test Error Tracking</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                errorTracker.captureException(new Error('Test JavaScript Error'), {
                  testType: 'manual_trigger',
                  dashboard: true
                });
              }}
              style={{
                background: '#FF6B6B',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Error Capture
            </button>
            
            <button
              onClick={() => {
                errorTracker.captureMessage('Test message from dashboard', 'info', {
                  testType: 'manual_message',
                  dashboard: true
                });
              }}
              style={{
                background: '#4FACFF',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Message
            </button>
            
            <button
              onClick={() => {
                // Simulate a performance metric
                errorTracker.trackPerformanceMetric({
                  type: 'user_interaction',
                  duration: Math.random() * 1000,
                  metrics: { testAction: 'dashboard_click' }
                });
              }}
              style={{
                background: '#00D4AA',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Performance
            </button>
          </div>
        </InfoSection>
      </DashboardContainer>
    </div>
  );
};

export default ErrorDashboard;