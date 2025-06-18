/**
 * Performance Optimization Utilities
 * Enterprise-grade performance enhancements and monitoring
 */

import config from '../config/environment';
import typographySystem from '../styles/typography';

// Font loading optimization
export const fontOptimization = {
  // Load and apply critical fonts immediately
  loadCriticalFonts: () => {
    // Use typography system for consistent font loading
    const fontCSS = typographySystem.generateCriticalFontCSS();

    // Create style element and add to head
    const styleElement = document.createElement('style');
    styleElement.textContent = fontCSS;
    styleElement.id = 'critical-fonts';
    document.head.appendChild(styleElement);

    // Mark fonts as loading
    document.body.classList.add('fonts-loading');
  },

  // Load fonts with fallback using Font Loading API
  loadFontsWithFallback: () => {
    if ('fonts' in document) {
      // Use Font Loading API for better control
      const fontPromises = [
        document.fonts.load('400 16px Inter'),
        document.fonts.load('500 16px Inter'),
        document.fonts.load('600 16px Inter'),
        document.fonts.load('700 16px Inter'),
        document.fonts.load('600 24px Poppins'),
        document.fonts.load('700 24px Poppins'),
        document.fonts.load('800 24px Poppins'),
      ];

      Promise.all(fontPromises).then(() => {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
      }).catch(() => {
        // Fallback to system fonts
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-fallback');
      });
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
      }, 3000); // Assume fonts loaded after 3 seconds
    }
  },
};

// Image optimization utilities
export const imageOptimization = {
  // Lazy loading with Intersection Observer
  lazyLoadImages: (selector = 'img[data-src]') => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01,
      });
      
      document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll(selector).forEach(img => {
        img.src = img.dataset.src;
      });
    }
  },
  
  // Generate responsive image srcSet
  generateSrcSet: (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },
  
  // WebP support detection
  supportsWebP: () => {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },
};

// Bundle optimization
export const bundleOptimization = {
  // Dynamic import with error handling
  dynamicImport: async (importFn, fallback = null) => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error('Dynamic import failed:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  },
  
  // Preload critical routes
  preloadRoutes: (routes = []) => {
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },
  
  // Resource hints
  addResourceHints: () => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: config.api.baseUrl },
    ];
    
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  },
};

// Memory optimization
export const memoryOptimization = {
  // Debounce function
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Memoization utility
  memoize: (fn, getKey = (...args) => JSON.stringify(args)) => {
    const cache = new Map();
    return (...args) => {
      const key = getKey(...args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },
  
  // Clean up event listeners
  cleanupEventListeners: () => {
    // Remove passive event listeners that might cause memory leaks
    const events = ['scroll', 'resize', 'mousemove', 'touchmove'];
    events.forEach(event => {
      const listeners = window.getEventListeners?.(window)?.[event] || [];
      listeners.forEach(listener => {
        if (listener.passive) {
          window.removeEventListener(event, listener.listener, listener.options);
        }
      });
    });
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Core Web Vitals measurement
  measureCoreWebVitals: () => {
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(performanceMonitoring.logMetric);
        getFID(performanceMonitoring.logMetric);
        getFCP(performanceMonitoring.logMetric);
        getLCP(performanceMonitoring.logMetric);
        getTTFB(performanceMonitoring.logMetric);
      });
    }
  },
  
  // Log performance metrics
  logMetric: (metric) => {
    const { name, value, id } = metric;
    
    if (config.features.enablePerformanceMonitoring) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${name}:`, {
          value: Math.round(value),
          id,
          timestamp: Date.now(),
        });
      }

      // Send to analytics in production
      if (config.isProduction && window.gtag) {
        window.gtag('event', name, {
          event_category: 'Web Vitals',
          value: Math.round(value),
          non_interaction: true,
        });
      }
    }
  },
  
  // Memory usage monitoring
  monitorMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const memoryInfo = {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
      
      if (config.features.enableDebugMode) {
        console.log('Memory Usage:', memoryInfo);
      }
      
      // Warn if memory usage is high
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercentage > 80) {
        console.warn('High memory usage detected:', usagePercentage.toFixed(2) + '%');
      }
      
      return memoryInfo;
    }
    return null;
  },
  
  // Network information
  getNetworkInfo: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    return null;
  },
};

// Critical resource loading
export const criticalResourceLoading = {
  // Load critical CSS inline
  loadCriticalCSS: (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },
  
  // Defer non-critical CSS
  deferCSS: (href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  },
  
  // Load scripts asynchronously
  loadScriptAsync: (src, callback) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.onload = callback;
    script.onerror = () => {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  },
};

// Service Worker utilities
export const serviceWorkerUtils = {
  // Register service worker
  register: async (swPath = '/sw.js') => {
    if ('serviceWorker' in navigator && config.isProduction) {
      try {
        const registration = await navigator.serviceWorker.register(swPath);
        if (process.env.NODE_ENV === 'development') {
          console.log('Service Worker registered:', registration);
        }
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  },
  
  // Update service worker
  update: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  },
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Font optimization - load critical fonts immediately
  fontOptimization.loadCriticalFonts();

  // Load fonts with fallback after initial render
  setTimeout(() => {
    fontOptimization.loadFontsWithFallback();
  }, 100);

  // Bundle optimization
  bundleOptimization.addResourceHints();

  // Image optimization
  imageOptimization.lazyLoadImages();

  // Performance monitoring
  performanceMonitoring.measureCoreWebVitals();

  // Service worker
  serviceWorkerUtils.register();

  // Memory monitoring (in development)
  if (config.features.enableDebugMode) {
    setInterval(() => {
      performanceMonitoring.monitorMemoryUsage();
    }, 30000); // Every 30 seconds
  }
};

const performanceOptimizations = {
  fontOptimization,
  imageOptimization,
  bundleOptimization,
  memoryOptimization,
  performanceMonitoring,
  criticalResourceLoading,
  serviceWorkerUtils,
  initializePerformanceOptimizations,
};

export default performanceOptimizations;
