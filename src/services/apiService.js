
import axios from 'axios';

/**
 * API configuration and base settings
 */
const API_CONFIG = {
  baseURL: 'https://api.mfapi.in',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request interceptor for logging and authentication
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and logging
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generic retry wrapper for API calls
 */
const withRetry = async (operation, attempts = API_CONFIG.retryAttempts) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      const isLastAttempt = i === attempts - 1;
      
      if (isLastAttempt) {
        throw error;
      }
      
      const delay = API_CONFIG.retryDelay * Math.pow(2, i); // Exponential backoff
      console.warn(`⚠️ Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
};

/**
 * Mutual Fund API Service
 */
export class FundApiService {
  /**
   * Fetch single fund data by scheme code
   * @param {string} schemeCode - The mutual fund scheme code
   * @returns {Promise<Object>} Fund data
   */
  static async getFundData(schemeCode) {
    return withRetry(async () => {
      const response = await apiClient.get(`/mf/${schemeCode}`);
      return response.data;
    });
  }

  /**
   * Fetch multiple funds data in parallel with rate limiting
   * @param {Array<string>} schemeCodes - Array of scheme codes
   * @param {number} batchSize - Number of requests per batch
   * @param {number} batchDelay - Delay between batches in ms
   * @returns {Promise<Array>} Array of fund data
   */
  static async getMultipleFundsData(schemeCodes, batchSize = 5, batchDelay = 100) {
    const results = [];
    
    for (let i = 0; i < schemeCodes.length; i += batchSize) {
      const batch = schemeCodes.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (schemeCode) => {
        try {
          return await this.getFundData(schemeCode);
        } catch (error) {
          console.error(`Failed to fetch data for scheme ${schemeCode}:`, error);
          return null;
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      const successfulResults = batchResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);
      
      results.push(...successfulResults);
      
      // Add delay between batches to be respectful to the API
      if (i + batchSize < schemeCodes.length) {
        await sleep(batchDelay);
      }
    }
    
    return results;
  }

  /**
   * Extract scheme codes from full URLs
   * @param {Array<string>} urls - Array of full API URLs
   * @returns {Array<string>} Array of scheme codes
   */
  static extractSchemeCodes(urls) {
    return urls.map(url => {
      const match = url.match(/\/mf\/(\d+)$/);
      return match ? match[1] : null;
    }).filter(Boolean);
  }

  /**
   * Fetch fund data from full URLs (for backward compatibility)
   * @param {Array<string>} urls - Array of full API URLs
   * @returns {Promise<Array>} Array of fund data
   */
  static async getFundsDataFromUrls(urls) {
    const schemeCodes = this.extractSchemeCodes(urls);
    return this.getMultipleFundsData(schemeCodes);
  }
}

export default apiClient;