
import { useCallback, useEffect, useMemo, useState } from 'react';
import { measurePerformance } from '../utils/performanceUtils';
import useGenericFundData, { ANALYSIS_TYPES } from './useGenericFundData';

/**
 * Cache for fund analysis results
 */
const analysisCache = new Map();

/**
 * Enhanced hook to manage fund data for buy and sell analysis with caching and performance monitoring
 * @param {Array} fundUrls - Array of fund API URLs
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing buy data, sell data, loading states, and additional utilities
 */
export const useFundAnalysis = (fundUrls, options = {}) => {
  const {
    enableCaching = true,
    enablePerformanceMonitoring = false,
    refreshInterval = null // Auto-refresh interval in milliseconds
  } = options;

  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Memoize URLs to prevent unnecessary re-renders
  const memoizedUrls = useMemo(() => fundUrls, [fundUrls]);
  
  // Generate cache key
  const cacheKey = useMemo(() => {
    return `${JSON.stringify(memoizedUrls)}-${lastRefresh}`;
  }, [memoizedUrls, lastRefresh]);

  // Check cache first
  const getCachedData = useCallback((type) => {
    if (!enableCaching) return null;
    const key = `${cacheKey}-${type}`;
    return analysisCache.get(key);
  }, [cacheKey, enableCaching]);

  // Set cache data
  const setCachedData = useCallback((type, data) => {
    if (!enableCaching) return;
    const key = `${cacheKey}-${type}`;
    analysisCache.set(key, data);
    
    // Cleanup old cache entries (keep only last 10 entries)
    if (analysisCache.size > 10) {
      const entries = Array.from(analysisCache.entries());
      entries.slice(0, entries.length - 10).forEach(([key]) => {
        analysisCache.delete(key);
      });
    }
  }, [cacheKey, enableCaching]);

  // Fetch buy data
  const buyResult = useGenericFundData(memoizedUrls, ANALYSIS_TYPES.BUY);
  const sellResult = useGenericFundData(memoizedUrls, ANALYSIS_TYPES.SELL);

  // Enhanced data with caching
  const enhancedBuyData = useMemo(() => {
    const cached = getCachedData('buy');
    if (cached && !buyResult.loading) return cached;
    
    if (!buyResult.loading && buyResult.fundData.length > 0) {
      setCachedData('buy', buyResult.fundData);
      return buyResult.fundData;
    }
    
    return buyResult.fundData;
  }, [buyResult.fundData, buyResult.loading, getCachedData, setCachedData]);

  const enhancedSellData = useMemo(() => {
    const cached = getCachedData('sell');
    if (cached && !sellResult.loading) return cached;
    
    if (!sellResult.loading && sellResult.fundData.length > 0) {
      setCachedData('sell', sellResult.fundData);
      return sellResult.fundData;
    }
    
    return sellResult.fundData;
  }, [sellResult.fundData, sellResult.loading, getCachedData, setCachedData]);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && !buyResult.loading && !sellResult.loading) {
      measurePerformance(
        () => Promise.resolve({ buyData: enhancedBuyData, sellData: enhancedSellData }),
        'Fund Analysis Processing'
      );
    }
  }, [enablePerformanceMonitoring, buyResult.loading, sellResult.loading, enhancedBuyData, enhancedSellData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        setLastRefresh(Date.now());
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLastRefresh(Date.now());
    // Clear cache for this fund set
    if (enableCaching) {
      ['buy', 'sell'].forEach(type => {
        const key = `${cacheKey}-${type}`;
        analysisCache.delete(key);
      });
    }
  }, [cacheKey, enableCaching]);

  // Calculate overall loading state
  const isLoading = buyResult.loading || sellResult.loading;
  
  // Calculate error state
  const hasError = buyResult.error || sellResult.error;
  const errorMessage = buyResult.error || sellResult.error;

  // Calculate data statistics
  const stats = useMemo(() => {
    const buyCount = enhancedBuyData.length;
    const sellCount = enhancedSellData.length;
    
    return {
      totalFunds: Math.max(buyCount, sellCount),
      buyDataCount: buyCount,
      sellDataCount: sellCount,
      isComplete: buyCount > 0 && sellCount > 0,
      cacheHitRate: enableCaching ? (analysisCache.size > 0 ? 1 : 0) : null
    };
  }, [enhancedBuyData.length, enhancedSellData.length, enableCaching]);

  return {
    // Data
    buyData: enhancedBuyData,
    sellData: enhancedSellData,
    
    // States
    isLoading,
    buyLoading: buyResult.loading,
    sellLoading: sellResult.loading,
    hasError,
    errorMessage,
    
    // Utilities
    refresh,
    refetchBuy: buyResult.refetch,
    refetchSell: sellResult.refetch,
    
    // Statistics
    stats,
    
    // Cache info
    isCached: enableCaching && (getCachedData('buy') !== null || getCachedData('sell') !== null),
    lastRefresh: new Date(lastRefresh)
  };
};