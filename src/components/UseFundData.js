import useGenericFundData, { ANALYSIS_TYPES } from '../hooks/useGenericFundData';

/**
 * Hook for buy analysis - focuses on maximum values for buying decisions
 * @param {Array} urls - Array of fund API URLs
 * @returns {Object} Object containing fundData array and loading state
 */
const useFundData = (urls) => {
  return useGenericFundData(urls, ANALYSIS_TYPES.BUY);
};

export default useFundData;