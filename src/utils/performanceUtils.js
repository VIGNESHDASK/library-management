
/**
 * Performance monitoring utilities
 */

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Promise<any>} Function result
 */
export const measurePerformance = async (fn, label = 'Operation') => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      console.log(`⏱️ ${label} took ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ ${label} failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
      throw error;
    }
  };
  
  /**
   * Debounce function to limit the rate of function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Whether to execute on leading edge
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait, immediate = false) => {
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
  };
  
  /**
   * Throttle function to limit function execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  export const throttle = (func, limit) => {
    let inThrottle;
    
    return function() {
      const args = arguments;
      const context = this;
      
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  /**
   * Memoization utility for expensive computations
   * @param {Function} fn - Function to memoize
   * @param {Function} keyGenerator - Function to generate cache key
   * @returns {Function} Memoized function
   */
  export const memoize = (fn, keyGenerator = (...args) => JSON.stringify(args)) => {
    const cache = new Map();
    
    return (...args) => {
      const key = keyGenerator(...args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  };
  
  /**
   * Batch operations to improve performance
   * @param {Array} items - Items to process
   * @param {Function} processor - Function to process each batch
   * @param {number} batchSize - Size of each batch
   * @param {number} delay - Delay between batches
   * @returns {Promise<Array>} Processed results
   */
  export const batchProcess = async (items, processor, batchSize = 10, delay = 0) => {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
      
      if (delay > 0 && i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  };
  
  /**
   * Deep clone utility for complex objects
   * @param {any} obj - Object to clone
   * @returns {any} Cloned object
   */
  export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  };
  
  /**
   * Check if two objects are deeply equal
   * @param {any} a - First object
   * @param {any} b - Second object
   * @returns {boolean} Whether objects are equal
   */
  export const deepEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
      }
      
      return true;
    }
    
    return false;
  };
  