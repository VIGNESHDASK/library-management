

/**
 * Enhanced loading component with different variants and progress support
 * @param {string} message - Loading message to display
 * @param {string} className - Additional CSS classes
 * @param {'spinner'|'dots'|'pulse'} variant - Loading animation variant
 * @param {number} progress - Progress percentage (0-100) for progress bar
 * @param {boolean} overlay - Whether to show as full-screen overlay
 */
const LoadingSpinner = ({ 
    message = "Loading...", 
    className = "",
    variant = "spinner",
    progress = null,
    overlay = false 
  }) => {
    const renderLoadingAnimation = () => {
      switch (variant) {
        case 'dots':
          return (
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          );
        case 'pulse':
          return <div className="loading-pulse"></div>;
        default:
          return <div className="loading-spinner"></div>;
      }
    };
  
    const containerClass = `loading-container ${overlay ? 'loading-overlay' : ''} ${className}`;
  
    return (
      <div className={containerClass}>
        {renderLoadingAnimation()}
        <div className="loading-message">{message}</div>
        {progress !== null && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
    );
  };
  
  export default LoadingSpinner;