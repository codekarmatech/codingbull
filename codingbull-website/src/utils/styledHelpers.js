/**
 * Styled Components Helper Utilities
 * 
 * This module provides reusable shouldForwardProp functions to prevent
 * custom props from being passed to DOM elements, which can cause React warnings.
 */

// Common motion props used by Framer Motion
const MOTION_PROPS = [
  'initial',
  'animate', 
  'exit',
  'variants',
  'transition',
  'whileHover',
  'whileTap',
  'whileInView',
  'viewport',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'onDragStart',
  'onDragEnd',
  'layout',
  'layoutId'
];

// Common custom props used across components
const COMMON_CUSTOM_PROPS = [
  'variant',
  'size',
  'fullWidth',
  'active',
  'isOpen',
  'disabled',
  'loading',
  'selected'
];

/**
 * Creates a shouldForwardProp function that filters out specified props
 * @param {string[]} propsToFilter - Array of prop names to filter out
 * @returns {function} shouldForwardProp function
 */
export const createShouldForwardProp = (propsToFilter = []) => {
  return (prop) => !propsToFilter.includes(prop);
};

/**
 * Default shouldForwardProp that filters out motion props and props starting with $
 * This is the most comprehensive filter and should be used as the default
 * @param {string} prop - The prop name to check
 * @returns {boolean} Whether the prop should be forwarded to the DOM
 */
export const shouldForwardProp = (prop) => {
  // Filter out motion props
  if (MOTION_PROPS.includes(prop)) {
    return false;
  }
  
  // Filter out props that start with $ (styled-components convention)
  if (prop.startsWith('$')) {
    return false;
  }
  
  return true;
};

/**
 * shouldForwardProp for components that use motion props
 * Filters out common motion props: whileHover, whileTap
 * @param {string} prop - The prop name to check
 * @returns {boolean} Whether the prop should be forwarded to the DOM
 */
export const shouldForwardMotionProp = createShouldForwardProp(['whileHover', 'whileTap']);

/**
 * shouldForwardProp for button components
 * Filters out button-specific props and motion props
 * @param {string} prop - The prop name to check
 * @returns {boolean} Whether the prop should be forwarded to the DOM
 */
export const shouldForwardButtonProp = createShouldForwardProp([
  'variant',
  'size', 
  'fullWidth',
  'whileHover',
  'whileTap'
]);

/**
 * shouldForwardProp for navigation/interactive components
 * Filters out state-related props
 * @param {string} prop - The prop name to check
 * @returns {boolean} Whether the prop should be forwarded to the DOM
 */
export const shouldForwardStateProp = createShouldForwardProp(['active', 'selected']);

/**
 * shouldForwardProp for toggle/collapsible components
 * Filters out toggle-related props
 * @param {string} prop - The prop name to check
 * @returns {boolean} Whether the prop should be forwarded to the DOM
 */
export const shouldForwardToggleProp = createShouldForwardProp(['isOpen', 'expanded', 'collapsed']);

/**
 * Utility to combine multiple prop filters
 * @param {...string[]} propArrays - Multiple arrays of props to filter
 * @returns {function} Combined shouldForwardProp function
 */
export const combinePropFilters = (...propArrays) => {
  const allPropsToFilter = propArrays.flat();
  return createShouldForwardProp(allPropsToFilter);
};

// Pre-configured combinations for common use cases
export const shouldForwardButtonMotionProp = combinePropFilters(
  ['variant', 'size', 'fullWidth'],
  ['whileHover', 'whileTap']
);

export const shouldForwardInteractiveProp = combinePropFilters(
  ['active', 'selected', 'isOpen'],
  ['whileHover', 'whileTap']
);

// Export individual prop arrays for custom combinations
export { MOTION_PROPS, COMMON_CUSTOM_PROPS };