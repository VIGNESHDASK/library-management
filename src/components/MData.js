
import { useMemo, useState } from 'react';
import { FUND_URL_LIST } from '../constants/fundUrls';
import { useFundAnalysis } from '../hooks/useFundAnalysis';
import FundTable from './FundTable';
import './MData.css';
import { LoadingSpinner, Section, Spacer } from './ui';
import ErrorBoundary from './ui/ErrorBoundary';

/**
 * MData Component - Enhanced mutual fund analysis with error handling and advanced features
 * Shows when to buy and when to sell based on fund performance data
 */
const MData = () => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Memoize fund URLs for performance
  const fundUrls = useMemo(() => FUND_URL_LIST, []);
  
  // Use enhanced custom hook with advanced features
  const analysisOptions = useMemo(() => ({
    enableCaching: true,
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
    refreshInterval: null // Could be set to auto-refresh every 5 minutes: 5 * 60 * 1000
  }), []);
  
  const { 
    buyData, 
    sellData, 
    isLoading, 
    hasError, 
    errorMessage,
    refresh,
    stats,
    isCached,
    lastRefresh
  } = useFundAnalysis(fundUrls, analysisOptions);
  
  // Memoize table components to prevent unnecessary re-renders
  const BuyAnalysisTable = useMemo(() => (
    <FundTable data={buyData} />
  ), [buyData]);
  
  const SellAnalysisTable = useMemo(() => (
    <FundTable data={sellData} />
  ), [sellData]);
  
  // Error state
  if (hasError) {
    return (
      <div className="fund-analysis-container">
        <div className="error-state">
          <h3>⚠️ Unable to load fund data</h3>
          <p>{errorMessage}</p>
          <button onClick={refresh} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Loading state with enhanced spinner
  if (isLoading) {
    const progress = stats.totalFunds > 0 ? 
      ((stats.buyDataCount + stats.sellDataCount) / (stats.totalFunds * 2)) * 100 : 
      null;
      
    return (
      <LoadingSpinner 
        message="Loading fund analysis data..." 
        variant="spinner"
        progress={progress}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="fund-analysis-container">
        {/* Header with controls */}
        <div className="analysis-header">
          <div className="analysis-info">
            <h1>Fund Analysis Dashboard</h1>
            <div className="stats-summary">
              <span>📊 {stats.totalFunds} funds analyzed</span>
              {isCached && <span>🗄️ Cached data</span>}
              <span>🕒 Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="analysis-controls">
            <button onClick={refresh} className="refresh-button">
              🔄 Refresh
            </button>
            <button 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="options-toggle"
            >
              ⚙️ Options
            </button>
          </div>
        </div>

        {/* Advanced options panel */}
        {showAdvancedOptions && (
          <div className="advanced-options">
            <h3>Analysis Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <label>Total Funds:</label>
                <span>{stats.totalFunds}</span>
              </div>
              <div className="stat-item">
                <label>Buy Data:</label>
                <span>{stats.buyDataCount}</span>
              </div>
              <div className="stat-item">
                <label>Sell Data:</label>
                <span>{stats.sellDataCount}</span>
              </div>
              <div className="stat-item">
                <label>Data Complete:</label>
                <span>{stats.isComplete ? '✅' : '❌'}</span>
              </div>
            </div>
          </div>
        )}

        <Spacer size={20} />

        {/* Analysis sections */}
        <Section title="When to Buy" className="buy-analysis-section">
          {buyData.length > 0 ? BuyAnalysisTable : (
            <div className="no-data">No buy analysis data available</div>
          )}
        </Section>
        
        <Spacer size={40} />
        
        <Section title="When to Sell" className="sell-analysis-section">
          {sellData.length > 0 ? SellAnalysisTable : (
            <div className="no-data">No sell analysis data available</div>
          )}
        </Section>
      </div>
    </ErrorBoundary>
  );
};

export default MData;