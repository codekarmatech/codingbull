/**
 * Security Utilities
 * Input sanitization, XSS protection, and security helpers
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML content
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (s) => map[s]);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize user input for forms
 * @param {string} input - User input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') return '';
  
  const {
    maxLength = 1000,
    allowHtml = false,
    trimWhitespace = true,
    removeLineBreaks = false,
  } = options;
  
  let sanitized = input;
  
  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Remove line breaks if specified
  if (removeLineBreaks) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  }
  
  // Escape HTML if not allowed
  if (!allowHtml) {
    sanitized = escapeHtml(sanitized);
  }
  
  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Generate a random nonce for CSP
 * @returns {string} - Random nonce string
 */
export const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if the current origin is allowed
 * @param {string} origin - Origin to check
 * @param {Array} allowedOrigins - Array of allowed origins
 * @returns {boolean} - True if origin is allowed
 */
export const isAllowedOrigin = (origin, allowedOrigins = []) => {
  return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
};

/**
 * Validate and sanitize form data
 * @param {Object} formData - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validation result with sanitized data and errors
 */
export const validateFormData = (formData, schema) => {
  const sanitizedData = {};
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = formData[field];
    const rules = schema[field];
    
    // Check if field is required
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Skip validation if field is not required and empty
    if (!rules.required && (!value || value.trim() === '')) {
      sanitizedData[field] = '';
      return;
    }
    
    // Sanitize the value
    const sanitized = sanitizeInput(value, rules.sanitization || {});
    
    // Validate email if specified
    if (rules.type === 'email' && !isValidEmail(sanitized)) {
      errors[field] = `${field} must be a valid email address`;
      return;
    }
    
    // Validate URL if specified
    if (rules.type === 'url' && !isValidUrl(sanitized)) {
      errors[field] = `${field} must be a valid URL`;
      return;
    }
    
    // Validate minimum length
    if (rules.minLength && sanitized.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      return;
    }
    
    // Validate maximum length
    if (rules.maxLength && sanitized.length > rules.maxLength) {
      errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      return;
    }
    
    // Custom validation function
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(sanitized);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
    
    sanitizedData[field] = sanitized;
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    data: sanitizedData,
    errors,
  };
};

/**
 * Rate limiting utility (client-side)
 * @param {string} key - Unique key for the action
 * @param {number} limit - Maximum number of attempts
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if action is allowed
 */
export const isRateLimited = (key, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    const attempts = stored ? JSON.parse(stored) : [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    // Check if limit is exceeded
    if (validAttempts.length >= limit) {
      return true; // Rate limited
    }
    
    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(validAttempts));
    
    return false; // Not rate limited
  } catch (error) {
    console.error('Rate limiting error:', error);
    return false; // Allow action if there's an error
  }
};
