/**
 * Accessibility Utilities
 * Helper functions and utilities for improving accessibility
 */

/**
 * Manage focus for keyboard navigation
 * @param {HTMLElement} element - Element to focus
 * @param {Object} options - Focus options
 */
export const manageFocus = (element, options = {}) => {
  if (!element) return;

  const { preventScroll = false, delay = 0 } = options;

  if (delay > 0) {
    setTimeout(() => {
      element.focus({ preventScroll });
    }, delay);
  } else {
    element.focus({ preventScroll });
  }
};

/**
 * Trap focus within a container (useful for modals)
 * @param {HTMLElement} container - Container element
 * @returns {Function} - Cleanup function
 */
export const trapFocus = (container) => {
  if (!container) return () => {};

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

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
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus the first element
  if (firstElement) {
    firstElement.focus();
  }

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Announce content to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Announcement priority ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Check if an element is visible to screen readers
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if visible to screen readers
 */
export const isVisibleToScreenReader = (element) => {
  if (!element) return false;

  const style = window.getComputedStyle(element);

  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    element.hasAttribute('aria-hidden') ||
    element.getAttribute('aria-hidden') === 'true'
  );
};

/**
 * Generate unique IDs for accessibility attributes
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID
 */
export const generateA11yId = (prefix = 'a11y') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check color contrast ratio
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {number} - Contrast ratio
 */
export const getContrastRatio = (foreground, background) => {
  const getLuminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standards
 * @param {number} ratio - Contrast ratio
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @param {string} size - Text size ('normal' or 'large')
 * @returns {boolean} - True if meets standards
 */
export const meetsContrastStandards = (ratio, level = 'AA', size = 'normal') => {
  const standards = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };

  return ratio >= standards[level][size];
};

/**
 * Add skip link functionality
 * @param {string} targetId - ID of the target element to skip to
 * @param {string} linkText - Text for the skip link
 */
export const addSkipLink = (targetId, linkText = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = linkText;
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

  document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Keyboard navigation handler
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Object} handlers - Object with key handlers
 */
export const handleKeyboardNavigation = (event, handlers) => {
  const { key, shiftKey, ctrlKey, altKey } = event;
  const keyCombo = [
    ctrlKey && 'ctrl',
    altKey && 'alt',
    shiftKey && 'shift',
    key.toLowerCase()
  ].filter(Boolean).join('+');

  if (handlers[keyCombo]) {
    event.preventDefault();
    handlers[keyCombo](event);
  } else if (handlers[key.toLowerCase()]) {
    event.preventDefault();
    handlers[key.toLowerCase()](event);
  }
};

/**
 * Reduce motion for users who prefer reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false; // Default to false in test environment
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * High contrast mode detection
 * @returns {boolean} - True if high contrast mode is active
 */
export const isHighContrastMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false; // Default to false in test environment
  }
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Create accessible button with proper ARIA attributes
 * @param {Object} options - Button options
 * @returns {HTMLElement} - Button element
 */
export const createAccessibleButton = (options = {}) => {
  const {
    text,
    ariaLabel,
    ariaDescribedBy,
    onClick,
    disabled = false,
    type = 'button'
  } = options;

  const button = document.createElement('button');
  button.type = type;
  button.textContent = text;
  button.disabled = disabled;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  if (ariaDescribedBy) {
    button.setAttribute('aria-describedby', ariaDescribedBy);
  }

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
};
