/**
 * Enhanced Security Utilities
 * Enterprise-grade security measures for production deployment
 */

import config from '../config/environment';

// Content Security Policy (CSP) configuration
export const cspConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:',
    ],
    'connect-src': [
      "'self'",
      config.api.baseUrl,
      'https://www.google-analytics.com',
      'https://sentry.io',
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },
};

// Generate CSP header string
export const generateCSPHeader = () => {
  return Object.entries(cspConfig.directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

// CSRF Token management
export const csrfUtils = {
  // Generate CSRF token
  generateToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  // Store CSRF token
  storeToken: (token) => {
    sessionStorage.setItem('csrf_token', token);
  },
  
  // Get CSRF token
  getToken: () => {
    return sessionStorage.getItem('csrf_token');
  },
  
  // Validate CSRF token
  validateToken: (token) => {
    const storedToken = csrfUtils.getToken();
    return storedToken && storedToken === token;
  },
  
  // Clear CSRF token
  clearToken: () => {
    sessionStorage.removeItem('csrf_token');
  },
};

// Enhanced input sanitization
export const advancedSanitization = {
  // SQL injection prevention patterns
  sqlInjectionPatterns: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/g,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi,
  ],
  
  // XSS prevention patterns
  xssPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ],
  
  // Check for SQL injection attempts
  detectSQLInjection: (input) => {
    return advancedSanitization.sqlInjectionPatterns.some(pattern => pattern.test(input));
  },
  
  // Check for XSS attempts
  detectXSS: (input) => {
    return advancedSanitization.xssPatterns.some(pattern => pattern.test(input));
  },
  
  // Comprehensive input sanitization
  sanitizeInput: (input, options = {}) => {
    if (typeof input !== 'string') return '';
    
    const {
      allowHtml = false,
      maxLength = 1000,
      stripSql = true,
      stripXss = true,
      trimWhitespace = true,
    } = options;
    
    let sanitized = input;
    
    // Trim whitespace
    if (trimWhitespace) {
      sanitized = sanitized.trim();
    }
    
    // Check for malicious patterns
    if (stripSql && advancedSanitization.detectSQLInjection(sanitized)) {
      throw new Error('Potential SQL injection detected');
    }
    
    if (stripXss && advancedSanitization.detectXSS(sanitized)) {
      throw new Error('Potential XSS attack detected');
    }
    
    // HTML sanitization
    if (!allowHtml) {
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    
    // Truncate to max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  },
};

// Rate limiting with enhanced tracking
export const enhancedRateLimit = {
  // Rate limit storage
  storage: new Map(),
  
  // Check if action is rate limited
  isLimited: (key, limit = 5, windowMs = 60000, options = {}) => {
    const now = Date.now();
    const {
      blockDuration = windowMs * 2, // Block for 2x the window
      // progressiveDelay could be used for future enhancements
    } = options;
    
    if (!enhancedRateLimit.storage.has(key)) {
      enhancedRateLimit.storage.set(key, {
        attempts: [],
        blocked: false,
        blockUntil: 0,
      });
    }
    
    const record = enhancedRateLimit.storage.get(key);
    
    // Check if currently blocked
    if (record.blocked && now < record.blockUntil) {
      return {
        limited: true,
        remainingTime: record.blockUntil - now,
        reason: 'blocked',
      };
    }
    
    // Clear block if expired
    if (record.blocked && now >= record.blockUntil) {
      record.blocked = false;
      record.blockUntil = 0;
      record.attempts = [];
    }
    
    // Remove old attempts
    record.attempts = record.attempts.filter(timestamp => now - timestamp < windowMs);
    
    // Check if limit exceeded
    if (record.attempts.length >= limit) {
      record.blocked = true;
      record.blockUntil = now + blockDuration;
      
      return {
        limited: true,
        remainingTime: blockDuration,
        reason: 'rate_exceeded',
      };
    }
    
    // Add current attempt
    record.attempts.push(now);
    
    return {
      limited: false,
      remaining: limit - record.attempts.length,
      resetTime: now + windowMs,
    };
  },
  
  // Clear rate limit for a key
  clear: (key) => {
    enhancedRateLimit.storage.delete(key);
  },
  
  // Clear all rate limits
  clearAll: () => {
    enhancedRateLimit.storage.clear();
  },
};

// Secure API request wrapper
export const secureApiRequest = async (url, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = config.api.timeout,
    retries = 3,
    ...otherOptions
  } = options;
  
  // Add security headers
  const secureHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...headers,
  };
  
  // Add CSRF token for non-GET requests
  if (method !== 'GET') {
    const csrfToken = csrfUtils.getToken();
    if (csrfToken) {
      secureHeaders['X-CSRF-Token'] = csrfToken;
    }
  }
  
  // Request configuration
  const requestConfig = {
    method,
    headers: secureHeaders,
    credentials: 'same-origin',
    ...otherOptions,
  };
  
  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  // Timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  requestConfig.signal = controller.signal;
  
  let lastError;
  
  // Retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);
      
      // Check for security-related status codes
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      
      if (response.status === 403) {
        throw new Error('Access forbidden - check authentication');
      }
      
      if (response.status === 401) {
        throw new Error('Unauthorized - authentication required');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      clearTimeout(timeoutId);
      
      // Don't retry on certain errors
      if (error.name === 'AbortError' || 
          error.message.includes('Rate limit') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('Forbidden')) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError;
};

// Security monitoring
export const securityMonitor = {
  // Log security events
  logSecurityEvent: (event, details = {}) => {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: sessionStorage.getItem('session_id'),
    };
    
    // In production, send to security monitoring service
    if (config.isProduction) {
      console.warn('Security Event:', securityEvent);
      // Send to monitoring service
    } else {
      console.log('Security Event:', securityEvent);
    }
  },
  
  // Monitor for suspicious activity
  detectSuspiciousActivity: () => {
    // Check for rapid page navigation
    const navigationCount = sessionStorage.getItem('navigation_count') || 0;
    const newCount = parseInt(navigationCount) + 1;
    sessionStorage.setItem('navigation_count', newCount);
    
    if (newCount > 50) { // Threshold for suspicious activity
      securityMonitor.logSecurityEvent('suspicious_navigation', {
        count: newCount,
      });
    }
    
    // Check for console manipulation attempts
    if (window.console && window.console.log.toString().indexOf('[native code]') === -1) {
      securityMonitor.logSecurityEvent('console_manipulation');
    }
  },
};

// Initialize security measures
export const initializeSecurity = () => {
  // Generate and store CSRF token
  const csrfToken = csrfUtils.generateToken();
  csrfUtils.storeToken(csrfToken);
  
  // Set up security monitoring
  securityMonitor.detectSuspiciousActivity();
  
  // Add security event listeners
  window.addEventListener('beforeunload', () => {
    // Clear sensitive data on page unload
    csrfUtils.clearToken();
  });
  
  // Monitor for developer tools
  if (config.isProduction) {
    let devtools = false;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools) {
          devtools = true;
          securityMonitor.logSecurityEvent('devtools_opened');
        }
      } else {
        devtools = false;
      }
    }, 1000);
  }
};

const securityEnhancements = {
  cspConfig,
  generateCSPHeader,
  csrfUtils,
  advancedSanitization,
  enhancedRateLimit,
  secureApiRequest,
  securityMonitor,
  initializeSecurity,
};

export default securityEnhancements;
