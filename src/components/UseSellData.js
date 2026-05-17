import useGenericFundData, { ANALYSIS_TYPES } from '../hooks/useGenericFundData';

/**
 * Hook for sell analysis - focuses on minimum values for selling decisions
 * @param {Array} urls - Array of fund API URLs
 * @returns {Object} Object containing fundData array and loading state
 */
const useSellData = (urls) => {
  return useGenericFundData(urls, ANALYSIS_TYPES.SELL);
};

export default useSellData;