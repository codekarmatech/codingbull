/**
 * Performance Monitoring Utilities
 * Tools for measuring and optimizing application performance
 */

import config from '../config/environment';

/**
 * Performance metrics collector
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = config.features.enablePerformanceMonitoring;
    
    if (this.isEnabled) {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers
   */
  initializeObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      this.observeWebVitals();
      this.observeResourceTiming();
      this.observeNavigationTiming();
    }
  }

  /**
   * Observe Core Web Vitals (LCP, FID, CLS)
   */
  observeWebVitals() {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      console.warn('Failed to initialize Web Vitals observers:', error);
    }
  }

  /**
   * Observe resource loading performance
   */
  observeResourceTiming() {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordResourceMetric(entry);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Failed to initialize resource timing observer:', error);
    }
  }

  /**
   * Observe navigation timing
   */
  observeNavigationTiming() {
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordNavigationMetric(entry);
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);
    } catch (error) {
      console.warn('Failed to initialize navigation timing observer:', error);
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, value, metadata = {}) {
    if (!this.isEnabled) return;

    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    };

    this.metrics.set(`${name}-${Date.now()}`, metric);

    // Log in development only
    if (config.isDevelopment) {
      console.log(`📊 Performance Metric: ${name} = ${value}ms`, metric);
    }

    // Send to analytics service in production
    if (config.isProduction) {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Record resource loading metrics
   */
  recordResourceMetric(entry) {
    const metric = {
      name: 'Resource Load',
      resource: entry.name,
      duration: entry.duration,
      size: entry.transferSize || entry.encodedBodySize,
      type: entry.initiatorType,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd
    };

    this.recordMetric('ResourceLoad', entry.duration, metric);
  }

  /**
   * Record navigation metrics
   */
  recordNavigationMetric(entry) {
    const metrics = {
      'DNS Lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'TCP Connection': entry.connectEnd - entry.connectStart,
      'Request': entry.responseStart - entry.requestStart,
      'Response': entry.responseEnd - entry.responseStart,
      'DOM Processing': entry.domComplete - entry.domLoading,
      'Load Complete': entry.loadEventEnd - entry.loadEventStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(name, value);
    });
  }

  /**
   * Measure custom performance
   */
  measure(name, fn) {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    this.recordMetric(name, endTime - startTime);
    
    return result;
  }

  /**
   * Measure async performance
   */
  async measureAsync(name, fn) {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    this.recordMetric(name, endTime - startTime);
    
    return result;
  }

  /**
   * Start a performance timer
   */
  startTimer(name) {
    if (!this.isEnabled) return;
    performance.mark(`${name}-start`);
  }

  /**
   * End a performance timer
   */
  endTimer(name) {
    if (!this.isEnabled) return;
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      this.recordMetric(name, measure.duration);
    }
  }

  /**
   * Send metrics to analytics service
   */
  sendToAnalytics(metric) {
    // This would integrate with your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    if (config.analytics.googleAnalyticsId) {
      // gtag('event', 'performance_metric', {
      //   metric_name: metric.name,
      //   metric_value: metric.value,
      //   custom_parameter: metric
      // });
    }
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const metrics = Array.from(this.metrics.values());
    const summary = {};

    metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          total: 0,
          min: Infinity,
          max: -Infinity,
          avg: 0
        };
      }

      const stat = summary[metric.name];
      stat.count++;
      stat.total += metric.value;
      stat.min = Math.min(stat.min, metric.value);
      stat.max = Math.max(stat.max, metric.value);
      stat.avg = stat.total / stat.count;
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Utility functions
 */

/**
 * Measure component render time
 */
export const measureRender = (componentName, renderFn) => {
  return performanceMonitor.measure(`${componentName} Render`, renderFn);
};

/**
 * Measure API call performance
 */
export const measureApiCall = async (endpoint, apiCall) => {
  return performanceMonitor.measureAsync(`API Call: ${endpoint}`, apiCall);
};

export default performanceMonitor;
