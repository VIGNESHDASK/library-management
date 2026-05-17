/**
 * Spacer component for consistent spacing between elements
 * @param {number} size - Size in pixels (default: 40)
 * @param {string} direction - 'vertical' or 'horizontal' (default: 'vertical')
 */
const Spacer = ({ size = 40, direction = 'vertical' }) => {
    const style = direction === 'vertical' 
      ? { margin: `${size}px 0` }
      : { margin: `0 ${size}px` };
  
    return <div style={style} className={`spacer spacer-${direction}`} />;
  };
  
  export default Spacer;