/**
 * Enhanced Accessibility Utilities
 * WCAG 2.1 AA/AAA compliance utilities and enhancements
 */

// Color contrast utilities
export const contrastUtils = {
  // Calculate relative luminance
  getRelativeLuminance: (color) => {
    const rgb = contrastUtils.hexToRgb(color);
    const sRGB = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  },
  
  // Convert hex to RGB
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  },
  
  // Calculate contrast ratio
  getContrastRatio: (color1, color2) => {
    const l1 = contrastUtils.getRelativeLuminance(color1);
    const l2 = contrastUtils.getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },
  
  // Check WCAG compliance
  checkWCAGCompliance: (foreground, background, level = 'AA', size = 'normal') => {
    const ratio = contrastUtils.getContrastRatio(foreground, background);
    const requirements = {
      'AA': { normal: 4.5, large: 3.0 },
      'AAA': { normal: 7.0, large: 4.5 }
    };
    
    const required = requirements[level][size];
    return {
      ratio: ratio.toFixed(2),
      passes: ratio >= required,
      required,
      level,
      size
    };
  },
};

// Focus management
export const focusManagement = {
  // Trap focus within an element
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        focusManagement.releaseFocus(element);
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },
  
  // Release focus trap
  releaseFocus: (element) => {
    const event = new CustomEvent('focusReleased', { detail: { element } });
    element.dispatchEvent(event);
  },
  
  // Get next focusable element
  getNextFocusableElement: (currentElement, direction = 'forward') => {
    const focusableElements = Array.from(document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex === -1) return null;
    
    const nextIndex = direction === 'forward' 
      ? (currentIndex + 1) % focusableElements.length
      : (currentIndex - 1 + focusableElements.length) % focusableElements.length;
    
    return focusableElements[nextIndex];
  },
  
  // Restore focus to previous element
  restoreFocus: (() => {
    let previousActiveElement = null;
    
    return {
      save: () => {
        previousActiveElement = document.activeElement;
      },
      restore: () => {
        if (previousActiveElement && previousActiveElement.focus) {
          previousActiveElement.focus();
          previousActiveElement = null;
        }
      }
    };
  })(),
};

// Screen reader utilities
export const screenReaderUtils = {
  // Announce message to screen readers
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },
  
  // Create visually hidden text for screen readers
  createSROnlyText: (text) => {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  },
  
  // Update aria-label dynamically
  updateAriaLabel: (element, newLabel) => {
    element.setAttribute('aria-label', newLabel);
    screenReaderUtils.announce(`Updated: ${newLabel}`);
  },
  
  // Describe element for screen readers
  describeElement: (element, description) => {
    const descriptionId = `desc-${Date.now()}`;
    const descriptionElement = document.createElement('div');
    descriptionElement.id = descriptionId;
    descriptionElement.className = 'sr-only';
    descriptionElement.textContent = description;
    
    document.body.appendChild(descriptionElement);
    element.setAttribute('aria-describedby', descriptionId);
    
    return () => {
      document.body.removeChild(descriptionElement);
      element.removeAttribute('aria-describedby');
    };
  },
};

// Keyboard navigation
export const keyboardNavigation = {
  // Handle arrow key navigation
  handleArrowNavigation: (container, options = {}) => {
    const {
      selector = '[role="menuitem"], button, [tabindex="0"]',
      wrap = true,
      orientation = 'vertical'
    } = options;
    
    const handleKeyDown = (e) => {
      const items = Array.from(container.querySelectorAll(selector));
      const currentIndex = items.indexOf(e.target);
      
      if (currentIndex === -1) return;
      
      let nextIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            nextIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            e.preventDefault();
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            nextIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            e.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            nextIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            e.preventDefault();
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            nextIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            e.preventDefault();
          }
          break;
        case 'Home':
          nextIndex = 0;
          e.preventDefault();
          break;
        case 'End':
          nextIndex = items.length - 1;
          e.preventDefault();
          break;
      }
      
      if (nextIndex !== currentIndex && items[nextIndex]) {
        items[nextIndex].focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  },
  
  // Skip link functionality
  createSkipLink: (targetId, text = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    return skipLink;
  },
};

// Motion and animation preferences
export const motionPreferences = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Respect motion preferences in animations
  respectMotionPreference: (animation, reducedMotionAlternative = null) => {
    if (motionPreferences.prefersReducedMotion()) {
      return reducedMotionAlternative || { duration: 0 };
    }
    return animation;
  },
  
  // Listen for motion preference changes
  onMotionPreferenceChange: (callback) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  },
};

// Form accessibility
export const formAccessibility = {
  // Associate labels with form controls
  associateLabel: (input, labelText) => {
    const labelId = `label-${Date.now()}`;
    const label = document.createElement('label');
    label.id = labelId;
    label.textContent = labelText;
    label.setAttribute('for', input.id || `input-${Date.now()}`);
    
    if (!input.id) {
      input.id = label.getAttribute('for');
    }
    
    input.parentNode.insertBefore(label, input);
    return label;
  },
  
  // Add error message to form field
  addErrorMessage: (input, message) => {
    const errorId = `error-${Date.now()}`;
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
    input.parentNode.appendChild(errorElement);
    
    return () => {
      input.removeAttribute('aria-describedby');
      input.removeAttribute('aria-invalid');
      if (errorElement.parentNode) {
        errorElement.parentNode.removeChild(errorElement);
      }
    };
  },
  
  // Validate form accessibility
  validateFormAccessibility: (form) => {
    const issues = [];
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Check for labels
      const label = form.querySelector(`label[for="${input.id}"]`);
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push(`Input ${input.name || input.id || 'unnamed'} is missing a label`);
      }
      
      // Check for required field indicators
      if (input.required && !input.getAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
    
    return issues;
  },
};

// Initialize accessibility enhancements
export const initializeAccessibility = () => {
  // Add skip link
  keyboardNavigation.createSkipLink('main', 'Skip to main content');
  
  // Add screen reader only styles
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    
    .skip-link:focus {
      position: absolute !important;
      top: 6px !important;
      left: 6px !important;
      z-index: 1000 !important;
    }
  `;
  document.head.appendChild(style);
  
  // Listen for motion preference changes
  motionPreferences.onMotionPreferenceChange((e) => {
    document.body.classList.toggle('reduce-motion', e.matches);
  });
  
  // Initial motion preference check
  if (motionPreferences.prefersReducedMotion()) {
    document.body.classList.add('reduce-motion');
  }
  
  // Announce page changes for SPAs
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(() => {
        const title = document.title;
        screenReaderUtils.announce(`Navigated to ${title}`, 'assertive');
      }, 100);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
};

export default {
  contrastUtils,
  focusManagement,
  screenReaderUtils,
  keyboardNavigation,
  motionPreferences,
  formAccessibility,
  initializeAccessibility,
};
