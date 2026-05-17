
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { getClosestDate, parseDate } from '../utils/dataUtils';

/**
 * Time frame configurations for fund analysis
 */
export const TIME_FRAMES = [
  { key: 'oneWeek', days: 7, label: 'One Week' },
  { key: 'twoWeek', days: 14, label: 'Two Weeks' },
  { key: 'oneMonth', days: 30, label: 'One Month' },
  { key: 'twoMonths', days: 60, label: 'Two Months' },
  { key: 'threeMonths', days: 90, label: 'Three Months' },
  { key: 'fourMonths', days: 120, label: 'Four Months' },
  { key: 'sixMonths', days: 180, label: 'Six Months' }
];

/**
 * Analysis types for different fund data processing
 */
export const ANALYSIS_TYPES = {
  BUY: 'buy', // Focuses on maximum values for buying decisions
  SELL: 'sell' // Focuses on minimum values for selling decisions
};

/**
 * Generic hook to fetch and process mutual fund data with configurable analysis type
 * @param {Array} urls - Array of fund API URLs
 * @param {string} analysisType - Type of analysis ('buy' or 'sell')
 * @returns {Object} Object containing fundData array, loading state, and error state
 */
const useGenericFundData = (urls, analysisType = ANALYSIS_TYPES.BUY) => {
  const [fundData, setFundData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Process data for a specific time period with configurable analysis type
   */
  const processTimeFrame = useCallback((daysAgo, apiData, currentDate) => {
    const startDate = new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth(), 
      currentDate.getDate() - daysAgo
    );
    
    const adjustedStartDate = getClosestDate(startDate, apiData);
    const filteredData = apiData.filter(entry => parseDate(entry.date) >= adjustedStartDate);

    if (filteredData.length === 0) {
      return {
        percentageDifference: '0.00',
        latestNav: 0,
        closeNav: 0
      };
    }

    // Find closest entry before start date
    const closestEntryBeforeStartDate = apiData.reduce((closest, entry) => {
      const entryDate = parseDate(entry.date);
      return (entryDate <= adjustedStartDate && (!closest || entryDate > parseDate(closest.date))) 
        ? entry 
        : closest;
    }, null);

    const latestNav = parseFloat(filteredData[0].nav) || 0;
    const closeNav = closestEntryBeforeStartDate ? parseFloat(closestEntryBeforeStartDate.nav) : 0;
    
    // Calculate extreme value based on analysis type
    const navValues = filteredData.map(entry => parseFloat(entry.nav));
    const extremeValue = analysisType === ANALYSIS_TYPES.BUY 
      ? Math.max(...navValues) // For buy analysis, use maximum
      : Math.min(...navValues); // For sell analysis, use minimum

    // Calculate percentage difference based on analysis type
    let percentageDifference = 0;
    if (analysisType === ANALYSIS_TYPES.BUY) {
      // Buy analysis: (max - current) / max * 100
      percentageDifference = extremeValue !== 0 ? ((extremeValue - latestNav) / extremeValue) * 100 : 0;
    } else {
      // Sell analysis: (current - min) / min * 100
      percentageDifference = extremeValue !== 0 ? ((latestNav - extremeValue) / extremeValue) * 100 : 0;
    }

    return {
      percentageDifference: percentageDifference.toFixed(2),
      latestNav,
      closeNav,
      extremeValue
    };
  }, [analysisType]);

  /**
   * Fetch and process fund data from API
   */
  const fetchData = useCallback(async () => {
    if (!urls || urls.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const fetchedData = [];
      const currentDate = new Date();

      // Process URLs in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (url, batchIndex) => {
          const actualIndex = i + batchIndex;
          try {
            const response = await axios.get(url);
            const apiData = response.data.data || [];

            if (apiData.length === 0) {
              console.warn(`No data received for ${url}`);
              return null;
            }

            // Calculate all-time maximum NAV
            const navValues = apiData.map(entry => parseFloat(entry.nav));
            const allTimeMaxNav = Math.max(...navValues);

            // Create fund data object
            const fundInfo = {
              id: actualIndex + 1,
              fundName: response.data.meta.scheme_name,
              dummyValue: '',
              maxNav: allTimeMaxNav,
              analysisType
            };

            // Process different time frames
            TIME_FRAMES.forEach(({ key, days }) => {
              fundInfo[key] = processTimeFrame(days, apiData, currentDate);
            });

            return fundInfo;
          } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        fetchedData.push(...batchResults.filter(result => result !== null));
        
        // Add small delay between batches to be respectful to the API
        if (i + batchSize < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setFundData(fetchedData);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error.message || 'Failed to fetch fund data');
    } finally {
      setLoading(false);
    }
  }, [urls, processTimeFrame, analysisType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return enhanced API with refetch capability
  return { 
    fundData, 
    loading, 
    error,
    refetch: fetchData 
  };
};

export default useGenericFundData;