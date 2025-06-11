/**
 * Custom Error Tracking Service
 * Lightweight alternative to Sentry for tracking errors, performance, and user sessions
 */

import config from '../config/environment';

class ErrorTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.generateUserId();
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;
    this.isEnabled = process.env.REACT_APP_ENABLE_ERROR_TRACKING !== 'false';
    this.apiEndpoint = `${config.api.baseUrl.replace(/\/$/, '')}/error-tracking`;
    
    if (this.isEnabled) {
      this.initializeTracking();
    }
  }
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateUserId() {
    // Check if user ID exists in localStorage, if not create one
    let userId = localStorage.getItem('error_tracker_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('error_tracker_user_id', userId);
    }
    return userId;
  }
  
  initializeTracking() {
    // Track page loads
    this.trackPageLoad();
    
    // Track unhandled errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    
    // Track user interactions for breadcrumbs
    this.setupBreadcrumbTracking();
    
    // Track performance
    this.trackPerformance();
    
    // Start session tracking
    this.startSession();
  }
  
  // Breadcrumb tracking
  setupBreadcrumbTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      this.addBreadcrumb({
        type: 'user_interaction',
        category: 'click',
        message: `Clicked on ${event.target.tagName}`,
        data: {
          tagName: event.target.tagName,
          className: event.target.className,
          id: event.target.id,
          text: event.target.textContent?.substring(0, 50)
        }
      });
    });
    
    // Track navigation
    if (typeof window !== 'undefined' && window.history) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function(...args) {
        errorTracker.addBreadcrumb({
          type: 'navigation',
          category: 'route_change',
          message: `Navigated to ${args[2]}`,
          data: { url: args[2] }
        });
        return originalPushState.apply(this, args);
      };
    }
  }
  
  addBreadcrumb(breadcrumb) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    this.breadcrumbs.push({
      ...breadcrumb,
      timestamp
    });
    
    // Keep only the last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }
  
  // Error tracking
  handleGlobalError(event) {
    this.captureError({
      type: 'javascript',
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      severity: 'high'
    });
  }
  
  handleUnhandledRejection(event) {
    this.captureError({
      type: 'javascript',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      severity: 'high'
    });
  }
  
  captureError(errorData) {
    if (!this.isEnabled) return;
    
    const errorPayload = {
      ...errorData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      browserInfo: this.getBrowserInfo(),
      userId: this.userId,
      sessionId: this.sessionId,
      breadcrumbs: [...this.breadcrumbs],
      pageLoadTime: this.getPageLoadTime(),
      memoryUsage: this.getMemoryUsage()
    };
    
    // Send to backend
    this.sendToBackend('error', errorPayload);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Tracker] Captured error:', errorPayload);
    }
  }
  
  // Performance tracking
  trackPageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        this.trackPerformanceMetric({
          type: 'page_load',
          duration: perfData.loadEventEnd - perfData.fetchStart,
          metrics: {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
          }
        });
      }
    });
  }
  
  trackPerformance() {
    // Track API calls (but exclude error tracking endpoints to prevent infinite loops)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      // Skip tracking for error tracking endpoints to prevent infinite loops
      if (typeof url === 'string' && url.includes('/error-tracking/')) {
        return originalFetch(...args);
      }
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        this.trackPerformanceMetric({
          type: 'api_call',
          duration: Math.round(duration),
          url: url,
          metrics: {
            status: response.status,
            ok: response.ok
          }
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.captureError({
          type: 'api',
          message: `API call failed: ${error.message}`,
          stack: error.stack,
          severity: 'medium',
          extra_data: { url, duration: Math.round(duration) }
        });
        
        throw error;
      }
    };
  }
  
  trackPerformanceMetric(metricData) {
    if (!this.isEnabled) return;
    
    const performancePayload = {
      ...metricData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId,
      sessionId: this.sessionId
    };
    
    this.sendToBackend('performance', performancePayload);
  }
  
  // Session tracking
  startSession() {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      userAgent: navigator.userAgent,
      browserInfo: this.getBrowserInfo(),
      startTime: new Date().toISOString(),
      url: window.location.href
    };
    
    this.sendToBackend('session', sessionData);
    
    // Update session activity periodically
    setInterval(() => {
      this.updateSessionActivity();
    }, 30000); // Every 30 seconds
  }
  
  updateSessionActivity() {
    this.sendToBackend('session-update', {
      sessionId: this.sessionId,
      lastActivity: new Date().toISOString(),
      currentUrl: window.location.href
    });
  }
  
  // Utility methods
  getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      browser: this.detectBrowser(ua),
      os: this.detectOS(ua),
      device: this.detectDevice(ua),
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: window.screen ? window.screen.width : null,
        height: window.screen ? window.screen.height : null,
        colorDepth: window.screen ? window.screen.colorDepth : null
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
  
  detectBrowser(ua) {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
  
  detectOS(ua) {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }
  
  detectDevice(ua) {
    if (/Mobi|Android/i.test(ua)) return 'Mobile';
    if (/Tablet|iPad/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }
  
  getPageLoadTime() {
    const perfData = performance.getEntriesByType('navigation')[0];
    return perfData ? Math.round(perfData.loadEventEnd - perfData.fetchStart) : null;
  }
  
  getMemoryUsage() {
    return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : null;
  }
  
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }
  
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? Math.round(fcp.startTime) : null;
  }
  
  // Backend communication
  async sendToBackend(type, data) {
    if (!this.isEnabled) return;
    
    // Prevent recursive calls by using a flag
    if (this._sendingToBackend) return;
    this._sendingToBackend = true;
    
    try {
      await fetch(`${this.apiEndpoint}/${type}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Silently fail to avoid infinite error loops
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Error Tracker] Failed to send data to backend:', error);
      }
    } finally {
      this._sendingToBackend = false;
    }
  }
  
  // Public API methods
  captureException(error, extra = {}) {
    this.captureError({
      type: 'javascript',
      message: error.message,
      stack: error.stack,
      severity: 'high',
      extra_data: extra
    });
  }
  
  captureMessage(message, level = 'info', extra = {}) {
    this.captureError({
      type: 'javascript',
      message: message,
      severity: level,
      extra_data: extra
    });
  }
  
  setUser(userData) {
    this.userId = userData.id || this.userId;
    this.userContext = userData;
  }
  
  setTag(key, value) {
    this.tags = this.tags || {};
    this.tags[key] = value;
  }
  
  setContext(key, context) {
    this.contexts = this.contexts || {};
    this.contexts[key] = context;
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Export for use in components
export default errorTracker;

// Also export the class for testing
export { ErrorTracker };