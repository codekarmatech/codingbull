import { memo, useCallback, useMemo } from 'react';

/**
 * Custom hook to memoize a callback function
 * @param {Function} callback - The callback function to memoize
 * @param {Array} dependencies - The dependencies array for the callback
 * @returns {Function} - The memoized callback function
 */
export const useMemoizedCallback = (callback, dependencies) => {
  // Include callback in dependencies to satisfy ESLint
  // This is safe because useCallback will memoize the function
  return useCallback((...args) => callback(...args), [...dependencies, callback]);
};

/**
 * Custom hook to memoize a value
 * @param {Function} factory - The factory function that returns the value to memoize
 * @param {Array} dependencies - The dependencies array for the value
 * @returns {*} - The memoized value
 */
export const useMemoizedValue = (factory, dependencies) => {
  // Include factory in dependencies to satisfy ESLint
  // This is safe because useMemo will memoize the result
  return useMemo(() => factory(), [...dependencies, factory]);
};

/**
 * Higher-order component to memoize a component
 * @param {React.Component} Component - The component to memoize
 * @param {Function} propsAreEqual - Optional custom comparison function
 * @returns {React.Component} - The memoized component
 */
export const withMemo = (Component, propsAreEqual = null) => {
  return memo(Component, propsAreEqual);
};

/**
 * Custom comparison function for React.memo to check if props are equal
 * @param {Object} prevProps - The previous props
 * @param {Object} nextProps - The next props
 * @returns {boolean} - Whether the props are equal
 */
export const arePropsEqual = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  return prevKeys.every(key => {
    if (typeof prevProps[key] === 'function' && typeof nextProps[key] === 'function') {
      // Skip function comparison as they might be recreated on each render
      return true;
    }
    
    if (typeof prevProps[key] === 'object' && prevProps[key] !== null && 
        typeof nextProps[key] === 'object' && nextProps[key] !== null) {
      // For objects, perform shallow comparison of their properties
      const prevObjKeys = Object.keys(prevProps[key]);
      const nextObjKeys = Object.keys(nextProps[key]);
      
      if (prevObjKeys.length !== nextObjKeys.length) {
        return false;
      }
      
      return prevObjKeys.every(objKey => prevProps[key][objKey] === nextProps[key][objKey]);
    }
    
    return prevProps[key] === nextProps[key];
  });
};

/**
 * Utility function to create a stable key for list items
 * @param {string} prefix - A prefix for the key
 * @param {*} id - The unique identifier
 * @param {number} index - The index of the item in the list (fallback)
 * @returns {string} - A stable key for the list item
 */
export const createStableKey = (prefix, id, index) => {
  if (id !== undefined && id !== null) {
    return `${prefix}-${id}`;
  }
  return `${prefix}-index-${index}`;
};